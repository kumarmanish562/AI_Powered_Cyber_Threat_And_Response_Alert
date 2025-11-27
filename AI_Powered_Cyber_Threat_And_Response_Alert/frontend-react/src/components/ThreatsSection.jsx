import React from "react";
import { ShieldAlert, Lock, Bug, Radio, Server, Database } from "lucide-react";

const threats = [
  {
    id: 1,
    icon: <ShieldAlert className="w-8 h-8 text-rose-500" />,
    title: "Ransomware",
    description: "Detects encryption behaviors and mass-file modifications instantly to stop ransomware before it locks your data.",
    glowColor: "bg-rose-500"
  },
  {
    id: 2,
    icon: <Bug className="w-8 h-8 text-amber-500" />,
    title: "Zero-Day Exploits",
    description: "Behavioral analysis identifies attacks that have never been seen before, protecting you from unknown vulnerabilities.",
    glowColor: "bg-amber-500"
  },
  {
    id: 3,
    icon: <Radio className="w-8 h-8 text-purple-500" />,
    title: "IoT Botnets",
    description: "Monitors traffic patterns to identify compromised IoT devices attempting to communicate with Command & Control servers.",
    glowColor: "bg-purple-500"
  },
  {
    id: 4,
    icon: <Lock className="w-8 h-8 text-blue-500" />,
    title: "Credential Stuffing",
    description: "Identifies and blocks automated login attempts using stolen credentials across your authentication endpoints.",
    glowColor: "bg-blue-500"
  },
  {
    id: 5,
    icon: <Server className="w-8 h-8 text-emerald-500" />,
    title: "DDoS Attacks",
    description: "Mitigates volumetric and application-layer attacks in real-time to ensure your services stay online.",
    glowColor: "bg-emerald-500"
  },
  {
    id: 6,
    icon: <Database className="w-8 h-8 text-cyan-500" />,
    title: "SQL Injection",
    description: "Deep packet inspection filters malicious SQL queries to prevent unauthorized database access and data leaks.",
    glowColor: "bg-cyan-500"
  }
];

const ThreatsSection = () => {
  return (
    <section id="threats" className="py-24 bg-[#0b1120] relative overflow-hidden">
      {/* Background Elements - Ambient Glow */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-900/10 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4 animate-fade-in">
             <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
             Threat Coverage
          </div>
          <h3 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
            We Stop What Others Miss
          </h3>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Our AI engine is trained on millions of attack vectors to recognize and neutralize threats across the entire kill chain in <span className="text-cyan-400 font-semibold">real-time</span>.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {threats.map((threat) => (
            <div 
              key={threat.id}
              className="group relative bg-[#151f32]/80 backdrop-blur-sm border border-slate-800/60 p-8 rounded-2xl hover:border-slate-600 hover:bg-[#1e293b] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-900/10 overflow-hidden"
            >
              {/* Card Internal Glow (Top Right) */}
              <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-500 ${threat.glowColor}`}></div>
              
              <div className="relative z-10">
                {/* Icon Container */}
                <div className="mb-6 p-4 bg-[#0f172a] rounded-xl inline-flex items-center justify-center border border-slate-700/50 group-hover:scale-110 group-hover:border-slate-600 transition-all duration-300 shadow-lg relative">
                  {/* Icon Glow */}
                  <div className={`absolute inset-0 opacity-20 blur-md rounded-xl ${threat.glowColor}`}></div>
                  <div className="relative">
                    {threat.icon}
                  </div>
                </div>
                
                <h4 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                  {threat.title}
                </h4>
                
                <p className="text-slate-400 leading-relaxed text-sm">
                  {threat.description}
                </p>
              </div>

              {/* Decorative Tech Accent (Bottom Right) */}
              <div className="absolute bottom-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-2 group-hover:translate-y-0">
                  <div className={`w-1 h-1 rounded-full ${threat.glowColor.replace('bg-', 'bg-')}`}></div>
                  <div className={`w-1 h-1 rounded-full ${threat.glowColor.replace('bg-', 'bg-')} opacity-50`}></div>
                  <div className={`w-1 h-1 rounded-full ${threat.glowColor.replace('bg-', 'bg-')} opacity-25`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThreatsSection;