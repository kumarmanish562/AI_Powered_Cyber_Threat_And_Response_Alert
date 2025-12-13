import React, { useEffect, useRef, useState } from "react";
import { Book, Server, Zap, Database, Globe, Shield, Activity, Code, Lock, Terminal, FileJson, ArrowRight, ArrowLeft, RefreshCw, AlertTriangle, CheckCircle, Eye } from "lucide-react";
import Navbar from "./Home/Navbar";
import Footer from "./Home/Footer";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

const ApiDocumentation = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const contentRef = useRef(null);

    // --- LIVE INTELLIGENCE DEMO STATE ---
    const [demoData, setDemoData] = useState({
        ip: "192.168.1.1",
        risk: 12,
        logs: [],
        recommendation: "System appears normal."
    });

    useEffect(() => {
        const fakeLogs = [
            "Port 80 TCP connection established",
            "SSL Handshake successful",
            "Incoming packet size: 1024 bytes",
            "Reputation check: Clean",
            "Geo-location lookup: US-West",
            "User-Agent: Mozilla/5.0 (Windows NT 10.0)",
            "DNS Query: api.threatwatch.ai",
            "Firewall Allow Rule #104 matched"
        ];

        const interval = setInterval(() => {
            const newRisk = Math.floor(Math.random() * 100);

            // Generate a fake IP slightly different each time or keep static
            const ipOctet = Math.floor(Math.random() * 255);
            const newIP = `203.0.113.${ipOctet}`;

            let rec = "Monitor traffic for anomalies.";
            if (newRisk > 75) rec = "CRITICAL: Block inbound traffic immediately.";
            else if (newRisk > 40) rec = "WARNING: Enable deep packet inspection.";

            setDemoData(prev => ({
                ip: newIP,
                risk: newRisk,
                logs: [fakeLogs[Math.floor(Math.random() * fakeLogs.length)], ...prev.logs].slice(0, 5),
                recommendation: rec
            }));
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Header Animation
            gsap.from(".api-header", {
                y: -30,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out"
            });

            // Content Reveal Stagger
            gsap.from(".api-section", {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "power3.out",
                delay: 0.3
            });

            // Code Block Reveal
            gsap.from(".code-block", {
                scale: 0.95,
                opacity: 0,
                duration: 0.6,
                ease: "back.out(1.2)",
                delay: 0.6
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-cyan-500/30 flex flex-col">
            <Navbar />
            <div className="flex-1 flex flex-col relative pt-20" ref={containerRef}>



                {/* Background Ambience */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-900/5 blur-[120px] rounded-full"></div>
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
                </div>

                {/* Header */}
                <nav className="api-header px-6 lg:px-8 mb-8 z-20 flex justify-between items-center max-w-7xl mx-auto w-full">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600/20 rounded-lg border border-blue-500/30">
                            <Book className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white tracking-tight">Developer API</h1>
                            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">v2.4.0 • Public Beta</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="px-4 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-colors flex items-center gap-2">
                            <FileJson size={14} className="text-amber-400" /> Download Swagger
                        </button>
                    </div>
                </nav>

                {/* Content */}
                <main className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-8 space-y-16 relative z-10 pb-20">

                    {/* Introduction */}
                    <section className="api-section max-w-4xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-8 w-1 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full"></div>
                            <h2 className="text-3xl font-bold text-white">System Overview</h2>
                        </div>
                        <p className="text-slate-400 leading-relaxed text-lg mb-8 border-l-2 border-slate-800 pl-6">
                            The ThreatWatch AI AI API provides programmatic access to the threat detection engine, real-time monitoring streams, and system logs.
                            Designed for high-throughput environments, it enables seamless integration with SIEMs, SOARs, and custom dashboards.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-5 bg-[#0f172a]/80 border border-slate-800 rounded-xl hover:border-blue-500/30 transition-colors group">
                                <Zap className="text-amber-400 mb-3 group-hover:scale-110 transition-transform" size={24} />
                                <h3 className="font-bold text-white mb-1">Real-Time</h3>
                                <p className="text-sm text-slate-500">Sub-millisecond latency for threat detection events via WebSockets.</p>
                            </div>
                            <div className="p-5 bg-[#0f172a]/80 border border-slate-800 rounded-xl hover:border-cyan-500/30 transition-colors group">
                                <Shield className="text-cyan-400 mb-3 group-hover:scale-110 transition-transform" size={24} />
                                <h3 className="font-bold text-white mb-1">Secure</h3>
                                <p className="text-sm text-slate-500">Enterprise-grade OAuth2 authentication with granular scopes.</p>
                            </div>
                            <div className="p-5 bg-[#0f172a]/80 border border-slate-800 rounded-xl hover:border-emerald-500/30 transition-colors group">
                                <Database className="text-emerald-400 mb-3 group-hover:scale-110 transition-transform" size={24} />
                                <h3 className="font-bold text-white mb-1">Scalable</h3>
                                <p className="text-sm text-slate-500">Horizontally scalable architecture handling 10k+ RPS.</p>
                            </div>
                        </div>
                    </section>

                    {/* Configuration */}
                    <section className="api-section max-w-6xl">
                        {/* --- LIVE INTELLIGENCE DEMO --- */}
                        <div className="mb-16 bg-[#0f172a]/90 border border-emerald-500/20 rounded-2xl p-1 overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.1)] relative group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500"></div>
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 animate-pulse">
                                            <Eye size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-white">Live Intelligence Inspector</h2>
                                            <p className="text-sm text-slate-400">Real-time threat scoring & remediation advice (Interactive Demo)</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-slate-800 rounded-full border border-slate-700 text-xs font-mono text-emerald-400 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> SYSTEM ONLINE
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Risk Gauge */}
                                    <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 flex flex-col items-center justify-center text-center">
                                        <div className="relative mb-4">
                                            <svg className="w-32 h-32 transform -rotate-90">
                                                <circle cx="64" cy="64" r="60" stroke="#1e293b" strokeWidth="8" fill="transparent" />
                                                <circle cx="64" cy="64" r="60" stroke={demoData.risk > 75 ? "#f43f5e" : demoData.risk > 40 ? "#f59e0b" : "#10b981"} strokeWidth="8" fill="transparent" strokeDasharray="377" strokeDashoffset={377 - (377 * demoData.risk) / 100} className="transition-all duration-1000 ease-out" />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                                <span className="text-3xl font-bold text-white">{demoData.risk}</span>
                                                <span className="text-[10px] uppercase tracking-widest text-slate-500">Risk Score</span>
                                            </div>
                                        </div>
                                        <p className={`font-bold ${demoData.risk > 75 ? "text-rose-400" : demoData.risk > 40 ? "text-amber-400" : "text-emerald-400"}`}>
                                            {demoData.risk > 75 ? "CRITICAL THREAT" : demoData.risk > 40 ? "SUSPICIOUS ACTIVITY" : "SAFE TRAFFIC"}
                                        </p>
                                    </div>

                                    {/* Data Stream */}
                                    <div className="lg:col-span-2 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-black/30 p-4 rounded-lg border border-slate-700/50">
                                                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Target IP</div>
                                                <div className="font-mono text-lg text-cyan-400">{demoData.ip}</div>
                                            </div>
                                            <div className="bg-black/30 p-4 rounded-lg border border-slate-700/50">
                                                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Recommendation</div>
                                                <div className={`font-bold text-sm ${demoData.risk > 75 ? "text-rose-400" : "text-slate-200"}`}>{demoData.recommendation}</div>
                                            </div>
                                        </div>

                                        <div className="bg-black/50 rounded-lg border border-slate-800 p-4 font-mono text-xs h-32 overflow-hidden flex flex-col justify-end relative">
                                            <div className="absolute top-2 right-2 flex items-center gap-1 text-slate-600">
                                                <RefreshCw size={10} className="animate-spin" /> Stream
                                            </div>
                                            {demoData.logs.map((log, i) => (
                                                <div key={i} className="mb-1 text-slate-400 truncate">
                                                    <span className="text-slate-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
                                                    {log}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-8 w-1 bg-gradient-to-b from-purple-400 to-pink-600 rounded-full"></div>
                            <h2 className="text-2xl font-bold text-white">Configuration</h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-[#1e293b]/40 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 shadow-xl">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                    <Server className="text-emerald-400" size={20} /> Connection Details
                                </h3>
                                <div className="space-y-6">
                                    <div className="group">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block group-hover:text-blue-400 transition-colors">Base Endpoint</label>
                                        <div className="flex items-center gap-3 bg-black/40 p-4 rounded-xl border border-slate-700 font-mono text-sm text-blue-400 shadow-inner">
                                            <Globe size={16} className="text-slate-600" />
                                            <span>https://api.ThreatWatch AI.ai/v1</span>
                                        </div>
                                    </div>

                                    <div className="group">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block group-hover:text-blue-400 transition-colors">Authentication Header</label>
                                        <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-xl">
                                            <div className="flex items-start gap-3">
                                                <Lock className="text-rose-400 mt-0.5" size={16} />
                                                <div>
                                                    <p className="text-slate-300 text-sm font-mono">Authorization: Bearer &lt;YOUR_API_KEY&gt;</p>
                                                    <p className="text-rose-300/60 text-xs mt-2">
                                                        API keys carry significant privileges. Never commit them to version control.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#1e293b]/40 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 shadow-xl flex flex-col">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                    <Activity className="text-amber-400" size={20} /> Rate Limiting
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                    To ensure system stability, API requests are rate-limited based on your subscription tier. Responses include standard rate limit headers.
                                </p>

                                <div className="space-y-3">
                                    {[
                                        { tier: "Free", limit: "100 req/min", color: "slate" },
                                        { tier: "Pro", limit: "1,000 req/min", color: "blue" },
                                        { tier: "Enterprise", limit: "Unlimited", color: "purple" }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                                            <span className={`text-sm font-medium text-${item.color === 'slate' ? 'slate-400' : item.color + '-400'}`}>{item.tier}</span>
                                            <span className="text-xs font-mono text-slate-500">{item.limit}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-auto pt-6">
                                    <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
                                        <Terminal size={14} />
                                        <span>X-RateLimit-Remaining: 49</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Endpoints Reference */}
                    <section className="api-section max-w-5xl">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-8 w-1 bg-gradient-to-b from-emerald-400 to-teal-600 rounded-full"></div>
                            <h2 className="text-2xl font-bold text-white">Core Endpoints</h2>
                        </div>

                        <div className="space-y-8">
                            {/* Subscribe Endpoint */}
                            <div className="code-block bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl transition-all hover:border-slate-700 hover:shadow-blue-900/5">
                                <div className="p-5 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-md text-xs font-bold border border-emerald-500/20 tracking-wide">POST</span>
                                        <code className="text-slate-200 font-mono text-sm">/v1/alerts/subscribe</code>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                        <span className="text-xs text-slate-500 font-mono">Active</span>
                                    </div>
                                </div>

                                <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div>
                                        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                                            Subscribes an email address or webhook URL to receive critical security alerts and weekly summary reports.
                                        </p>

                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Parameters</h4>
                                        <div className="space-y-2">
                                            <div className="flex items-baseline gap-3 text-sm">
                                                <code className="text-cyan-400 font-mono">email</code>
                                                <span className="text-slate-600 text-xs">string (required)</span>
                                                <span className="text-slate-400">Recipient email address.</span>
                                            </div>
                                            <div className="flex items-baseline gap-3 text-sm">
                                                <code className="text-cyan-400 font-mono">level</code>
                                                <span className="text-slate-600 text-xs">enum</span>
                                                <span className="text-slate-400">Min severity (info, warning, critical).</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex justify-between">
                                            Example Request
                                            <span className="text-blue-500 cursor-pointer hover:underline">Copy</span>
                                        </h4>
                                        <div className="bg-[#020617] rounded-xl border border-slate-800 p-5 font-mono text-xs shadow-inner relative group">
                                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Code size={16} className="text-slate-600" />
                                            </div>
                                            <pre className="text-slate-300 overflow-x-auto">
                                                {`curl -X POST https://api.ThreatWatch AI.ai/v1/alerts/subscribe \\
  -H "Authorization: Bearer $API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "security@example.com",
    "level": "critical"
  }'`}
                                            </pre>
                                        </div>
                                        <div className="mt-2 flex gap-2">
                                            <span className="px-2 py-1 bg-slate-800 rounded text-[10px] text-green-400 font-mono">200 OK</span>
                                            <span className="px-2 py-1 bg-slate-800 rounded text-[10px] text-slate-500 font-mono">54ms</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Footer Area */}
                    <div className="pt-10 border-t border-white/5 flex justify-between items-center text-slate-500 text-sm">
                        <p>© 2024 ThreatWatch AI AI API Team</p>
                        <a href="#" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                            View Full Changelog <ArrowRight size={16} />
                        </a>
                    </div>

                </main>
            </div>
            <Footer />
        </div >
    );
};

export default ApiDocumentation;