import React from 'react';
import { ArrowRight, TrendingUp } from 'lucide-react';

const StatCard = ({ title, count, icon, colorClass }) => {
  // Helper to extract the color name (e.g., "rose-500") from "text-rose-500"
  // This allows us to use it for backgrounds/borders dynamically
  const bgClass = colorClass.replace('text-', 'bg-');
  const borderClass = colorClass.replace('text-', 'border-');

  return (
    <div className="group relative bg-[#151f32]/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-800/60 transition-all duration-300 hover:border-slate-600 hover:-translate-y-1 hover:shadow-2xl overflow-hidden">
      
      {/* 1. Ambient Background Glow (Dynamic Color) */}
      <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-5 blur-3xl transition-opacity duration-500 group-hover:opacity-15 ${bgClass}`}></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.1em] mb-2 flex items-center gap-2">
              {title}
            </h3>
            <div className="flex items-baseline gap-2">
              {/* Main Number with subtle glow */}
              <span className={`text-4xl font-extrabold tracking-tight ${colorClass} drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]`}>
                {count}
              </span>
            </div>
          </div>

          {/* Icon Container with Glass effect */}
          <div className={`p-3 rounded-xl bg-opacity-10 border border-opacity-20 backdrop-blur-md shadow-inner transition-transform group-hover:scale-110 ${bgClass} ${borderClass}`}>
            {React.cloneElement(icon, { size: 24, strokeWidth: 2 })}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 my-3"></div>

        {/* Bottom Action Area */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
            <TrendingUp size={12} className={colorClass} />
            <span className="text-[10px] font-mono text-slate-400 uppercase">Real-time Data</span>
          </div>

          <button className={`group/btn flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-white transition-colors`}>
            Details 
            <ArrowRight size={14} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatCard;