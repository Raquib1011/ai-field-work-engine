import React from 'react';
import { Wrench, Sparkles, CheckCircle2 } from 'lucide-react';

export default function WorkOrderCard({ workOrder, onFindMatch }) {
    const requiredSkills = typeof workOrder.required_skills === 'string'
        ? JSON.parse(workOrder.required_skills)
        : workOrder.required_skills;

    return (
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 flex flex-col justify-between hover:shadow-lg transition">
            <div>
                <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg text-slate-800">{workOrder.title}</h3>
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        workOrder.status === 'OPEN' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                        {workOrder.status}
                    </span>
                </div>
                <p className="text-slate-600 text-sm mb-4">{workOrder.description}</p>
                
                <div className="mb-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Required Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                        {requiredSkills?.map((skill, i) => (
                            <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                                <Wrench className="w-3 h-3 mr-1 text-slate-500" />
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {workOrder.status === 'OPEN' ? (
                <button
                    onClick={() => onFindMatch(workOrder)}
                    className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center transition gap-2 shadow-sm"
                >
                    <Sparkles className="w-4 h-4" />
                    AI Technician Match
                </button>
            ) : (
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-sm text-emerald-600 font-medium">
                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                    Assigned
                </div>
            )}
        </div>
    );
}