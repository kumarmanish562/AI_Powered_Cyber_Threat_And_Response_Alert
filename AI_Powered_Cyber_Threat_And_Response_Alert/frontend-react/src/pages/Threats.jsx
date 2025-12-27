import React, { useMemo, useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import { getThreats, performRemediationAction } from "../services/api"; // Import API functions
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
  RefreshCw,
  Activity,
  Globe,
  Server,
  AlertTriangle
} from "lucide-react";
import gsap from "gsap";

/**
 * Premium Threats Management Page (Real-Time)
 * Updates:
 * - Fetches live data from backend
 * - Auto-refreshes every 5 seconds
 * - Preserves unique design and interactions
 * - Functional Actions (View Details, Run Remediation)
 */

// ----- Helper components -----
const DropdownItem = ({ icon, label, onClick }) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white flex items-center gap-3 transition-colors border-b border-slate-200 dark:border-slate-700/50 last:border-0"
  >
    {icon}
    <span>{label}</span>
  </button>
);

const SeverityBadge = ({ severity }) => {
  const classes = {
    Critical: "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.2)]",
    High: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    Medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    Low: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };
  return (
    <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider border inline-flex items-center gap-1.5 ${classes[severity] || classes.Low}`}>
      {severity === 'Critical' && <AlertTriangle size={10} className="animate-pulse" />}
      {severity}
    </span>
  );
};

const ThreatDetailsModal = ({ isOpen, onClose, threat }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(modalRef.current,
          { opacity: 0, scale: 0.95, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "power3.out" }
        );
        gsap.from(".modal-anim-item", {
          y: 20,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          delay: 0.2,
          ease: "power2.out"
        });
      }, modalRef);
      return () => ctx.revert();
    }
  }, [isOpen]);

  if (!isOpen || !threat) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-200/80 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      {/* Modal Content */}
      <div ref={modalRef} className="relative w-full max-w-3xl bg-white dark:bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] transition-colors duration-300">

        {/* Background Grid */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-0 right-0 w-full h-64 bg-rose-500/10 dark:bg-rose-900/10 blur-[80px]"></div>
          <div className="absolute inset-0 dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
        </div>

        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800/60 flex justify-between items-start bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md relative z-10 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg border border-rose-500/20 bg-rose-50 dark:bg-slate-900/50 text-rose-500 dark:text-rose-400">
              <ShieldAlert size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Threat Details</h2>
                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-mono text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">ID: #{threat.id}</span>
              </div>
              <p className="text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mt-1 flex items-center gap-2">
                <Activity size={12} className="animate-pulse" /> {threat.severity} Severity Detected
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 overflow-y-auto custom-scrollbar relative z-10 flex-1 bg-slate-50/50 dark:bg-[#020617]/50 space-y-8">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="modal-anim-item space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Threat Name</label>
                <p className="text-slate-900 dark:text-white text-lg font-bold">{threat.name}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Current Status</label>
                <span className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide inline-block border ${threat.status === 'Active' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' :
                  threat.status === 'Investigating' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' :
                    'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                  }`}>
                  {threat.status}
                </span>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Confidence Score</label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${threat.confidence > 90 ? 'bg-rose-500' : 'bg-amber-500'}`} style={{ width: `${threat.confidence}%` }}></div>
                  </div>
                  <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">{threat.confidence}%</span>
                </div>
              </div>
            </div>

            <div className="modal-anim-item bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2 mb-2">Technical Indicators</h4>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Threat Type</span>
                <span className="text-slate-900 dark:text-white font-medium">{threat.type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Source IP</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-mono">{threat.ip}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Detected At</span>
                <span className="text-slate-700 dark:text-slate-300 font-mono text-xs">{threat.detected}</span>
              </div>
            </div>
          </div>

          <div className="modal-anim-item">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block flex items-center gap-2">
              <Server size={14} /> Raw Payload Data
            </label>
            <div className="bg-slate-900/90 dark:bg-black/40 rounded-xl border border-slate-200 dark:border-slate-800 p-4 overflow-hidden relative group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-purple-500"></div>
              <pre className="text-[10px] text-slate-300 font-mono overflow-x-auto custom-scrollbar">
                {JSON.stringify(threat, null, 2)}
              </pre>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-800/60 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md flex justify-end gap-4 shrink-0 relative z-10">
          <button onClick={onClose} className="px-6 py-2.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors border border-transparent hover:border-slate-300 dark:hover:border-slate-700">
            Close
          </button>
          <button className="px-6 py-2.5 text-sm font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-lg shadow-rose-900/20 transition-all flex items-center gap-2">
            <ShieldAlert size={16} /> Initiate Response
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Threats() {
  const [page, setPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const containerRef = useRef(null);

  // Modal State
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedThreat, setSelectedThreat] = useState(null);

  // Missing state variables restored
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const pageSize = 8;

  // --- Real-Time Data Fetching ---
  const fetchThreatData = async () => {
    try {
      const data = await getThreats();
      // Map Backend Data to Frontend Structure
      const formattedThreats = data.map(alert => ({
        id: alert.id,
        name: alert.prediction === "Attack" ? "Network Anomaly Detected" : "Routine Traffic",
        type: "Network",
        severity: alert.severity || "Low",
        status: alert.status || "Active",
        confidence: Math.round(alert.confidence * 100),
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
    fetchThreatData();
    const interval = setInterval(fetchThreatData, 5000);

    // Initial Entrance Animation
    const ctx = gsap.context(() => {
      gsap.from(".threat-header", { y: -20, opacity: 0, duration: 0.8, ease: "power3.out" });
      gsap.from(".threat-filter-bar", { y: 20, opacity: 0, duration: 0.6, ease: "power2.out", delay: 0.2 });
      gsap.from(".threat-table-container", { scale: 0.98, opacity: 0, duration: 0.8, ease: "power2.out", delay: 0.4 });
    }, containerRef);

    return () => {
      clearInterval(interval);
      ctx.revert();
    };
  }, []);

  // Row Animation when data changes or page changes
  useEffect(() => {
    if (!loading && threats.length > 0) {
      const ctx = gsap.context(() => {
        gsap.fromTo(".threat-row",
          { opacity: 0, x: -10 },
          { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, ease: "power2.out" }
        );
      }, containerRef);
      return () => ctx.revert();
    }
  }, [page, threats, loading, severityFilter, statusFilter, typeFilter, query]);


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

  // Action Handlers
  const handleAction = async (id, actionType) => {
    setActiveMenuId(null);

    if (actionType === "View") {
      const threat = threats.find(t => t.id === id);
      setSelectedThreat(threat);
      setDetailsModalOpen(true);
      return;
    }

    // Optimistic UI Update
    if (actionType === "RunAuto" || actionType === "Remediate") {
      setThreats((prev) => prev.map((t) => (t.id === id ? { ...t, status: "Remediated" } : t)));
      try {
        await performRemediationAction(id, "Approve");
        fetchThreatData();
      } catch (error) {
        console.error("Remediation failed:", error);
        fetchThreatData();
      }
    } else if (actionType === "Investigate") {
      setThreats((prev) => prev.map((t) => (t.id === id ? { ...t, status: "Investigating" } : t)));
    } else if (actionType === "FalsePositive") {
      setThreats((prev) => prev.map((t) => (t.id === id ? { ...t, status: "False Positive" } : t)));
    }
  };

  const resetFilters = () => {
    setSeverityFilter("All");
    setStatusFilter("All");
    setTypeFilter("All");
    setQuery("");
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-600 dark:text-slate-300 font-sans transition-colors duration-300">
      <Sidebar />

      <ThreatDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        threat={selectedThreat}
      />

      <main ref={containerRef} className="flex-1 p-8 overflow-y-auto h-screen relative">

        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-500/10 dark:bg-rose-900/10 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Header */}
        <div className="threat-header mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/20 relative shadow-[0_0_15px_rgba(244,63,94,0.2)]">
              <ShieldAlert className="text-rose-400" size={32} />
            </div>
            <div>
              <h1 className="text-3xl text-slate-900 dark:text-white font-bold tracking-tight">Threat Management</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Real-time threat monitoring and automated response.</p>
                {loading && <span className="text-xs text-cyan-500 animate-pulse ml-2 font-mono">(Syncing...)</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchThreatData}
              className="p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition shadow-md"
              title="Refresh Data"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-bold transition-all shadow-sm uppercase tracking-wide ${showFilters
                  ? "bg-slate-800 text-white border-slate-600"
                  : "bg-transparent text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
              >
                <Filter size={16} /> Filters
              </button>
              <button
                onClick={resetFilters}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm uppercase tracking-wide"
              >
                <X size={16} /> Reset
              </button>
            </div>
          </div>
        </div>

        {/* Filters Area */}
        {showFilters && (
          <div className="threat-filter-bar bg-white/50 dark:bg-[#1e293b]/50 backdrop-blur-sm p-6 rounded-xl border border-slate-200 dark:border-slate-800 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 transition-all shadow-lg relative z-10">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-cyan-500 dark:group-focus-within:text-cyan-400 transition-colors" size={16} />
              <input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                placeholder="Search threats..."
                className="w-full bg-slate-100 dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg pl-10 pr-4 py-2.5 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition placeholder:text-slate-500 dark:placeholder:text-slate-600"
              />
            </div>
            <select
              value={severityFilter}
              onChange={(e) => { setSeverityFilter(e.target.value); setPage(1); }}
              className="bg-slate-100 dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-300 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
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
              className="bg-slate-100 dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-300 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
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
              className="bg-slate-100 dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-300 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
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
        <div className="threat-table-container bg-white/40 dark:bg-[#1e293b]/40 backdrop-blur-xl rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col min-h-[500px] relative z-10 transition-colors duration-300">
          {/* Top Gradient Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-orange-500 z-20"></div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800/60 bg-slate-100/80 dark:bg-[#0f172a]/80 text-slate-600 dark:text-slate-400 text-[11px] uppercase font-bold tracking-widest transition-colors">
                  <th className="p-5">Threat Name</th>
                  <th className="p-5">Type</th>
                  <th className="p-5">Severity</th>
                  <th className="p-5">Status</th>
                  <th className="p-5">Confidence</th>
                  <th className="p-5">Source IP</th>
                  <th className="p-5">Detected At</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/50 bg-white/30 dark:bg-[#0b1120]/30 transition-colors">
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
                    <tr key={threat.id} className="threat-row group hover:bg-slate-100/30 dark:hover:bg-slate-800/30 transition-colors border-l-2 border-l-transparent hover:border-l-cyan-500">
                      <td className="p-5 font-medium text-slate-900 dark:text-white">
                        {threat.name}
                        {new Date(threat.detected) > new Date(Date.now() - 60000) && (
                          <span className="ml-2 inline-block w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_8px_cyan]" title="Just Now"></span>
                        )}
                      </td>
                      <td className="p-5 text-slate-500 dark:text-slate-400 text-sm">
                        <span className="bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-2 py-0.5 rounded text-xs font-mono">{threat.type}</span>
                      </td>
                      <td className="p-5">
                        <SeverityBadge severity={threat.severity} />
                      </td>
                      <td className="p-5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${threat.status === 'Active' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          threat.status === 'Investigating' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                            threat.status === 'Remediated' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                              'bg-slate-500/10 text-slate-400 border-slate-500/20'
                          }`}>
                          {threat.status}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full shadow-[0_0_5px_currentColor] ${threat.confidence > 90 ? 'bg-red-500 text-red-500' : threat.confidence > 75 ? 'bg-orange-500 text-orange-500' : 'bg-blue-500 text-blue-500'}`}
                              style={{ width: `${threat.confidence}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-600 dark:text-slate-300 font-mono font-bold">{threat.confidence}%</span>
                        </div>
                      </td>
                      <td className="p-5 text-slate-500 dark:text-slate-400 font-mono text-xs text-cyan-600/80 dark:text-cyan-500/80">{threat.ip}</td>
                      <td className="p-5 text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap font-mono">{threat.detected}</td>

                      {/* ACTION COLUMN */}
                      <td className="p-5 text-right relative">
                        <div className="relative inline-block text-left">
                          <button
                            onClick={(e) => toggleMenu(e, threat.id)}
                            className={`p-2 rounded-lg transition-colors ${activeMenuId === threat.id
                              ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20"
                              : "text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                              }`}
                          >
                            <MoreVertical size={16} />
                          </button>

                          {/* DROPDOWN MENU */}
                          {activeMenuId === threat.id && (
                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#020617] border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden ring-1 ring-black/5 dark:ring-white/10 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                              <div className="py-1">
                                <DropdownItem
                                  icon={<Eye size={16} className="text-blue-400" />}
                                  label="View Details"
                                  onClick={() => handleAction(threat.id, "View")}
                                />
                                <DropdownItem
                                  icon={<Search size={16} className="text-yellow-400" />}
                                  label="Mark Investigating"
                                  onClick={() => handleAction(threat.id, "Investigate")}
                                />
                                <DropdownItem
                                  icon={<CheckCircle size={16} className="text-emerald-400" />}
                                  label="Mark Remediated"
                                  onClick={() => handleAction(threat.id, "Remediate")}
                                />
                                <DropdownItem
                                  icon={<XCircle size={16} className="text-rose-600 dark:text-rose-400" />}
                                  label="False Positive"
                                  onClick={() => handleAction(threat.id, "FalsePositive")}
                                />
                                <div className="border-t border-slate-200 dark:border-slate-800 my-1"></div>
                                <DropdownItem
                                  icon={<Play size={16} className="text-cyan-600 dark:text-cyan-400" />}
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
                    <td colSpan="8" className="p-16 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800">
                          <Search size={32} className="opacity-20" />
                        </div>
                        <p>No threats found matching your filters.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between mt-auto relative z-20">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Showing <span className="text-slate-900 dark:text-white">{Math.min((page - 1) * pageSize + 1, filtered.length)}</span> to{" "}
              <span className="text-slate-900 dark:text-white">{Math.min(page * pageSize, filtered.length)}</span> of{" "}
              <span className="text-slate-900 dark:text-white">{filtered.length}</span> results
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wide bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              >
                Previous
              </button>
              <button
                disabled={page === totalPages || totalPages === 0}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wide bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
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