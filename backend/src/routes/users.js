const express = require('express');
const router = express.Router();
const { pool } = require('../utils/db');

router.post('/', async (req, res) => {
	const { id, name, age, gender, height_cm, weight_kg, activity_level } = req.body || {};
	try {
		if (id) {
			const { rows } = await pool.query(
				`UPDATE users SET name=$1, age=$2, gender=$3, height_cm=$4, weight_kg=$5, activity_level=$6, updated_at=now() WHERE id=$7 RETURNING *`,
				[name, age, gender, height_cm, weight_kg, activity_level, id]
			);
			return res.json(rows[0]);
		}
		const { rows } = await pool.query(
			`INSERT INTO users (name, age, gender, height_cm, weight_kg, activity_level) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
			[name, age, gender, height_cm, weight_kg, activity_level]
		);
		res.json(rows[0]);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Failed to save user' });
	}
});

router.get('/:id', async (req, res) => {
	try {
		const { rows } = await pool.query(`SELECT * FROM users WHERE id=$1`, [req.params.id]);
		if (!rows[0]) return res.status(404).json({ error: 'User not found' });
		res.json(rows[0]);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Failed to fetch user' });
	}
});

module.exports = router;
