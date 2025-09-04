const express = require('express');
const router = express.Router();
const { pool } = require('../utils/db');

router.post('/', async (req, res) => {
	const { user_id, items } = req.body || {};
	if (!user_id || !Array.isArray(items)) return res.status(400).json({ error: 'Invalid payload' });
	const client = await pool.connect();
	try {
		await client.query('BEGIN');
		const inserted = [];
		for (const item of items) {
			const { rows } = await client.query(
				`INSERT INTO grocery_items (user_id, item_name, quantity, unit) VALUES ($1,$2,$3,$4) RETURNING *`,
				[user_id, item.item_name, item.quantity || 1, item.unit || null]
			);
			inserted.push(rows[0]);
		}
		await client.query('COMMIT');
		res.json({ items: inserted });
	} catch (err) {
		await client.query('ROLLBACK');
		console.error(err);
		res.status(500).json({ error: 'Failed to save groceries' });
	} finally {
		client.release();
	}
});

router.get('/user/:userId', async (req, res) => {
	try {
		const { rows } = await pool.query(`SELECT * FROM grocery_items WHERE user_id=$1 ORDER BY created_at DESC`, [req.params.userId]);
		res.json(rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Failed to fetch groceries' });
	}
});

module.exports = router;
