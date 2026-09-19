const prisma = require('../prisma');

// Fetch all work orders
exports.getWorkOrders = async (req, res) => {
    try {
        const orders = await prisma.workOrder.findMany({
            include: { assigned_tech: true }
        });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Assign technician to a work order
exports.assignTechnician = async (req, res) => {
    try {
        const { id } = req.params;
        const techId = req.body.technicianId || req.body.technician_id;

        if (!techId) {
            return res.status(400).json({ error: 'technicianId is required' });
        }

        const updated = await prisma.workOrder.update({
            where: { id },
            data: {
                assigned_tech_id: techId,
                status: 'ASSIGNED'
            }
        });

        res.json(updated);
    } catch (err) {
        console.error('Assign error:', err);
        res.status(500).json({ error: err.message });
    }
};