const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	console.warn('DATABASE_URL not set. Please configure Neon connection in .env');
}

const pool = new Pool({
	connectionString: connectionString || undefined,
	ssl: process.env.PGSSL === 'false' ? false : { rejectUnauthorized: false },
});

async function ensureDatabaseSetup() {
	if (!connectionString) {
		console.warn('Skipping DB setup: no DATABASE_URL provided. Set it in backend/.env for Neon.');
		return;
	}
	const client = await pool.connect();
	try {
		await client.query('BEGIN');
		await client.query(`
			CREATE EXTENSION IF NOT EXISTS pgcrypto;
		`);
		await client.query(`
			CREATE TABLE IF NOT EXISTS users (
				id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
				name TEXT,
				age INTEGER,
				gender TEXT,
				height_cm NUMERIC,
				weight_kg NUMERIC,
				activity_level TEXT,
				created_at TIMESTAMPTZ DEFAULT now(),
				updated_at TIMESTAMPTZ DEFAULT now()
			);
		`);
		await client.query(`
			CREATE TABLE IF NOT EXISTS grocery_items (
				id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
				user_id UUID REFERENCES users(id) ON DELETE CASCADE,
				item_name TEXT NOT NULL,
				quantity NUMERIC DEFAULT 1,
				unit TEXT,
				created_at TIMESTAMPTZ DEFAULT now()
			);
		`);
		await client.query(`
			CREATE TABLE IF NOT EXISTS nutrition_data (
				id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
				grocery_id UUID REFERENCES grocery_items(id) ON DELETE CASCADE,
				calories NUMERIC,
				protein_g NUMERIC,
				carbs_g NUMERIC,
				fat_g NUMERIC,
				sugar_g NUMERIC,
				fiber_g NUMERIC,
				sodium_mg NUMERIC,
				vitamins JSONB,
				raw JSONB,
				created_at TIMESTAMPTZ DEFAULT now()
			);
		`);
		await client.query(`
			CREATE TABLE IF NOT EXISTS daily_scores (
				id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
				user_id UUID REFERENCES users(id) ON DELETE CASCADE,
				score NUMERIC NOT NULL,
				details JSONB,
				created_at TIMESTAMPTZ DEFAULT now()
			);
		`);
		await client.query('COMMIT');
	} catch (err) {
		await client.query('ROLLBACK');
		throw err;
	} finally {
		client.release();
	}
}

module.exports = { pool, ensureDatabaseSetup };
