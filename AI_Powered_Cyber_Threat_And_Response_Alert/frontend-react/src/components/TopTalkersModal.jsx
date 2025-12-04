import React, { useState, useEffect, useRef } from 'react';
import { X, Globe, Shield, Search, Filter, Download, ChevronLeft, ChevronRight, AlertTriangle, Check, Activity, MapPin } from 'lucide-react';
import gsap from "gsap";

const TopTalkersModal = ({ isOpen, onClose, initialData }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('requests');
    const [sortDirection, setSortDirection] = useState('desc');
    const [fullData, setFullData] = useState([]);
    const modalRef = useRef(null);

    // Filter State
    const [showFilters, setShowFilters] = useState(false);
    const [selectedRisks, setSelectedRisks] = useState([]);
    const filterRef = useRef(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; // Slightly less to fit design

    // Simulate fetching more data when modal opens
    useEffect(() => {
        if (isOpen) {
            // Animate Entrance
            if (modalRef.current) {
                const ctx = gsap.context(() => {
                    gsap.fromTo(modalRef.current,
                        { opacity: 0, scale: 0.9, y: 20 },
                        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "power3.out" }
                    );

                    gsap.from(".table-row-anim", {
                        x: -20,
                        opacity: 0,
                        duration: 0.4,
                        stagger: 0.05,
                        ease: "power2.out",
                        delay: 0.2
                    });
                }, modalRef);
                return () => ctx.revert();
            }

            // Combine initial data with more simulated data
            const moreData = Array.from({ length: 50 }).map((_, i) => ({
                ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
                country: ['USA', 'China', 'Russia', 'Germany', 'Brazil', 'India'][Math.floor(Math.random() * 6)],
                requests: Math.floor(Math.random() * 10000) + 500,
                risk: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)],
                lastSeen: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toLocaleTimeString()
            }));

            // Merge unique IPs (simple simulation)
            setFullData([...(initialData || []), ...moreData]);
        }
    }, [isOpen, initialData]);

    // Re-animate rows on page change
    useEffect(() => {
        if (isOpen && modalRef.current) {
            gsap.fromTo(".table-row-anim",
                { opacity: 0, x: -10 },
                { opacity: 1, x: 0, duration: 0.3, stagger: 0.03, ease: "power2.out" }
            );
        }
    }, [currentPage, sortField, sortDirection, searchTerm, selectedRisks]);


    // Close filter dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setShowFilters(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedRisks]);

    if (!isOpen) return null;

    // Filter and Sort
    const filteredData = fullData
        .filter(item => {
            const matchesSearch = item.ip.includes(searchTerm) ||
                item.country.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRisk = selectedRisks.length === 0 || selectedRisks.includes(item.risk);
            return matchesSearch && matchesRisk;
        })
        .sort((a, b) => {
            let aVal = a[sortField];
            let bVal = b[sortField];

            // Handle risk sorting custom order
            if (sortField === 'risk') {
                const riskOrder = { 'Critical': 3, 'High': 2, 'Medium': 1, 'Low': 0 };
                aVal = riskOrder[aVal];
                bVal = riskOrder[bVal];
            }

            if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

    // Pagination Logic
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    const toggleRiskFilter = (risk) => {
        setSelectedRisks(prev =>
            prev.includes(risk)
                ? prev.filter(r => r !== risk)
                : [...prev, risk]
        );
    };

    const handleDownload = () => {
        // CSV Header
        const headers = ['IP Address', 'Location', 'Request Count', 'Risk Level', 'Last Seen'];

        // CSV Rows
        const rows = filteredData.map(item => [
            item.ip,
            item.country,
            item.requests,
            item.risk,
            item.lastSeen
        ]);

        // Combine to CSV string
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        // Create Blob and Download Link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `top_talkers_report_${new Date().toISOString().slice(0, 10)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div ref={modalRef} className="relative w-full max-w-5xl bg-[#020617] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh]">

                {/* Background Grid */}
                <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="absolute top-0 left-0 w-full h-32 bg-blue-900/10 blur-[60px]"></div>
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
                </div>

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-800/60 bg-[#0f172a]/80 backdrop-blur-md shrink-0 relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                <Globe className="text-blue-400" size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-white tracking-tight">Top Talkers Report</h2>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                            <span className="flex items-center gap-1.5"><Activity size={12} className="text-emerald-400" /> Live Monitoring</span>
                            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                            <span className="font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{filteredData.length} Records</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700 text-xs font-bold uppercase tracking-wider"
                            title="Download CSV"
                        >
                            <Download size={16} /> Export CSV
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="p-4 border-b border-slate-800/60 bg-[#0f172a]/30 flex gap-4 relative z-10">
                    <div className="relative flex-1 max-w-md group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Search IP address or country..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                        />
                    </div>

                    <div className="relative" ref={filterRef}>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${showFilters || selectedRisks.length > 0
                                ? 'bg-slate-800 text-white border-slate-600 shadow-lg'
                                : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                                }`}
                        >
                            <Filter size={16} />
                            Filter Risks
                            {selectedRisks.length > 0 && (
                                <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                                    {selectedRisks.length}
                                </span>
                            )}
                        </button>

                        {/* Filter Dropdown */}
                        {showFilters && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-[#0b1120] border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                                <div className="p-2 space-y-1">
                                    <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-950/50 rounded-lg mb-1">Filter by Severity</div>
                                    {['Critical', 'High', 'Medium', 'Low'].map(risk => (
                                        <button
                                            key={risk}
                                            onClick={() => toggleRiskFilter(risk)}
                                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${selectedRisks.includes(risk) ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                                                }`}
                                        >
                                            <span className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full shadow-[0_0_5px_currentColor] ${risk === 'Critical' ? 'bg-rose-500 text-rose-500' :
                                                    risk === 'High' ? 'bg-orange-500 text-orange-500' :
                                                        risk === 'Medium' ? 'bg-yellow-500 text-yellow-500' :
                                                            'bg-blue-500 text-blue-500'
                                                    }`}></span>
                                                {risk}
                                            </span>
                                            {selectedRisks.includes(risk) && <Check size={14} className="text-blue-400" />}
                                        </button>
                                    ))}
                                </div>
                                {selectedRisks.length > 0 && (
                                    <div className="p-2 border-t border-slate-800 bg-slate-950/30">
                                        <button
                                            onClick={() => setSelectedRisks([])}
                                            className="w-full text-xs font-bold text-center text-slate-400 hover:text-white py-1.5 rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-wide"
                                        >
                                            Reset Filters
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Table Content */}
                <div className="flex-1 overflow-auto custom-scrollbar p-0 relative z-10 bg-[#020617]/50">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#0f172a]/90 text-xs uppercase font-bold text-slate-500 sticky top-0 z-10 backdrop-blur-md shadow-sm">
                            <tr>
                                {['IP Address', 'Location', 'Request Count', 'Risk Level', 'Last Seen'].map((header, idx) => {
                                    const fieldMap = ['ip', 'country', 'requests', 'risk', 'lastSeen'];
                                    return (
                                        <th
                                            key={idx}
                                            className="px-6 py-4 cursor-pointer hover:text-blue-400 transition-colors border-b border-slate-800"
                                            onClick={() => handleSort(fieldMap[idx])}
                                        >
                                            <div className="flex items-center gap-1">
                                                {header}
                                                {sortField === fieldMap[idx] && (
                                                    <span className="text-[10px]">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                                                )}
                                            </div>
                                        </th>
                                    )
                                })}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50 text-sm">
                            {paginatedData.map((talker, idx) => (
                                <tr key={idx} className="table-row-anim hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-mono text-slate-300 group-hover:text-white transition-colors font-medium">{talker.ip}</div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-400">
                                        <div className="flex items-center gap-2">
                                            <MapPin size={14} className="text-slate-600 group-hover:text-blue-400 transition-colors" />
                                            {talker.country}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-200">{talker.requests.toLocaleString()}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border tracking-wide ${talker.risk === 'Critical' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.2)]' :
                                            talker.risk === 'High' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                                talker.risk === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                    'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                            }`}>
                                            {talker.risk === 'Critical' && <AlertTriangle size={10} className="animate-pulse" />}
                                            {talker.risk}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                                        {talker.lastSeen}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {paginatedData.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                            <Search size={48} className="mb-4 opacity-20" />
                            <p>No matching records found.</p>
                        </div>
                    )}
                </div>

                {/* Footer / Pagination */}
                <div className="p-4 border-t border-slate-800/60 bg-[#0f172a]/50 flex justify-between items-center text-sm text-slate-500 relative z-10">
                    <div>
                        Showing <span className="text-slate-300 font-medium">{filteredData.length > 0 ? startIndex + 1 : 0}</span> to <span className="text-slate-300 font-medium">{Math.min(startIndex + itemsPerPage, filteredData.length)}</span> of <span className="text-slate-300 font-medium">{filteredData.length}</span> entries
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border border-slate-700 hover:bg-slate-800 hover:text-white hover:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <div className="flex items-center px-4 bg-slate-900 rounded-lg border border-slate-800 text-xs font-mono">
                            Page {currentPage} / {totalPages || 1}
                        </div>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="p-2 rounded-lg border border-slate-700 hover:bg-slate-800 hover:text-white hover:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopTalkersModal;