import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle, Shield, Zap, Database, Server, Lock, Activity, Code, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

const specsData = {
    1: {
        title: "Deep Packet Inspection",
        subtitle: "Layer 7 Application Visibility",
        description: "Our DPI engine goes beyond simple header inspection. It reconstructs traffic flows in real-time to identify malicious payloads, zero-day exploits, and command-and-control communications hidden within legitimate traffic.",
        icon: Shield,
        color: "cyan",
        technicalDetails: [
            {
                title: "Architecture",
                content: "Implemented using a custom high-performance DPDK (Data Plane Development Kit) pipeline, allowing for zero-copy packet processing at line rates up to 100Gbps."
            },
            {
                title: "Protocol Support",
                content: "Native parsing for over 4,000 protocols including HTTP/2, SMBv3, OT/ICS protocols (Modbus, DNP3), and custom enterprise protocols."
            },
            {
                title: "Encryption Handling",
                content: "JA3/JA3S fingerprinting for TLS traffic analysis without decryption. Optional man-in-the-middle SSL decryption with hardware offloading."
            }
        ],
        diagram: (
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 font-mono text-xs text-slate-400">
                <div className="flex flex-col items-center gap-4">
                    <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded text-blue-400 w-48 text-center">Raw Packet Stream (NIC)</div>
                    <div className="h-6 w-[1px] bg-slate-700"></div>
                    <div className="p-3 bg-cyan-900/20 border border-cyan-500/30 rounded text-cyan-400 w-48 text-center">
                        DPDK Ring Buffer
                        <div className="text-[10px] opacity-70 mt-1">Zero-Copy Access</div>
                    </div>
                    <div className="h-6 w-[1px] bg-slate-700"></div>
                    <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                        <div className="p-3 bg-slate-800 border border-slate-600 rounded text-center">Protocol Decoder</div>
                        <div className="p-3 bg-slate-800 border border-slate-600 rounded text-center">Signature Matcher</div>
                    </div>
                    <div className="h-6 w-[1px] bg-slate-700"></div>
                    <div className="p-3 bg-red-900/20 border border-red-500/30 rounded text-red-400 w-48 text-center">Threat Alert / Block</div>
                </div>
            </div>
        )
    },
    2: {
        title: "Visual Workflow Automation",
        subtitle: "No-Code SOAR Capabilities",
        description: "Orchestrate your entire security stack with a visual drag-and-drop editor. Automate repetitive tasks, enrich alerts with threat intel, and respond to incidents at machine speed.",
        icon: Zap,
        color: "violet",
        technicalDetails: [
            {
                title: "Execution Engine",
                content: "Serverless execution environment based on WebAssembly (Wasm) for millisecond cold-start times and secure sandboxing of automation scripts."
            },
            {
                title: "Integrations",
                content: "300+ pre-built integrations with major security tools (CrowdStrike, Splunk, Palo Alto), cloud providers (AWS, Azure), and communication platforms (Slack, Teams)."
            },
            {
                title: "Logic Primitives",
                content: "Supports conditional branching, loops, manual approval gates, and variable transformations. Compatible with YAML definition export."
            }
        ],
        diagram: (
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 font-mono text-xs text-slate-400">
                <div className="flex justify-between items-center mb-4">
                    <div className="p-2 border border-dashed border-slate-600 rounded">Alert Source</div>
                    <ArrowRight size={14} />
                    <div className="p-2 border border-violet-500/50 bg-violet-500/10 rounded text-violet-300">Normalization</div>
                    <ArrowRight size={14} />
                    <div className="p-2 border border-dashed border-slate-600 rounded">Context</div>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-slate-300">Playbook Engine (Wasm)</span>
                    </div>
                </div>
            </div>
        )
    },
    3: {
        title: "Forensic-Grade Logging",
        subtitle: "Immutable Chain of Custody",
        description: "A centralized log management system designed for legal defensibility. Using Merkle trees and blockchain concepts to ensure that once a log is written, it cannot be altered without detection.",
        icon: Database,
        color: "emerald",
        technicalDetails: [
            {
                title: "Storage Format",
                content: "Logs are stored in a compressed, columnar format (Parquet-derived) optimized for analytical queries. Each block is cryptographically hashed."
            },
            {
                title: "Immutability",
                content: "A public ledger anchor (Ethereum/Polygon) is optionally used to publish the root hash of the Merkle tree periodically, providing public proof of log integrity."
            },
            {
                title: "Search Performance",
                content: "Full-text search capabilities with sub-second response times on petabytes of data using inverted indices and bloom filters."
            }
        ],
        diagram: (
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 font-mono text-xs text-slate-400">
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <div className="p-2 bg-slate-800 rounded border border-slate-600">Log A</div>
                        <div className="p-2 bg-slate-800 rounded border border-slate-600">Log B</div>
                        <div className="p-2 bg-slate-800 rounded border border-slate-600">Log C</div>
                    </div>
                    <div className="h-4 w-[1px] bg-slate-700 ml-4"></div>
                    <div className="flex gap-4">
                        <div className="p-2 bg-emerald-900/20 border border-emerald-500/30 rounded text-emerald-400">Hash(A)</div>
                        <div className="p-2 bg-emerald-900/20 border border-emerald-500/30 rounded text-emerald-400">Hash(B+C)</div>
                    </div>
                    <div className="h-4 w-[1px] bg-slate-700 ml-8"></div>
                    <div className="p-2 bg-emerald-950 border border-emerald-500 rounded text-emerald-300 w-fit">
                        Merkle Root (Signed)
                    </div>
                </div>
            </div>
        )
    }
};

