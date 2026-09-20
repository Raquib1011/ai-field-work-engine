const axios = require('axios');

// Default to local FastAPI port; can be overridden by environment variable for Docker
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'https://field-work-ml.onrender.com';

/**
 * Sends technician and job details to Python FastAPI microservice for AI match scoring
 */
async function getMatchScore(technicianSkills, requiredSkills, urgencyLevel = 2, distanceKm = 10.0) {
    try {
        const response = await axios.post(`${ML_SERVICE_URL}/predict-match`, {
            technician_skills: technicianSkills,
            required_skills: requiredSkills,
            urgency_level: urgencyLevel,
            distance_km: distanceKm
        });

        return response.data;
    } catch (error) {
        console.error('Error communicating with ML microservice:', error.message);
        throw new Error('ML scoring service unavailable');
    }
}

module.exports = { getMatchScore };