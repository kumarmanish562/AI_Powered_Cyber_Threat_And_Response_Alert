import React from 'react';
import { Briefcase, MapPin, Clock, ArrowRight } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

const positions = [
    {
        id: 1,
        title: "Senior Security Analyst",
        department: "Threat Intelligence",
        location: "Remote / Bangalore",
        type: "Full-time",
        description: "Lead threat hunting operations and analyze complex security incidents using our proprietary AI tools."
    },
    {
        id: 2,
        title: "AI/ML Engineer",
        department: "Research & Development",
        location: "Hyderabad",
        type: "Full-time",
        description: "Develop and fine-tune machine learning models for anomaly detection and automated threat response."
    },
    {
        id: 3,
        title: "Frontend Developer (React)",
        department: "Engineering",
        location: "Remote",
        type: "Contract",
        description: "Build intuitive and responsive dashboards for our security operations center (SOC) platform."
    },
    {
        id: 4,
        title: "DevSecOps Engineer",
        department: "Infrastructure",
        location: "Pune",
        type: "Full-time",
        description: "Integrate security best practices into our CI/CD pipelines and manage cloud infrastructure security."
    }
];

const Careers = () => {
    return (
        <div className="min-h-screen bg-[#0b1120] text-slate-300 font-sans">
            <Navbar />

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-blue-600/5 pointer-events-none"></div>
                <div className="absolute top-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Cyber Defense</span> Revolution
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
                        We are looking for passionate problem solvers to help us build the next generation of AI-powered security tools.
                    </p>
                    <a href="#positions" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-blue-900/20">
                        View Open Positions <ArrowRight size={18} />
                    </a>
                </div>
            </div>

            {/* Positions Grid */}
            <div id="positions" className="max-w-7xl mx-auto px-6 py-20">
                <h2 className="text-2xl font-bold text-white mb-12 flex items-center gap-3">
                    <Briefcase className="text-cyan-400" /> Open Roles
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {positions.map((job) => (
                        <div key={job.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{job.title}</h3>
                                    <p className="text-sm text-cyan-500 font-medium mt-1">{job.department}</p>
                                </div>
                                <span className="px-3 py-1 bg-slate-800 rounded-full text-xs font-mono text-slate-400 border border-slate-700">
                                    {job.type}
                                </span>
                            </div>

                            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                                {job.description}
                            </p>

                            <div className="flex items-center justify-between border-t border-slate-800 pt-4">
                                <div className="flex gap-4 text-xs text-slate-500">
                                    <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                                    <span className="flex items-center gap-1"><Clock size={14} /> Posted 2 days ago</span>
                                </div>
                                <button className="text-sm font-bold text-white hover:text-blue-400 flex items-center gap-1 transition-colors">
                                    Apply Now <ArrowRight size={14} />
                                </button>
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
