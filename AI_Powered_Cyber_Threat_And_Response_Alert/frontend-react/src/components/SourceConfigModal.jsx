import React, { useState } from 'react';
import { X, Server, Shield, Globe, Database, Settings, RefreshCw, CheckCircle, AlertCircle, Save, Ban, Loader2 } from 'lucide-react';

const SourceConfigModal = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('firewall');
    const [isEditing, setIsEditing] = useState(false);
    const [testStatus, setTestStatus] = useState('idle'); // idle, testing, success, error
    const [editValues, setEditValues] = useState({});

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

    if (!isOpen) return null;

    const sources = [
        { id: 'firewall', label: 'Firewall Logs', icon: Shield, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
        { id: 'auth', label: 'Auth Service', icon: Globe, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
        { id: 'system', label: 'System Kernel', icon: Server, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
        { id: 'database', label: 'Database Cluster', icon: Database, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
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
            <div className="relative w-full max-w-3xl bg-[#0b1120] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col md:flex-row h-[600px] md:h-[500px]">

                {/* Sidebar */}
                <div className="w-full md:w-64 bg-slate-900/50 border-r border-slate-800 p-4 flex flex-col gap-2">
                    <div className="mb-4 px-2">
                        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                            <Settings size={16} /> Config Sources
                        </h3>
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
                            className={`flex items-center gap-3 p-3 rounded-xl transition-all text-left ${activeTab === source.id
                                    ? 'bg-slate-800 text-white shadow-lg border border-slate-700'
                                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                                } ${isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <div className={`p-2 rounded-lg ${source.bg} ${source.border} border`}>
                                <source.icon size={16} className={source.color} />
                            </div>
                            <span className="text-sm font-medium">{source.label}</span>
                        </button>
                    ))}
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-800/60 bg-slate-950/30">
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
                                {activeSource.label}
                                <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                                    ID: {activeSource.id}
                                </span>
                            </h2>
                            <p className="text-slate-400 text-sm mt-1">Configuration parameters and status.</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Config Details */}
                    <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                        <div className="bg-slate-900/30 rounded-xl border border-slate-800 overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-950/50 text-xs uppercase font-bold text-slate-500">
                                    <tr>
                                        <th className="px-6 py-4">Parameter</th>
                                        <th className="px-6 py-4">Value</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    {activeConfig.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-400">{item.key}</td>
                                            <td className="px-6 py-4 text-slate-200 font-mono">
                                                {isEditing && item.key !== 'Status' ? (
                                                    <input
                                                        type="text"
                                                        value={editValues[item.key] || ''}
                                                        onChange={(e) => handleInputChange(item.key, e.target.value)}
                                                        className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white text-sm w-full focus:outline-none focus:border-blue-500 transition-colors"
                                                    />
                                                ) : (
                                                    item.status ? (
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${item.status === 'active'
                                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                            }`}>
                                                            {item.status === 'active' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                                                            {item.value}
                                                        </span>
                                                    ) : (
                                                        item.value
                                                    )
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                {testStatus === 'testing' && (
                                    <span className="text-xs text-blue-400 flex items-center gap-2 animate-pulse">
                                        <Loader2 size={14} className="animate-spin" /> Testing Connection...
                                    </span>
                                )}
                                {testStatus === 'success' && (
                                    <span className="text-xs text-emerald-400 flex items-center gap-2">
                                        <CheckCircle size={14} /> Connection Successful
                                    </span>
                                )}
                            </div>

                            <div className="flex gap-3">
                                {!isEditing ? (
                                    <>
                                        <button
                                            onClick={handleTestConnection}
                                            disabled={testStatus === 'testing'}
                                            className="px-4 py-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <RefreshCw size={14} className={testStatus === 'testing' ? 'animate-spin' : ''} />
                                            Test Connection
                                        </button>
                                        <button
                                            onClick={handleEdit}
                                            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 transition-all text-sm font-bold"
                                        >
                                            Edit Configuration
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleCancel}
                                            className="px-4 py-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm font-medium flex items-center gap-2"
                                        >
                                            <Ban size={14} /> Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 transition-all text-sm font-bold flex items-center gap-2"
                                        >
                                            <Save size={14} /> Save Changes
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
