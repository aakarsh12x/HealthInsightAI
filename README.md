# 🏥 HealthInsightAI - AI-Powered Health & Nutrition Assistant

A comprehensive full-stack application that analyzes grocery lists, generates nutrition profiles, and provides AI-driven health recommendations.

## 🚀 Features

- **Smart Grocery Analysis**: Upload grocery lists and get instant nutrition insights
- **Personalized Nutrition Profiles**: AI-generated recommendations based on your health data
- **Health Score Tracking**: Monitor your daily nutrition and health metrics
- **Modern Dashboard**: Beautiful, responsive UI with real-time data visualization
- **Recipe Suggestions**: Get healthy recipe recommendations based on your groceries

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern UI framework
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Data visualization library
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **NeonDB (PostgreSQL)** - Cloud database
- **Axios** - HTTP client for API calls

### External APIs
- **Nutrition APIs** - For food data and nutritional information
- **AI Services** - For intelligent recommendations

## 📁 Project Structure

```
HealthInsightAI/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   └── ...
│   └── package.json
├── backend/           # Node.js backend API
│   ├── src/
│   │   ├── routes/        # API route handlers
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Utility functions
│   │   └── ...
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- NeonDB account (for PostgreSQL database)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aakarsh12x/HealthInsightAI.git
   cd HealthInsightAI
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**
   
   Create `.env` file in the backend directory:
   ```env
   PORT=5000
   DATABASE_URL=your_neon_db_connection_string
   PGSSL=require
   NUTRITION_API_BASE=https://api.nutritionix.com/v2
   NUTRITION_API_KEY=your_nutrition_api_key
   ```

5. **Start the Application**
   
   **Backend:**
   ```bash
   cd backend
   npm run dev
   ```
   
   **Frontend:**
   ```bash
   cd frontend
   npm start
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📊 API Endpoints

### Users
- `POST /api/users` - Create user profile
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile

### Groceries
- `POST /api/groceries/upload` - Upload grocery list
- `GET /api/groceries` - Get grocery history

### Analysis
- `POST /api/analysis` - Analyze nutrition data
- `GET /api/analysis/health-score` - Get health score

## 🎨 UI Components

- **Dashboard**: Overview with nutrition metrics and charts
- **Grocery List**: Upload and analyze grocery items
- **Nutrition Analysis**: Detailed nutrition insights and comparisons
- **Profile & Settings**: User profile management

## 🔧 Development

### Running in Development Mode
```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm start
```

### Building for Production
```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend && npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Aakarsh** - [aakarsh12x](https://github.com/aakarsh12x)

## 🙏 Acknowledgments

- Inter font family for beautiful typography
- Tailwind CSS for modern styling
- Recharts for data visualization
- NeonDB for cloud database hosting

---

⭐ **Star this repository if you find it helpful!**
