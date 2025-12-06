const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { connectDB, sequelize } = require('./config/database');
// Import models to ensure they are registered
require('./models');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const ingestionRoutes = require('./routes/ingestionRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

app.use('/api/auth', authRoutes);
app.use('/api', ingestionRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.json({
        message: 'Xeno FDE Internship Assignment API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth (login, register)',
            dashboard: '/api/dashboard (stats, orders, top-customers)',
            ingestion: '/api/ingest',
        }
    });
});

// Start Server
const startServer = async () => {
    await connectDB();

    // Sync models
    try {
        await sequelize.sync({ alter: true });
        console.log('Database synced successfully.');
    } catch (error) {
        console.error('Error syncing database:', error);
    }

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer();
