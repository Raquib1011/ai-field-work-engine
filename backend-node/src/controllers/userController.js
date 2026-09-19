const prisma = require('../prisma');

// Create a new user
const createUser = async (req, res) => {
    try {
        const { name, email, role, location_zip } = req.body;
        const user = await prisma.user.create({
            data: { name, email, role, location_zip }
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all users (and include their skills)
const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            include: { skills: true } // Joins the Skills table
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { createUser, getUsers };