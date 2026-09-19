import React, { useEffect, useState } from 'react';
import { X, Sparkles, UserCheck } from 'lucide-react';
import { fetchTechnicians, evaluateMatch, assignTechnician } from '../services/api';

export default function TechnicianMatchModal({ workOrder, onClose, onAssigned }) {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [assigning, setAssigning] = useState(null);

    useEffect(() => {
        async function runAIMatching() {
            try {
                const techRes = await fetchTechnicians();
                const technicians = techRes.data;

                const matchPromises = technicians.map(async (tech) => {
                    try {
                        const res = await evaluateMatch({
                            technicianId: tech.id,
                            workOrderId: workOrder.id,
                            distanceKm: Math.floor(Math.random() * 20) + 2
                        });
                        return { tech, matchData: res.data };
                    } catch (err) {
                        return null;
                    }
                });

                const results = await Promise.all(matchPromises);
                const validResults = results.filter(r => r !== null);
                
                validResults.sort((a, b) => {
                    const scoreA = a.matchData?.aiMatchResult?.match_score ?? a.matchData?.match_score ?? 0;
                    const scoreB = b.matchData?.aiMatchResult?.match_score ?? b.matchData?.match_score ?? 0;
                    return scoreB - scoreA;
                });

                setMatches(validResults);
            } catch (err) {
                console.error("Match calculation failed:", err);
            } finally {
                setLoading(false);
            }
        }

        runAIMatching();
    }, [workOrder]);

    const handleAssign = async (technicianId) => {
        setAssigning(technicianId);
        try {
            await assignTechnician(workOrder.id, technicianId);
            onAssigned();
            onClose();
        } catch (err) {
            console.error(err);
            alert("Failed to assign technician.");
        } finally {
            setAssigning(null);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-100">
                <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                    <div>
                        <span className="text-indigo-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" /> Scikit-Learn Match Engine
                        </span>
                        <h2 className="text-xl font-bold">{workOrder.title}</h2>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
                    {loading ? (
                        <div className="py-12 text-center text-slate-500">
                            <Sparkles className="w-8 h-8 animate-spin mx-auto text-indigo-600 mb-2" />
                            <p className="font-medium">Running Random Forest ML model against technician skills...</p>
                        </div>
                    ) : (
                        matches.map(({ tech, matchData }) => {
                            const rawScore = 
                                matchData?.aiMatchResult?.match_score ?? 
                                matchData?.match_score ?? 
                                matchData?.score ?? 
                                0;
                            const score = Math.round(rawScore);

                            return (
                                <div key={tech.id} className="p-4 border border-slate-200 rounded-xl flex items-center justify-between hover:border-indigo-200 transition">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-semibold text-slate-800">{tech.name}</h4>
                                            <span className="text-xs text-slate-500">({tech.location_zip})</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {tech.skills?.map((s, idx) => (
                                                <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">
                                                    {s.skill_name || s} {s.experience_years ? `(${s.experience_years} yrs)` : ''}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <div className="text-2xl font-black text-indigo-600">{score}%</div>
                                            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Match Confidence</div>
                                        </div>

                                        <button
                                            onClick={() => handleAssign(tech.id)}
                                            disabled={assigning === tech.id}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition flex items-center gap-1.5"
                                        >
                                            <UserCheck className="w-4 h-4" />
                                            {assigning === tech.id ? 'Assigning...' : 'Assign'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}