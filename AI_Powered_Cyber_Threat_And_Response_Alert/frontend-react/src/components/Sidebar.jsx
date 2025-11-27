import React from 'react';
import { LayoutDashboard, ShieldAlert, Activity, FileText, Settings, Shield, Search, Network, Zap } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    if (path === '/dashboard' && location.pathname !== '/dashboard') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="w-64 bg-[#0b1120] border-r border-slate-800/60 min-h-screen flex flex-col text-slate-300 font-sans shrink-0 relative overflow-hidden transition-all duration-300 z-50">
      
      {/* Decorative Background Glow */}
      <div className="absolute top-0 left-0 w-full h-64 bg-cyan-500/5 blur-[80px] pointer-events-none"></div>

      {/* Logo Area */}
      <div className="h-20 flex items-center gap-3 px-6 border-b border-slate-800/60 relative z-10 bg-[#0b1120]/50 backdrop-blur-sm">
        <div className="relative group">
          <div className="absolute inset-0 bg-cyan-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative w-10 h-10 bg-gradient-to-br from-cyan-900/50 to-blue-900/50 border border-cyan-500/30 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Shield size={20} className="text-cyan-400" />
          </div>
        </div>
        <div>
          <span className="block text-lg font-bold text-white tracking-tight leading-none">Cyber</span>
          <span className="block text-[11px] font-bold text-cyan-500 tracking-[0.2em] uppercase mt-1">Sentinels</span>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar relative z-10">
        <NavItem 
          to="/dashboard" 
          icon={<LayoutDashboard size={18} />} 
          label="Dashboard" 
          active={isActive('/dashboard')} 
        />
        
        {/* Monitoring Section */}
        <SectionLabel label="Live Monitoring" />
        
        <NavItem 
          to="/threats" 
          icon={<ShieldAlert size={18} />} 
          label="Threat Management" 
          active={isActive('/threats')} 
        />
        <NavItem 
          to="/remediation" 
          icon={<Zap size={18} />} 
          label="Remediation" 
          active={isActive('/remediation')} 
        />
        <NavItem 
          to="/logs" 
          icon={<FileText size={18} />} 
          label="Security Logs" 
          active={isActive('/logs')} 
        />

        {/* Analysis Section */}
        <SectionLabel label="Analysis Tools" />
        
        <NavItem 
          to="/network" 
          icon={<Network size={18} />} 
          label="Network Scan" 
          active={isActive('/network')} 
        />
        <NavItem 
          to="/analysis" 
          icon={<Search size={18} />} 
          label="Log Analysis" 
          active={isActive('/analysis')} 
        />
      </nav>

      {/* Bottom Settings */}
      <div className="p-4 border-t border-slate-800/60 bg-[#0b1120] relative z-10">
        <NavItem 
          to="/settings" 
          icon={<Settings size={18} />} 
          label="System Settings" 
          active={isActive('/settings')} 
        />
      </div>
    </div>
  );
};

// ----- Sub-components -----

const SectionLabel = ({ label }) => (
  <div className="flex items-center px-4 mt-6 mb-2">
    <div className="w-1 h-1 rounded-full bg-slate-700 mr-2"></div>
    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
      {label}
    </p>
  </div>
);

const NavItem = ({ to, icon, label, active }) => (
  <Link 
    to={to} 
    className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative overflow-hidden ${
      active 
        ? 'text-white' 
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
    }`}
  >
    {/* Active Background & Glow */}
    {active && (
      <>
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-100 transition-opacity" />
        <div className="absolute left-0 top-1 bottom-1 w-1 bg-cyan-400 rounded-r-full shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
      </>
    )}
    
    <span className={`relative z-10 transition-colors duration-200 ${active ? 'text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]' : 'group-hover:text-cyan-200'}`}>
      {icon}
    </span>
    <span className="relative z-10 tracking-wide text-[13px]">{label}</span>
  </Link>
);

export default Sidebar;