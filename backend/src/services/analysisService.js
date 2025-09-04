const { pool } = require('../utils/db');
const { fetchNutritionForItems } = require('./nutritionService');
const { calculateRequirements, scoreAgainstRequirements, generateSuggestions } = require('./nutritionLogic');

async function analyzeUserGroceries(userId) {
	const client = await pool.connect();
	try {
		const userRes = await client.query('SELECT * FROM users WHERE id=$1', [userId]);
		const user = userRes.rows[0];
		if (!user) throw new Error('User not found');

		const groceriesRes = await client.query('SELECT * FROM grocery_items WHERE user_id=$1', [userId]);
		const groceries = groceriesRes.rows;

		const nutrition = await fetchNutritionForItems(groceries);

		const days = 7;
		const daily = nutrition.reduce(
			(acc, n) => {
				acc.calories += (n.calories || 0) / days;
				acc.protein_g += (n.protein_g || 0) / days;
				acc.carbs_g += (n.carbs_g || 0) / days;
				acc.fat_g += (n.fat_g || 0) / days;
				acc.sugar_g += (n.sugar_g || 0) / days;
				acc.fiber_g += (n.fiber_g || 0) / days;
				acc.sodium_mg += (n.sodium_mg || 0) / days;
				return acc;
			},
			{ calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0, sugar_g: 0, fiber_g: 0, sodium_mg: 0 }
		);

		const requirements = calculateRequirements({
			age: user.age,
			gender: user.gender,
			height_cm: Number(user.height_cm),
			weight_kg: Number(user.weight_kg),
			activity_level: user.activity_level,
		});

		const score = scoreAgainstRequirements(daily, requirements);
		const suggestions = generateSuggestions(daily, requirements);

		await client.query(
			'INSERT INTO daily_scores (user_id, score, details) VALUES ($1,$2,$3)',
			[userId, score.healthScore, { daily, requirements, suggestions }]
		);

		return { daily, requirements, score, suggestions };
	} finally {
		client.release();
	}
}

module.exports = { analyzeUserGroceries };
