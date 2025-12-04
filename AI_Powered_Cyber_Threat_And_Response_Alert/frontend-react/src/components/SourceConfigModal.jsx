import React, { useState, useEffect, useRef } from 'react';
import { X, Server, Shield, Globe, Database, Settings, RefreshCw, CheckCircle, AlertCircle, Save, Ban, Loader2, ArrowRight } from 'lucide-react';
import gsap from "gsap";

const SourceConfigModal = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('firewall');
    const [isEditing, setIsEditing] = useState(false);
    const [testStatus, setTestStatus] = useState('idle'); // idle, testing, success, error
    const [editValues, setEditValues] = useState({});
    const modalRef = useRef(null);

    // Initial Config State
    const [configs, setConfigs] = useState({
        firewall: [
            { key: 'Source IP', value: '192.168.1.1' },
            { key: 'Port', value: '514 (Syslog)' },
            { key: 'Protocol', value: 'UDP' },
            { key: 'Log Level', value: 'Warning' },
            { key: 'Retention', value: '30 Days' },
            { key: 'Status', value: 'Active', status: 'active' },
        ],
        auth: [
            { key: 'Endpoint', value: 'https://auth.internal/logs' },
            { key: 'Method', value: 'Webhook' },
            { key: 'Format', value: 'JSON' },
            { key: 'Interval', value: 'Real-time' },
            { key: 'Status', value: 'Active', status: 'active' },
        ],
        system: [
            { key: 'Agent Version', value: 'v2.4.1' },
            { key: 'Config Path', value: '/etc/rsyslog.conf' },
            { key: 'Buffer Size', value: '10MB' },
            { key: 'Status', value: 'Degraded', status: 'warning' },
        ],
        database: [
            { key: 'Cluster ID', value: 'db-prod-01' },
            { key: 'Audit Log', value: 'Enabled' },
            { key: 'Slow Query', value: '> 500ms' },
            { key: 'Status', value: 'Active', status: 'active' },
        ],
    });

    useEffect(() => {
        if (isOpen && modalRef.current) {
            const ctx = gsap.context(() => {
                gsap.fromTo(modalRef.current,
                    { opacity: 0, scale: 0.95, y: 20 },
                    { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "power3.out" }
                );

                gsap.from(".modal-sidebar-item", {
                    x: -20,
                    opacity: 0,
                    duration: 0.4,
                    stagger: 0.05,
                    ease: "power2.out",
                    delay: 0.2
                });

                gsap.from(".modal-content-anim", {
                    y: 10,
                    opacity: 0,
                    duration: 0.4,
                    ease: "power2.out",
                    delay: 0.3
                });
            }, modalRef);
            return () => ctx.revert();
        }
    }, [isOpen]);

    // Re-animate content when tab changes
    useEffect(() => {
        if (isOpen && modalRef.current) {
            gsap.fromTo(".config-row",
                { opacity: 0, x: 10 },
                { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, ease: "power2.out" }
            );
        }
    }, [activeTab, isOpen]);


    if (!isOpen) return null;

    const sources = [
        { id: 'firewall', label: 'Firewall Logs', icon: Shield, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', activeBorder: 'border-rose-500' },
        { id: 'auth', label: 'Auth Service', icon: Globe, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', activeBorder: 'border-blue-500' },
        { id: 'system', label: 'System Kernel', icon: Server, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', activeBorder: 'border-emerald-500' },
        { id: 'database', label: 'Database Cluster', icon: Database, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', activeBorder: 'border-amber-500' },
    ];

    const activeConfig = configs[activeTab];
    const activeSource = sources.find(s => s.id === activeTab);

    // Handlers
    const handleEdit = () => {
        const currentValues = {};
        activeConfig.forEach(item => {
            currentValues[item.key] = item.value;
        });
        setEditValues(currentValues);
        setIsEditing(true);
        setTestStatus('idle');
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditValues({});
    };

    const handleSave = () => {
        setConfigs(prev => ({
            ...prev,
            [activeTab]: prev[activeTab].map(item => ({
                ...item,
                value: editValues[item.key] || item.value
            }))
        }));
        setIsEditing(false);
    };

    const handleInputChange = (key, value) => {
        setEditValues(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleTestConnection = () => {
        setTestStatus('testing');
        setTimeout(() => {
            setTestStatus('success');
            setTimeout(() => setTestStatus('idle'), 3000);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div ref={modalRef} className="relative w-full max-w-4xl bg-[#020617] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[600px] md:h-[550px]">

                {/* Unified Grid Background inside Modal */}
                <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-900/10 blur-[80px] rounded-full"></div>
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>
                </div>

                {/* Sidebar */}
                <div className="w-full md:w-72 bg-[#0f172a]/80 backdrop-blur-md border-r border-slate-800/60 p-6 flex flex-col gap-3 relative z-10">
                    <div className="mb-6 flex items-center gap-2 text-slate-400">
                        <div className="p-1.5 bg-slate-800 rounded-md border border-slate-700">
                            <Settings size={16} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest">Configuration</span>
                    </div>

                    {sources.map((source) => (
                        <button
                            key={source.id}
                            onClick={() => {
                                setActiveTab(source.id);
                                setIsEditing(false);
                                setTestStatus('idle');
                            }}
                            disabled={isEditing}
                            className={`modal-sidebar-item group relative flex items-center gap-3 p-3 rounded-xl transition-all text-left overflow-hidden ${activeTab === source.id
                                ? 'bg-white/5 text-white shadow-lg border border-white/10'
                                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'
                                } ${isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {activeTab === source.id && (
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${source.bg.replace('/10', '')} shadow-[0_0_15px_currentColor]`}></div>
                            )}

                            <div className={`p-2 rounded-lg ${source.bg} ${source.border} border group-hover:scale-110 transition-transform duration-300`}>
                                <source.icon size={18} className={source.color} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold">{source.label}</span>
                                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Source ID: {source.id}</span>
                            </div>

                            {activeTab === source.id && <ArrowRight size={14} className="ml-auto text-slate-500" />}
                        </button>
                    ))}
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col min-w-0 relative z-10">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-800/60 bg-[#0f172a]/30 backdrop-blur-md">
                        <div className="modal-content-anim">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${activeSource.bg} ${activeSource.border} border`}>
                                    <activeSource.icon size={20} className={activeSource.color} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white tracking-tight">
                                        {activeSource.label} Config
                                    </h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`w-1.5 h-1.5 rounded-full ${activeConfig.find(c => c.key === 'Status')?.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                                        <p className="text-slate-400 text-xs font-mono">
                                            STATUS: <span className={activeConfig.find(c => c.key === 'Status')?.status === 'active' ? 'text-emerald-400' : 'text-amber-400'}>
                                                {activeConfig.find(c => c.key === 'Status')?.value.toUpperCase()}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Config Details */}
                    <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-[#020617]/50">
                        <div className="modal-content-anim bg-[#0f172a]/40 rounded-xl border border-slate-800 overflow-hidden shadow-inner">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-[#0f172a] text-xs uppercase font-bold text-slate-500 tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4 border-b border-slate-800">Parameter Key</th>
                                        <th className="px-6 py-4 border-b border-slate-800">Configuration Value</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    {activeConfig.map((item, idx) => (
                                        <tr key={idx} className="config-row hover:bg-slate-800/20 transition-colors group">
                                            <td className="px-6 py-4 font-mono text-xs text-slate-400 group-hover:text-slate-300 transition-colors">{item.key}</td>
                                            <td className="px-6 py-4 text-slate-200 font-mono text-sm">
                                                {isEditing && item.key !== 'Status' ? (
                                                    <input
                                                        type="text"
                                                        value={editValues[item.key] || ''}
                                                        onChange={(e) => handleInputChange(item.key, e.target.value)}
                                                        className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm w-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
                                                    />
                                                ) : (
                                                    item.status ? (
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border uppercase tracking-wider ${item.status === 'active'
                                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                            }`}>
                                                            {item.status === 'active' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                                                            {item.value}
                                                        </span>
                                                    ) : (
                                                        <span className="group-hover:text-white transition-colors">{item.value}</span>
                                                    )
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="modal-content-anim mt-8 flex justify-between items-center pt-6 border-t border-slate-800/50">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleTestConnection}
                                    disabled={testStatus === 'testing'}
                                    className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800/80 hover:border-slate-600 transition-all text-xs font-bold uppercase tracking-wide flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                >
                                    <RefreshCw size={14} className={testStatus === 'testing' ? 'animate-spin' : ''} />
                                    Test Connection
                                </button>

                                {testStatus === 'testing' && (
                                    <span className="text-xs text-blue-400 flex items-center gap-2 animate-pulse font-mono">
                                        <Loader2 size={14} className="animate-spin" /> PINGING HOST...
                                    </span>
                                )}
                                {testStatus === 'success' && (
                                    <span className="text-xs text-emerald-400 flex items-center gap-2 font-mono font-bold">
                                        <CheckCircle size={14} /> CONNECTION VERIFIED (12ms)
                                    </span>
                                )}
                            </div>

                            <div className="flex gap-3">
                                {!isEditing ? (
                                    <button
                                        onClick={handleEdit}
                                        className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all text-sm font-bold flex items-center gap-2 active:scale-95"
                                    >
                                        <Settings size={16} /> Edit Config
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleCancel}
                                            className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm font-medium flex items-center gap-2"
                                        >
                                            <Ban size={14} /> Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all text-sm font-bold flex items-center gap-2 active:scale-95"
                                        >
                                            <Save size={16} /> Save Changes
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SourceConfigModal;