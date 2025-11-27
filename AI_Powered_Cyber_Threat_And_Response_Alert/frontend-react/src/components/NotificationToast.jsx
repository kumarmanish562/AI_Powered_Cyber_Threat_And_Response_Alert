import React, { useEffect, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

const NotificationToast = ({ message, type, onClose }) => {
  useEffect(() => {
    // Play alert sound on mount
    if (type === 'critical') {
        const audio = new Audio('[https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3](https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3)');
        audio.play().catch(e => console.log("Audio play failed:", e));
    }
    
    // Auto close after 5 seconds
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-slide-in">
      <div className={`flex items-start gap-4 p-4 rounded-lg shadow-2xl border-l-4 backdrop-blur-md ${
        type === 'critical' 
          ? 'bg-red-900/90 border-red-500 text-white' 
          : 'bg-slate-800/90 border-blue-500 text-white'
      }`}>
        <div className={`p-2 rounded-full ${type === 'critical' ? 'bg-red-600' : 'bg-blue-600'}`}>
          <AlertTriangle size={24} />
        </div>
        <div>
          <h4 className="font-bold text-lg">{type === 'critical' ? 'THREAT DETECTED' : 'System Update'}</h4>
          <p className="text-sm opacity-90 mt-1">{message}</p>
        </div>
        <button onClick={onClose} className="text-white/50 hover:text-white">
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default NotificationToast;