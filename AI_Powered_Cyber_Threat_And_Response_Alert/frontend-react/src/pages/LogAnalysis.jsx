import React, { useEffect, useState, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import { getSecurityLogs } from '../services/api';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import {
  Activity, Shield, AlertTriangle, CheckCircle, Filter, Calendar,
  Download, RefreshCw, Search, FileText, BarChart2, Server, Terminal, Cpu, Zap
} from 'lucide-react';
import gsap from 'gsap';

const LogAnalysis = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');
  const containerRef = useRef(null);

  // --- Data Processing ---
  const logsByLevel = [
    { name: 'Error', value: logs.filter(l => l.level === 'ERROR').length, color: '#f43f5e' }, // Rose-500
    { name: 'Warning', value: logs.filter(l => l.level === 'WARNING').length, color: '#f59e0b' }, // Amber-500
    { name: 'Info', value: logs.filter(l => l.level === 'INFO').length, color: '#3b82f6' },    // Blue-500
    { name: 'Success', value: logs.filter(l => l.level === 'SUCCESS').length, color: '#10b981' }, // Emerald-500
  ].filter(item => item.value > 0);

  const logsOverTime = logs.reduce((acc, log) => {
    const time = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const existing = acc.find(item => item.time === time);
    if (existing) {
      existing.count += 1;
      if (log.level === 'ERROR') existing.errors += 1;
    } else {
      acc.push({ time, count: 1, errors: log.level === 'ERROR' ? 1 : 0 });
    }
    return acc;
  }, []).slice(-15); // Extended view

  const logsBySource = Object.entries(logs.reduce((acc, log) => {
    acc[log.source] = (acc[log.source] || 0) + 1;
    return acc;
  }, {})).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5);


  // --- Fetching & Animation ---
  const fetchData = async () => {
    // Optimistic UI: Don't set loading to true on refresh to keep UI stable
    if (logs.length === 0) setLoading(true);
    try {
      const data = await getSecurityLogs();
      setLogs(data);
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Auto-refresh
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!loading && logs.length > 0) {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline();

        tl.from(".log-header", { y: -20, opacity: 0, duration: 0.6, ease: "power3.out" })
          .from(".stat-card-anim", { y: 20, opacity: 0, duration: 0.5, stagger: 0.1, ease: "back.out(1.2)" }, "-=0.3")
          .from(".chart-anim", { scale: 0.98, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power2.out" }, "-=0.4")
          .from(".anomaly-item", { x: -10, opacity: 0, duration: 0.4, stagger: 0.05, ease: "power1.out" }, "-=0.6");

      }, containerRef);
      return () => ctx.revert();
    }
  }, [loading]); // Only run once when data loads initially

  // --- Custom Tooltip ---
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0f172a]/95 backdrop-blur-xl border border-slate-700 p-3 rounded-lg shadow-2xl">
          <p className="text-slate-400 text-xs font-mono mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-xs font-bold mb-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <span style={{ color: entry.color }}>
                {entry.name}: {entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex min-h-screen bg-[#020617] font-sans text-slate-200 overflow-hidden">
      <Sidebar />

      <main ref={containerRef} className="flex-1 p-8 h-screen overflow-y-auto relative scroll-smooth">

        {/* --- BACKGROUND (Unified Grid) --- */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-900/10 blur-[120px] rounded-full"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">

          {/* --- Header --- */}
          <header className="log-header mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                  <BarChart2 className="text-indigo-400" size={28} />
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Log Analytics</h1>
              </div>
              <p className="text-slate-400 text-sm flex items-center gap-2">
                <Activity size={14} className="text-emerald-500 animate-pulse" />
                Ingesting data stream...
              </p>
            </div>

            <div className="flex items-center gap-3 bg-[#0f172a]/50 p-1.5 rounded-xl border border-slate-800/60 backdrop-blur-md">
              <div className="relative group">
                <Calendar className="absolute left-3 top-2.5 text-slate-500 group-hover:text-blue-400 transition-colors" size={16} />
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="bg-transparent border-none text-sm text-slate-300 pl-9 pr-8 py-2 focus:ring-0 cursor-pointer hover:text-white transition-colors appearance-none"
                >
                  <option value="1h">Last 1 Hour</option>
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                </select>
              </div>
              <div className="w-px h-6 bg-slate-700"></div>
              <button
                onClick={fetchData}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                title="Refresh Data"
              >
                <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              </button>
              <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors" title="Export CSV">
                <Download size={18} />
              </button>
            </div>
          </header>

          {/* --- KPI Stats Row --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Events"
              value={logs.length.toLocaleString()}
              sub="Processed (24h)"
              icon={<FileText size={24} />}
              color="text-blue-400"
              border="border-blue-500/30"
            />
            <StatCard
              title="Critical Errors"
              value={logs.filter(l => l.level === 'ERROR').length}
              sub="Require Action"
              icon={<AlertTriangle size={24} />}
              color="text-rose-400"
              border="border-rose-500/30"
            />
            <StatCard
              title="Warnings"
              value={logs.filter(l => l.level === 'WARNING').length}
              sub="Potential Issues"
              icon={<Shield size={24} />}
              color="text-amber-400"
              border="border-amber-500/30"
            />
            <StatCard
              title="System Health"
              value="98.2%"
              sub="Operational"
              icon={<CheckCircle size={24} />}
              color="text-emerald-400"
              border="border-emerald-500/30"
            />
          </div>

          {/* --- Charts Grid --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

            {/* 1. Event Volume (Wide) */}
            <div className="chart-anim lg:col-span-2 bg-[#0f172a]/60 backdrop-blur-xl rounded-2xl border border-slate-800 p-6 shadow-xl relative overflow-hidden group">
              {/* Pulse Background */}
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors duration-700"></div>

              <div className="flex justify-between items-center mb-6 relative z-10">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Activity size={18} className="text-indigo-400" /> Ingestion Volume
                </h3>
                <span className="px-2 py-1 bg-indigo-500/10 text-indigo-300 text-[10px] font-mono font-bold uppercase tracking-wider rounded border border-indigo-500/20">
                  Live Stream
                </span>
              </div>

              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={logsOverTime}>
                    <defs>
                      <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorError" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                    <Area type="monotone" dataKey="count" name="Total Events" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorVolume)" />
                    <Area type="monotone" dataKey="errors" name="Errors" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorError)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 2. Top Sources (Tall) */}
            <div className="chart-anim bg-[#0f172a]/60 backdrop-blur-xl rounded-2xl border border-slate-800 p-6 shadow-xl flex flex-col">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Server size={18} className="text-purple-400" /> Top Sources
              </h3>
              <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={logsBySource} layout="vertical" margin={{ left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" horizontal={false} />
                    <XAxis type="number" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} width={70} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                    <Bar dataKey="value" name="Events" fill="#a855f7" radius={[0, 4, 4, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* --- Bottom Row: Pie & Anomalies --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* 3. Log Distribution */}
            <div className="chart-anim bg-[#0f172a]/60 backdrop-blur-xl rounded-2xl border border-slate-800 p-6 shadow-xl relative overflow-hidden">
              <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
              <h3 className="text-lg font-bold text-white mb-2 relative z-10">Severity Distribution</h3>
              <p className="text-slate-500 text-xs mb-4 font-mono relative z-10">Event breakdown by log level</p>

              <div className="h-[220px] w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={logsByLevel}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {logsByLevel.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0)" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 4. AI Insights / Anomalies Feed */}
            <div className="chart-anim lg:col-span-2 bg-[#0f172a]/60 backdrop-blur-xl rounded-2xl border border-slate-800 p-0 overflow-hidden flex flex-col shadow-xl">
              <div className="p-6 border-b border-slate-800 bg-[#1e293b]/30 flex justify-between items-center">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Zap size={18} className="text-amber-400" /> AI Anomalies
                </h3>
                <span className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold px-2 py-1 rounded animate-pulse">
                  ACTION REQUIRED
                </span>
              </div>

              <div className="p-4 overflow-y-auto max-h-[250px] custom-scrollbar space-y-3">
                {logs.filter(l => l.level === 'ERROR').length > 0 ? (
                  logs.filter(l => l.level === 'ERROR').slice(0, 5).map((log, idx) => (
                    <div key={idx} className="anomaly-item flex items-start gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-rose-500/30 transition-colors group">
                      <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500 mt-0.5 group-hover:scale-110 transition-transform">
                        <AlertTriangle size={18} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-sm font-bold text-rose-200">Critical Failure Detected</h4>
                          <span className="text-[10px] text-slate-500 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-xs text-slate-400 font-mono mb-2">{log.message}</p>
                        <div className="flex gap-2">
                          <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded text-slate-500 border border-slate-800">Source: {log.source}</span>
                          <span className="text-[10px] bg-rose-950/30 px-2 py-0.5 rounded text-rose-400 border border-rose-900/30">Error Code: 0x5F</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-10 text-slate-500">
                    <CheckCircle size={40} className="text-emerald-500/20 mb-4" />
                    <p>No anomalies detected. System nominal.</p>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

// --- Helper: Stat Card Component ---
const StatCard = ({ title, value, sub, icon, color, border }) => (
  <div className={`stat-card-anim bg-[#1e293b]/40 backdrop-blur-md rounded-xl border ${border} p-5 shadow-lg hover:bg-[#1e293b]/60 transition-colors group`}>
    <div className="flex justify-between items-start mb-2">
      <div className={`p-2.5 rounded-lg bg-opacity-10 bg-white ${color}`}>
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <span className={`text-xs font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-400 group-hover:text-white transition-colors`}>
        +2.4%
      </span>
    </div>
    <div>
      <h3 className="text-2xl font-bold text-white mb-0.5">{value}</h3>
      <p className="text-slate-400 text-xs uppercase tracking-wide">{title}</p>
      <p className="text-slate-500 text-[10px] mt-1">{sub}</p>
    </div>
  </div>
);

export default LogAnalysis;