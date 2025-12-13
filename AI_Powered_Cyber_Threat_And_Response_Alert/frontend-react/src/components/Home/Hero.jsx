import React, { useEffect, useRef } from 'react';
import { ArrowRight, Shield, Zap, Activity, Globe, Lock, Cpu, Command } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

const Hero = () => {
  const heroRef = useRef(null);
  const dashboardRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // 1. Initial Reveal
      tl.from(".hero-badge", { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" })
        .from(".hero-title", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.4")
        .from(".hero-desc", { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
        .from(".hero-cta", { y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: "back.out(1.7)" }, "-=0.4")
        .from(".hero-trust", { opacity: 0, duration: 1 }, "-=0.2");

      // 2. Dashboard Entrance (3D Tilt)
      gsap.from(dashboardRef.current, {
        rotationX: 45,
        rotationY: -15,
        scale: 0.8,
        opacity: 0,
        y: 100,
        duration: 1.5,
        ease: "power4.out",
        delay: 0.2
      });

      // 3. Floating Elements Animation
      gsap.to(".floating-card", {
        y: -15,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
          each: 1,
          from: "random"
        }
      });

      // 4. Mouse Parallax Effect
      const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5) * 15;
        const yPos = (clientY / window.innerHeight - 0.5) * 15;

        gsap.to(dashboardRef.current, {
          rotationY: -15 + xPos,
          rotationX: 15 - yPos,
          duration: 1.2,
          ease: "power2.out"
        });
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-[#020617] min-h-screen flex items-center perspective-2000"
    >
      {/* --- UPDATED: Richer Dark Background & Sharper Grid --- */}

      {/* 1. Top Spotlight (Ambient Light) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/15 blur-[120px] rounded-[100%] pointer-events-none"></div>

      {/* 2. The Grid (Sharper, Indigo tinted lines instead of muddy white) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

      {/* 3. Subtle bottom glow for depth */}
      <div className="absolute bottom-0 left-0 right-0 h-[300px] bg-gradient-to-t from-[#020617] via-[#020617]/80 to-transparent pointer-events-none"></div>


      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">

        {/* --- Left Column: Content --- */}
        <div className="z-10 flex flex-col items-start">

          {/* Badge (Updated Colors) */}
          <div className="hero-badge inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono mb-8 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            SYSTEM OPERATIONAL v2.4
          </div>

          {/* Headline (Updated Gradient) */}
          <h1 className="hero-title text-5xl lg:text-7xl font-bold text-white tracking-tight mb-6 leading-[1.1]">
            Security That <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500">
              Never Sleeps.
            </span>
          </h1>

          {/* Description */}
          <p className="hero-desc text-lg text-slate-400 mb-10 max-w-xl leading-relaxed">
            Autonomous threat detection powered by next-gen AI. We identify, isolate, and neutralize cyber threats in milliseconds, not minutes.
          </p>

          {/* CTA Buttons */}
          <div className="hero-cta flex flex-wrap gap-4 w-full sm:w-auto">
            <Link to="/register" className="w-full sm:w-auto">
              <button className="group w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-xl transition-all hover:bg-blue-50 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] flex items-center justify-center gap-2">
                Get Protected <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link to="/api-docs" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white font-medium rounded-xl border border-white/10 hover:bg-white/10 transition-all backdrop-blur-sm flex items-center justify-center gap-2">
                <Command size={18} /> View Documentation
              </button>
            </Link>
          </div>

          {/* Social Proof */}
          <div className="hero-trust mt-12 pt-8 border-t border-white/10 w-full">
            <p className="text-xs text-slate-500 font-mono mb-4 uppercase tracking-widest">Trusted By Engineering Teams At</p>
            <div className="flex gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="h-6 w-24 bg-white/20 rounded animate-pulse"></div>
              <div className="h-6 w-24 bg-white/20 rounded animate-pulse delay-75"></div>
              <div className="h-6 w-24 bg-white/20 rounded animate-pulse delay-150"></div>
            </div>
          </div>
        </div>

        {/* --- Right Column: 3D Interface --- */}
        <div className="relative z-10 perspective-1000 flex justify-center lg:justify-end">

          {/* Main Dashboard Card (Updated BG Color) */}
          <div
            ref={dashboardRef}
            className="relative w-full max-w-[600px] bg-[#09090b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden transform-style-3d rotate-y-[-15deg] rotate-x-[15deg]"
            style={{ boxShadow: '0 0 100px -20px rgba(79, 70, 229, 0.2)' }}
          >
            {/* Window Controls */}
            <div className="h-10 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
              </div>
              <div className="ml-auto flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                <Activity size={10} className="animate-pulse text-green-500" />
                LIVE MONITORING
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="p-6 grid gap-6">

              {/* Metric Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 relative group hover:border-blue-500/30 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <Shield className="text-blue-500" size={20} />
                    <span className="text-xs text-green-400 font-mono">+12%</span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">98.4%</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">Threats Blocked</div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 relative group hover:border-purple-500/30 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <Zap className="text-purple-500" size={20} />
                    <span className="text-xs text-slate-500 font-mono">2ms</span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">0.04s</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">Avg Latency</div>
                </div>
              </div>

              {/* Chart / Activity Visual */}
              <div className="bg-white/5 p-4 rounded-xl border border-white/5 h-48 flex items-end gap-2 relative overflow-hidden group">
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <Globe size={14} className="text-slate-500" />
                  <span className="text-xs text-slate-400">Global Traffic Map</span>
                </div>
                {/* Abstract Bars */}
                {[40, 70, 30, 85, 50, 65, 90, 45, 60, 75, 55, 80].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-blue-600/20 to-blue-500/50 rounded-t-sm hover:from-blue-500/40 hover:to-blue-400/80 transition-all duration-300"
                    style={{ height: `${h}%` }}
                  ></div>
                ))}
              </div>

              {/* Logs / Console */}
              <div className="bg-black/40 p-3 rounded-lg border border-white/5 font-mono text-[10px] text-slate-400 space-y-1">
                <div className="flex gap-2">
                  <span className="text-blue-500">10:42:01</span>
                  <span>System check initiated...</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-blue-500">10:42:05</span>
                  <span className="text-green-400">Secure connection established (TLS 1.3)</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-blue-500">10:42:08</span>
                  <span>Scanning incoming packets [Port 443]</span>
                </div>
              </div>

            </div>

            {/* --- Floating Elements (Absolute to Dashboard) --- */}

            {/* Card 1: Alert */}
            <div className="floating-card absolute -right-6 top-20 bg-slate-900/90 backdrop-blur-xl p-3 rounded-lg border border-red-500/30 shadow-xl flex items-center gap-3 w-48">
              <div className="p-2 bg-red-500/20 rounded-full text-red-500">
                <Lock size={16} />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Attack Blocked</div>
                <div className="text-[10px] text-slate-400">IP: 192.168.0.1 blocked</div>
              </div>
            </div>

            {/* Card 2: Status */}
            <div className="floating-card absolute -left-8 bottom-32 bg-slate-900/90 backdrop-blur-xl p-3 rounded-lg border border-green-500/30 shadow-xl flex items-center gap-3 w-40" style={{ animationDelay: '1s' }}>
              <div className="p-2 bg-green-500/20 rounded-full text-green-500">
                <Cpu size={16} />
              </div>
              <div>
                <div className="text-xs font-bold text-white">System Stable</div>
                <div className="text-[10px] text-slate-400">Load: 24%</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;