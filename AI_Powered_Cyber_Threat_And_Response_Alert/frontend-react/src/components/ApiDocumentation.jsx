import React, { useEffect, useRef } from "react";
import { Book, Server, Zap, Database, Globe, Shield, Activity, Code, Lock, Terminal, FileJson, ArrowRight, ArrowLeft } from "lucide-react";
import Navbar from "./Home/Navbar";
import Footer from "./Home/Footer";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

const ApiDocumentation = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const contentRef = useRef(null);

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

                {/* Back Button */}
                <div className="max-w-7xl mx-auto w-full px-6 lg:px-8 py-6 z-20">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Platform</span>
                    </button>
                </div>

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