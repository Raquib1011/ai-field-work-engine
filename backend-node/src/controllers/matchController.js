const prisma = require('../prisma');
const { getMatchScore } = require('../services/mlService');

exports.evaluateMatch = async (req, res, next) => {
    try {
        const { technicianId, workOrderId, distanceKm } = req.body;

        // Fetch technician and their skills
        const user = await prisma.user.findUnique({
            where: { id: technicianId },
            include: { skills: true }
        });

        if (!user) {
            return res.status(404).json({ error: 'Technician not found' });
        }

        // Fetch work order
        const workOrder = await prisma.workOrder.findUnique({
            where: { id: workOrderId }
        });

        if (!workOrder) {
            return res.status(404).json({ error: 'Work order not found' });
        }

        // Format skills for Python API
        const formattedSkills = user.skills.map(s => ({
            skill_name: s.skill_name,
            experience_years: s.experience_years
        }));

        const requiredSkills = workOrder.required_skills ? JSON.parse(workOrder.required_skills) : [];

        // Call Python ML service via Axios
        const mlResult = await getMatchScore(
            formattedSkills,
            requiredSkills,
            2, // Default urgency
            distanceKm || 10.0
        );

        return res.json({
            technician: { id: user.id, name: user.name },
            workOrder: { id: workOrder.id, title: workOrder.title },
            aiMatchResult: mlResult
        });
    } catch (error) {
        next(error);
    }
};