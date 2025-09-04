function calculateBMR({ age, gender, height_cm, weight_kg }) {
	if (gender?.toLowerCase() === 'male') {
		return 10 * weight_kg + 6.25 * height_cm - 5 * age + 5;
	}
	return 10 * weight_kg + 6.25 * height_cm - 5 * age - 161;
}

function activityMultiplier(level) {
	const map = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };
	return map[level] || 1.2;
}

function calculateRequirements({ age, gender, height_cm, weight_kg, activity_level }) {
	const bmr = calculateBMR({ age, gender, height_cm, weight_kg });
	const tdee = bmr * activityMultiplier(activity_level);
	const proteinCalories = tdee * 0.20;
	const carbsCalories = tdee * 0.50;
	const fatCalories = tdee * 0.30;
	return {
		calories: tdee,
		protein_g: proteinCalories / 4,
		carbs_g: carbsCalories / 4,
		fat_g: fatCalories / 9,
		sugar_g: 36,
		fiber_g: 30,
		sodium_mg: 2300,
	};
}

function scoreAgainstRequirements(daily, req) {
	function componentScore(actual, target) {
		if (!target) return 1;
		const diff = Math.abs(actual - target) / target;
		const s = Math.max(0, 1 - diff);
		return s;
	}
	const weights = { calories: 0.3, protein_g: 0.25, carbs_g: 0.15, fat_g: 0.15, fiber_g: 0.1, sodium_mg: 0.05 };
	const parts = Object.keys(weights).map((k) => weights[k] * componentScore(daily[k] || 0, req[k] || 0));
	const healthScore = Math.round(100 * parts.reduce((a, b) => a + b, 0));
	return { healthScore };
}

function generateSuggestions(daily, req) {
	const suggestions = [];
	if ((daily.protein_g || 0) < req.protein_g * 0.9) suggestions.push('Add lean proteins like chicken, fish, tofu, or beans.');
	if ((daily.fiber_g || 0) < req.fiber_g * 0.9) suggestions.push('Increase fiber with vegetables, legumes, and whole grains.');
	if ((daily.sugar_g || 0) > req.sugar_g) suggestions.push('Reduce sugary snacks and beverages.');
	if ((daily.sodium_mg || 0) > req.sodium_mg) suggestions.push('Choose low-sodium options and minimize processed foods.');
	if ((daily.fat_g || 0) > req.fat_g * 1.1) suggestions.push('Cut down on saturated fats; opt for nuts, seeds, and olive oil.');
	if ((daily.carbs_g || 0) < req.carbs_g * 0.9) suggestions.push('Add complex carbs like brown rice, quinoa, and oats.');
	if (suggestions.length === 0) suggestions.push('Your list looks balanced. Maintain variety and portion control.');
	return suggestions;
}

module.exports = { calculateRequirements, scoreAgainstRequirements, generateSuggestions };
