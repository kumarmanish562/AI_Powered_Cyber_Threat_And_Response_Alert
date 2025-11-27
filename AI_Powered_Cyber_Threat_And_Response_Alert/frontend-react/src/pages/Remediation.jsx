import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { getRemediationTasks } from "../services/api"; // Import the API
import {
  Activity,
  CheckCircle,
  Clock,
  AlertTriangle,
  Terminal,
  Play,
  RotateCcw,
  FileText,
  MoreVertical,
  Cpu,
  ShieldCheck,
  Zap,
  RefreshCw,
  Server
} from "lucide-react";

/**
 * Remediation Management Page
 * Updates:
 * - Real-time data fetching
 * - Enhanced UI with status indicators
 * - Dynamic Progress Bars
 */

// ----- Helper Components -----

const StatCard = ({ icon, label, value, trend, color, loading }) => {
  const IconComponent = icon;
  return (
    <div className="bg-[#1e293b]/70 backdrop-blur-sm p-5 rounded-xl border border-slate-800 shadow-lg flex items-start justify-between relative overflow-hidden group hover:border-slate-600 transition-all">
      <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
        <IconComponent size={80} />
      </div>
      <div>
        <p className="text-slate-400 text-sm font-medium mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-white">
            {loading ? <span className="animate-pulse">...</span> : value}
        </h3>
        {trend && <p className={`text-xs mt-2 ${trend.includes('+') ? 'text-emerald-400' : 'text-rose-400'}`}>{trend} from last week</p>}
      </div>
      <div className={`p-3 rounded-lg bg-opacity-10 ${color} bg-white shadow-inner`}>
        <IconComponent size={24} className={color.replace('text-', '')} />
      </div>
    </div>
  );
};

const ProgressBar = ({ progress, status }) => {
  let colorClass = "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]";
  if (status === "Failed") colorClass = "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]";
  if (status === "Completed") colorClass = "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]";
  
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1.5 font-mono">
        <span className="text-slate-400">{progress}%</span>
        <span className={status === "Failed" ? "text-rose-400" : status === "Completed" ? "text-emerald-400" : "text-blue-400"}>
          {status}
        </span>
      </div>
      <div className="w-32 h-1.5 bg-slate-700/50 rounded-full overflow-hidden backdrop-blur-sm">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-out ${colorClass}`} 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

const DropdownItem = ({ icon, label, onClick }) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className="w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors border-b border-slate-700/50 last:border-0 text-slate-300 hover:bg-slate-700 hover:text-white"
  >
    {icon}
    <span>{label}</span>
  </button>
);

// ----- Main Component -----

export default function Remediation() {
  const [activeTab, setActiveTab] = useState("active");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // --- Real-Time Data Fetching ---
  const fetchData = async () => {
    try {
      const data = await getRemediationTasks();
      // Transform date strings to readable format if needed
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
    const interval = setInterval(fetchData, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleMenu = (e, id) => {
    e.stopPropagation();
    setActiveMenuId(prev => prev === id ? null : id);
  };

  const handleAction = (id, action) => {
    console.log(`Action: ${action} on Task ${id}`);
    setActiveMenuId(null);
    // Optimistic Update for UI responsiveness
    if (action === "Retry") {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: "In Progress", progress: 10 } : t));
    } else if (action === "Approve") {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: "In Progress", progress: 25 } : t));
    }
  };

  // Derived Stats
  const activeCount = tasks.filter(t => t.status === "In Progress").length;
  const completedCount = tasks.filter(t => t.status === "Completed").length;

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-slate-300 font-sans">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto h-screen relative">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Header */}
        <div className="mb-8 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <Zap className="text-emerald-400" size={26} />
                </div>
                <h1 className="text-3xl text-white font-bold tracking-tight">Remediation Center</h1>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <p className="text-slate-400 text-sm">Automated Playbooks & Patch Management</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
              <button 
                onClick={fetchData} 
                className="p-2.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              </button>
              <div className="bg-[#1e293b] px-4 py-2 rounded-lg border border-slate-700 flex items-center gap-3">
                  <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">System Status</span>
                  <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                      <ShieldCheck size={14}/> OPERATIONAL
                  </span>
              </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative z-10">
          <StatCard 
            icon={Cpu} 
            label="Active Processes" 
            value={activeCount} 
            color="text-blue-400"
            loading={loading} 
          />
          <StatCard 
            icon={CheckCircle} 
            label="Tasks Completed (24h)" 
            value={completedCount} 
            trend="+12%" 
            color="text-emerald-400" 
            loading={loading}
          />
          <StatCard 
            icon={Clock} 
            label="Avg. Response Time" 
            value="420ms" 
            trend="-35ms" 
            color="text-purple-400" 
            loading={loading}
          />
        </div>

        {/* Main Content Card */}
        <div className="bg-[#1e293b]/60 backdrop-blur-md rounded-2xl border border-slate-800 shadow-2xl overflow-hidden min-h-[500px] relative z-10">
          
          {/* Tabs */}
          <div className="flex border-b border-slate-800">
            <button 
              onClick={() => setActiveTab("active")}
              className={`px-8 py-4 text-sm font-bold tracking-wide transition-colors relative ${activeTab === 'active' ? 'text-white bg-slate-800/50' : 'text-slate-400 hover:text-white hover:bg-slate-800/30'}`}
            >
              Live Tasks
              {activeTab === 'active' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />}
            </button>
            <button 
              onClick={() => setActiveTab("history")}
              className={`px-8 py-4 text-sm font-bold tracking-wide transition-colors relative ${activeTab === 'history' ? 'text-white bg-slate-800/50' : 'text-slate-400 hover:text-white hover:bg-slate-800/30'}`}
            >
              Execution Logs
              {activeTab === 'history' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500" />}
            </button>
          </div>

          {/* Table Toolbar */}
          <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-[#0f172a]/30">
            <div className="flex gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider py-1 mr-2">View:</span>
              <button className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-md border border-slate-700 hover:border-slate-500 transition-colors">All Types</button>
              <button className="text-xs bg-transparent text-slate-400 px-3 py-1.5 rounded-md border border-transparent hover:bg-slate-800 transition-colors">Automated</button>
              <button className="text-xs bg-transparent text-slate-400 px-3 py-1.5 rounded-md border border-transparent hover:bg-slate-800 transition-colors">Manual</button>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 rounded-lg text-xs font-bold transition-all shadow-lg shadow-emerald-900/10">
              <Play size={14} /> EXECUTE PLAYBOOK
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0f172a]/50 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                  <th className="p-5 font-semibold">Incident / Threat</th>
                  <th className="p-5 font-semibold">Playbook Strategy</th>
                  <th className="p-5 font-semibold">Type</th>
                  <th className="p-5 font-semibold">Execution Status</th>
                  <th className="p-5 font-semibold">Started</th>
                  <th className="p-5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {loading && tasks.length === 0 ? (
                    // Loading Skeleton
                    [...Array(5)].map((_,i) => (
                        <tr key={i} className="animate-pulse">
                            <td className="p-5"><div className="h-4 bg-slate-800 rounded w-48"></div></td>
                            <td className="p-5"><div className="h-4 bg-slate-800 rounded w-32"></div></td>
                            <td className="p-5"><div className="h-4 bg-slate-800 rounded w-20"></div></td>
                            <td className="p-5"><div className="h-4 bg-slate-800 rounded w-32"></div></td>
                            <td className="p-5"><div className="h-4 bg-slate-800 rounded w-16"></div></td>
                            <td className="p-5"></td>
                        </tr>
                    ))
                ) : tasks.length > 0 ? (
                  tasks.map((task) => (
                    <tr key={task.id} className="group hover:bg-slate-800/40 transition-colors">
                      <td className="p-5">
                        <div className="font-bold text-white flex items-center gap-2">
                            {task.threat}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 mt-1 uppercase tracking-wider">
                            ID: <span className="text-slate-400">#{task.id}</span>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2 text-sm text-cyan-200">
                          <Terminal size={14} className="text-slate-500" />
                          {task.playbook}
                        </div>
                      </td>
                      <td className="p-5">
                        <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded border ${
                          task.type === 'Automated' 
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                            : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                        }`}>
                          {task.type}
                        </span>
                      </td>
                      <td className="p-5 min-w-[200px]">
                        <ProgressBar progress={task.progress} status={task.status} />
                      </td>
                      <td className="p-5">
                        <div className="text-sm font-mono text-slate-300">{task.startTime}</div>
                        <div className="text-xs text-slate-500">{task.duration}</div>
                      </td>
                      
                      {/* Actions */}
                      <td className="p-5 text-right relative">
                        <div className="relative inline-block text-left">
                          <button
                            onClick={(e) => toggleMenu(e, task.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              activeMenuId === task.id 
                                ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20" 
                                : "text-slate-400 hover:text-white hover:bg-slate-700"
                            }`}
                          >
                            <MoreVertical size={16} />
                          </button>

                          {/* Dropdown Menu */}
                          {activeMenuId === task.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-[#0f172a] border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden ring-1 ring-black ring-opacity-5 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                              {task.status === "Failed" && (
                                <DropdownItem 
                                  icon={<RotateCcw size={14} className="text-cyan-400"/>} 
                                  label="Retry Playbook" 
                                  onClick={() => handleAction(task.id, "Retry")} 
                                />
                              )}
                              {task.status === "Pending Approval" && (
                                <DropdownItem 
                                  icon={<CheckCircle size={14} className="text-emerald-400"/>} 
                                  label="Approve Fix" 
                                  onClick={() => handleAction(task.id, "Approve")} 
                                />
                              )}
                              <DropdownItem 
                                icon={<FileText size={14} className="text-slate-400"/>} 
                                label="View Logs" 
                                onClick={() => handleAction(task.id, "Logs")} 
                              />
                              <DropdownItem 
                                icon={<AlertTriangle size={14} className="text-rose-400"/>} 
                                label="Stop / Rollback" 
                                onClick={() => handleAction(task.id, "Rollback")} 
                              />
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                    <tr>
                        <td colSpan="6" className="p-12 text-center text-slate-500">
                            No active remediation tasks. System is secure.
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t border-slate-800 text-center bg-[#0f172a]/30">
            <button className="text-xs font-bold text-slate-500 hover:text-white transition uppercase tracking-widest flex items-center justify-center gap-2 mx-auto">
                <Server size={12}/> View Full Execution History
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}