import React, { useState } from 'react';
import { Server, ChevronRight } from 'lucide-react';
import DeviceDetailsModal from './DeviceDetailsModal';

const AssetTable = ({ devices, loading }) => {
    const [selectedDevice, setSelectedDevice] = useState(null);

    return (
        <>
            <div className="bg-[#1e293b]/60 backdrop-blur-sm rounded-xl border border-slate-800 shadow-xl overflow-hidden animate-fade-in-up">
                <div className="p-5 border-b border-slate-800 flex justify-between items-center">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <Server size={18} className="text-slate-400" /> Discovered Assets ({devices.length})
                    </h3>
                    <div className="flex gap-2 text-xs font-medium">
                        <span className="px-2.5 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-md">
                            {devices.filter(d => d.status === 'Critical').length} Critical
                        </span>
                        <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md">
                            {devices.filter(d => d.status === 'Warning').length} Warning
                        </span>
                    </div>
                </div>

                <table className="w-full text-left">
                    <thead className="bg-[#0f172a]/80 text-xs uppercase text-slate-400 font-semibold tracking-wider">
                        <tr>
                            <th className="p-4">Device Name</th>
                            <th className="p-4">IP Address</th>
                            <th className="p-4">Type</th>
                            <th className="p-4">OS Fingerprint</th>
                            <th className="p-4">Open Ports</th>
                            <th className="p-4 text-right">Latency</th>
                            <th className="p-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-sm">
                        {loading && devices.length === 0 ? (
                            // Loading State
                            [...Array(4)].map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="p-4"><div className="w-32 h-4 bg-slate-800 rounded"></div></td>
                                    <td className="p-4"><div className="w-24 h-4 bg-slate-800 rounded"></div></td>
                                    <td className="p-4"><div className="w-16 h-4 bg-slate-800 rounded"></div></td>
                                    <td className="p-4"><div className="w-20 h-4 bg-slate-800 rounded"></div></td>
                                    <td className="p-4"><div className="w-24 h-4 bg-slate-800 rounded"></div></td>
                                    <td className="p-4"></td>
                                    <td className="p-4"></td>
                                </tr>
                            ))
                        ) : (
                            devices.map((device) => (
                                <tr key={device.ip} className="hover:bg-slate-800/40 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)] ${device.status === 'Safe' ? 'bg-emerald-500 shadow-emerald-500/20' :
                                                    device.status === 'Critical' ? 'bg-rose-500 shadow-rose-500/20' :
                                                        'bg-amber-500 shadow-amber-500/20'
                                                }`}></div>
                                            <span className="font-bold text-slate-200">{device.hostname}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 font-mono text-slate-400 text-xs">{device.ip}</td>
                                    <td className="p-4">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs border border-slate-700 font-medium">
                                            {device.type}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-400">{device.os}</td>
                                    <td className="p-4">
                                        <div className="flex gap-1 flex-wrap">
                                            {device.ports.map(port => (
                                                <span key={port} className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-[10px] font-mono">
                                                    {port}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right font-mono text-xs text-slate-500">
                                        {device.latency}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => setSelectedDevice(device)}
                                            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            Details <ChevronRight size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Device Details Modal */}
            <DeviceDetailsModal
                device={selectedDevice}
                onClose={() => setSelectedDevice(null)}
            />
        </>
    );
};

export default AssetTable;
