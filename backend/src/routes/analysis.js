const express = require('express');
const router = express.Router();
const { analyzeUserGroceries } = require('../services/analysisService');
const { pool } = require('../utils/db');

router.post('/run', async (req, res) => {
	const { user_id } = req.body || {};
	if (!user_id) return res.status(400).json({ error: 'user_id is required' });
	try {
		const result = await analyzeUserGroceries(user_id);
		res.json(result);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Failed to analyze groceries' });
	}
});

router.get('/scores/:userId', async (req, res) => {
	try {
		const { rows } = await pool.query(
			'SELECT * FROM daily_scores WHERE user_id=$1 ORDER BY created_at DESC LIMIT 30',
			[req.params.userId]
		);
		res.json(rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Failed to fetch scores' });
	}
});

module.exports = router;
