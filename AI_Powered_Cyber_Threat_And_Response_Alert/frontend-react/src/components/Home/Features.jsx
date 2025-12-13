import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Eye, GitBranch, Database, Shield, Zap, CheckCircle, Terminal, ArrowRight, X, Activity } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const featuresData = [
  {
    id: 1,
    title: "Deep Packet Inspection",
    subtitle: "Advanced Traffic Analysis",
    description:
      "Our system examines network traffic in real time to detect harmful activity. It looks deeper than basic firewalls and helps identify risks before they become threats.",
    icon: Eye,
    color: "cyan",
    image:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=2070&auto=format&fit=crop",
    uiType: "scanner",
    detailedContent: (
      <div className="space-y-4">
        <p className="text-slate-300 leading-relaxed">
          Deep Packet Inspection (DPI) gives a clear view of what is happening inside your network traffic. Instead of analyzing only packet headers, it checks the full data content to spot unusual or unsafe patterns.
        </p>
        <ul className="space-y-2 text-slate-400">
          <li className="flex items-start gap-2">
            <CheckCircle size={16} className="text-cyan-400 mt-1" />
            <span>
              <strong>Protocol Checking:</strong> Detects when traffic does not match normal usage patterns.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle size={16} className="text-cyan-400 mt-1" />
            <span>
              <strong>Known Threat Detection:</strong> Compares data with a large database of common security threats.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle size={16} className="text-cyan-400 mt-1" />
            <span>
              <strong>Encrypted Traffic Monitoring:</strong> Identifies suspicious behavior in encrypted data streams.
            </span>
          </li>
        </ul>
      </div>
    )
  },

  {
    id: 2,
    title: "Visual Workflow Automation",
    subtitle: "Simple Incident Response",
    description:
      "Create automated workflows using an easy drag-and-drop interface. No coding needed. Set triggers and actions to respond instantly to security events.",
    icon: GitBranch,
    color: "violet",
    image:
      "https://images.unsplash.com/photo-1558494949-efc535b5c47c?q=80&w=2000&auto=format&fit=crop",
    uiType: "nodes",
    detailedContent: (
      <div className="space-y-4">
        <p className="text-slate-300 leading-relaxed">
          Visual automation makes it easy to handle security incidents quickly. Build step-by-step response processes with simple blocks rather than writing scripts.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
            <h4 className="text-violet-400 font-bold mb-2 text-sm">
              Triggers
            </h4>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• New security alert</li>
              <li>• Too many failed logins</li>
              <li>• Unusual data flow</li>
            </ul>
          </div>

          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
            <h4 className="text-violet-400 font-bold mb-2 text-sm">
              Actions
            </h4>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• Block suspicious IP</li>
              <li>• Disconnect affected device</li>
              <li>• Send alert to team</li>
            </ul>
          </div>
        </div>
      </div>
    )
  },

  {
    id: 3,
    title: "Forensic-Grade Logging",
    subtitle: "Secure Audit Records",
    description:
      "All logs are stored safely and cannot be modified. Generate compliance-ready reports and maintain clear records of system activity.",
    icon: Database,
    color: "emerald",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
    uiType: "terminal",
    detailedContent: (
      <div className="space-y-4">
        <p className="text-slate-300 leading-relaxed">
          Our logging system ensures every activity is recorded securely. Each entry is stored in a way that prevents tampering, giving you a reliable audit trail.
        </p>
        <ul className="space-y-2 text-slate-400">
          <li className="flex items-start gap-2">
            <CheckCircle size={16} className="text-emerald-400 mt-1" />
            <span>
              <strong>Compliance:</strong> Easy reporting for security standards such as SOC2 and GDPR.
            </span>
          </li>

          <li className="flex items-start gap-2">
            <CheckCircle size={16} className="text-emerald-400 mt-1" />
            <span>
              <strong>Long-Term Storage:</strong> Records can be kept for years without risk of loss.
            </span>
          </li>

          <li className="flex items-start gap-2">
            <CheckCircle size={16} className="text-emerald-400 mt-1" />
            <span>
              <strong>Audit Tracking:</strong> See who accessed logs, when, and what actions they performed.
            </span>
          </li>
        </ul>
      </div>
    )
  }
];


const Features = () => {
  const sectionRef = useRef(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const navigate = useNavigate();

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
            The only platform that combines AI inspection with consumer-grade usability. Secure your infrastructure without slowing down innovation.
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
                <button
                  onClick={() => setSelectedFeature(feature)}
                  className={`group text-sm font-bold text-white flex items-center gap-2 hover:text-${feature.color}-400 transition-colors cursor-pointer`}
                >
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

        {/* --- Feature Detail Modal --- */}
        <AnimatePresence>
          {selectedFeature && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              onClick={() => setSelectedFeature(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-[#0f172a] w-full max-w-2xl rounded-2xl border border-slate-700 shadow-2xl overflow-hidden relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-slate-800 flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg bg-${selectedFeature.color}-500/10 border border-${selectedFeature.color}-500/20 text-${selectedFeature.color}-400`}>
                      <selectedFeature.icon size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">{selectedFeature.title}</h3>
                      <p className={`text-sm font-mono text-${selectedFeature.color}-400 uppercase tracking-wider`}>
                        {selectedFeature.subtitle}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedFeature(null)}
                    className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-8">
                  {selectedFeature.detailedContent}
                </div>

                {/* Modal Footer */}
                <div className="p-6 bg-slate-950/50 border-t border-slate-800 flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedFeature(null)}
                    className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => navigate(`/technical-specs/${selectedFeature.id}`)}
                    className={`px-4 py-2 text-sm font-bold bg-${selectedFeature.color}-600 hover:bg-${selectedFeature.color}-500 text-white rounded-lg transition-colors flex items-center gap-2`}
                  >
                    Full Technical Specs <ArrowRight size={16} />
                  </button>
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};

export default Features;