const TechnicalSpecs = () => {
    const { featureId } = useParams();
    const navigate = useNavigate();
    const spec = specsData[featureId];

    if (!spec) {
        return (
            <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Feature Not Found</h2>
                    <button
                        onClick={() => navigate('/')}
                        className="text-blue-400 hover:text-blue-300 flex items-center gap-2 mx-auto"
                    >
                        <ArrowLeft size={20} /> Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-blue-500/30">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-[#020617]/80 backdrop-blur-lg border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={18} />
                        <span className="font-medium">Back to Platform</span>
                    </button>
                </div>
            </nav>

            <main className="pt-32 pb-20 max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row gap-8 items-start mb-16">
                    <div className={`p-4 rounded-2xl bg-${spec.color}-500/10 border border-${spec.color}-500/20 shadow-[0_0_40px_-10px_rgba(var(--${spec.color}-500-rgb),0.3)]`}>
                        <spec.icon size={48} className={`text-${spec.color}-400`} />
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{spec.title}</h1>
                        <p className={`text-xl font-mono text-${spec.color}-400 mb-6`}>// {spec.subtitle}</p>
                        <p className="text-lg text-slate-400 max-w-3xl leading-relaxed">
                            {spec.description}
                        </p>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left: Technical Highlights */}
                    <div className="lg:col-span-2 space-y-12">
                        <section>
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Code size={24} className="text-blue-400" />
                                Technical Implementations
                            </h2>
                            <div className="grid gap-6">
                                {spec.technicalDetails.map((detail, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        viewport={{ once: true }}
                                        className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors"
                                    >
                                        <h3 className="text-lg font-semibold text-white mb-3">{detail.title}</h3>
                                        <p className="text-slate-400 leading-relaxed">{detail.content}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Cpu size={24} className="text-violet-400" />
                                System Architecture
                            </h2>
                            <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm">
                                {spec.diagram}
                                <p className="text-slate-500 text-sm mt-4 text-center italic">
                                    Simplified architectural view of the {spec.title} module.
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* Right: Specs Sidebar */}
                    <div className="space-y-8">
                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">System Requirements</h3>
                            <ul className="space-y-3 text-sm text-slate-300">
                                <li className="flex justify-between border-b border-slate-800 pb-2">
                                    <span>CPU Cores</span>
                                    <span className="font-mono text-white">8+ vCPU</span>
                                </li>
                                <li className="flex justify-between border-b border-slate-800 pb-2">
                                    <span>Memory</span>
                                    <span className="font-mono text-white">32GB DDR4</span>
                                </li>
                                <li className="flex justify-between border-b border-slate-800 pb-2">
                                    <span>Storage</span>
                                    <span className="font-mono text-white">NVMe SSD</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Network</span>
                                    <span className="font-mono text-white">10GbE</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/20 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-white mb-2">Enterprise Ready</h3>
                            <p className="text-sm text-slate-400 mb-4">
                                This module is available in our Enterprise Security Standard plan.
                            </p>
                            <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-colors">
                                Request Demo
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TechnicalSpecs;
