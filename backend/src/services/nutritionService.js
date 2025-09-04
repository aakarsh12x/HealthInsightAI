const axios = require('axios');
const { pool } = require('../utils/db');

const NUTRITION_API_BASE = process.env.NUTRITION_API_BASE || '';
const NUTRITION_API_KEY = process.env.NUTRITION_API_KEY || '';

async function fetchNutritionForItems(groceries) {
	const client = await pool.connect();
	try {
		const results = [];
		for (const g of groceries) {
			const itemName = g.item_name;
			let nutrition = null;
			if (NUTRITION_API_BASE && NUTRITION_API_KEY) {
				try {
					const resp = await axios.post(
						`${NUTRITION_API_BASE}/v2/natural/nutrients`,
						{ query: itemName },
						{ headers: { 'x-app-key': NUTRITION_API_KEY } }
					);
					const food = resp.data.foods?.[0] || {};
					nutrition = {
						calories: food.nf_calories || 0,
						protein_g: food.nf_protein || 0,
						carbs_g: food.nf_total_carbohydrate || 0,
						fat_g: food.nf_total_fat || 0,
						sugar_g: food.nf_sugars || 0,
						fiber_g: food.nf_dietary_fiber || 0,
						sodium_mg: food.nf_sodium || 0,
						raw: food,
					};
				} catch (e) {
					nutrition = estimateNutrition(itemName);
				}
			} else {
				nutrition = estimateNutrition(itemName);
			}

			results.push(nutrition);
			await client.query(
				`INSERT INTO nutrition_data (grocery_id, calories, protein_g, carbs_g, fat_g, sugar_g, fiber_g, sodium_mg, raw)
				 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
				[g.id, nutrition.calories, nutrition.protein_g, nutrition.carbs_g, nutrition.fat_g, nutrition.sugar_g, nutrition.fiber_g, nutrition.sodium_mg, nutrition.raw || null]
			);
		}
		return results;
	} finally {
		client.release();
	}
}

function estimateNutrition(name) {
	const n = name.toLowerCase();
	if (n.includes('chicken')) return { calories: 239, protein_g: 27, carbs_g: 0, fat_g: 14, sugar_g: 0, fiber_g: 0, sodium_mg: 82 };
	if (n.includes('rice')) return { calories: 130, protein_g: 2.7, carbs_g: 28, fat_g: 0.3, sugar_g: 0.1, fiber_g: 0.4, sodium_mg: 1 };
	if (n.includes('milk')) return { calories: 103, protein_g: 8, carbs_g: 12, fat_g: 2.4, sugar_g: 12, fiber_g: 0, sodium_mg: 107 };
	if (n.includes('apple')) return { calories: 95, protein_g: 0.5, carbs_g: 25, fat_g: 0.3, sugar_g: 19, fiber_g: 4.4, sodium_mg: 2 };
	if (n.includes('spinach')) return { calories: 23, protein_g: 2.9, carbs_g: 3.6, fat_g: 0.4, sugar_g: 0.4, fiber_g: 2.2, sodium_mg: 79 };
	return { calories: 100, protein_g: 3, carbs_g: 15, fat_g: 3, sugar_g: 5, fiber_g: 2, sodium_mg: 50 };
}

module.exports = { fetchNutritionForItems };
