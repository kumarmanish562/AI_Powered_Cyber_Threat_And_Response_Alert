import React, { useEffect, useRef } from "react";
import { Lock, Bug, Server, Database, Globe, Shield, Activity, ArrowRight, CheckCircle2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// --- DATA ---
const threats = [
  {
    id: "01",
    title: "Ransomware",
    subtitle: "Encryption Halt",
    description: "Malware that encrypts your critical data and demands payment for the decryption key.",
    mechanics: "Our engine detects the pre-encryption handshake and isolates the infected process before a single file is locked.",
    icon: Lock,
    color: "rose",
    image: "https://plus.unsplash.com/premium_photo-1733317302666-82fb00a68109?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cmFuc29td2FyZXxlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    id: "02",
    title: "Zero-Day Exploits",
    subtitle: "Unknown Vulnerabilities",
    description: "Attacks targeting software vulnerabilities that the vendor is not yet aware of.",
    mechanics: "We don't rely on signatures. We use behavioral heuristics to identify anomalous execution patterns typical of zero-day payloads.",
    icon: Bug,
    color: "amber",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "03",
    title: "Botnet Swarms",
    subtitle: "IoT Compromise",
    description: "Networks of infected devices used to launch coordinated attacks like DDoS.",
    mechanics: "Traffic analysis identifies the command-and-control (C2) signatures, severing the link between the botmaster and the swarm.",
    icon: Server,
    color: "purple",
    image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "04",
    title: "SQL Injection",
    subtitle: "Database Breach",
    description: "Malicious code injected into database queries to manipulate or steal data.",
    mechanics: "Deep packet inspection sanitizes incoming queries in real-time, stripping malicious operators before they reach your database.",
    icon: Database,
    color: "cyan",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop"
  }
];

const ThreatsSection = () => {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".threat-card");

      // Calculate scroll length based on number of cards
      // +=4000 creates a long, slow scroll (approx 10s of user interaction)
      const scrollHeight = "+=4000";

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: scrollHeight,
          pin: true, // Pins the whole section
          scrub: 1,  // Smooth scrubbing
          anticipatePin: 1
        }
      });

      cards.forEach((card, i) => {
        if (i === 0) return; // First card is already visible

        // Animate card entry (Slide Up)
        tl.fromTo(card,
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1, ease: "none" }
        );

        // Animate PREVIOUS card exit (Scale Down & Darken) for depth effect
        if (i > 0) {
          tl.to(cards[i - 1], {
            scale: 0.95,
            opacity: 0.5,
            filter: "blur(5px)",
            duration: 1,
            ease: "none"
          }, "<"); // Run at same time as entry
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-[#020617] text-white relative h-screen overflow-hidden flex flex-col items-center">

      {/* --- BACKGROUND (Masked Grid) --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-900/10 blur-[120px] rounded-full"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>
      </div>

      <div className="w-full h-full max-w-6xl mx-auto px-6 relative z-10 flex flex-col">

        {/* --- Header (Stays visible at top) --- */}
        <div className="pt-12 pb-8 text-center shrink-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono font-bold mb-4 uppercase tracking-wider">
            <Activity size={12} />
            Kill Chain Analysis
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            Threats <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-purple-500">Neutralized</span>
          </h2>
        </div>

        {/* --- CARDS WRAPPER --- */}
        <div ref={wrapperRef} className="relative flex-1 w-full h-full">

          {threats.map((threat, index) => (
            <div
              key={threat.id}
              className="threat-card absolute top-0 left-0 w-full h-[calc(100vh-250px)] md:h-[600px] mt-4"
              style={{ zIndex: index + 1 }} // Ensure proper stacking order
            >
              <div className="w-full h-full bg-[#09090b] rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.8)]">

                {/* Left Column: Text */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center border-r border-white/5 bg-[#09090b] relative z-10">
                  <div className={`w-12 h-12 rounded-xl bg-${threat.color}-500/10 border border-${threat.color}-500/20 flex items-center justify-center mb-6`}>
                    <threat.icon size={24} className={`text-${threat.color}-500`} />
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-3xl font-bold text-white">{threat.title}</h3>
                    <span className="text-xs font-mono text-slate-500 opacity-50">0{index + 1} / 04</span>
                  </div>

                  <div className={`text-sm font-mono text-${threat.color}-400 mb-6 uppercase tracking-widest`}>
                    // {threat.subtitle}
                  </div>

                  <div className="space-y-6">
                    <p className="text-lg text-slate-300 leading-relaxed">{threat.description}</p>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Shield size={12} className="text-green-400" /> Countermeasure
                      </h4>
                      <p className="text-sm text-slate-400 leading-relaxed font-mono">
                        {threat.mechanics}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto pt-8">
                    <div className="flex items-center gap-2 text-sm font-bold text-white group cursor-pointer">
                      <span>Live Simulation</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* Right Column: Visual */}
                <div className="w-full md:w-1/2 relative overflow-hidden bg-black">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 mix-blend-overlay z-10"></div>
                  <img
                    src={threat.image}
                    alt={threat.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-60 hover:scale-105 transition-transform duration-1000 ease-out"
                  />

                  {/* Decorative Scan Lines overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_2px,#000_3px)] bg-[size:100%_4px] opacity-20 pointer-events-none z-20"></div>

                  {/* Mini Status Badge */}
                  <div className="absolute top-6 right-6 z-30 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] font-mono font-bold uppercase">Protection Active</span>
                  </div>
                </div>

              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default ThreatsSection;