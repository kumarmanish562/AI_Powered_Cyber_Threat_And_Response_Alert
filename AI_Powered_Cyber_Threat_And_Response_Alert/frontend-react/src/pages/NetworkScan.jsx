import React, { useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import { Network, Play, RefreshCw, Terminal, Activity, Globe, Cpu, ShieldCheck, Server } from "lucide-react";
import { useNetworkScan } from "../hooks/useNetworkScan";
import ScanTerminal from "../components/network/ScanTerminal";
import AssetTable from "../components/network/AssetTable";
import gsap from "gsap";

// --- Topology Map Visual (Placeholder for actual Map component) ---
const TopologyVisual = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".node-pulse", {
        scale: 1.5,
        opacity: 0,
        duration: 2,
        repeat: -1,
        stagger: 0.5
      });

      gsap.from(".node", {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.7)"
      });
    }, mapRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={mapRef} className="w-full h-full bg-slate-50 dark:bg-[#020617] relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 transition-colors duration-300">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      {/* Central Hub */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
        <div className="relative">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.5)] border-4 border-slate-50 dark:border-[#020617] z-20 relative transition-colors">
            <Globe className="text-white w-8 h-8" />
          </div>
          <div className="node-pulse absolute inset-0 bg-blue-500 rounded-full -z-10"></div>
          <div className="node-pulse absolute inset-0 bg-blue-500 rounded-full -z-10 delay-75"></div>
        </div>
        <span className="mt-2 text-xs font-bold text-blue-600 dark:text-blue-400 bg-white/80 dark:bg-[#020617]/80 px-2 py-1 rounded border border-blue-500/30">GATEWAY</span>
      </div>

      {/* Satellite Nodes */}
      {[
        { x: '20%', y: '30%', icon: Server, color: 'emerald' },
        { x: '80%', y: '25%', icon: Database, color: 'cyan' }, // Assuming Database imported
        { x: '15%', y: '75%', icon: ShieldCheck, color: 'rose' },
        { x: '85%', y: '70%', icon: Cpu, color: 'purple' },
        { x: '50%', y: '15%', icon: Network, color: 'amber' }
      ].map((node, i) => (
        <div key={i} className="node absolute flex flex-col items-center" style={{ left: node.x, top: node.y }}>
          <div className={`w-10 h-10 bg-white dark:bg-slate-900 rounded-lg border border-${node.color}-500/30 flex items-center justify-center shadow-lg hover:scale-110 transition-all cursor-pointer z-10`}>
            <node.icon size={18} className={`text-${node.color}-600 dark:text-${node.color}-400`} />
          </div>
          {/* Connecting Line (Simplified CSS) */}
          <svg className="absolute top-1/2 left-1/2 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 -z-20 pointer-events-none opacity-20">
            <line x1="50%" y1="50%" x2={i % 2 === 0 ? "100%" : "0%"} y2="100%" stroke="currentColor" className="text-slate-400 dark:text-white" strokeWidth="1" strokeDasharray="4 4" />
          </svg>
        </div>
      ))}
    </div>
  );
};

// Placeholder for Database icon if not imported
const Database = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>
);


export default function NetworkScan() {
  const { isScanning, progress, devices, loading, logs, startScan } = useNetworkScan();
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".scan-header", { y: -20, opacity: 0, duration: 0.8, ease: "power3.out" });
      gsap.from(".scan-control-bar", { y: 20, opacity: 0, duration: 0.6, ease: "power2.out", delay: 0.2 });
      gsap.from(".scan-grid-item", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.2)",
        delay: 0.4
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-600 dark:text-slate-300 font-sans transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 p-8 h-screen overflow-y-auto relative" ref={containerRef}>

        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-indigo-500/5 dark:bg-indigo-900/10 blur-[120px] pointer-events-none rounded-full"></div>

        {/* --- Header --- */}
        <div className="scan-header flex flex-col md:flex-row justify-between items-end mb-8 relative z-10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <Network className="text-cyan-600 dark:text-cyan-400" size={28} />
              </div>
              <h1 className="text-3xl text-slate-900 dark:text-white font-bold tracking-tight">Network Scanner</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Engine Ready
              </span>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Discover assets, open ports, and map network topology.</p>
            </div>
          </div>

          <div className="scan-control-bar flex items-center gap-4 w-full md:w-auto bg-white/50 dark:bg-[#1e293b]/50 backdrop-blur-md p-2 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
            {isScanning && (
              <div className="flex-1 md:w-64 px-4">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">Scanning Subnet</span>
                  <span className="text-xs font-mono text-slate-900 dark:text-white">{progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-600 to-blue-500 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(6,182,212,0.6)]"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <button
              onClick={startScan}
              disabled={isScanning}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg ${isScanning
                ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-slate-700"
                : "bg-cyan-600 text-white hover:bg-cyan-500 shadow-cyan-900/20 hover:shadow-cyan-900/40 hover:-translate-y-0.5 active:translate-y-0"
                }`}
            >
              {isScanning ? <><RefreshCw size={16} className="animate-spin" /> Abort Scan</> : <><Play size={16} fill="currentColor" /> Start Scan</>}
            </button>
          </div>
        </div>

        {/* --- Top Section: Visual Map & Terminal --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 min-h-[500px]">

          {/* Visual Map (2/3 width) */}
          <div className="scan-grid-item lg:col-span-2 relative h-full bg-white dark:bg-[#020617] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden group transition-colors">

            {/* Map Overlay UI */}
            <div className="absolute top-4 left-4 z-20 bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-md p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl w-64 transition-colors">
              <div className="flex items-center justify-between mb-3 border-b border-slate-200 dark:border-slate-800 pb-2">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Topology Status</p>
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,1)]"></div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Gateway</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">Online</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Subnet</span>
                  <span className="text-blue-600 dark:text-blue-400 font-mono">192.168.1.0/24</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Latency</span>
                  <span className="text-purple-600 dark:text-purple-400 font-mono">~4ms</span>
                </div>
              </div>
            </div>

            <div className="absolute bottom-4 right-4 z-20 flex gap-2">
              <button className="p-2 bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"><Activity size={16} /></button>
            </div>

            {/* Replaced TopologyMap with new Visual Component */}
            <TopologyVisual />
          </div>

          {/* Terminal Output (1/3 width) */}
          <div className="scan-grid-item flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden min-h-[500px]">
            {/* Terminal implementation using the new ScanTerminal component */}
            <ScanTerminal logs={logs} />
          </div>

        </div>

        {/* --- Asset Table --- */}
        <div className="scan-grid-item">
          <AssetTable devices={devices} loading={loading} />
        </div>

      </main>
    </div>
  );
}