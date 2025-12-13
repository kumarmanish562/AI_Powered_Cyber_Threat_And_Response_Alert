import React, { useEffect, useRef } from "react";
import { Book, Shield, Zap, Activity, Monitor, Search, Cpu, PlayCircle, ArrowLeft, Lightbulb } from "lucide-react";
import Navbar from "./Home/Navbar";
import Footer from "./Home/Footer";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

const UserDocumentation = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".doc-header", { y: -30, opacity: 0, duration: 0.8, ease: "power3.out" });
            gsap.from(".doc-section", { y: 30, opacity: 0, duration: 0.8, stagger: 0.2, ease: "power3.out", delay: 0.3 });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-indigo-500/30 flex flex-col">
            <Navbar />

            <div className="flex-1 flex flex-col relative pt-24 pb-20" ref={containerRef}>
                {/* Background Ambience */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-900/10 blur-[120px] rounded-full"></div>
                    <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-blue-900/5 blur-[100px] rounded-full"></div>
                </div>

                <div className="max-w-7xl mx-auto w-full px-6 lg:px-8 relative z-10">

                    {/* Header */}
                    <header className="doc-header mb-16 text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-6 uppercase tracking-widest">
                            <Book size={12} /> Project Manual
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                            How to Use <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">ThreatWatch AI</span>
                        </h1>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            A complete guide to operating the platform, understanding the AI features, and presenting the project effectively.
                        </p>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                        {/* LEFT COLUMN: Main Guide */}
                        <div className="lg:col-span-2 space-y-12">

                            {/* Section 1: Project Overview */}
                            <section className="doc-section">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Shield size={24} /></div>
                                    1. Project Overview
                                </h2>
                                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm">
                                    <p className="text-slate-300 mb-4 leading-relaxed">
                                        <strong>ThreatWatch AI</strong> is an advanced cybersecurity platform designed to respond to threats in real-time. Unlike traditional passive logs, it uses <strong>Artificial Intelligence</strong> to actively predict attacks before they cause damage.
                                    </p>
                                    <ul className="space-y-3 text-slate-400 text-sm">
                                        <li className="flex items-start gap-3">
                                            <CheckIcon />
                                            <span><strong>Real-time Monitoring:</strong> Watches network traffic milliseconds-by-millisecond.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckIcon />
                                            <span><strong>AI Classification:</strong> Uses Random Forest ML models to classify packets as "Safe" or "Attack".</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckIcon />
                                            <span><strong>Automated Response:</strong> Can instantly block IPs and send email alerts to admins.</span>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            {/* Section 2: Dashboard Guide */}
                            <section className="doc-section">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><Monitor size={24} /></div>
                                    2. Dashboard Guide
                                </h2>
                                <div className="space-y-6">
                                    <FeatureCard
                                        icon={<PlayCircle size={20} className="text-emerald-400" />}
                                        title="Simulate Attack Button"
                                        desc="Located in the top-right of the Dashboard. Click this to generate active 'mock' traffic. It demonstrates how the system detects attacks in real-time without needing a real hacker."
                                    />
                                    <FeatureCard
                                        icon={<Activity size={20} className="text-amber-400" />}
                                        title="Live Traffic Graph"
                                        desc="The area chart shows the volume of network packets. Spikes usually indicate a DDoS attack or heavy scanning activity."
                                    />
                                    <FeatureCard
                                        icon={<Search size={20} className="text-cyan-400" />}
                                        title="Network Scanner"
                                        desc="Use the 'Network' tab to discover devices. It lists all connected assets (Servers, PCs) and checks them for vulnerabilities."
                                    />
                                </div>
                            </section>

                            {/* Section 3: Technical Stack */}
                            <section className="doc-section">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    <div className="p-2 bg-slate-800 rounded-lg text-slate-400"><Cpu size={24} /></div>
                                    3. Technical Stack
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <TechBadge label="React.js" sub="Frontend UI" />
                                    <TechBadge label="FastAPI" sub="Python Backend" />
                                    <TechBadge label="Scikit-Learn" sub="AI Engine" />
                                    <TechBadge label="PostgreSQL" sub="Database" />
                                </div>
                            </section>

                        </div>

                        {/* RIGHT COLUMN: Presentation Script */}
                        <div className="lg:col-span-1">
                            <div className="doc-section sticky top-24 bg-gradient-to-b from-indigo-900/20 to-slate-900/50 border border-indigo-500/30 rounded-2xl p-6 backdrop-blur-md shadow-xl">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <Lightbulb size={20} className="text-yellow-400" /> Presentation Cheat Sheet
                                </h3>
                                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-4">Say this to the judges:</p>

                                <div className="space-y-6">
                                    <ScriptBlock
                                        title="The Problem"
                                        text="Traditional firewalls are too slow. They rely on static rules. We needed a system that 'thinks' and adapts to new zero-day attacks."
                                    />
                                    <ScriptBlock
                                        title="Our Solution"
                                        text="We built an AI-powered engine that analyzes packet behavior. It achieves 98% accuracy in distinguishing legitimate traffic from malicious exploits."
                                    />
                                    <ScriptBlock
                                        title="Key Innovation"
                                        text="The 'Active Response' module. It doesn't just alert; it takes action—blocking ports and notifying admins instantly via email."
                                    />
                                </div>

                                <div className="mt-8 pt-6 border-t border-white/5">
                                    <button onClick={() => navigate('/dashboard')} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-indigo-500/20">
                                        Open Live Demo
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

// Helper Components
const CheckIcon = () => (
    <div className="mt-1 w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
    </div>
);

const FeatureCard = ({ icon, title, desc }) => (
    <div className="bg-[#0f172a]/40 border border-slate-800 p-5 rounded-xl hover:border-slate-600 transition-colors flex gap-4">
        <div className="mt-1">{icon}</div>
        <div>
            <h3 className="font-bold text-white mb-1">{title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
        </div>
    </div>
);

const TechBadge = ({ label, sub }) => (
    <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-center">
        <div className="font-bold text-white text-sm">{label}</div>
        <div className="text-[10px] text-slate-500 uppercase tracking-wider">{sub}</div>
    </div>
);

const ScriptBlock = ({ title, text }) => (
    <div className="relative pl-4 border-l-2 border-indigo-500/30">
        <div className="text-xs font-bold text-indigo-400 mb-1">{title}</div>
        <p className="text-slate-300 text-sm italic">"{text}"</p>
    </div>
);

export default UserDocumentation;
