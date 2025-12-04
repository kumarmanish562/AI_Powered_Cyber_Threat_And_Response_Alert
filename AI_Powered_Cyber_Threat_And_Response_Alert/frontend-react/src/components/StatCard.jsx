import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, TrendingUp } from 'lucide-react';
import StatDetailsModal from './StatDetailsModal';
import gsap from "gsap";

const StatCard = ({ title, count, icon, colorClass, borderColor }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cardRef = useRef(null);

  // Helper to extract the color name (e.g., "rose-500") from "text-rose-500"
  // This allows us to use it for backgrounds/borders dynamically
  const bgClass = colorClass ? colorClass.replace('text-', 'bg-') : 'bg-blue-500';
  const borderClass = colorClass ? colorClass.replace('text-', 'border-') : 'border-blue-500';

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });
      tl.to(cardRef.current, { y: -5, duration: 0.3, ease: "power2.out" })
        .to(".stat-glow", { opacity: 0.2, scale: 1.2, duration: 0.3 }, 0)
        .to(".stat-icon", { scale: 1.1, rotate: 5, duration: 0.3 }, 0);

      cardRef.current.addEventListener("mouseenter", () => tl.play());
      cardRef.current.addEventListener("mouseleave", () => tl.reverse());

    }, cardRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <div
        ref={cardRef}
        className={`group relative bg-[#1e293b]/60 backdrop-blur-md rounded-2xl p-6 border border-slate-800/80 transition-colors duration-300 hover:border-slate-600 overflow-hidden shadow-xl cursor-pointer`}
        onClick={() => setIsModalOpen(true)}
      >

        {/* 1. Ambient Background Glow (Dynamic Color) */}
        <div className={`stat-glow absolute -right-10 -top-10 w-40 h-40 rounded-full opacity-5 blur-[50px] transition-opacity duration-500 ${bgClass}`}></div>

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.1em] mb-2 flex items-center gap-2">
                {title}
              </h3>
              <div className="flex items-baseline gap-2">
                {/* Main Number with subtle glow */}
                <span className={`text-3xl font-extrabold tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]`}>
                  {count}
                </span>
              </div>
            </div>

            {/* Icon Container with Glass effect */}
            <div className={`stat-icon p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md shadow-inner transition-transform ${colorClass}`}>
              {React.cloneElement(icon, { size: 24, strokeWidth: 2 })}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent my-4 opacity-50"></div>

          {/* Bottom Action Area */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
              <TrendingUp size={12} className={colorClass} />
              <span className="text-[10px] font-mono text-slate-400 uppercase">Live Data</span>
            </div>

            <button
              className={`group/btn flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-wide`}
            >
              Details
              <ArrowRight size={12} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      <StatDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        count={count}
        colorClass={colorClass}
        icon={icon}
      />
    </>
  );
};

export default StatCard;