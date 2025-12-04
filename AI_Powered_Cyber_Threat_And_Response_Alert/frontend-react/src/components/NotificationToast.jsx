import React, { useEffect, useRef } from 'react';
import { AlertTriangle, X, CheckCircle, Info, Bell } from 'lucide-react';
import gsap from "gsap";

const NotificationToast = ({ message, type, onClose }) => {
  const toastRef = useRef(null);

  useEffect(() => {
    // Play alert sound on mount (only for critical)
    if (type === 'critical') {
      // Using a more reliable/standard beep sound or skipping if external URL is unreliable
      // For now, we'll keep the logic but handle the promise to avoid errors
      const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => { }); // Silent fail if autoplay blocked
    }

    // Animate In
    const ctx = gsap.context(() => {
      gsap.fromTo(toastRef.current,
        { x: 100, opacity: 0, scale: 0.9 },
        { x: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.2)" }
      );
    }, toastRef);

    // Auto close after 5 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  const handleClose = () => {
    if (toastRef.current) {
      gsap.to(toastRef.current, {
        x: 50,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: onClose
      });
    } else {
      onClose();
    }
  };

  // Dynamic Styles based on type
  const styles = {
    critical: {
      border: 'border-rose-500',
      bg: 'bg-rose-950/90',
      iconBg: 'bg-rose-500/20',
      iconColor: 'text-rose-500',
      title: 'text-rose-400',
      Icon: AlertTriangle,
      glow: 'shadow-rose-900/40'
    },
    success: {
      border: 'border-emerald-500',
      bg: 'bg-emerald-950/90',
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-500',
      title: 'text-emerald-400',
      Icon: CheckCircle,
      glow: 'shadow-emerald-900/40'
    },
    info: {
      border: 'border-blue-500',
      bg: 'bg-slate-900/90',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-500',
      title: 'text-blue-400',
      Icon: Info,
      glow: 'shadow-blue-900/40'
    },
    warning: { // Adding warning just in case
      border: 'border-amber-500',
      bg: 'bg-amber-950/90',
      iconBg: 'bg-amber-500/20',
      iconColor: 'text-amber-500',
      title: 'text-amber-400',
      Icon: Bell,
      glow: 'shadow-amber-900/40'
    }
  };

  const currentStyle = styles[type] || styles.info;
  const { Icon } = currentStyle;

  return (
    <div
      ref={toastRef}
      className={`fixed bottom-6 right-6 z-[100] max-w-sm w-full backdrop-blur-xl rounded-2xl border ${currentStyle.border} shadow-2xl ${currentStyle.glow} ${currentStyle.bg} overflow-hidden`}
    >
      {/* Background Pulse Effect for Critical */}
      {type === 'critical' && (
        <div className="absolute inset-0 bg-rose-500/10 animate-pulse pointer-events-none"></div>
      )}

      <div className="flex items-start gap-4 p-5 relative z-10">
        <div className={`p-3 rounded-xl ${currentStyle.iconBg} ${currentStyle.iconColor} shrink-0`}>
          <Icon size={24} className={type === 'critical' ? 'animate-bounce' : ''} />
        </div>

        <div className="flex-1 pt-0.5">
          <h4 className={`font-bold text-sm uppercase tracking-wider mb-1 ${currentStyle.title}`}>
            {type === 'critical' ? 'Threat Detected' :
              type === 'success' ? 'Success' :
                'System Update'}
          </h4>
          <p className="text-slate-200 text-sm leading-relaxed font-medium">
            {message}
          </p>
        </div>

        <button
          onClick={handleClose}
          className="text-slate-400 hover:text-white hover:bg-white/10 rounded-lg p-1.5 transition-colors -mt-2 -mr-2"
        >
          <X size={16} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20">
        <div
          className={`h-full ${currentStyle.iconBg.replace('/20', '')}`} // Use solid color derived from bg class
          style={{
            animation: `progress 5s linear forwards`,
            backgroundColor: type === 'critical' ? '#f43f5e' : type === 'success' ? '#10b981' : '#3b82f6'
          }}
        ></div>
      </div>

      <style>{`
                @keyframes progress {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>
    </div>
  );
};

export default NotificationToast;