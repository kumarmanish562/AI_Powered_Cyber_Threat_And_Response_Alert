import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import {
    Search, FolderPlus, UploadCloud, FileText, HardDrive,
    Cpu, Shield, Clock, MoreVertical, Plus, Database,
    FileCode, Microscope, Trash2
} from 'lucide-react';
import gsap from 'gsap';

const ForensicsLab = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const [cases, setCases] = useState([
        { id: 1, name: "Case #4092: Ransomware Attack", status: "Active", evidence: 12, created: "2 hrs ago", type: "Malware Analysis" },
        { id: 2, name: "Case #4091: Insider Threat", status: "Closed", evidence: 5, created: "1 day ago", type: "User Behavior" },
        { id: 3, name: "Case #4088: DDoS Investigation", status: "Archived", evidence: 85, created: "3 days ago", type: "Network Forensics" },
    ]);

    const [isDragging, setIsDragging] = useState(false);

    const [storageUsed, setStorageUsed] = useState(74);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".lab-header", { y: -20, opacity: 0, duration: 0.8, ease: "power3.out" });
            gsap.from(".lab-card", {
                y: 20,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "back.out(1.2)",
                delay: 0.2
            });
            gsap.from(".tool-card", {
                scale: 0.9,
                opacity: 0,
                duration: 0.5,
                stagger: 0.05,
                ease: "power2.out",
                delay: 0.5
            });
        }, containerRef);

        // Real-time simulation
        const interval = setInterval(() => {
            // Simulate evidence growth
            setCases(prev => prev.map(c =>
                c.status === 'Active' && Math.random() > 0.7
                    ? { ...c, evidence: c.evidence + 1 }
                    : c
            ));

            // Simulate storage growth
            setStorageUsed(prev => {
                const change = Math.random() > 0.8 ? 0.1 : 0;
                return Math.min(99, prev + change);
            });

        }, 2000);

        return () => {
            ctx.revert();
            clearInterval(interval);
        };
    }, []);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        // Handle file drop logic here
        alert("Files dropped! (Simulation)");
    };

    return (
        <div className="flex min-h-screen bg-[#020617] font-sans text-slate-200">
            <Sidebar />

            <main ref={containerRef} className="flex-1 p-8 h-screen overflow-y-auto relative">
                {/* Background Elements */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none"></div>

                {/* Header */}
                <header className="lab-header flex justify-between items-end mb-10 relative z-10">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <div className="p-2.5 bg-purple-500/10 rounded-xl border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                                <Microscope className="text-purple-400" size={28} />
                            </div>
                            Forensics Lab
                        </h1>
                        <p className="text-slate-400 mt-2 text-sm max-w-xl">
                            Manage digital investigations, analyze evidence artifacts, and generate forensic reports.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/analysis/new')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40 hover:-translate-y-0.5"
                    >
                        <Plus size={18} /> New Case
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Case Management */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Active Cases */}
                        <section className="lab-card bg-[#0f172a]/60 backdrop-blur-xl rounded-2xl border border-slate-800 p-6 shadow-xl">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <FolderPlus size={18} className="text-blue-400" /> Active Cases
                                </h2>
                                <div className="flex gap-2">
                                    <span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400 border border-slate-700">Sort by: Date</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {cases.map((c) => (
                                    <div key={c.id} className="group flex items-center justify-between p-4 bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800 hover:border-purple-500/30 rounded-xl transition-all cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-lg ${c.status === 'Active' ? 'bg-purple-500/10 text-purple-400' : 'bg-slate-800 text-slate-500'}`}>
                                                <FileCode size={20} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-200 group-hover:text-white transition-colors">{c.name}</h3>
                                                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                                    <span className="flex items-center gap-1"><Clock size={12} /> {c.created}</span>
                                                    <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                                                    <span>{c.type}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Evidence</div>
                                                <div className="font-mono text-slate-300">{c.evidence} Files</div>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${c.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                c.status === 'Closed' ? 'bg-slate-700/50 text-slate-400 border-slate-600' :
                                                    'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                }`}>
                                                {c.status}
                                            </div>
                                            <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-500 hover:text-white transition-colors">
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Evidence Upload Zone */}
                        <section
                            className={`lab-card border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300 ${isDragging ? 'border-purple-500 bg-purple-500/10 scale-[1.02]' : 'border-slate-700 bg-[#0f172a]/40 hover:border-slate-600'
                                }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-lg">
                                <UploadCloud size={32} className={isDragging ? "text-purple-400 animate-bounce" : "text-slate-400"} />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Upload Evidence Datasets</h3>
                            <p className="text-slate-400 text-sm max-w-md mb-6">
                                Drag and drop PCAP files, System Logs, or Disk Images here to begin automated analysis.
                                Supported formats: .pcap, .evtx, .log, .dd
                            </p>
                            <button className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium border border-slate-700 transition-colors">
                                Browse Files
                            </button>
                        </section>

                    </div>

                    {/* Right Column: Tools & Stats */}
                    <div className="space-y-8">

                        {/* Forensic Tools */}
                        <section className="lab-card">
                            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Cpu size={16} /> Forensic Toolkit
                            </h2>
                            <div className="grid grid-cols-1 gap-3">
                                {[
                                    { name: "Network Miner", icon: HardDrive, color: "text-cyan-400", bg: "bg-cyan-500/10", desc: "PCAP Analysis" },
                                    { name: "Memory Dump", icon: Database, color: "text-emerald-400", bg: "bg-emerald-500/10", desc: "Volatile Data" },
                                    { name: "Log Parser", icon: FileText, color: "text-amber-400", bg: "bg-amber-500/10", desc: "Event Correlation" },
                                    { name: "Malware Sandbox", icon: Shield, color: "text-rose-400", bg: "bg-rose-500/10", desc: "Behavioral Analysis" },
                                ].map((tool, i) => (
                                    <div key={i} className="tool-card group flex items-center gap-4 p-3 bg-[#0f172a]/80 border border-slate-800 hover:border-slate-600 rounded-xl cursor-pointer hover:bg-slate-800 transition-all">
                                        <div className={`p-2.5 rounded-lg ${tool.bg} ${tool.color} group-hover:scale-110 transition-transform`}>
                                            <tool.icon size={20} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-200 group-hover:text-white">{tool.name}</div>
                                            <div className="text-xs text-slate-500">{tool.desc}</div>
                                        </div>
                                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Plus size={16} className="text-slate-400" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Storage Status */}
                        <section className="lab-card bg-[#0f172a]/60 backdrop-blur rounded-2xl border border-slate-800 p-6">
                            <h3 className="font-bold text-white mb-4">Evidence Storage</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                                        <span>Used Space</span>
                                        <span className="text-white font-mono">{storageUsed.toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-500 transition-all duration-1000 ease-out" style={{ width: `${storageUsed}%` }}></div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-500">
                                    <div className="p-2 bg-slate-800 rounded-lg">
                                        <HardDrive size={14} />
                                    </div>
                                    <div>
                                        <div className="text-slate-300 font-bold">1.2 TB / 2.0 TB</div>
                                        <div>Encrypted Vault</div>
                                    </div>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default ForensicsLab;
