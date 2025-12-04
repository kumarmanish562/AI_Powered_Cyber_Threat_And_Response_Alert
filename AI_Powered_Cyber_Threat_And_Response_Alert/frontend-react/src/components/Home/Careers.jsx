import React, { useEffect, useRef } from 'react';
import { Briefcase, MapPin, Clock, ArrowRight, Code, Terminal, Cpu, Shield } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const positions = [
    {
        id: 1,
        title: "Senior Security Analyst",
        department: "Threat Intelligence",
        location: "Remote / Bangalore",
        type: "Full-time",
        icon: Shield,
        description: "Lead threat hunting operations and analyze complex security incidents using our proprietary AI tools."
    },
    {
        id: 2,
        title: "AI/ML Engineer",
        department: "Research & Development",
        location: "Hyderabad",
        type: "Full-time",
        icon: Cpu,
        description: "Develop and fine-tune machine learning models for anomaly detection and automated threat response."
    },
    {
        id: 3,
        title: "Frontend Developer (React)",
        department: "Engineering",
        location: "Remote",
        type: "Contract",
        icon: Code,
        description: "Build intuitive and responsive dashboards for our security operations center (SOC) platform."
    },
    {
        id: 4,
        title: "DevSecOps Engineer",
        department: "Infrastructure",
        location: "Pune",
        type: "Full-time",
        icon: Terminal,
        description: "Integrate security best practices into our CI/CD pipelines and manage cloud infrastructure security."
    }
];

const Careers = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero Animation
            gsap.from(".hero-content > *", {
                y: 30,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out"
            });

            // Job Cards Animation
            gsap.from(".job-card", {
                scrollTrigger: {
                    trigger: "#positions",
                    start: "top 80%",
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "back.out(1.7)"
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="min-h-screen bg-[#0b1120] text-slate-300 font-sans selection:bg-blue-500/30">
            <Navbar />

            {/* Hero Section */}
            <div className="relative pt-40 pb-20 px-6 overflow-hidden">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>

                <div className="hero-content max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-500/20 text-blue-400 text-xs font-bold mb-6 uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        We are hiring
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                        Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Cyber Defense</span> Revolution
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        We are looking for passionate problem solvers to help us build the next generation of AI-powered security tools.
                    </p>
                    <a href="#positions" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-1">
                        View Open Positions <ArrowRight size={18} />
                    </a>
                </div>
            </div>

            {/* Positions Grid */}
            <div id="positions" className="max-w-7xl mx-auto px-6 py-20 relative z-10">
                <div className="flex items-center gap-4 mb-12">
                    <div className="h-px flex-1 bg-slate-800"></div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Briefcase className="text-blue-500" /> Open Roles
                    </h2>
                    <div className="h-px flex-1 bg-slate-800"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {positions.map((job) => (
                        <div key={job.id} className="job-card bg-slate-900/50 border border-slate-800 rounded-2xl p-8 hover:border-blue-500/50 hover:bg-slate-900 transition-all group relative overflow-hidden">
                            {/* Hover Glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700 group-hover:border-blue-500/30 transition-colors">
                                            <job.icon className="text-blue-400" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{job.title}</h3>
                                            <p className="text-sm text-blue-500 font-mono mt-1">{job.department}</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-slate-800 rounded-lg text-xs font-mono text-slate-400 border border-slate-700">
                                        {job.type}
                                    </span>
                                </div>

                                <p className="text-slate-400 text-sm mb-8 leading-relaxed border-l-2 border-slate-800 pl-4">
                                    {job.description}
                                </p>

                                <div className="flex items-center justify-between pt-6 border-t border-slate-800/50">
                                    <div className="flex gap-6 text-xs text-slate-500 font-mono">
                                        <span className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-600" /> {job.location}</span>
                                        <span className="flex items-center gap-1.5"><Clock size={14} className="text-slate-600" /> 2 days ago</span>
                                    </div>
                                    <button className="text-sm font-bold text-white hover:text-blue-400 flex items-center gap-2 transition-colors group/btn">
                                        Apply Now <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Careers;
