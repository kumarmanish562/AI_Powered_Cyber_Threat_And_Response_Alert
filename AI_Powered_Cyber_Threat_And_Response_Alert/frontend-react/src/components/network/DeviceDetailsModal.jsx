import React, { useState, useEffect, useRef } from 'react';
import { X, Server, Shield, Activity, Clock, Globe, Cpu, Play, Terminal, CheckCircle } from 'lucide-react';

const DeviceDetailsModal = ({ device, onClose }) => {
    const [isScanning, setIsScanning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [scanLogs, setScanLogs] = useState([]);
    const logsEndRef = useRef(null);

    // Reset state when device changes
    useEffect(() => {
        setIsScanning(false);
        setProgress(0);
        setScanLogs([]);
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#1e293b] border border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden relative animate-scale-in flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-6 border-b border-slate-700 flex justify-between items-start bg-slate-800/50 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg border ${device.status === 'Critical' ? 'bg-rose-500/20 border-rose-500/50 text-rose-400' :
                                device.status === 'Warning' ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' :
                                    'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                            }`}>
                            <Server size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">{device.hostname}</h2>
                            <p className="text-slate-400 font-mono text-sm">{device.ip}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-700 rounded-lg"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Status Card */}
                        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Activity size={14} /> Health Status
                            </h3>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-slate-300 text-sm">Current State</span>
                                <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase border ${device.status === 'Critical' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                        device.status === 'Warning' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                            'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                    }`}>
                                    {device.status}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-300 text-sm">Latency</span>
                                <span className="font-mono text-cyan-400 text-sm">{device.latency}</span>
                            </div>
                        </div>

                        {/* System Info */}
                        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Cpu size={14} /> System Info
                            </h3>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">OS</span>
                                    <span className="text-white">{device.os}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Type</span>
                                    <span className="text-white">{device.type}</span>
                                </div>
                            </div>
                        </div>

                        {/* Open Ports */}
                        <div className="md:col-span-2 bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Globe size={14} /> Open Ports & Services
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {device.ports && device.ports.length > 0 ? (
                                    device.ports.map(port => (
                                        <span key={port} className="px-3 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md text-xs font-mono flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span>
                                            Port {port}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-slate-500 text-sm italic">No open ports detected</span>
                                )}
                            </div>
                        </div>

                        {/* Security Analysis */}
                        <div className="md:col-span-2 bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Shield size={14} /> Security Analysis
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
                        {(isScanning || scanLogs.length > 0) && (
                            <div className="md:col-span-2 bg-black/40 rounded-lg border border-slate-700 overflow-hidden">
                                <div className="bg-slate-800/50 px-4 py-2 border-b border-slate-700 flex justify-between items-center">
                                    <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                                        <Terminal size={12} />
                                        <span>DEEP_SCAN_V2.exe</span>
                                    </div>
                                    {isScanning && <span className="text-[10px] animate-pulse text-emerald-400">RUNNING...</span>}
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
                                <div className="p-3 h-48 overflow-y-auto font-mono text-xs space-y-1">
                                    {scanLogs.map((log, idx) => (
                                        <div key={idx} className="break-all">
                                            <span className="text-slate-500">[{log.time}]</span>{" "}
                                            <span className={log.type === 'success' ? 'text-emerald-400' : 'text-slate-300'}>
                                                {log.msg}
                                            </span>
                                        </div>
                                    ))}
                                    <div ref={logsEndRef} />
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-700 bg-slate-800/50 flex justify-end gap-3 shrink-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleDeepScan}
                        disabled={isScanning}
                        className={`px-4 py-2 text-sm font-bold text-white rounded-lg shadow-lg transition-all flex items-center gap-2 ${isScanning
                                ? "bg-slate-700 cursor-not-allowed text-slate-400"
                                : "bg-cyan-600 hover:bg-cyan-500 shadow-cyan-900/20"
                            }`}
                    >
                        {isScanning ? (
                            <>Scanning...</>
                        ) : (
                            <>Run Deep Scan <Play size={14} fill="currentColor" /></>
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default DeviceDetailsModal;
