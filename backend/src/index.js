const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const { ensureDatabaseSetup } = require('./utils/db');
const userRoutes = require('./routes/users');
const groceryRoutes = require('./routes/groceries');
const analysisRoutes = require('./routes/analysis');

app.get('/api/health', (req, res) => {
	res.json({ status: 'ok' });
});

app.use('/api/users', userRoutes);
app.use('/api/groceries', groceryRoutes);
app.use('/api/analysis', analysisRoutes);

const PORT = process.env.PORT || 4000;

ensureDatabaseSetup()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Server listening on port ${PORT}`);
		});
	})
	.catch((err) => {
		console.error('Failed to setup database:', err);
		process.exit(1);
	});
