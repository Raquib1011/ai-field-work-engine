const prisma = require('../prisma');

// Create a new work order
const createWorkOrder = async (req, res) => {
    try {
        const { title, description, required_skills } = req.body;
        const workOrder = await prisma.workOrder.create({
            data: { title, description, required_skills }
        });
        res.status(201).json(workOrder);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all work orders
const getWorkOrders = async (req, res) => {
    try {
        const workOrders = await prisma.workOrder.findMany({
            include: { assigned_tech: true } // Joins assigned user data if it exists
        });
        res.status(200).json(workOrders);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { createWorkOrder, getWorkOrders };