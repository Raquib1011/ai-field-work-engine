require('dotenv').config();
const express = require('express');
const cors = require('cors');
const prisma = require('./prisma');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes
const userRoutes = require('./routes/userRoutes');
const workOrderRoutes = require('./routes/workOrderRoutes');
const matchRoutes = require('./routes/matchRoutes');

// Use Routes
app.use('/api/users', userRoutes);
app.use('/api/work-orders', workOrderRoutes);
app.use('/api/match', matchRoutes);

// Demo Reset Route for Portfolio Reviewers
app.post('/api/demo/reset', async (req, res, next) => {
    try {
        await prisma.workOrder.updateMany({
            data: {
                status: 'OPEN',
                assigned_tech_id: null
            }
        });
        res.status(200).json({ message: 'Demo work orders reset successfully' });
    } catch (error) {
        next(error);
    }
});

// Health Check Route
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Field Work Engine API is running' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});