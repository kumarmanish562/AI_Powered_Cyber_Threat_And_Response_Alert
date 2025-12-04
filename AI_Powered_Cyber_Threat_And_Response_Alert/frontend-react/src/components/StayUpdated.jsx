import React, { useEffect, useRef } from "react";
import { ArrowLeft, CheckCircle, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import gsap from "gsap";

const StayUpdated = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            tl.from(".success-icon", {
                scale: 0,
                rotate: -180,
                opacity: 0,
                duration: 0.8,
                ease: "back.out(1.7)"
            })
                .from(".success-content", {
                    y: 30,
                    opacity: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power3.out"
                }, "-=0.4")
                .from(".success-card", {
                    scale: 0.9,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power3.out"
                }, "-=0.6");

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-cyan-500/30 flex flex-col overflow-hidden relative">

            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-emerald-900/10 blur-[120px] rounded-full"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>
            </div>

            {/* Header */}
            <nav className="p-8 border-b border-white/5 bg-[#020617]/80 backdrop-blur-md sticky top-0 z-50 shrink-0">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-medium group">
                        <div className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/50 group-hover:bg-slate-800 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        Back to Home
                    </Link>
                </div>
            </nav>

            {/* Content */}
            <main className="flex-grow flex items-center justify-center p-6 relative z-10">
                <div className="success-card max-w-md w-full bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 text-center shadow-2xl shadow-emerald-900/10 relative overflow-hidden">

                    {/* Decorative Top Gradient */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500"></div>

                    <div className="success-icon w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)] relative">
                        <div className="absolute inset-0 bg-emerald-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
                        <CheckCircle className="w-10 h-10 text-emerald-400 relative z-10" />
                    </div>

                    <div className="success-content">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                            <Sparkles size={12} /> Confirmed
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">You're Subscribed!</h1>
                        <p className="text-slate-400 mb-10 leading-relaxed text-sm md:text-base">
                            Thank you for joining our secure network. You will now receive critical threat intelligence and system updates directly to your inbox.
                        </p>

                        <div className="bg-[#020617]/50 rounded-xl p-5 border border-slate-800/60 flex items-start gap-4 mb-10 text-left relative overflow-hidden group hover:border-slate-700 transition-colors">
                            <div className="p-2.5 bg-blue-600/10 rounded-lg text-blue-400 shrink-0 border border-blue-500/20">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-white text-sm font-bold mb-1 group-hover:text-blue-400 transition-colors">Check your email</p>
                                <p className="text-slate-500 text-xs leading-relaxed">We've sent a confirmation link to verify your subscription preferences.</p>
                            </div>
                        </div>

                        <Link
                            to="/dashboard"
                            className="block w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/40 hover:-translate-y-0.5 active:translate-y-0 text-sm flex items-center justify-center gap-2"
                        >
                            <ShieldCheck size={18} /> Return to Dashboard
                        </Link>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default StayUpdated;