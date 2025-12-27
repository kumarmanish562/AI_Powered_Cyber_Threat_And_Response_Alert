import React, { useEffect, useRef } from 'react';
import { LayoutDashboard, ShieldAlert, Activity, FileText, Settings, Shield, Search, Network, Zap, Book, ChevronRight, PieChart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import gsap from "gsap";
import ThemeToggle from './ThemeToggle';

const Sidebar = () => {
  const location = useLocation();
  const sidebarRef = useRef(null);

  const isActive = (path) => {
    if (path === '/dashboard' && location.pathname !== '/dashboard') return false;
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial Entrance Animation
      gsap.from(".sidebar-item", {
        x: -20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: "power2.out",
        delay: 0.2
      });

      gsap.from(".sidebar-logo", {
        y: -20,
        opacity: 0,
        duration: 0.6,
        ease: "back.out(1.7)"
      });

      gsap.from(".sidebar-bg-glow", {
        opacity: 0,
        duration: 1.5,
        ease: "power2.inOut"
      });

    }, sidebarRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={sidebarRef} className="w-72 bg-slate-50 dark:bg-[#020617] border-r border-slate-200 dark:border-white/5 min-h-screen flex flex-col text-slate-700 dark:text-slate-300 font-sans shrink-0 relative overflow-hidden transition-all duration-300 z-50 shadow-2xl shadow-slate-200/50 dark:shadow-none">

      {/* Decorative Background Glow */}
      <div className="sidebar-bg-glow absolute top-0 left-0 w-full h-96 bg-blue-500/5 dark:bg-blue-900/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute inset-0 dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_0%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>

      {/* Logo Area */}
      <div className="h-24 flex items-center gap-4 px-8 border-b border-slate-200 dark:border-white/5 relative z-10 bg-slate-50/80 dark:bg-[#020617]/80 backdrop-blur-xl">
        <div className="sidebar-logo relative group cursor-pointer">
          <div className="absolute inset-0 bg-blue-500 rounded-xl blur-md opacity-20 group-hover:opacity-50 transition-opacity duration-500"></div>
          <div className="relative w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 border border-blue-400/30 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-900/20 group-hover:scale-105 transition-transform duration-300">
            <Shield size={20} className="fill-white/20" />
          </div>
        </div>
        <div className="sidebar-logo flex flex-col">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-200">
            ThreatWatch AI<span className="font-extralight opacity-80">AI</span>
          </span>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">Command Center</span>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-8 px-4 space-y-1 overflow-y-auto custom-scrollbar relative z-10">
        <div className="sidebar-item">
          <NavItem
            to="/dashboard"
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            active={isActive('/dashboard')}
          />
        </div>

        {/* Monitoring Section */}
        <SectionLabel label="Live Operations" delay={0.1} />

        <div className="space-y-1">
          <div className="sidebar-item"><NavItem to="/threats" icon={<ShieldAlert size={18} />} label="Threat Stream" active={isActive('/threats')} badge="12" /></div>
          <div className="sidebar-item"><NavItem to="/remediation" icon={<Zap size={18} />} label="Auto-Remediation" active={isActive('/remediation')} /></div>
          <div className="sidebar-item"><NavItem to="/logs" icon={<FileText size={18} />} label="Security Logs" active={isActive('/logs')} /></div>
        </div>

        {/* Analysis Section */}
        <SectionLabel label="Deep Analysis" delay={0.2} />

        <div className="space-y-1">
          <div className="sidebar-item"><NavItem to="/network" icon={<Network size={18} />} label="Network Scanner" active={isActive('/network')} /></div>
          <div className="sidebar-item"><NavItem to="/log-analysis" icon={<PieChart size={18} />} label="Log Analysis" active={isActive('/log-analysis')} /></div>
          <div className="sidebar-item"><NavItem to="/analysis" icon={<Search size={18} />} label="Forensics Lab" active={isActive('/analysis')} /></div>
        </div>

        {/* Resources Section */}
        <SectionLabel label="Knowledge Base" delay={0.3} />

        <div className="sidebar-item">
          <NavItem to="/api-docs" icon={<Book size={18} />} label="API Reference" active={isActive('/api-docs')} />
        </div>
      </nav>

      {/* Bottom Settings */}
      <div className="p-4 border-t border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-[#020617]/50 backdrop-blur-md relative z-10 sidebar-item">
        <NavItem
          to="/settings"
          icon={<Settings size={20} />}
          label="System Settings"
          active={isActive('/settings')}
        />
        <div className="mt-4 flex justify-center">
          <ThemeToggle className="w-full bg-slate-200 hover:bg-slate-300 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300" />
        </div>
        <div className="mt-4 px-4 flex items-center justify-between text-[10px] text-slate-600 font-mono uppercase">
          <span>v2.4.0 Stable</span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online
          </div>
        </div>
      </div>
    </div>
  );
};

// ----- Sub-components -----

const SectionLabel = ({ label, delay }) => (
  <div className="sidebar-item flex items-center px-4 mt-8 mb-3 group">
    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300">
      {label}
    </span>
    <div className="ml-3 h-px flex-1 bg-slate-200 dark:bg-slate-800 group-hover:bg-blue-500/30 transition-colors duration-300"></div>
  </div>
);

const NavItem = ({ to, icon, label, active, badge }) => (
  <Link
    to={to}
    className={`group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden ${active
      ? 'text-blue-900 dark:text-white bg-blue-50 dark:bg-white/5 shadow-lg shadow-blue-500/10 dark:shadow-black/20 border border-blue-100 dark:border-white/5'
      : 'text-slate-500 dark:text-slate-400 hover:text-blue-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 hover:border hover:border-slate-200 dark:hover:border-white/5 border border-transparent'
      }`}
  >
    {/* Active Glow Effect */}
    {active && (
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 shadow-[0_0_15px_blue]"></div>
    )}

    <div className="flex items-center gap-3 relative z-10">
      <span className={`transition-colors duration-300 ${active ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'}`}>
        {icon}
      </span>
      <span className="tracking-wide">{label}</span>
    </div>

    {/* Right Side Indicators */}
    <div className="flex items-center gap-2">
      {badge && (
        <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-bold border border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.2)]">
          {badge}
        </span>
      )}
      {active && <ChevronRight size={14} className="text-blue-500 opacity-80" />}
    </div>

    {/* Hover Background Gradient */}
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
  </Link>
);

export default Sidebar;