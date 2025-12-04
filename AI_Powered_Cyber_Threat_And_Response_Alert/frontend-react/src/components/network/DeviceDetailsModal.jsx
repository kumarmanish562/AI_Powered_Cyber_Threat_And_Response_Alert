import React, { useState, useEffect, useRef } from 'react';
import { X, Server, Shield, Activity, Clock, Globe, Cpu, Play, Terminal, CheckCircle, AlertTriangle, Lock, Database, Wifi, Loader2, ShieldCheck } from 'lucide-react';
import gsap from "gsap";

const DeviceDetailsModal = ({ device, onClose }) => {
    const [isScanning, setIsScanning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [scanLogs, setScanLogs] = useState([]);
    const modalRef = useRef(null);
    const logsEndRef = useRef(null);

    // Reset state when device changes
    useEffect(() => {
        if (device) {
            setIsScanning(false);
            setProgress(0);
            setScanLogs([]);

            // Animate Entrance
            if (modalRef.current) {
                const ctx = gsap.context(() => {
                    gsap.fromTo(modalRef.current,
                        { opacity: 0, scale: 0.95, y: 20 },
                        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "power3.out" }
                    );

                    gsap.from(".modal-anim-item", {
                        y: 20,
                        opacity: 0,
                        duration: 0.5,
                        stagger: 0.1,
                        delay: 0.2,
                        ease: "power2.out"
                    });
                }, modalRef);
                return () => ctx.revert();
            }
        }
    }, [device]);

    // Auto-scroll logs
    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [scanLogs]);

    if (!device) return null;

    const handleDeepScan = () => {
        if (isScanning) return;
        setIsScanning(true);
        setProgress(0);
        setScanLogs([{ time: new Date().toLocaleTimeString(), msg: `Initiating Deep Scan on ${device.ip}...`, type: 'info' }]);

        let p = 0;
        const interval = setInterval(() => {
            p += 1; // Increment progress
            setProgress(p);

            // Simulation Milestones
            if (p === 5) addLog("Verifying host reachability (ICMP)...");
            if (p === 15) addLog("Host is UP. Latency: 2ms. Starting port enumeration...");
            if (p === 30) addLog(`Scanning top 1000 ports on ${device.ip}...`);
            if (p === 45) addLog("Port 80 (HTTP) open. Banner: Apache/2.4.41");
            if (p === 55) addLog("Port 443 (HTTPS) open. Checking SSL certificate...");
            if (p === 70) addLog("Running CVE vulnerability check against database...");
            if (p === 85) addLog("Analyzing service versions for known exploits...");
            if (p === 95) addLog("Finalizing report and risk assessment...");

            if (p >= 100) {
                clearInterval(interval);
                setIsScanning(false);
                addLog("Deep Scan Completed. Report generated.", "success");
            }
        }, 50); // Speed of scan
    };

    const addLog = (msg, type = 'info') => {
        setScanLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), msg, type }]);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Critical': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
            case 'Warning': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            default: return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
        }
    };

    const statusStyle = getStatusColor(device.status);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div ref={modalRef} className="relative w-full max-w-3xl bg-[#020617] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Background Grid */}
                <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="absolute top-0 right-0 w-full h-64 bg-blue-900/10 blur-[80px]"></div>
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
                </div>

                {/* Header */}
                <div className="p-6 border-b border-slate-800/60 flex justify-between items-start bg-[#0f172a]/80 backdrop-blur-md relative z-10 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg border ${statusStyle.replace('text-', 'border-').split(' ')[2]} bg-slate-900`}>
                            <Server size={28} className={statusStyle.split(' ')[0]} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-bold text-white tracking-tight">{device.hostname}</h2>
                                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border tracking-wider ${statusStyle}`}>
                                    {device.status}
                                </span>
                            </div>
                            <p className="text-slate-400 font-mono text-sm mt-1 flex items-center gap-2">
                                <Globe size={12} /> {device.ip}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="p-6 overflow-y-auto custom-scrollbar relative z-10 flex-1 bg-[#020617]/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Status Card */}
                        <div className="modal-anim-item bg-slate-900/50 p-5 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Activity size={14} className="text-blue-400" /> Connectivity
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-300 text-sm">Latency</span>
                                    <div className="flex items-center gap-2">
                                        <span className="flex h-2 w-2 relative">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                        </span>
                                        <span className="font-mono text-white font-bold">{device.latency}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-300 text-sm">Packet Loss</span>
                                    <span className="font-mono text-emerald-400 text-sm">0%</span>
                                </div>
                                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                                    <div className="bg-emerald-500 h-1.5 rounded-full w-[98%] shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                </div>
                            </div>
                        </div>

                        {/* System Info */}
                        <div className="modal-anim-item bg-slate-900/50 p-5 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Cpu size={14} className="text-purple-400" /> System Fingerprint
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm border-b border-slate-800/50 pb-2">
                                    <span className="text-slate-400">Operating System</span>
                                    <span className="text-white font-medium flex items-center gap-2">
                                        {device.os === 'Linux' ? <Terminal size={14} /> : <Server size={14} />}
                                        {device.os}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm border-b border-slate-800/50 pb-2">
                                    <span className="text-slate-400">Device Type</span>
                                    <span className="text-white font-medium">{device.type}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">MAC Address</span>
                                    <span className="text-slate-500 font-mono text-xs">00:1B:44:11:3A:B7</span>
                                </div>
                            </div>
                        </div>

                        {/* Open Ports */}
                        <div className="modal-anim-item md:col-span-2 bg-slate-900/50 p-5 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Wifi size={14} className="text-amber-400" /> Network Exposure
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {device.ports && device.ports.length > 0 ? (
                                    device.ports.map(port => (
                                        <div key={port} className="flex flex-col items-center justify-center bg-slate-950 border border-slate-800 rounded-lg p-3 w-24 hover:border-blue-500/30 transition-colors group">
                                            <span className="text-[10px] text-slate-500 uppercase font-bold mb-1">Port</span>
                                            <span className="text-lg font-mono text-blue-400 font-bold group-hover:text-blue-300">{port}</span>
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-slate-500 text-sm italic flex items-center gap-2">
                                        <ShieldCheck size={16} /> No open ports detected (Stealth Mode)
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Security Analysis */}
                        <div className="modal-anim-item md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-900/50 p-5 rounded-xl border border-slate-800 relative overflow-hidden">
                            <div className={`absolute top-0 left-0 w-1 h-full ${statusStyle.split(' ')[1]}`}></div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Shield size={14} className={statusStyle.split(' ')[0]} /> Threat Analysis
                            </h3>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                {device.status === 'Critical'
                                    ? "Multiple high-severity vulnerabilities detected. Unusual traffic patterns observed on port 445. Immediate isolation recommended."
                                    : device.status === 'Warning'
                                        ? "Device is showing slightly elevated latency and one outdated service version. Monitor for potential issues."
                                        : "Device operating within normal parameters. Latest security patches applied. No suspicious activity detected."
                                }
                            </p>
                        </div>

                        {/* Deep Scan Section */}
                        <div className="modal-anim-item md:col-span-2 bg-black/40 rounded-xl border border-slate-700 overflow-hidden shadow-inner">
                            <div className="bg-[#0f172a] px-4 py-3 border-b border-slate-700 flex justify-between items-center">
                                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                                    <Terminal size={14} />
                                    <span>ROOT_ACCESS :: DEEP_SCAN_V2.exe</span>
                                </div>
                                {isScanning && <span className="text-[10px] font-bold animate-pulse text-emerald-400 px-2 py-0.5 bg-emerald-500/10 rounded">SCANNING...</span>}
                            </div>

                            {/* Progress Bar */}
                            {isScanning && (
                                <div className="h-1 w-full bg-slate-800">
                                    <div
                                        className="h-full bg-cyan-500 transition-all duration-75 ease-linear shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            )}

                            {/* Logs */}
                            <div className="p-4 h-48 overflow-y-auto font-mono text-xs space-y-1.5 bg-[#050a14]">
                                {scanLogs.length === 0 && !isScanning ? (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-600">
                                        <Database size={24} className="mb-2 opacity-20" />
                                        <p>Ready to initiate system scan.</p>
                                    </div>
                                ) : (
                                    scanLogs.map((log, idx) => (
                                        <div key={idx} className="break-all flex gap-3">
                                            <span className="text-slate-600 select-none">[{log.time}]</span>
                                            <span className={log.type === 'success' ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                                                {log.type === 'success' ? '✓ ' : '> '} {log.msg}
                                            </span>
                                        </div>
                                    ))
                                )}
                                <div ref={logsEndRef} />
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-800/60 bg-[#0f172a]/80 backdrop-blur-md flex justify-end gap-4 shrink-0 relative z-10">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors border border-transparent hover:border-slate-700"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleDeepScan}
                        disabled={isScanning}
                        className={`px-6 py-2.5 text-sm font-bold text-white rounded-xl shadow-lg transition-all flex items-center gap-2 border ${isScanning
                            ? "bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed"
                            : "bg-blue-600 border-blue-500 hover:bg-blue-500 hover:shadow-blue-500/25 active:scale-95"
                            }`}
                    >
                        {isScanning ? (
                            <><Loader2 size={16} className="animate-spin" /> Scanning...</>
                        ) : (
                            <><Play size={16} fill="currentColor" /> Run Deep Scan</>
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default DeviceDetailsModal;