import React from "react";
import { Zap, Shield, Eye, FileCode, Lock, Globe, Server, Activity } from "lucide-react";

const featuresList = [
  {
    icon: <Zap className="w-6 h-6 text-cyan-400" />,
    title: "Instant Remediation",
    desc: "AI executes pre-approved containment scripts the moment a high-severity threat is detected."
  },
  {
    icon: <Eye className="w-6 h-6 text-blue-400" />,
    title: "Deep Packet Inspection",
    desc: "Analyzes traffic behavior to identify sophisticated SQL injections and XSS attacks."
  },
  {
    icon: <Shield className="w-6 h-6 text-purple-400" />,
    title: "Zero-Day Protection",
    desc: "Behavioral analysis detects unknown attack vectors before they cause damage."
  },
  {
    icon: <FileCode className="w-6 h-6 text-emerald-400" />,
    title: "Forensic Reporting",
    desc: "Generates detailed logs and root-cause analysis for compliance and auditing."
  },
  {
    icon: <Lock className="w-6 h-6 text-rose-400" />,
    title: "Encrypted Logs",
    desc: "All security logs are encrypted at rest and in transit using AES-256 standards."
  },
  {
    icon: <Activity className="w-6 h-6 text-orange-400" />,
    title: "Real-Time Monitoring",
    desc: "Live dashboards update continuously via WebSocket connections for instant visibility."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-slate-950 relative">
      {/* Decorative background element */}
      <div className="absolute left-0 top-1/4 w-1/2 h-1/2 bg-blue-900/5 blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        <div className="text-center mb-20 max-w-3xl mx-auto">
          <h2 className="text-blue-500 font-semibold tracking-wide uppercase text-sm mb-3">Capabilities</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-6">
            Engineered for Modern Cyber Defense
          </h3>
          <p className="text-lg text-slate-400">
            Gain full-spectrum visibility across your entire digital infrastructure with tools built for speed and accuracy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresList.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-900/10"
            >
              <div className="w-14 h-14 flex items-center justify-center bg-slate-800 border border-slate-700 rounded-xl mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                {feature.title}
              </h3>

              <p className="text-slate-400 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;