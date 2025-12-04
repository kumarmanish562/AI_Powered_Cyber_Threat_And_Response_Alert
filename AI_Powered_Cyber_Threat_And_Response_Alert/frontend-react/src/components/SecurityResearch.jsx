import React, { useEffect, useRef } from 'react';
import { FileText, Microscope, Shield, ExternalLink, Download, Brain, Network, Lock, ChevronRight } from 'lucide-react';
import Navbar from './Home/Navbar';
import Footer from './Home/Footer';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import researchPaper from '../assets/AI_Enabled_Threat_Detection_Leveraging_Artificial_Intelligence_for_Advanced_Security_and_Cyber_Threat_Mitigation.pdf';

gsap.registerPlugin(ScrollTrigger);

const papers = [
    {
        id: 1,
        title: "Adversarial Machine Learning in Network Intrusion Detection",
        date: "Oct 15, 2023",
        category: "AI Security",
        summary: "Exploring the resilience of deep learning models against sophisticated adversarial attacks in real-time network traffic.",
        readTime: "12 min read"
    },
    {
        id: 2,
        title: "Zero-Day Exploit Prediction using Behavioral Analysis",
        date: "Sep 28, 2023",
        category: "Threat Intelligence",
        summary: "A novel approach to identifying unknown vulnerabilities by analyzing system call patterns and memory access anomalies.",
        readTime: "8 min read"
    },
    {
        id: 3,
        title: "Quantum Cryptography Integration for IoT Devices",
        date: "Aug 10, 2023",
        category: "Cryptography",
        summary: "Implementing lightweight post-quantum cryptographic algorithms on resource-constrained IoT gateways.",
        readTime: "15 min read"
    }
];

const SecurityResearch = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero Animation
            gsap.from(".hero-content > *", {
                y: 30,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out"
            });

            // Featured Paper Animation
            gsap.from(".featured-paper", {
                scrollTrigger: {
                    trigger: ".featured-paper",
                    start: "top 80%",
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: "back.out(1.7)"
            });

            // List Animation
            gsap.from(".paper-card", {
                scrollTrigger: {
                    trigger: ".papers-grid",
                    start: "top 85%",
                },
                y: 30,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out"
            });

            // Neural Network Animation
            gsap.to(".neural-node", {
                scale: 1.2,
                duration: 2,
                stagger: {
                    each: 0.5,
                    repeat: -1,
                    yoyo: true
                },
                ease: "sine.inOut"
            });

            gsap.to(".neural-connection", {
                strokeDashoffset: 0,
                duration: 3,
                stagger: 0.2,
                repeat: -1,
                ease: "linear"
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="min-h-screen bg-[#0b1120] text-slate-300 font-sans selection:bg-blue-500/30">
            <Navbar />

            {/* Hero Section */}
            <div className="relative pt-40 pb-20 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>

                <div className="hero-content max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/20 border border-purple-500/20 text-purple-400 text-xs font-bold mb-6 uppercase tracking-wider">
                        <Microscope size={12} className="fill-current" />
                        Research Labs
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                        Pioneering the Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Cyber Defense</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Our research team publishes open-source tools, datasets, and whitepapers to advance the global understanding of AI-driven threats.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pb-24 relative z-10">

                {/* Featured Paper Section */}
                <div className="featured-paper mb-20">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative group">
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/5 blur-[100px] pointer-events-none"></div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 md:p-12 items-center">
                            <div className="space-y-6 relative z-10">
                                <div className="inline-flex items-center gap-2 text-blue-400 font-mono text-xs uppercase tracking-wider">
                                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                                    Featured Publication
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                                    AI-Enabled Threat Detection: Leveraging Artificial Intelligence for Advanced Security
                                </h2>
                                <p className="text-slate-400 text-lg leading-relaxed">
                                    A comprehensive study on how machine learning algorithms can be deployed to detect and mitigate zero-day attacks in real-time, reducing response latency by 99%.
                                </p>
                                <div className="flex flex-wrap gap-4 pt-4">
                                    <a href={researchPaper} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-1">
                                        <FileText size={18} /> Read Full Paper
                                    </a>
                                    <a href={researchPaper} download className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-bold transition-all border border-slate-700 hover:border-slate-600">
                                        <Download size={18} /> Download PDF
                                    </a>
                                </div>
                            </div>

                            {/* Abstract Visualization */}
                            <div className="relative h-[400px] bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center overflow-hidden">
                                {/* Neural Network SVG */}
                                <svg className="w-full h-full absolute inset-0" viewBox="0 0 400 400">
                                    <defs>
                                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.2" />
                                        </linearGradient>
                                    </defs>

                                    {/* Connections */}
                                    {[...Array(20)].map((_, i) => (
                                        <line
                                            key={`line-${i}`}
                                            x1={200}
                                            y1={200}
                                            x2={Math.random() * 400}
                                            y2={Math.random() * 400}
                                            stroke="url(#grad1)"
                                            strokeWidth="1"
                                            className="neural-connection"
                                            strokeDasharray="5,5"
                                        />
                                    ))}

                                    {/* Nodes */}
                                    <circle cx="200" cy="200" r="30" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" className="neural-node" />
                                    <Brain x="185" y="185" size={30} className="text-blue-500" />

                                    {[...Array(8)].map((_, i) => {
                                        const angle = (i / 8) * Math.PI * 2;
                                        const x = 200 + Math.cos(angle) * 120;
                                        const y = 200 + Math.sin(angle) * 120;
                                        return (
                                            <g key={`node-${i}`} className="neural-node">
                                                <circle cx={x} cy={y} r="15" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
                                                <circle cx={x} cy={y} r="4" fill="#3b82f6" />
                                            </g>
                                        );
                                    })}
                                </svg>

                                <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur px-3 py-1 rounded-lg border border-slate-800 text-xs font-mono text-blue-400">
                                    FIG 1.1: THREAT NEURAL NET
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Latest Papers Grid */}
                <div className="papers-grid">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Network className="text-purple-500" /> Latest Publications
                        </h3>
                        <button className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium transition-colors">
                            View Archive <ChevronRight size={14} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {papers.map((paper) => (
                            <div key={paper.id} className="paper-card group bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:bg-slate-900 hover:border-purple-500/30 transition-all duration-300 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="px-2 py-1 rounded bg-slate-800 text-xs font-bold text-purple-400 border border-slate-700">
                                        {paper.category}
                                    </span>
                                    <span className="text-xs text-slate-500 font-mono">{paper.date}</span>
                                </div>
                                <h4 className="text-lg font-bold text-white mb-3 group-hover:text-purple-400 transition-colors leading-snug">
                                    {paper.title}
                                </h4>
                                <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">
                                    {paper.summary}
                                </p>
                                <div className="flex items-center justify-between pt-4 border-t border-slate-800/50 text-xs text-slate-500">
                                    <span className="flex items-center gap-1"><ClockIcon size={12} /> {paper.readTime}</span>
                                    <span className="flex items-center gap-1 text-slate-300 group-hover:text-white transition-colors">
                                        Read <ArrowRightIcon size={12} />
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            <Footer />
        </div>
    );
};

// Helper Icons
const ClockIcon = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);
const ArrowRightIcon = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
);

export default SecurityResearch;
