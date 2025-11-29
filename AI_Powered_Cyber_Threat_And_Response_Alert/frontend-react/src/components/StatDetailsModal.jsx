import React, { useState, useEffect, useRef } from 'react';
import { X, Clock, Activity, ArrowUpRight, Calendar, ArrowLeft } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const StatDetailsModal = ({ isOpen, onClose, title, count, colorClass, icon }) => {
    const [historyData, setHistoryData] = useState([]);
    const [realTimeData, setRealTimeData] = useState([]);
    const [showFullHistory, setShowFullHistory] = useState(false);
    const scrollRef = useRef(null);

    // Extract color code from tailwind class (approximate mapping for chart)
    const getColorCode = (cls) => {
        if (cls.includes('rose')) return '#f43f5e';
        if (cls.includes('blue')) return '#3b82f6';
        if (cls.includes('emerald')) return '#10b981';
        if (cls.includes('amber')) return '#f59e0b';
        return '#64748b';
    };

    const chartColor = getColorCode(colorClass);

    // Simulate data loading
    useEffect(() => {
        if (isOpen) {
            // Generate mock history
            const history = Array.from({ length: 10 }, (_, i) => ({
                id: Date.now() - i * 1000,
                timestamp: new Date(Date.now() - i * 3600000).toLocaleTimeString(),
                value: Math.floor(Math.random() * 100),
                status: Math.random() > 0.5 ? 'Increased' : 'Stable'
            }));
            setHistoryData(history);

            // Generate mock real-time data for chart
            const rtData = Array.from({ length: 20 }, (_, i) => ({
                time: i,
                value: Math.floor(Math.random() * 50) + 20
            }));
            setRealTimeData(rtData);
            setShowFullHistory(false); // Reset view on open
        }
    }, [isOpen]);

    // Simulate live updates
    useEffect(() => {
        if (!isOpen) return;

        const interval = setInterval(() => {
            // Update Chart Data
            setRealTimeData(prev => {
                const newData = [...prev.slice(1), {
                    time: prev[prev.length - 1].time + 1,
                    value: Math.floor(Math.random() * 60) + 20
                }];
                return newData;
            });

            // Update History Data (Simulate new log every 3 seconds)
            if (Math.random() > 0.7) {
                setHistoryData(prev => [
                    {
                        id: Date.now(),
                        timestamp: new Date().toLocaleTimeString(),
                        value: Math.floor(Math.random() * 100),
                        status: Math.random() > 0.5 ? 'Spike Detected' : 'Normal Operation'
                    },
                    ...prev
                ]);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-2xl bg-[#0b1120] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-800/60 bg-slate-900/50 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-opacity-10 border border-opacity-20 ${colorClass.replace('text-', 'bg-')} ${colorClass.replace('text-', 'border-')}`}>
                            {React.cloneElement(icon, { size: 24 })}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
                            <p className="text-slate-400 text-xs uppercase tracking-wider font-mono mt-1">Detailed Analysis</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {!showFullHistory ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Column: Real-time Chart */}
                            <div className="space-y-6">
                                <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                                            <Activity size={16} className={colorClass} />
                                            Real-time Activity
                                        </h3>
                                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 animate-pulse">
                                            LIVE
                                        </span>
                                    </div>

                                    <div className="h-40 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={realTimeData}>
                                                <defs>
                                                    <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', fontSize: '12px' }}
                                                    itemStyle={{ color: chartColor }}
                                                    labelStyle={{ display: 'none' }}
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="value"
                                                    stroke={chartColor}
                                                    fill={`url(#gradient-${title})`}
                                                    strokeWidth={2}
                                                    isAnimationActive={false}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                                        <span>Current Throughput</span>
                                        <span className={`font-mono font-bold ${colorClass}`}>
                                            {realTimeData[realTimeData.length - 1]?.value} ops/s
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-500 text-xs mb-1">Total Count</p>
                                        <p className={`text-2xl font-bold ${colorClass}`}>{count}</p>
                                    </div>
                                    <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center">
                                        <ArrowUpRight size={20} className="text-slate-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: History Log Preview */}
                            <div className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden flex flex-col h-full">
                                <div className="p-4 border-b border-slate-800/60 bg-slate-950/30">
                                    <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                                        <Clock size={16} className="text-slate-500" />
                                        Recent History
                                    </h3>
                                </div>

                                <div className="flex-1 overflow-y-auto max-h-[250px] p-2 space-y-1 custom-scrollbar">
                                    {historyData.slice(0, 5).map((item) => (
                                        <div key={item.id} className="flex items-center justify-between p-3 hover:bg-slate-800/50 rounded-lg transition-colors group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-blue-500 transition-colors"></div>
                                                <span className="text-xs text-slate-400 font-mono">{item.timestamp}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-xs text-slate-500">{item.status}</span>
                                                <span className="text-xs font-bold text-slate-300 bg-slate-800 px-2 py-1 rounded min-w-[40px] text-center">
                                                    {item.value}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-3 border-t border-slate-800/60 bg-slate-950/30 text-center mt-auto">
                                    <button
                                        onClick={() => setShowFullHistory(true)}
                                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center justify-center gap-1 w-full"
                                    >
                                        <Calendar size={12} /> View Full History
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Full History View */
                        <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <button
                                    onClick={() => setShowFullHistory(false)}
                                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                                >
                                    <ArrowLeft size={16} /> Back to Summary
                                </button>
                                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 animate-pulse">
                                    LIVE UPDATES ACTIVE
                                </span>
                            </div>

                            <div className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden flex-1 flex flex-col">
                                <div className="grid grid-cols-4 gap-4 p-4 border-b border-slate-800/60 bg-slate-950/30 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <div className="col-span-1">Timestamp</div>
                                    <div className="col-span-2">Status / Event</div>
                                    <div className="col-span-1 text-right">Value</div>
                                </div>
                                <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                                    {historyData.map((item) => (
                                        <div key={item.id} className="grid grid-cols-4 gap-4 p-3 hover:bg-slate-800/50 rounded-lg transition-colors border-b border-slate-800/30 last:border-0">
                                            <div className="col-span-1 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                                                <span className="text-xs text-slate-300 font-mono">{item.timestamp}</span>
                                            </div>
                                            <div className="col-span-2 text-xs text-slate-400">
                                                {item.status}
                                            </div>
                                            <div className="col-span-1 text-right">
                                                <span className={`text-xs font-bold ${colorClass}`}>
                                                    {item.value}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StatDetailsModal;
