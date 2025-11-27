import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-950">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] opacity-50 mix-blend-screen"></div>
        <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] opacity-30"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center z-10">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-8 animate-fade-in uppercase tracking-wider">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          AI Threat Engine v2.0 Live
        </div>

        {/* Main Title */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
          Secure Your Infrastructure <br className="hidden md:block" />
          With <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Intelligent Defense</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 max-w-2xl text-lg md:text-xl text-slate-400 mb-10 leading-relaxed">
          The world's most advanced real-time threat detection system. 
          Monitor network traffic, detect zero-day anomalies, and automate remediation instantly.
        </p>

        {/* CTA Buttons (Only Start Free Trial) */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link to="/register">
            <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-950 font-bold rounded-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/5 hover:scale-105">
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>

        {/* Tech Stack / Social Proof */}
        <div className="mt-20 pt-10 border-t border-slate-800/60 w-full max-w-4xl">
          <p className="text-slate-500 text-sm font-medium mb-6 uppercase tracking-widest">Trusted by Security Teams at</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="text-xl font-bold text-white">Acme Corp</span>
            <span className="text-xl font-bold text-white">GlobalBank</span>
            <span className="text-xl font-bold text-white">TechFlow</span>
            <span className="text-xl font-bold text-white">SecureNet</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
