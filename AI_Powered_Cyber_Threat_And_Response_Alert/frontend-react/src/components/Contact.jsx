import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [sent, setSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate form submission
        setSent(true);
        setTimeout(() => setSent(false), 3000);
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="min-h-screen bg-[#0b1120] text-slate-300 font-sans">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                    {/* Contact Info */}
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-6">Get in Touch</h1>
                        <p className="text-lg text-slate-400 mb-10 leading-relaxed">
                            Have questions about our platform or need a custom enterprise solution? Our team is ready to help you secure your infrastructure.
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center shrink-0">
                                    <Mail className="text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg">Email Us</h3>
                                    <p className="text-slate-400">support@cybersentinels.com</p>
                                    <p className="text-slate-400">sales@cybersentinels.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center shrink-0">
                                    <Phone className="text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg">Call Us</h3>
                                    <p className="text-slate-400">+91 (800) 123-4567</p>
                                    <p className="text-slate-500 text-sm mt-1">Mon-Fri from 9am to 6pm IST</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center shrink-0">
                                    <MapPin className="text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg">Visit Us</h3>
                                    <p className="text-slate-400">CyberSentinels HQ</p>
                                    <p className="text-slate-400">Tech Park, Sector 5</p>
                                    <p className="text-slate-400">Bangalore, Karnataka 560103</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
                        <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-2">Subject</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
                                    placeholder="How can we help?"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-2">Message</label>
                                <textarea
                                    rows="4"
                                    required
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors resize-none"
                                    placeholder="Tell us more about your inquiry..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-lg transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                {sent ? 'Message Sent!' : <><Send size={18} /> Send Message</>}
                            </button>
                        </form>
                    </div>

                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Contact;
