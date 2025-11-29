import React from 'react';
import { FileText, Microscope, Shield, ExternalLink } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

const papers = [
    {
        id: 1,
        title: "Adversarial Machine Learning in Network Intrusion Detection",
        date: "Oct 15, 2023",
        category: "AI Security",
        summary: "Exploring the resilience of deep learning models against sophisticated adversarial attacks in real-time network traffic."
    },
    {
        id: 2,
        title: "Zero-Day Exploit Prediction using Behavioral Analysis",
        date: "Sep 28, 2023",
        category: "Threat Intelligence",
        summary: "A novel approach to identifying unknown vulnerabilities by analyzing system call patterns and memory access anomalies."
    },
    {
        id: 3,
        title: "Quantum Cryptography Integration for IoT Devices",
        date: "Aug 10, 2023",
        category: "Cryptography",
        summary: "Implementing lightweight post-quantum cryptographic algorithms on resource-constrained IoT gateways."
    }
];

const SecurityResearch = () => {
    return (
        <div className="min-h-screen bg-[#0b1120] text-slate-300 font-sans">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-24">
                <div className="mb-16">
                    <h1 className="text-4xl font-bold text-white mb-4 flex items-center gap-3">
                        <Microscope className="text-blue-500" size={40} /> Security Research Labs
                    </h1>
                    <p className="text-xl text-slate-400 max-w-3xl">
                        Our dedicated research team pushes the boundaries of cybersecurity, publishing open-source tools and whitepapers to make the internet safer for everyone.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - Papers */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <FileText className="text-cyan-400" /> Latest Publications
                        </h2>

                        {papers.map((paper) => (
                            <div key={paper.id} className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl hover:bg-slate-900 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">{paper.category}</span>
                                    <span className="text-xs text-slate-500">{paper.date}</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 hover:text-blue-400 cursor-pointer transition-colors">
                                    {paper.title}
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                    {paper.summary}
                                </p>
                                <button className="text-sm font-medium text-white flex items-center gap-1 hover:text-cyan-400 transition-colors">
                                    Read Whitepaper <ExternalLink size={14} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Sidebar - Stats & Focus Areas */}
                    <div className="space-y-8">
                        <div className="bg-gradient-to-br from-blue-900/20 to-slate-900 border border-blue-500/30 p-6 rounded-xl">
                            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                <Shield className="text-blue-500" /> Research Focus
                            </h3>
                            <ul className="space-y-3 text-sm">
                                {['AI/ML Security', 'Malware Analysis', 'Cryptography', 'Cloud Security', 'IoT Defense'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2 text-slate-300">
                                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                            <h3 className="font-bold text-white mb-2">Vulnerability Disclosure</h3>
                            <p className="text-sm text-slate-400 mb-4">
                                Found a security issue? We support responsible disclosure.
                            </p>
                            <button className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 rounded-lg text-sm transition-colors border border-slate-700">
                                Submit Report (PGP)
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default SecurityResearch;
