import React, { useMemo, useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { getThreats } from "../services/api"; // Import the API function
import {
  ShieldAlert,
  Filter,
  X,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Play,
  MoreVertical,
  RefreshCw
} from "lucide-react";

/**
 * Premium Threats Management Page (Real-Time)
 * Updates:
 * - Fetches live data from backend
 * - Auto-refreshes every 5 seconds
 * - Preserves unique design and interactions
 */

// ----- Helper components -----
const DropdownItem = ({ icon, label, onClick }) => (
  <button
    onClick={(e) => {
      e.stopPropagation(); 
      onClick();
    }}
    className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-3 transition-colors border-b border-slate-700/50 last:border-0"
  >
    {icon}
    <span>{label}</span>
  </button>
);

const SeverityBadge = ({ severity }) => {
  const classes = {
    Critical: "bg-red-500/10 text-red-400 border-red-500/20",
    High: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    Medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    Low: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    Default: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium border ${
        classes[severity] || classes.Default
      }`}
    >
      {severity}
    </span>
  );
};

// ----- Main component -----
export default function Threats() {
  const [threats, setThreats] = useState([]); // Start empty, fetch real data
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(true);
  const [page, setPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState(null);

  const pageSize = 8; // Increased slightly for better view

  // --- Real-Time Data Fetching ---
  const fetchThreatData = async () => {
    try {
      const data = await getThreats();
      // Map Backend Data to Frontend Structure
      const formattedThreats = data.map(alert => ({
        id: alert.id,
        name: alert.prediction === "Attack" ? "Network Anomaly Detected" : "Routine Traffic",
        type: "Network", // You can refine this if backend provides more specific types
        severity: alert.severity || "Low",
        status: alert.status || "Active",
        confidence: Math.round(alert.confidence * 100), // Convert 0.95 to 95
        ip: alert.src_ip,
        detected: new Date(alert.timestamp).toLocaleString()
      }));
      setThreats(formattedThreats);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch threats:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreatData(); // Initial Fetch
    const interval = setInterval(fetchThreatData, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleMenu = (e, id) => {
    e.stopPropagation();
    setActiveMenuId((prevId) => (prevId === id ? null : id));
  };

  // Filter Logic
  const filtered = useMemo(() => {
    let list = threats;
    if (severityFilter !== "All") list = list.filter((t) => t.severity === severityFilter);
    if (statusFilter !== "All") list = list.filter((t) => t.status === statusFilter);
    if (typeFilter !== "All") list = list.filter((t) => t.type === typeFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((t) => (t.name + " " + t.type + " " + t.ip).toLowerCase().includes(q));
    }
    return list;
  }, [threats, severityFilter, statusFilter, typeFilter, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Action Handlers (Mock logic for now, can be connected to API later)
  const handleAction = (id, actionType) => {
    console.log(`Action: ${actionType} on ID: ${id}`);
    
    // Optimistic UI Update
    if (actionType === "Remediate") {
      setThreats((prev) => prev.map((t) => (t.id === id ? { ...t, status: "Remediated" } : t)));
    } else if (actionType === "Investigate") {
      setThreats((prev) => prev.map((t) => (t.id === id ? { ...t, status: "Investigating" } : t)));
    } else if (actionType === "FalsePositive") {
      setThreats((prev) => prev.map((t) => (t.id === id ? { ...t, status: "False Positive" } : t)));
    }
    setActiveMenuId(null);
  };

  const resetFilters = () => {
    setSeverityFilter("All");
    setStatusFilter("All");
    setTypeFilter("All");
    setQuery("");
  };

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-slate-300 font-sans">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto h-screen">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20 relative">
              <ShieldAlert className="text-cyan-400" size={32} />
              {/* Pulse effect if loading/live */}
              <span className="absolute top-0 right-0 -mt-1 -mr-1 w-3 h-3 bg-cyan-500 rounded-full animate-ping opacity-75"></span>
            </div>
            <div>
              <h1 className="text-3xl text-white font-bold tracking-tight">Threat Management</h1>
              <p className="text-slate-400 mt-1 flex items-center gap-2">
                Real-time threat monitoring and automated response.
                {loading && <span className="text-xs text-cyan-500 animate-pulse">(Syncing...)</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchThreatData}
              className="p-2.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Refresh Data"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                  showFilters
                    ? "bg-slate-800 text-white border-slate-600"
                    : "bg-transparent text-slate-400 border-slate-700 hover:border-slate-500"
                }`}
              >
                <Filter size={16} /> Filters
              </button>
              <button
                onClick={resetFilters}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-700 text-slate-400 text-sm font-medium hover:bg-slate-800 transition-all"
              >
                <X size={16} /> Reset
              </button>
            </div>
          </div>
        </div>

        {/* Filters Area */}
        {showFilters && (
          <div className="bg-[#1e293b]/50 backdrop-blur-sm p-6 rounded-xl border border-slate-800 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 transition-all animate-fade-in">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-slate-500" size={16} />
              <input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                placeholder="Search threats..."
                className="w-full bg-[#0f172a] border border-slate-700 text-white text-sm rounded-lg pl-10 pr-4 py-2.5 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition"
              />
            </div>
            <select
              value={severityFilter}
              onChange={(e) => { setSeverityFilter(e.target.value); setPage(1); }}
              className="bg-[#0f172a] border border-slate-700 text-slate-300 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-cyan-500"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="bg-[#0f172a] border border-slate-700 text-slate-300 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-cyan-500"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Investigating">Investigating</option>
              <option value="Remediated">Remediated</option>
              <option value="False Positive">False Positive</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
              className="bg-[#0f172a] border border-slate-700 text-slate-300 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-cyan-500"
            >
              <option value="All">All Types</option>
              <option value="Network">Network</option>
              <option value="Malware">Malware</option>
              <option value="Intrusion">Intrusion</option>
              <option value="Web">Web</option>
            </select>
          </div>
        )}

        {/* Data Table */}
        <div className="bg-[#1e293b] rounded-xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col min-h-[500px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700/50 bg-[#0f172a]/50 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="p-5 font-semibold">Threat Name</th>
                  <th className="p-5 font-semibold">Type</th>
                  <th className="p-5 font-semibold">Severity</th>
                  <th className="p-5 font-semibold">Status</th>
                  <th className="p-5 font-semibold">Confidence</th>
                  <th className="p-5 font-semibold">Source IP</th>
                  <th className="p-5 font-semibold">Detected At</th>
                  <th className="p-5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {loading && threats.length === 0 ? (
                   // Loading Skeleton
                   [...Array(5)].map((_, i) => (
                     <tr key={i} className="animate-pulse">
                        <td className="p-5"><div className="h-4 bg-slate-800 rounded w-32"></div></td>
                        <td className="p-5"><div className="h-4 bg-slate-800 rounded w-20"></div></td>
                        <td className="p-5"><div className="h-4 bg-slate-800 rounded w-16"></div></td>
                        <td className="p-5"><div className="h-4 bg-slate-800 rounded w-20"></div></td>
                        <td className="p-5"><div className="h-4 bg-slate-800 rounded w-12"></div></td>
                        <td className="p-5"><div className="h-4 bg-slate-800 rounded w-24"></div></td>
                        <td className="p-5"><div className="h-4 bg-slate-800 rounded w-28"></div></td>
                        <td className="p-5"></td>
                     </tr>
                   ))
                ) : pageItems.length > 0 ? (
                  pageItems.map((threat) => (
                    <tr key={threat.id} className="group hover:bg-slate-800/50 transition-colors">
                      <td className="p-5 font-medium text-white">
                        {threat.name}
                        {/* New Indicator */}
                        {new Date(threat.detected) > new Date(Date.now() - 60000) && (
                            <span className="ml-2 inline-block w-2 h-2 bg-cyan-500 rounded-full animate-pulse" title="Just Now"></span>
                        )}
                      </td>
                      <td className="p-5 text-slate-400">{threat.type}</td>
                      <td className="p-5">
                        <SeverityBadge severity={threat.severity} />
                      </td>
                      <td className="p-5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          threat.status === 'Active' ? 'bg-rose-500/10 text-rose-400 ring-1 ring-inset ring-rose-500/20' : 
                          threat.status === 'Remediated' ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20' : 
                          'bg-slate-700/30 text-slate-400 ring-1 ring-inset ring-slate-700/50'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${threat.status === 'Active' ? 'bg-rose-500' : threat.status === 'Remediated' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                          {threat.status}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${threat.confidence > 90 ? 'bg-red-500' : threat.confidence > 75 ? 'bg-orange-500' : 'bg-blue-500'}`} 
                              style={{ width: `${threat.confidence}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-300 font-mono">{threat.confidence}%</span>
                        </div>
                      </td>
                      <td className="p-5 text-slate-400 font-mono text-xs text-cyan-500/80">{threat.ip}</td>
                      <td className="p-5 text-slate-400 text-xs whitespace-nowrap">{threat.detected}</td>
                      
                      {/* ACTION COLUMN */}
                      <td className="p-5 text-right relative">
                        <div className="relative inline-block text-left">
                          <button
                            onClick={(e) => toggleMenu(e, threat.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              activeMenuId === threat.id 
                                ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20" 
                                : "text-slate-400 hover:text-white hover:bg-slate-700"
                            }`}
                          >
                            <MoreVertical size={16} />
                          </button>

                          {/* DROPDOWN MENU */}
                          {activeMenuId === threat.id && (
                            <div className="absolute right-0 mt-2 w-56 bg-[#0f172a] border border-slate-700 rounded-lg shadow-2xl z-50 overflow-hidden ring-1 ring-black ring-opacity-5 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                              <div className="py-1">
                                <DropdownItem 
                                  icon={<Eye size={16} className="text-blue-400"/>} 
                                  label="View Details" 
                                  onClick={() => handleAction(threat.id, "View")} 
                                />
                                <DropdownItem 
                                  icon={<Search size={16} className="text-yellow-400"/>} 
                                  label="Mark Investigating" 
                                  onClick={() => handleAction(threat.id, "Investigate")} 
                                />
                                <DropdownItem 
                                  icon={<CheckCircle size={16} className="text-emerald-400"/>} 
                                  label="Mark Remediated" 
                                  onClick={() => handleAction(threat.id, "Remediate")} 
                                />
                                <DropdownItem 
                                  icon={<XCircle size={16} className="text-rose-400"/>} 
                                  label="False Positive" 
                                  onClick={() => handleAction(threat.id, "FalsePositive")} 
                                />
                                <div className="border-t border-slate-700/50 my-1"></div>
                                <DropdownItem 
                                  icon={<Play size={16} className="text-cyan-400"/>} 
                                  label="Run Remediation" 
                                  onClick={() => handleAction(threat.id, "RunAuto")} 
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="p-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-3">
                         <Search size={32} className="opacity-20" />
                         <p>No threats found matching your filters.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-[#0f172a]/30 p-4 border-t border-slate-800 flex items-center justify-between mt-auto">
            <span className="text-sm text-slate-400">
              Showing <span className="text-white font-medium">{Math.min((page - 1) * pageSize + 1, filtered.length)}</span> to{" "}
              <span className="text-white font-medium">{Math.min(page * pageSize, filtered.length)}</span> of{" "}
              <span className="text-white font-medium">{filtered.length}</span> results
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 text-sm bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>
              <button
                disabled={page === totalPages || totalPages === 0}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-4 py-2 text-sm bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}