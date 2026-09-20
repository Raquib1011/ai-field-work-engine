import React, { useEffect, useState } from 'react';
import { fetchWorkOrders, resetDemoData } from './services/api';
import WorkOrderCard from './components/WorkOrderCard';
import TechnicianMatchModal from './components/TechnicianMatchModal';
import { LayoutDashboard, RefreshCw, RotateCcw } from 'lucide-react';

export default function App() {
    const [workOrders, setWorkOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isResetting, setIsResetting] = useState(false);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const res = await fetchWorkOrders();
            setWorkOrders(res.data);
        } catch (err) {
            console.error("Failed to load work orders:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleResetDemo = async () => {
        setIsResetting(true);
        try {
            await resetDemoData();
            await loadOrders();
        } catch (err) {
            console.error("Failed to reset demo data:", err);
        } finally {
            setIsResetting(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-600 text-white rounded-xl">
                            <LayoutDashboard className="w-5 h-5" />
                        </div>
                        <h1 className="font-bold text-xl text-slate-900 tracking-tight">
                            AI Field Work Dispatch
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handleResetDemo}
                            disabled={isResetting}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-300 transition disabled:opacity-50"
                            title="Reset all work orders back to OPEN status"
                        >
                            <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
                            {isResetting ? 'Resetting...' : 'Reset Demo Data'}
                        </button>

                        <button 
                            onClick={loadOrders} 
                            className="p-2 text-slate-500 hover:text-slate-800 transition rounded-lg hover:bg-slate-100"
                            title="Refresh work orders"
                        >
                            <RefreshCw className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Active Work Orders</h2>
                    <p className="text-slate-500 text-sm">Select an open order to trigger AI technician allocation matching.</p>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-slate-400">Loading work orders...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {workOrders.map(order => (
                            <WorkOrderCard
                                key={order.id}
                                workOrder={order}
                                onFindMatch={(order) => setSelectedOrder(order)}
                            />
                        ))}
                    </div>
                )}
            </main>

            {selectedOrder && (
                <TechnicianMatchModal
                    workOrder={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onAssigned={loadOrders}
                />
            )}
        </div>
    );
}