import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.DEV 
        ? 'http://localhost:5000/api' 
        : 'https://ai-field-work-engine.onrender.com/api',
});

export const fetchWorkOrders = () => API.get('/work-orders');
export const fetchTechnicians = () => API.get('/users?role=TECHNICIAN');
export const evaluateMatch = (payload) => API.post('/match/evaluate', payload);
export const assignTechnician = (workOrderId, technicianId) => 
    API.patch(`/work-orders/${workOrderId}/assign`, { 
        technicianId, 
        technician_id: technicianId 
    });
export const resetDemoData = () => API.post('/demo/reset');