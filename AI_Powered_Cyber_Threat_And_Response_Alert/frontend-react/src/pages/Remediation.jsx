import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  getRemediationTasks,
  executePlaybook,
  performRemediationAction,
  getRemediationLogs
} from "../services/api";
import {
  Activity, CheckCircle, Clock, AlertTriangle, Terminal, Play,
  RotateCcw, FileText, MoreVertical, Cpu, ShieldCheck, Zap,
  RefreshCw, Server, X, Search, Filter
} from "lucide-react";

gsap.registerPlugin(useGSAP);

// ----- Visual Helper Components -----

const CyberGridBackground = () => (
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 bg-slate-50 dark:bg-[#020617] transition-colors duration-300"></div>
    <div
      className="absolute inset-0 opacity-20"
      style={{
        backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}
    ></div>
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 dark:bg-emerald-500/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen"></div>
  </div>
);

const StatusBadge = ({ type }) => {
  const isAuto = type === 'Automated';
  return (
    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${isAuto
      ? 'bg-purple-500/10 text-purple-400 border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
      : 'bg-orange-500/10 text-orange-400 border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.2)]'
      }`}>
      {type}
    </span>
  );
};

const AnimatedCounter = ({ value, duration = 1 }) => {
  const ref = useRef(null);

  useGSAP(() => {
    // Only animate if value is a number
    if (typeof value === 'number') {
      gsap.from(ref.current, {
        textContent: 0,
        duration: duration,
        ease: "power1.out",
        snap: { textContent: 1 },
        stagger: 1,
      });
    }
  }, [value]);

  return <span ref={ref}>{value}</span>;
};

const StatCard = ({ icon: Icon, label, value, trend, color, loading }) => {
  return (
    <div className="stat-card relative group p-6 rounded-2xl bg-white/80 dark:bg-[#1e293b]/40 border border-slate-200 dark:border-slate-700/50 backdrop-blur-xl hover:bg-white dark:hover:bg-[#1e293b]/60 hover:border-emerald-500/30 transition-all duration-300 overflow-hidden shadow-sm">
      <div className={`absolute -right-6 -top-6 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500 ${color} transform group-hover:scale-110 group-hover:rotate-12`}>
        <Icon size={120} />
      </div>

      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">{label}</p>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            {loading ? <span className="animate-pulse">...</span> : <AnimatedCounter value={value} />}
          </h3>
          {trend && (
            <div className={`flex items-center gap-1 text-xs mt-3 font-medium px-2 py-1 rounded-full w-fit ${trend.includes('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
              <Activity size={12} />
              {trend} vs last week
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br from-slate-100/50 to-white/0 dark:from-white/5 dark:to-white/0 border border-slate-200 dark:border-white/10 shadow-lg ${color}`}>
          <Icon size={24} className="text-slate-700 dark:text-white" />
        </div>
      </div>
    </div>
  );
};

const ProgressBar = ({ progress, status }) => {
  const barRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(barRef.current,
      { width: "0%" },
      { width: `${progress}%`, duration: 1.5, ease: "power2.out" }
    );
  }, [progress]);

  let colorClass = "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]";
  if (["Failed", "Stopped", "Rolled Back"].includes(status)) colorClass = "bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.6)]";
  if (status === "Completed") colorClass = "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)]";

  return (
    <div className="w-full group">
      <div className="flex justify-between text-[10px] mb-1.5 font-mono uppercase tracking-widest opacity-80">
        <span className="text-slate-500 dark:text-slate-400">{progress}%</span>
        <span className={status === "Completed" ? "text-emerald-500 dark:text-emerald-400" : "text-slate-500 dark:text-slate-300"}>{status}</span>
      </div>
      <div className="w-32 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-300 dark:border-slate-700/50">
        <div ref={barRef} className={`h-full rounded-full ${colorClass} relative`}>
          <div className="absolute top-0 right-0 bottom-0 w-[2px] bg-white/50 blur-[1px]"></div>
        </div>
      </div>
    </div>
  );
};

// ----- Main Component -----

export default function RemediationRedesign() {
  const containerRef = useRef();
  const [activeTab, setActiveTab] = useState("active");
  const [viewFilter, setViewFilter] = useState("All Types");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [selectedLogs, setSelectedLogs] = useState([]);

  // --- GSAP Animation Sequence ---
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Header elements
    tl.from(".header-item", {
      y: -20,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8
    })
      // Stat cards
      .from(".stat-card", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        scale: 0.95
      }, "-=0.5")
      // Main interface
      .from(".main-panel", {
        opacity: 0,
        y: 40,
        duration: 1
      }, "-=0.6");

  }, { scope: containerRef });

  // Animate rows when tab changes or data updates
  useGSAP(() => {
    if (!loading && tasks.length > 0) {
      gsap.fromTo(".task-row",
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, stagger: 0.05, duration: 0.4, clearProps: "all" }
      );
    }
  }, { scope: containerRef, dependencies: [activeTab, loading] });

  // --- Logic (Same as original) ---
  const fetchData = async () => {
    // Simulate API delay for smoothness or real fetch
    try {
      const data = await getRemediationTasks();
      const formattedData = data.map(t => ({
        ...t,
        startTime: new Date(t.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
      setTasks(formattedData);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleExecutePlaybook = async () => {
    setLoading(true);
    await executePlaybook();
    await fetchData();
  };

  const handleAction = async (id, action) => {
    setActiveMenuId(null);
    if (action === "Logs") {
      const logs = await getRemediationLogs(id);
      setSelectedLogs(logs);
      setLogModalOpen(true);
      return;
    }
    // Optimistic UI updates...
    if (action === "Stop") setTasks(prev => prev.map(t => t.id === id ? { ...t, status: "Stopped" } : t));
    try {
      await performRemediationAction(id, action);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesTab = activeTab === "active" ? task.status !== "Completed" : task.status === "Completed";
    const matchesType = viewFilter === "All Types" || task.type === viewFilter;
    return matchesTab && matchesType;
  });

  const activeCount = tasks.filter(t => t.status === "In Progress").length;
  const completedCount = tasks.filter(t => t.status === "Completed").length;

  return (
    <div ref={containerRef} className="flex min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-600 dark:text-slate-300 font-sans relative overflow-hidden transition-colors duration-300">
      <CyberGridBackground />
      <Sidebar />

      {/* Log Modal */}
      {logModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 w-full max-w-2xl rounded-xl overflow-hidden shadow-2xl shadow-slate-900/20 dark:shadow-black/50 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
              <h3 className="text-slate-900 dark:text-white font-mono font-bold flex items-center gap-2">
                <Terminal size={16} className="text-emerald-500 dark:text-emerald-400" /> Execution Logs
              </h3>
              <button onClick={() => setLogModalOpen(false)} className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-4 bg-slate-100 dark:bg-black/50 font-mono text-xs h-[400px] overflow-y-auto space-y-2">
              {selectedLogs.map((log, i) => (
                <div key={i} className="flex gap-4 border-b border-slate-200 dark:border-white/5 pb-1">
                  <span className="text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  <span className={log.level === 'ERROR' ? 'text-red-500 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}>
                    {log.level === 'ERROR' ? '>> ' : '> '}{log.message}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 p-8 overflow-y-auto h-screen relative z-10 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">

        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="header-item">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <ShieldCheck className="text-emerald-600 dark:text-emerald-400" size={28} />
              </div>
              <h1 className="text-4xl text-slate-900 dark:text-white font-bold tracking-tight">Remediation<span className="text-emerald-600 dark:text-emerald-400">.Center</span></h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse box-shadow-glow"></span>
              Automated Response & Playbook Management
            </p>
          </div>

          <div className="header-item flex items-center gap-4">
            <div className="bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur border border-slate-200 dark:border-slate-700 rounded-lg p-1 flex items-center">
              <button onClick={fetchData} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95">
                <RefreshCw size={18} className={loading ? "animate-spin text-emerald-500 dark:text-emerald-400" : ""} />
              </button>
            </div>
            <button
              onClick={handleExecutePlaybook}
              className="group relative px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] flex items-center gap-2 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Play size={16} fill="currentColor" /> RUN PLAYBOOK
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard icon={Cpu} label="Active Processes" value={activeCount} color="text-cyan-400" loading={loading} />
          <StatCard icon={CheckCircle} label="Fixed (24h)" value={completedCount} trend="+12%" color="text-emerald-400" loading={loading} />
          <StatCard icon={Clock} label="Avg Response" value="420" trend="-35ms" color="text-purple-400" loading={loading} />
        </div>

        {/* Main Panel */}
        <div className="main-panel bg-white/60 dark:bg-[#1e293b]/40 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-2xl overflow-hidden min-h-[600px] flex flex-col transition-colors">

          {/* Tabs & Filters */}
          <div className="border-b border-slate-200 dark:border-slate-700/50 bg-slate-50/40 dark:bg-[#0f172a]/40 flex justify-between items-center pr-4">
            <div className="flex">
              {['active', 'history'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-8 py-5 text-sm font-bold tracking-wide transition-all ${activeTab === tab ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                >
                  {tab === 'active' ? 'Live Tasks' : 'Execution Logs'}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 bg-white/60 dark:bg-[#1e293b]/60 p-1 rounded-lg border border-slate-200 dark:border-slate-700/50">
              {["All Types", "Automated", "Manual"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setViewFilter(filter)}
                  className={`text-xs px-3 py-1.5 rounded-md transition-all ${viewFilter === filter
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-inner"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-x-auto relative">
            {/* Decorative Gradient Line */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-500 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-700/50 bg-slate-50/20 dark:bg-[#0f172a]/20">
                  <th className="p-5 pl-8">Threat / Incident</th>
                  <th className="p-5">Strategy</th>
                  <th className="p-5">Type</th>
                  <th className="p-5">Status</th>
                  <th className="p-5">Timestamp</th>
                  <th className="p-5 text-right pr-8">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/50">
                {loading && tasks.length === 0 ? (
                  [...Array(4)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="p-6 pl-8"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-48"></div></td>
                      <td className="p-6"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-32"></div></td>
                      <td className="p-6"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-20"></div></td>
                      <td className="p-6"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-32"></div></td>
                      <td className="p-6"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24"></div></td>
                      <td className="p-6"></td>
                    </tr>
                  ))
                ) : filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <tr
                      key={task.id}
                      className="task-row group hover:bg-slate-50 dark:hover:bg-[#1e293b]/60 transition-colors duration-200"
                    >
                      <td className="p-5 pl-8">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 p-1.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                            <AlertTriangle size={14} />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                              {task.threat}
                            </div>
                            <div className="text-[10px] font-mono text-slate-500 mt-0.5">ID: {task.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2 text-sm text-cyan-600 dark:text-cyan-200/80 font-mono">
                          <Terminal size={12} className="text-slate-500" />
                          {task.playbook}
                        </div>
                      </td>
                      <td className="p-5">
                        <StatusBadge type={task.type} />
                      </td>
                      <td className="p-5 min-w-[200px]">
                        <ProgressBar progress={task.progress} status={task.status} />
                      </td>
                      <td className="p-5">
                        <div className="text-sm text-slate-500 dark:text-slate-400 font-mono">{task.startTime}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-600">Duration: {task.duration}</div>
                      </td>
                      <td className="p-5 pr-8 text-right relative">
                        <button
                          onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === task.id ? null : task.id); }}
                          className={`p-2 rounded-lg transition-all ${activeMenuId === task.id ? 'bg-emerald-500 text-black' : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'}`}
                        >
                          <MoreVertical size={16} />
                        </button>

                        {/* Dropdown */}
                        {activeMenuId === task.id && (
                          <div className="absolute right-8 mt-2 w-48 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-600 rounded-lg shadow-2xl z-50 overflow-hidden text-left origin-top-right animate-in fade-in zoom-in-95 duration-100">
                            {/* ... (Keep existing dropdown items logic) ... */}
                            {task.status !== 'Completed' && (
                              <>
                                <button onClick={() => handleAction(task.id, 'Stop')} className="w-full text-left px-4 py-3 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 text-rose-600 dark:text-rose-400 flex gap-2 items-center"><X size={14} /> Stop Execution</button>
                                <button onClick={() => handleAction(task.id, 'Approve')} className="w-full text-left px-4 py-3 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 text-emerald-600 dark:text-emerald-400 flex gap-2 items-center"><CheckCircle size={14} /> Force Approve</button>
                              </>
                            )}
                            <button onClick={() => handleAction(task.id, 'Logs')} className="w-full text-left px-4 py-3 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex gap-2 items-center border-t border-slate-200 dark:border-slate-800"><FileText size={14} /> View Logs</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-20 text-center">
                      <div className="flex flex-col items-center justify-center opacity-40">
                        <Server size={48} className="mb-4 text-slate-500" />
                        <p className="text-slate-400 text-sm font-medium">No tasks found for this view.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}