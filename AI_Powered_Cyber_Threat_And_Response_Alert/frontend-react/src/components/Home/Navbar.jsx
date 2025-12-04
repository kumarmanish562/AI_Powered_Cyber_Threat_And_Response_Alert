import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronRight, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);
  const menuRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    // Initial Entrance Animation
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from(".nav-brand", {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      })
        .from(".nav-link", {
          y: -20,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out"
        }, "-=0.6")
        .from(".nav-cta", {
          scale: 0.9,
          opacity: 0,
          duration: 0.6,
          ease: "back.out(1.7)"
        }, "-=0.4");

    }, navRef);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      ctx.revert();
    };
  }, []);

  // Mobile Menu Animation
  useEffect(() => {
    if (isOpen) {
      gsap.to(menuRef.current, {
        height: "auto",
        opacity: 1,
        duration: 0.4,
        ease: "power3.out"
      });
    } else {
      gsap.to(menuRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power3.in"
      });
    }
  }, [isOpen]);

  // Updated Navigation Links
  const navLinks = [
    { name: 'Features', path: '/#features' },
    { name: 'About', path: '/#about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled
        ? 'bg-[#050505]/80 backdrop-blur-xl border-b border-white/10 py-3 shadow-lg shadow-blue-900/5'
        : 'bg-transparent border-b border-transparent py-6'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* --- Brand Logo --- */}
          <Link to="/" className="nav-brand flex items-center gap-3 group">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-500/20 rounded-xl rotate-3 group-hover:rotate-6 transition-transform duration-300"></div>
              <div className="absolute inset-0 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 border border-blue-400/50">
                <Shield className="h-5 w-5 text-white fill-white/20" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white tracking-tight leading-none">
                Cyber<span className="text-blue-500">Sentinels</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest leading-none mt-1">
                Security Ops
              </span>
            </div>
          </Link>

          {/* --- Desktop Links --- */}
          <div className="hidden md:flex items-center bg-white/5 rounded-full px-2 py-1 border border-white/5 backdrop-blur-md">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                className="nav-link relative px-5 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors group"
              >
                <span className="relative z-10">{link.name}</span>
                {/* Hover Glow Pill */}
                <span className="absolute inset-0 bg-white/10 rounded-full scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out -z-0"></span>
              </a>
            ))}
          </div>

          {/* --- CTA (Log in removed) --- */}
          <div className="hidden md:flex items-center gap-6 nav-cta">
            <Link to="/register">
              <button className="group relative px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-bold rounded-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <div className="relative flex items-center gap-2">
                  <span>Get Access</span>
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </Link>
          </div>

          {/* --- Mobile Toggle --- */}
          <div className="md:hidden nav-cta">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- Mobile Menu --- */}
      <div
        ref={menuRef}
        className="md:hidden absolute top-full left-0 w-full bg-[#050505] border-b border-white/10 overflow-hidden h-0 opacity-0"
      >
        <div className="px-6 py-8 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.path}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between p-3 text-lg font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
              {link.name}
              <ChevronRight size={16} className="opacity-50" />
            </a>
          ))}
          <div className="h-px bg-white/10 my-4"></div>
          <div className="grid gap-3">
            <Link to="/register" onClick={() => setIsOpen(false)}>
              <button className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-colors">
                Get Access
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;