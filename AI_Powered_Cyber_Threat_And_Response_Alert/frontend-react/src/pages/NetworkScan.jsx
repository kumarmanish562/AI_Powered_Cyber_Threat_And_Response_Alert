import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import { getNetworkDevices } from "../services/api"; // Import API
import {
  Network,
  Wifi,
  Search,
  Server,
  Smartphone,
  Laptop,
  Play,
  StopCircle,
  ShieldAlert,
  Terminal,
  ChevronRight,
  Globe,
  Activity,
  RefreshCw,
  Cpu
} from "lucide-react";

/**
 * Network Scanner Page (Real-Time)
 * Features:
 * - Visual Topology Map
 * - Simulated Nmap/Ping sweep + API Integration
 * - Asset Inventory List with Live Status
 */

// ----- Helper Components -----

// A simulated Terminal window showing scan logs
const ScanTerminal = ({ logs }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-[#0b1120] border border-slate-800 rounded-lg p-4 font-mono text-xs h-full flex flex-col shadow-inner relative overflow-hidden">
      {/* Scanline effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-[10px] w-full animate-scan pointer-events-none"></div>
      
      <div className="flex items-center gap-2 mb-2 border-b border-slate-800 pb-2 z-10">
        <Terminal size={14} className="text-slate-500" />
        <span className="text-slate-400">Scanner Output (Console)</span>
      </div>
      <div ref={scrollRef} className="overflow-y-auto flex-1 space-y-1 z-10 scrollbar-thin scrollbar-thumb-slate-800">
        {logs.map((log, idx) => (
          <div key={idx} className="break-all font-medium">
            <span className="text-slate-600">[{log.time}]</span>{" "}
            <span className={log.type === 'error' ? 'text-rose-400' : log.type === 'success' ? 'text-emerald-400' : 'text-slate-300'}>
              {log.msg}
            </span>
          </div>
        ))}
        <div className="animate-pulse text-cyan-500 font-bold">_</div>
      </div>
    </div>
  );
};

// The visual map of the network
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
                   transform: `translate(-50%, -50%) rotate(${angle * (180/Math.PI) + 180}deg)`,
                   left: `-${radius/2}px` 
                 }} 
            />
            
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg border transition-all hover:scale-110 cursor-pointer relative ${
              device.status === 'Critical' ? 'bg-rose-900/80 border-rose-500 text-rose-400 shadow-rose-900/50' : 
              device.status === 'Warning' ? 'bg-amber-900/80 border-amber-500 text-amber-400 shadow-amber-900/50' :
              'bg-slate-800/90 border-slate-600 text-slate-300 shadow-slate-900/50'
            }`}>
              {/* Status Dot */}
              <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-[#1e293b] ${
                 device.status === 'Critical' ? 'bg-rose-500 animate-pulse' : 
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

// ----- Main Component -----

export default function NetworkScan() {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([{ time: new Date().toLocaleTimeString(), msg: "System ready. Idle.", type: "info" }]);

  // --- 1. Fetch Data ---
  const fetchDevices = async () => {
    try {
      const data = await getNetworkDevices();
      setDevices(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch network devices:", error);
    }
  };

  useEffect(() => {
    fetchDevices(); // Initial load
    const interval = setInterval(fetchDevices, 5000); // Poll every 5s for status updates
    return () => clearInterval(interval);
  }, []);

  // --- 2. Simulation Logic ---
  const startScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setProgress(0);
    setLogs([{ time: new Date().toLocaleTimeString(), msg: "Initializing Network Discovery...", type: "info" }]);

    let p = 0;
    const interval = setInterval(() => {
      p += 2; // Slower progress for realism
      setProgress(p);

      // Random log generation
      if (p === 10) addLog("Gateway 192.168.1.1 responded (1ms).");
      if (p === 24) addLog("Scanning Subnet 192.168.1.0/24...", "info");
      if (p === 40) addLog(`Discovered ${devices.length} hosts active in ARP table.`);
      if (p === 65) addLog("Port scan initiated on active hosts...");
      if (p === 80) addLog("Analyzing OS fingerprints and service versions...");
      if (p === 92) addLog("Finalizing topology map...");

      if (p >= 100) {
        clearInterval(interval);
        setIsScanning(false);
        fetchDevices(); // Refresh data to ensure latest status
        addLog("Scan Completed Successfully. Asset inventory updated.", "success");
      }
    }, 100);
  };

  const addLog = (msg, type = "info") => {
    setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), msg, type }]);
  };

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
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all shadow-lg w-full md:w-auto justify-center ${
                isScanning 
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
                <Network size={14} className="text-blue-400"/>
                Subnet: 192.168.1.0/24
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-1">
                <Activity size={14} className="text-purple-400"/>
                Latency: ~4ms
              </div>
            </div>
            <TopologyMap devices={devices} isScanning={isScanning} />
          </div>

          {/* Terminal Output (1/3 width) */}
          <div className="flex flex-col h-full">
            <div className="bg-[#1e293b] p-4 rounded-t-xl border border-slate-800 flex justify-between items-center shadow-lg relative z-10">
              <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                <Terminal size={16} className="text-cyan-400"/> Live Logs
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
        <div className="bg-[#1e293b]/60 backdrop-blur-sm rounded-xl border border-slate-800 shadow-xl overflow-hidden animate-fade-in-up">
          <div className="p-5 border-b border-slate-800 flex justify-between items-center">
            <h3 className="font-bold text-white flex items-center gap-2">
                <Server size={18} className="text-slate-400"/> Discovered Assets ({devices.length})
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
                        <div className={`w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)] ${
                            device.status === 'Safe' ? 'bg-emerald-500 shadow-emerald-500/20' : 
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
                        <button className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        Details <ChevronRight size={14} />
                        </button>
                    </td>
                    </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
}