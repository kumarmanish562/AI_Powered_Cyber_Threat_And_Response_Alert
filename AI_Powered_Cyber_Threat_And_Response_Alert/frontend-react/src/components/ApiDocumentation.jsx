import React from "react";
import { Book, Server, Zap, Database, Globe, Shield, Activity } from "lucide-react";
import Sidebar from "./Sidebar";

const ApiDocumentation = () => {
    return (
        <div className="flex h-screen bg-[#0b1120] text-slate-200 font-sans selection:bg-blue-500 selection:text-white overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Header */}
                <nav className="p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md shrink-0">
                    <div className="max-w-7xl mx-auto flex items-center justify-end">
                        <div className="flex items-center gap-2">
                            <Book className="w-5 h-5 text-blue-500" />
                            <h1 className="text-lg font-bold text-white tracking-wide">System API Reference</h1>
                        </div>
                    </div>
                </nav>

                {/* Content */}
                <main className="flex-1 overflow-y-auto w-full p-8 space-y-12 custom-scrollbar">

                    {/* Introduction */}
                    <section>
                        <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
                            <Shield className="text-blue-500" /> System Overview
                        </h2>
                        <p className="text-slate-400 leading-relaxed text-lg">
                            The CyberSentinels API provides programmatic access to the threat detection engine, real-time monitoring streams, and system logs.
                            This interface is designed for system integration and automated response handling, operating in real-time to ensure immediate threat mitigation.
                        </p>
                    </section>

                    {/* Configuration */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Server className="text-emerald-500" size={20} /> API Configuration
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Base URL</label>
                                    <div className="mt-1 flex items-center gap-2 bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-blue-400">
                                        <Globe size={16} />
                                        <span>http://192.168.1.100/api</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Authentication</label>
                                    <p className="mt-1 text-slate-400 text-sm">
                                        All requests must include the <code className="text-rose-400 bg-rose-500/10 px-1 py-0.5 rounded">Authorization</code> header with a valid Bearer token.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Zap className="text-amber-500" size={20} /> Real-Time Architecture
                            </h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                The system utilizes a hybrid real-time architecture. Critical alerts are pushed immediately via WebSockets (planned), while statistical data is aggregated and polled at high frequency (5s intervals) to ensure dashboard accuracy without overloading the network.
                            </p>
                            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-950/50 p-2 rounded border border-slate-800/50">
                                <Activity size={14} className="text-blue-500" />
                                <span>Current Polling Interval: <strong>5000ms</strong></span>
                            </div>
                        </div>
                    </section>

                    {/* Endpoints Reference */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <Globe className="text-blue-500" /> Endpoints Reference
                        </h2>

                        <div className="space-y-6">
                            {/* Subscribe Endpoint */}
                            <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                                <div className="p-4 border-b border-slate-800 bg-slate-950/30 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded text-xs font-bold border border-emerald-500/20">POST</span>
                                        <code className="text-slate-300 font-mono text-sm">/subscribe</code>
                                    </div>
                                    <span className="text-xs text-slate-500 font-mono">Public</span>
                                </div>
                                <div className="p-6">
                                    <p className="text-slate-400 text-sm mb-4">Subscribes an email address to receive critical security alerts and weekly summary reports.</p>

                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Request Body</h4>
                                            <div className="bg-slate-950 rounded-lg border border-slate-800 p-4 font-mono text-xs text-slate-300">
                                                <pre>{`{
  "email": "user@example.com"
}`}</pre>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default ApiDocumentation;
