import React from "react";
import { ArrowLeft, Book, Code, Terminal } from "lucide-react";
import { Link } from "react-router-dom";

const ApiDocumentation = () => {
    return (
        <div className="min-h-screen bg-[#0b1120] text-slate-200 font-sans selection:bg-blue-500 selection:text-white">
            {/* Header */}
            <nav className="p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-semibold">
                        <ArrowLeft className="w-5 h-5" />
                        Back to Home
                    </Link>
                    <div className="flex items-center gap-2">
                        <Book className="w-5 h-5 text-blue-500" />
                        <h1 className="text-xl font-bold text-white tracking-wide">API Documentation</h1>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-6 py-12">
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-white mb-4">Introduction</h2>
                    <p className="text-slate-400 leading-relaxed">
                        Welcome to the CyberSentinels API. Our API allows you to programmatically access threat data, manage alerts, and integrate our security engine into your own applications.
                    </p>
                </div>

                {/* Endpoint Example */}
                <div className="space-y-8">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="bg-green-500/10 text-green-400 px-2 py-1 rounded text-xs font-bold border border-green-500/20">GET</span>
                                <code className="text-slate-300 font-mono text-sm">/api/alerts</code>
                            </div>
                            <Terminal className="w-4 h-4 text-slate-600" />
                        </div>
                        <div className="p-6">
                            <p className="text-slate-400 mb-4">Retrieve a list of recent security alerts detected by the system.</p>
                            <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 font-mono text-sm text-blue-300 overflow-x-auto">
                                {`[
  {
    "id": 1,
    "prediction": "Attack",
    "confidence": 0.98,
    "severity": "High",
    "src_ip": "192.168.1.45",
    "timestamp": "2023-10-24T14:30:00Z"
  },
  ...
]`}
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded text-xs font-bold border border-blue-500/20">POST</span>
                                <code className="text-slate-300 font-mono text-sm">/api/subscribe</code>
                            </div>
                            <Code className="w-4 h-4 text-slate-600" />
                        </div>
                        <div className="p-6">
                            <p className="text-slate-400 mb-4">Subscribe to the newsletter for security alerts.</p>
                            <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 font-mono text-sm text-blue-300 overflow-x-auto">
                                {`{
  "email": "user@example.com"
}`}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ApiDocumentation;
