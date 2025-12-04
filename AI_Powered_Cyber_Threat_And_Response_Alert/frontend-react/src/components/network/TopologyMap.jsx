import React from 'react';
import { Network, Server, Laptop, Wifi, Smartphone, Globe } from 'lucide-react';

const TopologyMap = ({ devices, isScanning }) => {
    return (
        <div className="relative w-full h-full bg-[#1e293b]/50 backdrop-blur rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center shadow-inner">
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
            </div>

            {/* Central Hub (Scanner) */}
            <div className="relative z-10 w-20 h-20 bg-blue-600/20 border border-blue-500/50 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.3)] backdrop-blur-md">
                <Network className="text-blue-400" size={36} />

                {/* Radar Effect (Only when scanning) */}
                {isScanning && (
                    <>
                        <div className="absolute inset-0 border-2 border-cyan-400/30 rounded-full animate-ping"></div>
                        <div className="absolute w-[400px] h-[400px] border border-cyan-500/10 rounded-full flex items-center justify-center pointer-events-none">
                            <div className="w-full h-1/2 bg-gradient-to-t from-transparent to-cyan-500/20 absolute top-0 origin-bottom animate-spin duration-[2s]"></div>
                        </div>
                    </>
                )}
            </div>

            {/* Device Nodes */}
            {devices.map((device, index) => {
                const angle = (index / devices.length) * 2 * Math.PI;
                const radius = 160;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                return (
                    <div
                        key={device.ip}
                        className="absolute flex flex-col items-center group transition-all duration-500"
                        style={{ transform: `translate(${x}px, ${y}px)` }}
                    >
                        {/* Connecting Line */}
                        <div className="absolute top-1/2 left-1/2 h-[1px] bg-gradient-to-r from-transparent via-slate-700 to-slate-700 -z-10 origin-left"
                            style={{
                                width: `${radius}px`,
                                transform: `translate(-50%, -50%) rotate(${angle * (180 / Math.PI) + 180}deg)`,
                                left: `-${radius / 2}px`
                            }}
                        />

                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg border transition-all hover:scale-110 cursor-pointer relative ${device.status === 'Critical' ? 'bg-rose-900/80 border-rose-500 text-rose-400 shadow-rose-900/50' :
                            device.status === 'Warning' ? 'bg-amber-900/80 border-amber-500 text-amber-400 shadow-amber-900/50' :
                                'bg-slate-800/90 border-slate-600 text-slate-300 shadow-slate-900/50'
                            }`}>
                            {/* Status Dot */}
                            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-[#1e293b] ${device.status === 'Critical' ? 'bg-rose-500 animate-pulse' :
                                device.status === 'Warning' ? 'bg-amber-500' :
                                    'bg-emerald-500'
                                }`}></div>

                            {device.type === 'Server' && <Server size={20} />}
                            {device.type === 'Desktop' && <Laptop size={20} />}
                            {device.type === 'IoT' && <Wifi size={20} />}
                            {device.type === 'Mobile' && <Smartphone size={20} />}
                            {device.type === 'Gateway' && <Globe size={20} />}
                        </div>

                        {/* Label */}
                        <div className="mt-3 bg-black/60 backdrop-blur px-2.5 py-1 rounded-md text-[10px] text-slate-300 border border-slate-700/50 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 pointer-events-none transform translate-y-2 group-hover:translate-y-0">
                            <span className="font-bold text-white">{device.hostname}</span>
                            <span className="block text-slate-500 font-mono">{device.ip}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TopologyMap;