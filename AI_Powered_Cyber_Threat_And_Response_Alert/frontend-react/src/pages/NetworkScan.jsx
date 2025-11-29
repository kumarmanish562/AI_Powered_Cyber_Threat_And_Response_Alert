import React from "react";
import Sidebar from "../components/Sidebar";
import { Network, Play, RefreshCw, Terminal, Activity } from "lucide-react";
import { useNetworkScan } from "../hooks/useNetworkScan";
import ScanTerminal from "../components/network/ScanTerminal";
import TopologyMap from "../components/network/TopologyMap";
import AssetTable from "../components/network/AssetTable";

/**
 * Network Scanner Page (Real-Time)
 * Features:
 * - Visual Topology Map
 * - Simulated Nmap/Ping sweep + API Integration
 * - Asset Inventory List with Live Status
 */

export default function NetworkScan() {
  const { isScanning, progress, devices, loading, logs, startScan } = useNetworkScan();

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-slate-300 font-sans">
      <Sidebar />

      <main className="flex-1 p-8 h-screen overflow-y-auto relative">
        {/* Background Glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/5 blur-[120px] pointer-events-none"></div>

        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 relative z-10 gap-4">
          <div>
            <h1 className="text-3xl text-white font-bold flex items-center gap-3">
              <Network className="text-cyan-400" size={32} /> Network Scanner
            </h1>
            <p className="text-slate-400 mt-1 flex items-center gap-2">
              Discover assets, open ports, and map network topology.
              {loading && <span className="text-cyan-500 animate-pulse text-xs">(Syncing...)</span>}
            </p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            {isScanning && (
              <div className="text-right flex-1 md:flex-none">
                <p className="text-xs text-cyan-400 font-bold mb-1 font-mono">SCANNING... {progress}%</p>
                <div className="w-full md:w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 transition-all shadow-[0_0_10px_rgba(6,182,212,0.6)]" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            )}
            <button
              onClick={startScan}
              disabled={isScanning}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all shadow-lg w-full md:w-auto justify-center ${isScanning
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                  : "bg-cyan-600 text-white hover:bg-cyan-500 shadow-cyan-900/20 hover:scale-105"
                }`}
            >
              {isScanning ? <><RefreshCw size={20} className="animate-spin" /> Scanning...</> : <><Play size={20} /> Start Scan</>}
            </button>
          </div>
        </div>

        {/* --- Top Section: Visual Map & Terminal --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 h-[500px] lg:h-[450px]">

          {/* Visual Map (2/3 width) */}
          <div className="lg:col-span-2 relative h-full">
            <div className="absolute top-4 left-4 z-20 bg-slate-900/90 backdrop-blur p-4 rounded-xl border border-slate-700/50 shadow-xl">
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-3">Topology Status</p>
              <div className="flex items-center gap-2 text-sm text-emerald-400 font-mono font-bold">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                Gateway Online
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-2">
                <Network size={14} className="text-blue-400" />
                Subnet: 192.168.1.0/24
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-1">
                <Activity size={14} className="text-purple-400" />
                Latency: ~4ms
              </div>
            </div>
            <TopologyMap devices={devices} isScanning={isScanning} />
          </div>

          {/* Terminal Output (1/3 width) */}
          <div className="flex flex-col h-full">
            <div className="bg-[#1e293b] p-4 rounded-t-xl border border-slate-800 flex justify-between items-center shadow-lg relative z-10">
              <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                <Terminal size={16} className="text-cyan-400" /> Live Logs
              </h3>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
              </div>
            </div>
            <div className="flex-1 bg-[#0b1120] border-x border-b border-slate-800 rounded-b-xl overflow-hidden shadow-lg">
              <ScanTerminal logs={logs} />
            </div>
          </div>

        </div>

        {/* --- Asset Table --- */}
        <AssetTable devices={devices} loading={loading} />

      </main>
    </div>
  );
}