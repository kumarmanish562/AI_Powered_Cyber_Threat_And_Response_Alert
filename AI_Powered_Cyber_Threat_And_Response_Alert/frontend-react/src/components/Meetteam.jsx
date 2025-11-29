import React from "react";
import { ArrowLeft, Linkedin, Twitter, Github } from "lucide-react";
import { Link } from "react-router-dom";

const teamMembers = [
    {
        name: "Alex Mercer",
        role: "Chief Executive Officer",
        bio: "Ex-NSA cybersecurity analyst with 15+ years of experience in threat intelligence and network defense.",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
    },
    {
        name: "Sarah Connor",
        role: "CTO & Lead AI Architect",
        bio: "PhD in Machine Learning from MIT. Specialist in adversarial AI and automated defense systems.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    },
    {
        name: "David Chen",
        role: "Head of Security Operations",
        bio: "Former Red Team leader for a Fortune 500 bank. Expert in penetration testing and incident response.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
    },
    {
        name: "Emily Rodriguez",
        role: "Senior Threat Researcher",
        bio: "Specializes in malware analysis and reverse engineering. Contributor to multiple open-source security tools.",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
    },
];

const Meetteam = () => {
    return (
        <div className="min-h-screen bg-[#0b1120] text-slate-200 font-sans selection:bg-blue-500 selection:text-white">
            {/* Header / Nav */}
            <nav className="p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-semibold">
                        <ArrowLeft className="w-5 h-5" />
                        Back to Home
                    </Link>
                    <h1 className="text-xl font-bold text-white tracking-wide">CyberSentinels Team</h1>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-16">
                <div className="text-center mb-16">
                    <h2 className="text-blue-500 font-bold uppercase tracking-wide text-sm mb-3">Our Experts</h2>
                    <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                        Meet the Minds Behind the Defense
                    </h3>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        We are a diverse team of security veterans, data scientists, and engineers united by a single mission: to secure the digital future.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {teamMembers.map((member, index) => (
                        <div key={index} className="group relative bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                            {/* Image */}
                            <div className="aspect-[4/5] overflow-hidden">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                            </div>

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                <h4 className="text-xl font-bold text-white mb-1">{member.name}</h4>
                                <p className="text-blue-400 text-sm font-medium mb-3">{member.role}</p>
                                <p className="text-slate-300 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 mb-4">
                                    {member.bio}
                                </p>

                                {/* Social Links */}
                                <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                    <a href="#" className="text-slate-400 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
                                    <a href="#" className="text-slate-400 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
                                    <a href="#" className="text-slate-400 hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Meetteam;
