import React, { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Terminal, Globe, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import gsap from 'gsap';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState('idle'); // idle, sending, sent
    const sectionRef = useRef(null);
    const formRef = useRef(null);
    const globeRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {

            // 1. Entrance Animation
            const tl = gsap.timeline();
            tl.from(".contact-reveal", {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out"
            })
                .from(formRef.current, {
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    ease: "back.out(1.2)"
                }, "-=0.4");

            // 2. Globe Rotation
            gsap.to(globeRef.current, {
                rotation: 360,
                duration: 60,
                repeat: -1,
                ease: "linear"
            });

            // 3. Floating Icons Animation
            gsap.to(".float-icon", {
                y: -10,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                stagger: { each: 0.5, from: "random" }
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('sending');

        // Simulate API call
        setTimeout(() => {
            setStatus('sent');
            // Reset form after delay
            setTimeout(() => {
                setStatus('idle');
                setFormData({ name: '', email: '', subject: '', message: '' });
            }, 3000);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-blue-500/30 overflow-hidden">
            <Navbar />

            <section ref={sectionRef} className="relative pt-32 pb-20 lg:pt-48 lg:pb-32">

                {/* --- BACKGROUND (Unified Grid) --- */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-indigo-900/10 blur-[120px] rounded-full"></div>
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">

                        {/* --- LEFT COLUMN: Context & Info --- */}
                        <div className="lg:col-span-5 flex flex-col justify-center">

                            <div className="contact-reveal inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-bold mb-8 uppercase tracking-wider w-fit">
                                <MessageSquare size={12} className="fill-current" />
                                24/7 Global Support
                            </div>

                            <h1 className="contact-reveal text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                                Secure Your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                                    Infrastructure.
                                </span>
                            </h1>

                            <p className="contact-reveal text-lg text-slate-400 mb-12 leading-relaxed">
                                Whether you need a custom enterprise audit, API integration support, or just want to chat about zero-day threats, our team is online.
                            </p>

                            {/* Contact Cards */}
                            <div className="contact-reveal space-y-6">
                                {[
                                    { icon: Mail, title: "Email Us", info: "support@cybersentinels.io", sub: "Response < 2 hours" },
                                    { icon: Phone, title: "Emergency Line", info: "+1 (888) 99-CYBER", sub: "24/7 SOC Access" },
                                    { icon: MapPin, title: "Global HQ", info: "San Francisco, CA", sub: "Silicon Valley" }
                                ].map((item, idx) => (
                                    <div key={idx} className="group flex items-center gap-5 p-4 rounded-2xl border border-transparent hover:border-white/5 hover:bg-white/5 transition-all duration-300">
                                        <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-blue-500 group-hover:scale-110 group-hover:border-blue-500/50 transition-all shadow-lg shadow-black/50">
                                            <item.icon size={22} />
                                        </div>
                                        <div>
                                            <div className="text-white font-bold text-lg">{item.title}</div>
                                            <div className="text-blue-400 font-mono text-sm">{item.info}</div>
                                            <div className="text-slate-500 text-xs mt-0.5">{item.sub}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>

                        {/* --- RIGHT COLUMN: The Interactive Form --- */}
                        <div className="lg:col-span-7 relative">

                            {/* Background Decor (Holo Globe) */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] -z-10 pointer-events-none opacity-30">
                                <div ref={globeRef} className="w-full h-full border border-blue-500/20 rounded-full border-dashed"></div>
                            </div>

                            {/* Floating Icons */}
                            <div className="float-icon absolute -top-10 -right-10 p-3 bg-slate-900/80 backdrop-blur border border-green-500/30 rounded-xl text-green-400 shadow-xl z-20 hidden md:block">
                                <Shield size={24} />
                            </div>
                            <div className="float-icon absolute -bottom-10 -left-10 p-3 bg-slate-900/80 backdrop-blur border border-purple-500/30 rounded-xl text-purple-400 shadow-xl z-20 hidden md:block" style={{ animationDelay: '1s' }}>
                                <Terminal size={24} />
                            </div>

                            <div ref={formRef} className="bg-[#09090b]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">

                                {/* Form Header */}
                                <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
                                    <div className="flex items-center gap-2 text-slate-400 font-mono text-xs uppercase tracking-widest">
                                        <div className={`w-2 h-2 rounded-full ${status === 'sending' ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
                                        {status === 'sending' ? 'Establishing Uplink...' : 'System Online'}
                                    </div>
                                    <Globe size={16} className="text-slate-600" />
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="group space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 group-focus-within:text-blue-400 transition-colors">Identity</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-blue-500 focus:bg-blue-500/5 outline-none transition-all placeholder:text-slate-700"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div className="group space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 group-focus-within:text-blue-400 transition-colors">Comms Channel</label>
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-blue-500 focus:bg-blue-500/5 outline-none transition-all placeholder:text-slate-700"
                                                placeholder="john@company.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="group space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 group-focus-within:text-blue-400 transition-colors">Subject Vector</label>
                                        <select
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-blue-500 focus:bg-blue-500/5 outline-none transition-all appearance-none"
                                        >
                                            <option value="" disabled className="text-slate-700">Select Inquiry Type</option>
                                            <option value="sales" className="bg-slate-900">Enterprise Sales</option>
                                            <option value="support" className="bg-slate-900">Technical Support</option>
                                            <option value="partnership" className="bg-slate-900">Partnership</option>
                                        </select>
                                    </div>

                                    <div className="group space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 group-focus-within:text-blue-400 transition-colors">Transmission Payload</label>
                                        <textarea
                                            rows="4"
                                            required
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-blue-500 focus:bg-blue-500/5 outline-none transition-all resize-none placeholder:text-slate-700"
                                            placeholder="Describe your security needs..."
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={status === 'sending' || status === 'sent'}
                                        className={`w-full font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-3 group relative overflow-hidden ${status === 'sent'
                                                ? 'bg-green-600 text-white cursor-default'
                                                : 'bg-blue-600 hover:bg-blue-500 text-white hover:shadow-blue-500/25'
                                            }`}
                                    >
                                        {/* Button Content */}
                                        <div className="relative z-10 flex items-center gap-2">
                                            {status === 'idle' && (
                                                <>
                                                    <span>Transmit Message</span>
                                                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                </>
                                            )}
                                            {status === 'sending' && (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    <span>Encrypting & Sending...</span>
                                                </>
                                            )}
                                            {status === 'sent' && (
                                                <>
                                                    <CheckCircle2 size={18} />
                                                    <span>Transmission Successful</span>
                                                </>
                                            )}
                                        </div>

                                        {/* Button Hover Glow */}
                                        {status === 'idle' && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/20 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                                        )}
                                    </button>
                                </form>

                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Contact;