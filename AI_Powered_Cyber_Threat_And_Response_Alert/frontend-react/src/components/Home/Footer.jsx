import React, { useState, useEffect, useRef } from 'react';
import { Twitter, Github, Linkedin, Mail, ArrowRight, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const footerRef = useRef(null);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:8000/api/subscribe', { email });
      navigate('/stay-updated');
      setEmail('');
    } catch (error) {
      console.error('Error subscribing:', error);
      alert('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered Entrance Animation
      gsap.from(".footer-content", {
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%", // Start animating when footer is near bottom of viewport
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="bg-[#020617] border-t border-white/5 pt-20 pb-10 relative overflow-hidden">

      {/* --- BACKGROUND (Unified Grid) --- */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Bottom Spotlight */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-900/10 blur-[120px] rounded-t-full"></div>
        {/* Sharp Grid with Mask */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_100%,#000_70%,transparent_100%)] opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20 mb-16">

          {/* --- Brand Column --- */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1 footer-content">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <div className="absolute inset-0 bg-blue-500/20 rounded-lg rotate-3 group-hover:rotate-6 transition-transform duration-300"></div>
                <div className="absolute inset-0 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30 border border-blue-400/50">
                  <Shield className="h-4 w-4 text-white fill-white/20" />
                </div>
              </div>
              <span className="text-xl font-bold text-white tracking-tight leading-none">
                Cyber<span className="text-blue-500">Sentinels</span>_
              </span>
            </Link>

            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              A student-led initiative re-engineering the future of autonomous cyber defense. Open source, AI-driven, and developer-first.
            </p>

            <div className="flex gap-3">
              {[
                { icon: Twitter, href: "#" },
                { icon: Github, href: "#" },
                { icon: Linkedin, href: "#" }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-500 hover:shadow-[0_0_15px_rgba(37,99,235,0.5)] transition-all duration-300 group"
                >
                  <social.icon size={18} className="group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* --- Platform Links --- */}
          <div className="footer-content">
            <h4 className="text-white font-bold mb-6 flex items-center gap-2 text-sm uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_blue]"></span> Platform
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link to="/threats" className="hover:text-blue-400 transition-colors flex items-center gap-2 group w-fit">
                  <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-500" />
                  Live Threat Monitor
                </Link>
              </li>
              <li>
                <Link to="/network" className="hover:text-blue-400 transition-colors flex items-center gap-2 group w-fit">
                  <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-500" />
                  Network Scanner
                </Link>
              </li>
              <li>
                <Link to="/analysis" className="hover:text-blue-400 transition-colors flex items-center gap-2 group w-fit">
                  <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-500" />
                  Log Analysis
                </Link>
              </li>
              <li>
                <Link to="/api-docs" className="hover:text-blue-400 transition-colors flex items-center gap-2 group w-fit">
                  <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-500" />
                  API Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* --- Company Links --- */}
          <div className="footer-content">
            <h4 className="text-white font-bold mb-6 flex items-center gap-2 text-sm uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_10px_cyan]"></span> Company
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <a href="/#about" className="hover:text-cyan-400 transition-colors flex items-center gap-2 group w-fit">
                  <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-cyan-500" />
                  About Us
                </a>
              </li>
              <li>
                <Link to="/careers" className="hover:text-cyan-400 transition-colors flex items-center gap-2 group w-fit">
                  <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-cyan-500" />
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/research" className="hover:text-cyan-400 transition-colors flex items-center gap-2 group w-fit">
                  <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-cyan-500" />
                  Security Research
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-cyan-400 transition-colors flex items-center gap-2 group w-fit">
                  <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-cyan-500" />
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* --- Newsletter Column --- */}
          <div className="footer-content">
            <h4 className="text-white font-bold mb-6 flex items-center gap-2 text-sm uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_emerald]"></span> Stay Updated
            </h4>
            <p className="text-slate-500 text-sm mb-4">Join our developer newsletter for security tips.</p>

            <form onSubmit={handleNewsletterSubmit} className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl opacity-0 group-hover:opacity-20 transition duration-500 blur"></div>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 text-slate-500" size={16} />
                <input
                  type="email"
                  placeholder="developer@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0B1121] border border-white/10 text-white pl-10 pr-12 py-3 rounded-xl text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-700"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-2 p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
                >
                  {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <ArrowRight size={16} />}
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* --- Copyright --- */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-600 text-xs font-mono footer-content">
          <p>© {new Date().getFullYear()} CyberSentinels Project. Open Source License.</p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;