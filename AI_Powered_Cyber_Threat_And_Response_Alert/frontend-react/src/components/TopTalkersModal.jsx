import React, { useState, useEffect, useRef } from 'react';
import { X, Globe, Shield, Search, Filter, Download, ChevronLeft, ChevronRight, AlertTriangle, Check } from 'lucide-react';

const TopTalkersModal = ({ isOpen, onClose, initialData }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('requests');
    const [sortDirection, setSortDirection] = useState('desc');
    const [fullData, setFullData] = useState([]);

    // Filter State
    const [showFilters, setShowFilters] = useState(false);
    const [selectedRisks, setSelectedRisks] = useState([]);
    const filterRef = useRef(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Simulate fetching more data when modal opens
    useEffect(() => {
        if (isOpen) {
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
            <div className="relative w-full max-w-5xl bg-[#0b1120] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col h-[80vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-800/60 bg-slate-950/30">
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
                            <Globe className="text-blue-400" size={24} />
                            Top Talkers Report
                            <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                                {filteredData.length} Records
                            </span>
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">Detailed analysis of highest volume IP addresses.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleDownload}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700"
                            title="Download CSV"
                        >
                            <Download size={20} />
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
                <div className="p-4 border-b border-slate-800/60 bg-slate-900/20 flex gap-4 relative">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search IP or Country..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    <div className="relative" ref={filterRef}>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${showFilters || selectedRisks.length > 0
                                    ? 'bg-slate-800 text-white border-slate-600'
                                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                                }`}
                        >
                            <Filter size={16} />
                            Filter
                            {selectedRisks.length > 0 && (
                                <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                    {selectedRisks.length}
                                </span>
                            )}
                        </button>

                        {/* Filter Dropdown */}
                        {showFilters && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-[#0b1120] border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                <div className="p-2 space-y-1">
                                    <div className="px-2 py-1 text-xs font-bold text-slate-500 uppercase tracking-wider">Risk Level</div>
                                    {['Critical', 'High', 'Medium', 'Low'].map(risk => (
                                        <button
                                            key={risk}
                                            onClick={() => toggleRiskFilter(risk)}
                                            className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-800 text-sm text-slate-300 transition-colors"
                                        >
                                            <span className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${risk === 'Critical' ? 'bg-rose-500' :
                                                        risk === 'High' ? 'bg-orange-500' :
                                                            risk === 'Medium' ? 'bg-yellow-500' :
                                                                'bg-slate-500'
                                                    }`}></span>
                                                {risk}
                                            </span>
                                            {selectedRisks.includes(risk) && <Check size={14} className="text-blue-400" />}
                                        </button>
                                    ))}
                                </div>
                                {selectedRisks.length > 0 && (
                                    <div className="p-2 border-t border-slate-800 bg-slate-900/50">
                                        <button
                                            onClick={() => setSelectedRisks([])}
                                            className="w-full text-xs text-center text-slate-400 hover:text-white py-1 transition-colors"
                                        >
                                            Clear Filters
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Table Content */}
                <div className="flex-1 overflow-auto custom-scrollbar p-0">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-900/80 text-xs uppercase font-bold text-slate-500 sticky top-0 z-10 backdrop-blur-md">
                            <tr>
                                <th className="px-6 py-4 cursor-pointer hover:text-slate-300 transition-colors" onClick={() => handleSort('ip')}>IP Address</th>
                                <th className="px-6 py-4 cursor-pointer hover:text-slate-300 transition-colors" onClick={() => handleSort('country')}>Location</th>
                                <th className="px-6 py-4 cursor-pointer hover:text-slate-300 transition-colors" onClick={() => handleSort('requests')}>Request Count</th>
                                <th className="px-6 py-4 cursor-pointer hover:text-slate-300 transition-colors" onClick={() => handleSort('risk')}>Risk Level</th>
                                <th className="px-6 py-4 cursor-pointer hover:text-slate-300 transition-colors" onClick={() => handleSort('lastSeen')}>Last Seen</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50 text-sm">
                            {paginatedData.map((talker, idx) => (
                                <tr key={idx} className="hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-6 py-4 font-mono text-slate-300 group-hover:text-white transition-colors">
                                        {talker.ip}
                                    </td>
                                    <td className="px-6 py-4 text-slate-400 flex items-center gap-2">
                                        {talker.country}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-200">
                                        {talker.requests.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border tracking-wide inline-flex items-center gap-1.5 ${talker.risk === 'Critical' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                                talker.risk === 'High' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                                    talker.risk === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                        'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                            }`}>
                                            {talker.risk === 'Critical' && <AlertTriangle size={10} />}
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
                </div>

                {/* Footer / Pagination */}
                <div className="p-4 border-t border-slate-800/60 bg-slate-950/30 flex justify-between items-center text-sm text-slate-500">
                    <div>
                        Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} entries
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span className="flex items-center px-2 text-slate-400">
                            Page {currentPage} of {totalPages || 1}
                        </span>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="p-2 rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
