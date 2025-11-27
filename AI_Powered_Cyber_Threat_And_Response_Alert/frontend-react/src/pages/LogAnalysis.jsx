import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { getLogStats } from "../services/api"; // Import API
import {
  PieChart,
  BarChart2,
  Calendar,
  Download,
  Share2,
  RefreshCw,
  AlertTriangle,
  BrainCircuit,
  TrendingUp,
  Server,
  Shield,
  Globe,
  Database,
  Activity
} from "lucide-react";

/**
 * Log Analysis Page (Real-Time)
 * Features:
 * - Dynamic Histogram visualization
 * - Live Source Distribution
 * - AI Anomaly Summary
 * - Top Talkers Table
 */

// ----- Custom CSS Chart Components -----

const Histogram = ({ data }) => {
  const maxVal = Math.max(...data.map((d) => d.value));
  return (
    <div className="h-64 flex items-end justify-between gap-1 pt-6 px-2 relative">
      {/* Grid lines background */}
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
         <div className="border-t border-slate-400 w-full"></div>
         <div className="border-t border-slate-400 w-full"></div>
         <div className="border-t border-slate-400 w-full"></div>
         <div className="border-t border-slate-400 w-full"></div>
      </div>

      {data.map((item, index) => (
        <div key={index} className="group relative flex flex-col items-center justify-end w-full h-full z-10">
          {/* Tooltip */}
          <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/90 backdrop-blur text-xs text-white px-2 py-1 rounded border border-slate-700 pointer-events-none whitespace-nowrap z-20 shadow-xl">
            <span className="font-bold">{item.label}</span>: {item.value.toLocaleString()} events
          </div>
          {/* Bar */}
          <div
            className={`w-full mx-[1px] rounded-t-sm transition-all duration-500 ease-in-out ${
              item.isAnomaly 
                ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" 
                : "bg-cyan-600/60 hover:bg-cyan-500"
            }`}
            style={{ height: `${(item.value / maxVal) * 100}%` }}
          />
        </div>
      ))}
    </div>
  );
};

const DistributionBar = ({ label, count, total, color, icon }) => {
  const percent = Math.round((count / total) * 100) || 0;
  const IconComponent = icon;
  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-1.5">
        <div className="flex items-center gap-2 text-sm text-slate-300 font-medium">
          {IconComponent ? <IconComponent size={14} className="text-slate-500" /> : null}
          {label}
        </div>
        <div className="text-xs font-mono text-slate-400">
          {count.toLocaleString()} <span className="text-slate-600">/</span> <span className="text-cyan-400">{percent}%</span>
        </div>
      </div>
      <div className="w-full h-1.5 bg-slate-800/50 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ${color}`} 
          style={{ width: `${percent}%` }} 
        />
      </div>
    </div>
  );
};

// ----- Icon Mapping Helper -----
const getIconForLabel = (label) => {
    if (label.includes("Firewall")) return Shield;
    if (label.includes("Auth")) return Globe; // or Lock
    if (label.includes("System")) return Server;
    if (label.includes("Database")) return Database;
    return Activity;
};

// ----- Main Component -----

export default function LogAnalysis() {
  const [timeRange, setTimeRange] = useState("24h");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Data Fetching ---
  const fetchData = async () => {
    try {
      const stats = await getLogStats();
      setData(stats);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch log stats:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Update every 5s
    return () => clearInterval(interval);
  }, []);

  // Loading State
  if (loading) {
      return (
        <div className="flex min-h-screen bg-[#0f172a] text-slate-300 font-sans">
            <Sidebar />
            <main className="flex-1 p-8 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 animate-pulse">
                    <BarChart2 size={48} className="text-cyan-500/50"/>
                    <p className="text-slate-500 font-mono text-sm">Initializing Analytics Engine...</p>
                </div>
            </main>
        </div>
      );
  }

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-slate-300 font-sans">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto h-screen relative">
        {/* Background Glow */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-900/10 to-transparent pointer-events-none"></div>

        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 relative z-10">
          <div>
            <h1 className="text-2xl text-white font-bold flex items-center gap-3">
              <BarChart2 className="text-cyan-400" size={28} /> Log Analytics
            </h1>
            <p className="text-slate-400 mt-1 flex items-center gap-2">
               Deep dive into system behavior.
               <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
               </span>
               <span className="text-xs text-emerald-500 font-bold tracking-wider">LIVE</span>
            </p>
          </div>
          
          <div className="flex items-center gap-2 bg-[#1e293b]/80 backdrop-blur p-1 rounded-lg border border-slate-700">
            {['1h', '24h', '7d', '30d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  timeRange === range 
                    ? 'bg-slate-700 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* --- Top Cards Row --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 relative z-10">
          <div className="bg-[#1e293b]/60 backdrop-blur-sm p-5 rounded-xl border border-slate-800 shadow-lg">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Events</p>
            <h3 className="text-2xl font-bold text-white mt-1">{data.total_events.toLocaleString()}</h3>
            <p className="text-emerald-400 text-xs flex items-center gap-1 mt-2"><TrendingUp size={12}/> +12% vs avg</p>
          </div>
          
          <div className="bg-[#1e293b]/60 backdrop-blur-sm p-5 rounded-xl border border-slate-800 shadow-lg">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Data Ingested</p>
            <h3 className="text-2xl font-bold text-white mt-1">{data.data_ingested}</h3>
            <p className="text-slate-500 text-xs mt-2">Compressed (LZ4)</p>
          </div>

          <div className="bg-[#1e293b]/60 backdrop-blur-sm p-5 rounded-xl border border-slate-800 shadow-lg relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-3 opacity-10 text-rose-500 group-hover:opacity-20 transition-opacity"><AlertTriangle size={60} /></div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Anomalies</p>
            <h3 className="text-2xl font-bold text-rose-400 mt-1">{data.anomalies} Detected</h3>
            <p className="text-rose-400/80 text-xs mt-2">Requires attention</p>
          </div>

          <div className="bg-gradient-to-br from-indigo-900/80 to-slate-900/80 backdrop-blur p-5 rounded-xl border border-indigo-500/30 shadow-lg flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <BrainCircuit size={16} className="text-indigo-400" />
              <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider">AI Insight</p>
            </div>
            <p className="text-xs text-indigo-100 italic leading-relaxed opacity-90">
              "Traffic pattern anomaly detected. 15% deviation from baseline in firewall logs at 14:00."
            </p>
          </div>
        </div>

        {/* --- Main Histogram --- */}
        <div className="bg-[#1e293b]/60 backdrop-blur-md rounded-xl border border-slate-800 shadow-xl p-6 mb-6 relative z-10">
          <div className="flex justify-between items-center mb-4">
            <div>
                <h3 className="text-lg font-semibold text-white">Event Volume</h3>
                <p className="text-xs text-slate-400">Last 24 Hours</p>
            </div>
            <div className="flex gap-2">
              <button onClick={fetchData} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition border border-slate-700 hover:border-slate-600">
                  <RefreshCw size={16} />
              </button>
              <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition border border-slate-700 hover:border-slate-600">
                  <Download size={16} />
              </button>
            </div>
          </div>
          
          {/* Custom Histogram Component */}
          <Histogram data={data.histogram} />
          
          {/* X-Axis Labels */}
          <div className="flex justify-between text-[10px] text-slate-500 mt-3 px-2 font-mono uppercase tracking-widest">
            <span>00:00</span>
            <span>04:00</span>
            <span>08:00</span>
            <span>12:00</span>
            <span>16:00</span>
            <span>20:00</span>
            <span>23:59</span>
          </div>
        </div>

        {/* --- Split View: Distribution & Top Talkers --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
          
          {/* Left: Source Distribution */}
          <div className="bg-[#1e293b]/60 backdrop-blur-md rounded-xl border border-slate-800 shadow-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <PieChart size={18} className="text-purple-400" />
              <h3 className="font-semibold text-white">Log Sources</h3>
            </div>
            
            <div className="space-y-6">
              {data.sources.map((item) => (
                <DistributionBar 
                  key={item.label}
                  {...item}
                  total={data.total_events}
                  icon={getIconForLabel(item.label)}
                />
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-700/50">
              <button className="w-full py-2.5 border border-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-300 hover:bg-slate-700/50 transition">
                View Source Config
              </button>
            </div>
          </div>

          {/* Right: Top Talkers Table */}
          <div className="lg:col-span-2 bg-[#1e293b]/60 backdrop-blur-md rounded-xl border border-slate-800 shadow-xl p-0 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Globe size={18} className="text-blue-400" />
                <div>
                    <h3 className="font-semibold text-white">Top Talkers</h3>
                    <p className="text-xs text-slate-400">Highest volume IP addresses</p>
                </div>
              </div>
              <button className="text-xs font-bold text-cyan-400 hover:text-cyan-300 uppercase tracking-wide">View Full Report</button>
            </div>

            <div className="flex-1 overflow-auto">
                <table className="w-full text-left">
                <thead className="bg-[#0f172a]/50 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    <tr>
                    <th className="px-6 py-4">IP Address</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Request Count</th>
                    <th className="px-6 py-4">Risk Level</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-sm">
                    {data.top_talkers.map((talker, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition">
                        <td className="px-6 py-4 font-mono text-slate-300">{talker.ip}</td>
                        <td className="px-6 py-4 text-slate-400">{talker.country}</td>
                        <td className="px-6 py-4 font-bold text-white">{talker.requests.toLocaleString()}</td>
                        <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border tracking-wide ${
                            talker.risk === 'Critical' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                            talker.risk === 'High' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                            talker.risk === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                            'bg-slate-500/10 text-slate-400 border-slate-500/20'
                        }`}>
                            {talker.risk}
                        </span>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}