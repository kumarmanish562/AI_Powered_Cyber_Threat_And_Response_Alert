import React, { useState, useEffect, useRef } from 'react';
import { Server, ChevronRight, ShieldCheck, AlertTriangle, Activity, Search } from 'lucide-react';
import DeviceDetailsModal from './DeviceDetailsModal';
import gsap from "gsap";

const AssetTable = ({ devices, loading }) => {
    const [selectedDevice, setSelectedDevice] = useState(null);
    const tableRef = useRef(null);

    useEffect(() => {
        if (!loading && devices.length > 0) {
            const ctx = gsap.context(() => {
                gsap.from(".asset-row", {
                    y: 20,
                    opacity: 0,
                    duration: 0.4,
                    stagger: 0.05,
                    ease: "power2.out"
                });
            }, tableRef);
            return () => ctx.revert();
        }
    }, [loading, devices]);

    return (
        <>
            <div ref={tableRef} className="bg-white/80 dark:bg-[#1e293b]/40 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden relative transition-colors duration-300">
                {/* Top Gradient Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>

                <div className="p-6 border-b border-slate-200 dark:border-slate-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 dark:bg-[#0f172a]/50">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <div className="p-2 bg-blue-600/20 rounded-lg border border-blue-500/30 text-blue-600 dark:text-blue-400">
                                <Server size={20} />
                            </div>
                            Discovered Assets
                            <span className="text-xs font-mono text-slate-500 bg-slate-200 dark:bg-slate-900 px-2 py-1 rounded border border-slate-300 dark:border-slate-800 ml-2">
                                {devices.length} NODES
                            </span>
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 ml-11">Real-time network topology scan results.</p>
                    </div>

                    <div className="flex gap-3 text-xs font-bold uppercase tracking-wider">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg">
                            <AlertTriangle size={14} />
                            {devices.filter(d => d.status === 'Critical').length} Critical
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg">
                            <Activity size={14} />
                            {devices.filter(d => d.status === 'Warning').length} Warning
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">
                            <ShieldCheck size={14} />
                            {devices.filter(d => d.status === 'Safe').length} Secure
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-100 dark:bg-[#0f172a] text-[11px] uppercase text-slate-500 font-bold tracking-widest transition-colors">
                            <tr>
                                <th className="p-5 border-b border-slate-200 dark:border-slate-800">Device Name</th>
                                <th className="p-5 border-b border-slate-200 dark:border-slate-800">IP Address</th>
                                <th className="p-5 border-b border-slate-200 dark:border-slate-800">Type</th>
                                <th className="p-5 border-b border-slate-200 dark:border-slate-800">OS Fingerprint</th>
                                <th className="p-5 border-b border-slate-200 dark:border-slate-800">Open Ports</th>
                                <th className="p-5 border-b border-slate-200 dark:border-slate-800 text-right">Latency</th>
                                <th className="p-5 border-b border-slate-200 dark:border-slate-800 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800/50 text-sm bg-white/30 dark:bg-[#0b1120]/30 transition-colors">
                            {loading && devices.length === 0 ? (
                                // Loading Skeleton
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="p-5"><div className="w-32 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div></td>
                                        <td className="p-5"><div className="w-24 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div></td>
                                        <td className="p-5"><div className="w-16 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div></td>
                                        <td className="p-5"><div className="w-24 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div></td>
                                        <td className="p-5"><div className="w-32 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div></td>
                                        <td className="p-5 text-right"><div className="w-12 h-4 bg-slate-200 dark:bg-slate-800 rounded ml-auto"></div></td>
                                        <td className="p-5 text-right"><div className="w-8 h-8 bg-slate-200 dark:bg-slate-800 rounded ml-auto"></div></td>
                                    </tr>
                                ))
                            ) : devices.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="p-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <Search size={48} className="mb-4 opacity-20" />
                                            <p>No assets discovered yet.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                devices.map((device) => (
                                    <tr key={device.ip} className="asset-row hover:bg-slate-100 dark:hover:bg-slate-800/30 transition-colors group">
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className={`relative flex h-3 w-3`}>
                                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${device.status === 'Critical' ? 'bg-rose-500' : device.status === 'Warning' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                                                    <span className={`relative inline-flex rounded-full h-3 w-3 ${device.status === 'Critical' ? 'bg-rose-500' : device.status === 'Warning' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                                                </div>
                                                <span className="font-bold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{device.hostname}</span>
                                            </div>
                                        </td>
                                        <td className="p-5 font-mono text-slate-500 dark:text-slate-400 text-xs">{device.ip}</td>
                                        <td className="p-5">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wide shadow-sm">
                                                {device.type}
                                            </span>
                                        </td>
                                        <td className="p-5 text-slate-500 dark:text-slate-400 text-xs">{device.os}</td>
                                        <td className="p-5">
                                            <div className="flex gap-1.5 flex-wrap">
                                                {device.ports.slice(0, 3).map(port => (
                                                    <span key={port} className="px-1.5 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded text-[10px] font-mono font-bold">
                                                        {port}
                                                    </span>
                                                ))}
                                                {device.ports.length > 3 && (
                                                    <span className="text-[10px] text-slate-500 px-1">+{device.ports.length - 3}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-5 text-right">
                                            <span className={`font-mono text-xs font-bold ${parseInt(device.latency) > 100 ? 'text-amber-500 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                                {device.latency}
                                            </span>
                                        </td>
                                        <td className="p-5 text-right">
                                            <button
                                                onClick={() => setSelectedDevice(device)}
                                                className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1 justify-end group/btn transition-colors uppercase tracking-wider"
                                            >
                                                Inspect <ChevronRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <DeviceDetailsModal
                device={selectedDevice}
                onClose={() => setSelectedDevice(null)}
            />
        </>
    );
};

export default AssetTable;