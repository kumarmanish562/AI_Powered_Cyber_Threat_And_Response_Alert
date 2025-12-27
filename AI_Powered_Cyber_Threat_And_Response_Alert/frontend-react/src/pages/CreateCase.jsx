import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import {
    FolderPlus, UploadCloud, FileText, Save, X,
    Briefcase, AlertCircle, Calendar, Tag
} from 'lucide-react';
import gsap from 'gsap';

const CreateCase = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const [files, setFiles] = useState([]);
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [formData, setFormData] = useState({
        caseName: '',
        description: '',
        type: 'Malware Analysis',
        priority: 'Medium'
    });

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".page-header", { y: -20, opacity: 0, duration: 0.8, ease: "power3.out" });
            gsap.from(".form-card", {
                y: 20,
                opacity: 0,
                duration: 0.6,
                ease: "back.out(1.2)",
                delay: 0.2
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFiles = Array.from(e.dataTransfer.files);
            setFiles(prev => [...prev, ...droppedFiles]);
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFiles = Array.from(e.target.files);
            setFiles(prev => [...prev, ...selectedFiles]);
        }
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate API call with files
        console.log("Submitting case:", formData);
        console.log("Files:", files);
        setTimeout(() => {
            navigate('/analysis');
        }, 500);
    };

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-[#020617] font-sans text-slate-600 dark:text-slate-200 transition-colors duration-300">
            <Sidebar />

            <main ref={containerRef} className="flex-1 p-8 h-screen overflow-y-auto relative">
                {/* Background Elements */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 dark:bg-emerald-900/10 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <header className="page-header mb-8">
                        <button
                            onClick={() => navigate('/analysis')}
                            className="text-slate-400 hover:text-white text-sm mb-4 flex items-center gap-2 transition-colors"
                        >
                            <X size={16} /> Cancel & Return
                        </button>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                <FolderPlus className="text-emerald-600 dark:text-emerald-400" size={28} />
                            </div>
                            Create New Case
                        </h1>
                        <p className="text-slate-400 mt-2 text-sm ml-14">
                            Initialize a new forensic investigation and import initial evidence.
                        </p>
                    </header>

                    <form onSubmit={handleSubmit} className="form-card bg-white/80 dark:bg-[#0f172a]/60 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl transition-colors duration-300">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            {/* Left Column: Case Details */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Case Name</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-3 text-slate-400 dark:text-slate-500" size={18} />
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                            placeholder="e.g., Incident #2024-001"
                                            value={formData.caseName}
                                            onChange={(e) => setFormData({ ...formData, caseName: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Description</label>
                                    <textarea
                                        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 min-h-[120px]"
                                        placeholder="Describe the incident, suspected vectors, and scope..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Case Type</label>
                                        <div className="relative">
                                            <Tag className="absolute left-3 top-3 text-slate-400 dark:text-slate-500" size={18} />
                                            <select
                                                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer"
                                                value={formData.type}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            >
                                                <option>Malware Analysis</option>
                                                <option>Network Forensics</option>
                                                <option>Insider Threat</option>
                                                <option>Disk Forensics</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Priority</label>
                                        <div className="relative">
                                            <AlertCircle className="absolute left-3 top-3 text-slate-400 dark:text-slate-500" size={18} />
                                            <select
                                                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer"
                                                value={formData.priority}
                                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                            >
                                                <option>Low</option>
                                                <option>Medium</option>
                                                <option>High</option>
                                                <option>Critical</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Evidence Upload */}
                            <div className="flex flex-col h-full">
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Initial Evidence</label>
                                <div
                                    className={`flex-1 border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 ${isDragging ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30 hover:border-slate-400 dark:hover:border-slate-600'
                                        }`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    <input
                                        type="file"
                                        multiple
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={handleFileSelect}
                                    />

                                    {files.length === 0 ? (
                                        <>
                                            <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-lg transition-colors">
                                                <UploadCloud size={28} className={isDragging ? "text-emerald-500 dark:text-emerald-400 animate-bounce" : "text-slate-400"} />
                                            </div>
                                            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Upload Artifacts</h3>
                                            <p className="text-slate-500 text-xs max-w-[200px] mb-4">
                                                Drag & drop files here or click to browse.
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-white text-xs rounded-lg font-medium border border-slate-300 dark:border-slate-700 transition-colors"
                                            >
                                                Select Files
                                            </button>
                                        </>
                                    ) : (
                                        <div className="w-full h-full overflow-y-auto pr-2 custom-scrollbar">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-xs font-bold text-emerald-400">{files.length} Files Selected</span>
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="text-[10px] text-slate-400 hover:text-white underline"
                                                >
                                                    Add More
                                                </button>
                                            </div>
                                            <div className="space-y-2">
                                                {files.map((file, idx) => (
                                                    <div key={idx} className="flex items-center justify-between p-2 bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-300 dark:border-slate-700 text-left group transition-colors">
                                                        <div className="flex items-center gap-2 overflow-hidden">
                                                            <FileText size={14} className="text-slate-400 shrink-0" />
                                                            <div className="truncate">
                                                                <div className="text-xs text-slate-700 dark:text-slate-200 truncate max-w-[120px]">{file.name}</div>
                                                                <div className="text-[10px] text-slate-500">{(file.size / 1024).toFixed(1)} KB</div>
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFile(idx)}
                                                            className="p-1 hover:bg-rose-500/20 rounded text-slate-400 hover:text-rose-500 dark:text-slate-500 dark:hover:text-rose-400 transition-colors"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-4 transition-colors">
                            <button
                                type="button"
                                onClick={() => navigate('/analysis')}
                                className="px-6 py-2.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-8 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/40 hover:-translate-y-0.5"
                            >
                                <Save size={18} /> Create Case
                            </button>
                        </div>

                    </form>
                </div>
            </main>
        </div>
    );
};

export default CreateCase;
