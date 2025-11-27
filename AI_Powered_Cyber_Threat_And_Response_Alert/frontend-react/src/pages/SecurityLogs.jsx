import React, { useState, useMemo, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { getSecurityLogs } from "../services/api"; // Import API
import {
  FileText,
  Search,
  Filter,
  Download,
  Calendar,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Copy,
  Server,
  Shield,
  Activity
} from "lucide-react";

/**
 * Security Logs Page (Real-Time + Export)
 * Features:
 * - Fetches data from backend
 * - Functional CSV Export
 * - Enhanced UI design
 */

// ----- Helper Components -----

const LogLevelBadge = ({ level }) => {
  const styles = {
    ERROR: "bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]",
    WARNING: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    INFO: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    SUCCESS: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border tracking-wide ${styles[level] || styles.INFO}`}>
      {level}
    </span>
  );
};

// ----- Main Component -----

export default function SecurityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("ALL");
  const [isLive, setIsLive] = useState(true);

  // --- 1. Real-Time Data Fetching ---
  const fetchLogs = async () => {
    if (!isLive) return; // Stop fetching if paused
    try {
      const data = await getSecurityLogs();
      // Format timestamp for display
      const formattedData = data.map(log => ({
        ...log,
        timestampDisplay: new Date(log.timestamp).toLocaleString()
      }));
      setLogs(formattedData);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch logs:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(); // Initial load
    const interval = setInterval(fetchLogs, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, [isLive]); // Re-run if isLive changes

  // --- 2. Filter Logic ---
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = 
        log.event.toLowerCase().includes(searchTerm.toLowerCase()) || 
        log.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ip.includes(searchTerm);
      
      const matchesLevel = levelFilter === "ALL" || log.level === levelFilter;
      
      return matchesSearch && matchesLevel;
    });
  }, [logs, searchTerm, levelFilter]);

  // --- 3. CSV Export Functionality ---
  const handleExportCSV = () => {
    // Define headers
    const headers = ["ID", "Timestamp", "Level", "Event", "Source", "User", "IP Address", "Message"];
    
    // Map filtered data to CSV rows
    const rows = filteredLogs.map(log => [
      log.id,
      `"${log.timestampDisplay}"`, // Quote timestamps to prevent comma issues
      log.level,
      `"${log.event}"`,
      log.source,
      log.user,
      log.ip,
      `"${log.message.replace(/"/g, '""')}"` // Escape quotes in message
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(","), 
      ...rows.map(row => row.join(","))
    ].join("\n");

    // Create a Blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `security_logs_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    // In a real app, you'd show a toast here
    console.log("Copied to clipboard");
  };

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-slate-300 font-sans">
      <Sidebar />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Background Gradient */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none"></div>

        {/* --- Top Header --- */}
        <div className="p-6 border-b border-slate-800 bg-[#0f172a]/95 backdrop-blur z-20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600/10 rounded-xl border border-blue-600/20 shadow-[0_0_15px_rgba(37,99,235,0.2)]">
              <FileText className="text-blue-400" size={26} />
            </div>
            <div>
              <h1 className="text-2xl text-white font-bold tracking-tight">Security Logs</h1>
              <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
                Audit trail and system events registry.
                {loading && <span className="text-cyan-500 animate-pulse text-xs">(Syncing...)</span>}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
             <button 
              onClick={() => setIsLive(!isLive)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold border transition-all ${
                isLive 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <RefreshCw size={14} className={isLive ? "animate-spin" : ""} />
              {isLive ? "LIVE STREAM ON" : "PAUSED"}
            </button>
            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-300 text-sm font-medium rounded-lg border border-slate-700 transition-colors shadow-lg"
            >
              <Download size={16} /> Export CSV
            </button>
          </div>
        </div>

        {/* --- Controls / Filters --- */}
        <div className="px-6 py-4 bg-[#1e293b]/50 backdrop-blur-sm border-b border-slate-800 shrink-0 grid grid-cols-1 md:grid-cols-12 gap-4 relative z-10">
          
          {/* Search */}
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search by Event, Source, or IP..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0f172a] border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition"
            />
          </div>

          {/* Level Filter */}
          <div className="md:col-span-3">
             <div className="relative">
              <Filter className="absolute left-3 top-2.5 text-slate-500" size={16} />
              <select 
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="w-full bg-[#0f172a] border border-slate-700 rounded-lg pl-9 pr-8 py-2 text-sm text-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none appearance-none cursor-pointer"
              >
                <option value="ALL">All Levels</option>
                <option value="ERROR">Error</option>
                <option value="WARNING">Warning</option>
                <option value="INFO">Info</option>
                <option value="SUCCESS">Success</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 text-slate-500 pointer-events-none" size={14} />
             </div>
          </div>

           {/* Date Picker Mock */}
           <div className="md:col-span-4">
            <div className="relative w-full">
              <Calendar className="absolute left-3 top-2.5 text-slate-500" size={16} />
              <button className="w-full text-left bg-[#0f172a] border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-400 hover:border-slate-500 transition">
                Last 24 Hours
              </button>
            </div>
          </div>
        </div>

        {/* --- Data Table Container --- */}
        <div className="flex-1 overflow-auto bg-[#0f172a] relative scroll-smooth">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#1e293b] sticky top-0 z-10 text-xs font-semibold text-slate-400 uppercase tracking-wider shadow-md">
              <tr>
                <th className="p-4 w-10"></th> {/* Expand Toggle */}
                <th className="p-4">Timestamp</th>
                <th className="p-4">Level</th>
                <th className="p-4">Event Name</th>
                <th className="p-4">Source</th>
                <th className="p-4">User</th>
                <th className="p-4 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm">
              {loading && logs.length === 0 ? (
                 // Loading Skeleton
                 [...Array(10)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                        <td className="p-4"><div className="w-4 h-4 bg-slate-800 rounded"></div></td>
                        <td className="p-4"><div className="w-32 h-4 bg-slate-800 rounded"></div></td>
                        <td className="p-4"><div className="w-16 h-4 bg-slate-800 rounded"></div></td>
                        <td className="p-4"><div className="w-48 h-4 bg-slate-800 rounded"></div></td>
                        <td className="p-4"><div className="w-24 h-4 bg-slate-800 rounded"></div></td>
                        <td className="p-4"><div className="w-20 h-4 bg-slate-800 rounded"></div></td>
                        <td className="p-4"><div className="w-32 h-4 bg-slate-800 rounded"></div></td>
                    </tr>
                 ))
              ) : (
                filteredLogs.map((log) => (
                  <React.Fragment key={log.id}>
                    {/* Main Row */}
                    <tr 
                      onClick={() => toggleExpand(log.id)}
                      className={`cursor-pointer transition-colors border-l-2 ${
                        expandedRow === log.id 
                          ? "bg-slate-800/60 border-l-blue-500" 
                          : "hover:bg-slate-800/30 border-l-transparent"
                      }`}
                    >
                      <td className="p-4 text-slate-500">
                        {expandedRow === log.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </td>
                      <td className="p-4 font-mono text-slate-400 text-xs whitespace-nowrap">{log.timestampDisplay}</td>
                      <td className="p-4"><LogLevelBadge level={log.level} /></td>
                      <td className="p-4 font-medium text-slate-200">
                        <div className="flex items-center gap-2">
                           {log.level === 'ERROR' && <Shield size={14} className="text-red-400"/>}
                           {log.level === 'SUCCESS' && <Activity size={14} className="text-emerald-400"/>}
                           {log.event}
                        </div>
                      </td>
                      <td className="p-4 text-slate-400">{log.source}</td>
                      <td className="p-4 text-slate-300">{log.user}</td>
                      <td className="p-4 text-right font-mono text-xs text-cyan-500/80">{log.ip}</td>
                    </tr>
  
                    {/* Expanded Detail Row */}
                    {expandedRow === log.id && (
                      <tr className="bg-[#0b1120] animate-in slide-in-from-top-2 duration-200">
                        <td colSpan="7" className="p-0">
                          <div className="border-y border-slate-800/50 p-6 shadow-inner relative overflow-hidden">
                            {/* Decorative glow for expanded row */}
                            <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-blue-500 to-transparent"></div>
                            
                            <div className="flex justify-between items-start mb-4">
                              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Server size={14} /> Log Trace Details
                              </h4>
                              <button 
                                onClick={() => handleCopy(JSON.stringify(log, null, 2))}
                                className="flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 transition-colors border border-cyan-900/50 px-2 py-1 rounded bg-cyan-950/30"
                              >
                                <Copy size={12} /> Copy JSON
                              </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="font-mono text-xs space-y-3 text-slate-400">
                                <p className="flex justify-between border-b border-slate-800 pb-1"><span className="text-slate-500">ID</span> <span className="text-slate-200">{log.id}</span></p>
                                <p className="flex justify-between border-b border-slate-800 pb-1"><span className="text-slate-500">Event</span> <span className="text-slate-200">{log.event}</span></p>
                                <p className="flex justify-between border-b border-slate-800 pb-1"><span className="text-slate-500">Source</span> <span className="text-white">{log.source}</span></p>
                                <p className="flex justify-between border-b border-slate-800 pb-1"><span className="text-slate-500">User</span> <span className="text-white">{log.user}</span></p>
                                <p className="flex justify-between border-b border-slate-800 pb-1"><span className="text-slate-500">Trace ID</span> <span className="text-cyan-400">{log.trace_id}</span></p>
                              </div>
                              
                              {/* Raw Message Block */}
                              <div className="bg-[#020408] rounded-lg p-4 border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto shadow-inner">
  {`{
    "timestamp": "${log.timestamp}",
    "level": "${log.level}",
    "ip_address": "${log.ip}",
    "message": "${log.message}",
    "trace_id": "${log.trace_id}"
  }`}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
              
              {!loading && filteredLogs.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <Search size={32} className="opacity-20" />
                      <p>No logs found matching filter.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer Stats */}
        <div className="p-3 bg-[#1e293b] border-t border-slate-800 flex justify-between items-center text-xs text-slate-500 shrink-0 z-20">
          <span>Total Records: {logs.length}</span>
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> {logs.filter(l => l.level === 'ERROR').length} Errors</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-500"></div> {logs.filter(l => l.level === 'WARNING').length} Warnings</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> {logs.filter(l => l.level === 'SUCCESS').length} Success</span>
          </div>
        </div>

      </main>
    </div>
  );
}