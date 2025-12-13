import React, { useEffect, useRef } from "react";
import { Linkedin, Twitter, Github, Shield, Code, Terminal, Fingerprint, Globe, Key, Cpu, ScanFace, Share2 } from "lucide-react";
import gsap from "gsap";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import boy from "../assets/boy.jpg";
import girl1 from "../assets/girl1.jpg";
import girl2 from "../assets/girl2.jpg";

const SOCIAL_LINKS = [
    { icon: Linkedin, href: "#" },
    { icon: Twitter, href: "#" },
    { icon: Github, href: "#" }
];

const teamMembers = [
    {
        id: 1,
        name: "Manish Kumar",
        role: "Chief Executive Officer",
        codeName: "VANGUARD",
        bio: "Visionary leader with a decade of experience in cyber warfare. Pioneering AI-driven threat neutralization strategies.",
        image: boy,
        icon: Shield,
        specialty: "Strategic Defense",
        clearance: "L-5"
    },
    {
        id: 2,
        name: "Ankita Mishra",
        role: "Chief Technology Officer",
        codeName: "ARCHITECT",
        bio: "AI Architect specializing in neural networks for anomaly detection. Leading the autonomous response engine.",
        image: girl1,
        icon: Code,
        specialty: "Neural Networks",
        clearance: "L-4"
    },
    {
        id: 3,
        name: "Amisha Kumar",
        role: "Head of Security Ops",
        codeName: "OPERATOR",
        bio: "Expert in red teaming and penetration testing. Ensuring our systems stay ahead of global threats.",
        image: girl2,
        icon: Terminal,
        specialty: "Red Teaming",
        clearance: "L-4"
    },
];

const MeetTeam = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            // 1. Header Entrance
            tl.from(".team-reveal", {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
                clearProps: "all" // Ensures elements stay visible after animation
            });

            // 2. Card Entrance
            tl.from(".team-card", {
                y: 60,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "back.out(1.2)",
                clearProps: "all"
            }, "-=0.4");

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="min-h-screen bg-[#020617] text-slate-200 font-sans flex flex-col selection:bg-cyan-500/30">

            <Navbar />

            <main className="flex-grow relative pt-32 pb-20 overflow-hidden">

                {/* --- VISIBLE GRID BACKGROUND --- */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Top Spotlight - Increased Brightness */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full"></div>

                    {/* Explicit Cyan Grid - Increased Opacity */}
                    <div className="absolute inset-0"
                        style={{
                            backgroundImage: `linear-gradient(to right, rgba(6, 182, 212, 0.15) 1px, transparent 1px), 
                                     linear-gradient(to bottom, rgba(6, 182, 212, 0.15) 1px, transparent 1px)`,
                            backgroundSize: '4rem 4rem',
                            maskImage: 'radial-gradient(ellipse 80% 80% at 50% 0%, black 40%, transparent 100%)',
                            WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 0%, black 40%, transparent 100%)'
                        }}>
                    </div>

                    {/* Bottom Fade */}
                    <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#020617] to-transparent"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">

                    {/* --- HEADER --- */}
                    <div className="text-center mb-24 max-w-3xl mx-auto">
                        <div className="team-reveal inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-6 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                            <Fingerprint size={14} />
                            Core Leadership
                        </div>

                        <h1 className="team-reveal text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
                            The Minds Behind <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
                                The Machine.
                            </span>
                        </h1>

                        <p className="team-reveal text-lg text-slate-400 leading-relaxed">
                            A collective of white-hat hackers, AI researchers, and defense strategists building the future of autonomous security.
                        </p>
                    </div>

                    {/* --- TEAM GRID --- */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
                        {teamMembers.map((member) => (
                            <div
                                key={member.id}
                                className="team-card group relative bg-[#0f172a] rounded-3xl overflow-hidden border border-slate-800 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(6,182,212,0.3)] flex flex-col"
                            >

                                {/* Image Container (Top) */}
                                <div className="relative h-[400px] w-full overflow-hidden bg-slate-900">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110 opacity-100"
                                    />
                                    {/* Gradient Overlay for Text readability at bottom of image */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-90"></div>

                                    {/* Clearance Badge */}
                                    <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <span className="text-[10px] font-mono font-bold text-slate-300 tracking-wider">{member.clearance} ACCESS</span>
                                    </div>
                                </div>

                                {/* Content Body (Bottom) */}
                                <div className="p-8 relative -mt-12 z-10">
                                    {/* Code Name Tag */}
                                    <div className="inline-flex items-center gap-1.5 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-3">
                                        <ScanFace size={14} />
                                        {member.codeName}
                                    </div>

                                    <h3 className="text-3xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                                        {member.name}
                                    </h3>
                                    <p className="text-slate-400 font-medium text-sm mb-6 border-b border-slate-800 pb-6">
                                        {member.role}
                                    </p>

                                    {/* Description */}
                                    <p className="text-slate-300 text-sm leading-relaxed mb-6">
                                        {member.bio}
                                    </p>

                                    {/* Specs Box */}
                                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 mb-6 flex items-center justify-between group-hover:border-slate-700 transition-colors">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                                <member.icon size={16} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-slate-500 uppercase font-bold">Specialty</span>
                                                <span className="text-xs text-slate-200 font-medium">{member.specialty}</span>
                                            </div>
                                        </div>
                                        <div className="text-slate-600">
                                            <Cpu size={18} />
                                        </div>
                                    </div>

                                    {/* Social Actions */}
                                    <div className="flex items-center gap-3">
                                        {SOCIAL_LINKS.map((social, i) => (
                                            <a
                                                key={i}
                                                href={social.href}
                                                className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:bg-cyan-600 hover:text-white hover:border-cyan-500 transition-all duration-300"
                                            >
                                                <social.icon size={16} />
                                            </a>
                                        ))}
                                        <div className="w-full h-px bg-slate-800 flex-1 mx-2"></div>
                                        <button className="text-xs font-bold text-slate-500 hover:text-white flex items-center gap-1 transition-colors uppercase tracking-wider">
                                            Dossier <Share2 size={12} />
                                        </button>
                                    </div>

                                </div>

                            </div>
                        ))}
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
};

export default MeetTeam;