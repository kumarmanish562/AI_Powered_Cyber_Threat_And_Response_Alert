import React, { useEffect, useRef } from "react";
import { Eye, GitBranch, Database, Shield, Zap, Search, Lock, Activity, CheckCircle, Terminal, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const featuresData = [
  {
    id: 1,
    title: "Deep Packet Inspection",
    subtitle: "X-Ray Vision for Network Traffic",
    description: "We don't just look at headers. Our engine deconstructs every packet payload in real-time, identifying concealed exploits, SQL injections, and zero-day signatures hidden within encrypted traffic streams.",
    icon: Eye,
    color: "cyan",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=2070&auto=format&fit=crop",
    uiType: "scanner"
  },
  {
    id: 2,
    title: "Visual Workflow Automation",
    subtitle: "Orchestrate Response Logic",
    description: "Stop writing custom scripts for every incident. Drag and drop nodes to create complex remediation workflows that trigger instantly. Block IPs, reset credentials, and notify Slack channels automatically.",
    icon: GitBranch,
    color: "violet",
    image: "https://images.unsplash.com/photo-1558494949-efc535b5c47c?q=80&w=2000&auto=format&fit=crop",
    uiType: "nodes"
  },
  {
    id: 3,
    title: "Forensic-Grade Logging",
    subtitle: "Immutable Audit Trails",
    description: "Compliance is baked in. Every event is cryptographically signed and stored in cold storage. Generate SOC2, HIPAA, and GDPR compliance reports with a single click.",
    icon: Database,
    color: "emerald",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
    uiType: "terminal"
  }
];

const Features = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      const featureRows = gsap.utils.toArray(".feature-row");

      featureRows.forEach((row, i) => {
        const textCol = row.querySelector(".feature-text");
        const visualCol = row.querySelector(".feature-visual");
        const image = row.querySelector(".feature-bg-image");
        const uiCard = row.querySelector(".feature-ui-card");

        // 1. Text Entrance (Slide Up)
        gsap.from(textCol, {
          scrollTrigger: {
            trigger: row,
            start: "top 80%",
            toggleActions: "play none none reverse"
          },
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "power3.out"
        });

        // 2. Visual Container (Scale Up)
        gsap.from(visualCol, {
          scrollTrigger: {
            trigger: row,
            start: "top 80%",
            toggleActions: "play none none reverse"
          },
          scale: 0.9,
          opacity: 0,
          duration: 1.2,
          ease: "power2.out",
          delay: 0.1
        });

        // 3. Image Parallax (Scrubbing Effect)
        gsap.fromTo(image,
          { yPercent: -15, scale: 1.1 },
          {
            yPercent: 15,
            scale: 1.1, // Keep scale to avoid edges showing
            ease: "none",
            scrollTrigger: {
              trigger: row,
              start: "top bottom",
              end: "bottom top",
              scrub: true
            }
          }
        );

        // 4. Floating UI Card Entrance (Pop)
        gsap.from(uiCard, {
          scrollTrigger: {
            trigger: row,
            start: "top 65%",
            toggleActions: "play none none reverse"
          },
          y: 60,
          opacity: 0,
          duration: 0.8,
          ease: "back.out(1.2)",
          delay: 0.3
        });
      });

      // Special Internal Animations
      gsap.to(".scanner-line", {
        top: "100%",
        repeat: -1,
        duration: 2.5,
        ease: "power1.inOut",
        yoyo: true
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="features" ref={sectionRef} className="py-32 bg-[#020617] relative overflow-hidden">

      {/* --- 1. Enhanced Grid Background --- */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Glow Spot */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-blue-900/10 blur-[120px] rounded-full"></div>
        {/* Sharp Grid with Mask */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* --- Section Header --- */}
        <div className="text-center mb-40 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-bold mb-6 uppercase tracking-wider">
            <Activity size={12} />
            Core Capabilities
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6">
            Total Visibility. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500">
              Absolute Control.
            </span>
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed">
            The only platform that combines military-grade inspection with consumer-grade usability. Secure your infrastructure without slowing down innovation.
          </p>
        </div>

        {/* --- Features Stack --- */}
        <div className="space-y-40">
          {featuresData.map((feature, index) => (
            <div
              key={feature.id}
              className={`feature-row grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
            >

              {/* --- Text Column --- */}
              <div className={`feature-text ${index % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
                {/* Icon Box */}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border border-${feature.color}-500/20 bg-${feature.color}-500/10 shadow-[0_0_30px_-10px_rgba(var(--${feature.color}-500-rgb),0.3)]`}>
                  <feature.icon size={32} className={`text-${feature.color}-400`} />
                </div>

                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {feature.title}
                </h3>
                <h4 className={`text-lg font-mono mb-6 text-${feature.color}-400 flex items-center gap-2`}>
                  <span className="text-slate-600">//</span> {feature.subtitle}
                </h4>
                <p className="text-slate-400 text-lg leading-relaxed mb-8 border-l-2 border-slate-800 pl-6">
                  {feature.description}
                </p>
                <button className="group text-sm font-bold text-white flex items-center gap-2 hover:text-${feature.color}-400 transition-colors">
                  Explore Documentation
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* --- Visual Column --- */}
              <div className={`feature-visual relative group perspective-1000 ${index % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>

                {/* 1. Main Image Container (Masked) */}
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 bg-slate-900 shadow-2xl">
                  {/* Heavy overlay to ensure text contrast */}
                  <div className="absolute inset-0 bg-[#020617]/70 z-10"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent z-10"></div>

                  {/* The Image (Parallax Target) */}
                  <div className="absolute inset-0 overflow-hidden rounded-3xl">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="feature-bg-image w-full h-[120%] object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-70 transition-all duration-700"
                    />
                  </div>

                  {/* 2. Floating Glass UI Card */}
                  <div className="feature-ui-card absolute inset-0 z-20 flex items-center justify-center p-6 md:p-12">

                    {/* UI TYPE: SCANNER */}
                    {feature.uiType === 'scanner' && (
                      <div className="w-full max-w-sm bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-cyan-900/20">
                        <div className="h-9 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
                          <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div><div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div></div>
                          <span className="text-[10px] text-slate-400 font-mono ml-2 uppercase tracking-wide">packet_stream_04.log</span>
                        </div>
                        <div className="p-5 relative">
                          <div className="scanner-line absolute top-0 left-0 w-full h-[2px] bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.8)] z-10"></div>
                          <div className="space-y-3 font-mono text-[10px] md:text-xs text-slate-300">
                            <div className="flex justify-between border-b border-white/5 pb-2">
                              <span className="text-cyan-400">SRC: 192.168.1.45</span>
                              <span>PORT: 443</span>
                            </div>
                            <div className="opacity-50 space-y-1">
                              <div>0040: 55 48 89 e5 48 83 ec 20</div>
                              <div>0050: eb 12 90 90 90 90 90</div>
                              <div>0060: b8 00 00 00 00 c9 c3</div>
                            </div>
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded mt-2 flex items-center gap-2 text-red-400 animate-pulse">
                              <Shield size={14} /> MALICIOUS PAYLOAD DETECTED
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* UI TYPE: NODES */}
                    {feature.uiType === 'nodes' && (
                      <div className="relative w-full flex flex-col items-center">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-500/20 rounded-full blur-[80px]"></div>

                        <div className="flex items-center gap-2 md:gap-4 relative z-10 w-full justify-center">
                          {/* Node 1 */}
                          <div className="p-4 bg-[#0F172A] border border-slate-700 rounded-xl shadow-xl flex flex-col items-center gap-2 min-w-[80px]">
                            <Activity size={20} className="text-red-400" />
                            <span className="text-[10px] font-bold text-slate-300">Alert</span>
                          </div>

                          {/* Connector */}
                          <div className="w-8 md:w-16 h-[2px] bg-slate-700 relative overflow-hidden rounded-full">
                            <div className="absolute inset-0 bg-violet-500 w-1/2 animate-[shimmer_1.5s_infinite]"></div>
                          </div>

                          {/* Node 2 (Active) */}
                          <div className="p-4 bg-[#0F172A] border border-violet-500 shadow-[0_0_30px_-5px_rgba(139,92,246,0.4)] rounded-xl flex flex-col items-center gap-2 min-w-[100px] scale-110">
                            <Zap size={24} className="text-violet-400" />
                            <span className="text-xs font-bold text-white">Block IP</span>
                          </div>

                          {/* Connector */}
                          <div className="w-8 md:w-16 h-[2px] bg-slate-700"></div>

                          {/* Node 3 */}
                          <div className="p-4 bg-[#0F172A]/50 border border-slate-700 rounded-xl flex flex-col items-center gap-2 opacity-60 min-w-[80px]">
                            <CheckCircle size={20} className="text-slate-400" />
                            <span className="text-[10px] font-bold text-slate-400">Report</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* UI TYPE: TERMINAL */}
                    {feature.uiType === 'terminal' && (
                      <div className="w-full max-w-sm bg-[#020617] border border-emerald-500/20 rounded-xl overflow-hidden shadow-2xl font-mono text-xs">
                        <div className="p-2 bg-emerald-950/30 border-b border-emerald-500/20 flex justify-between items-center px-4">
                          <div className="flex items-center gap-2">
                            <Terminal size={12} className="text-emerald-500" />
                            <span className="text-emerald-500 font-bold">Audit_Log.json</span>
                          </div>
                          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        </div>
                        <div className="p-5 text-emerald-400/80 space-y-2">
                          <div className="flex gap-3 border-l border-emerald-500/20 pl-3">
                            <span className="text-slate-600">10:42:01</span>
                            <span className="text-white">User_Login_Success</span>
                          </div>
                          <div className="flex gap-3 border-l border-emerald-500/20 pl-3">
                            <span className="text-slate-600">10:42:05</span>
                            <span className="text-white">Config_Change_Detected</span>
                          </div>
                          <div className="flex gap-3 border-l-2 border-emerald-500 pl-3 bg-emerald-500/5 py-1">
                            <span className="text-slate-600">10:42:09</span>
                            <span className="text-emerald-300 font-bold">Immutable_Hash_Generated</span>
                          </div>
                          <div className="flex gap-3 border-l border-emerald-500/20 pl-3 opacity-50">
                            <span className="text-slate-600">10:42:12</span>
                            <span>Sync_To_Cold_Storage</span>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                </div>

                {/* Decorative Elements Behind Visual */}
                <div className={`absolute -bottom-10 -right-10 w-48 h-48 bg-${feature.color}-500/10 rounded-full blur-[60px] pointer-events-none`}></div>
                <div className={`absolute -top-10 -left-10 w-32 h-32 bg-${feature.color}-500/10 rounded-full blur-[50px] pointer-events-none`}></div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;