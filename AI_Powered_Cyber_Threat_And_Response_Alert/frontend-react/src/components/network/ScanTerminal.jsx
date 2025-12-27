import React, { useEffect, useRef } from 'react';
import { Terminal, ChevronRight, Minimize2, Maximize2 } from 'lucide-react';
import gsap from "gsap";

const ScanTerminal = ({ logs }) => {
    const scrollRef = useRef(null);
    const terminalRef = useRef(null);

    useEffect(() => {
        // Auto-scroll to bottom
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }

        // Animate new log entry
        if (logs.length > 0) {
            const lastLog = scrollRef.current?.lastElementChild?.previousElementSibling;
            if (lastLog) {
                gsap.fromTo(lastLog, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" });
            }
        }
    }, [logs]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Entrance Animation
            gsap.from(terminalRef.current, {
                scale: 0.95,
                opacity: 0,
                duration: 0.6,
                ease: "back.out(1.2)"
            });

            // Continuous Scanline
            gsap.to(".scan-line-effect", {
                top: "100%",
                repeat: -1,
                duration: 3,
                ease: "linear"
            });
        }, terminalRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={terminalRef} className="bg-slate-50 dark:bg-[#050a14] border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-xs h-full flex flex-col shadow-2xl relative overflow-hidden group transition-colors duration-300">

            {/* Animated Scanline */}
            <div className="scan-line-effect absolute top-0 left-0 w-full h-[20px] bg-gradient-to-b from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 pointer-events-none z-10"></div>

            {/* Header / Title Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-[#0f172a]/90 backdrop-blur-sm z-20 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 ml-2">
                        <Terminal size={12} />
                        <span className="font-bold tracking-wide text-slate-700 dark:text-slate-300">root@sentinel:~</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-500 border border-slate-300 dark:border-slate-700">bash</span>
                </div>
            </div>

            {/* Terminal Body */}
            <div ref={scrollRef} className="overflow-y-auto flex-1 p-4 space-y-1.5 z-10 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 hover:scrollbar-thumb-slate-400 dark:hover:scrollbar-thumb-slate-600">

                {/* Initial Prompt */}
                <div className="text-slate-500 mb-4">
                    ThreatWatch AI AI Integrated Terminal v2.4.0 <br />
                    Type 'help' for available commands.
                </div>

                {logs.map((log, idx) => (
                    <div key={idx} className="break-all flex gap-2 group/log hover:bg-black/5 dark:hover:bg-white/5 rounded px-1 -mx-1 transition-colors">
                        <span className="text-slate-500 dark:text-slate-600 select-none shrink-0">[{log.time}]</span>
                        <span className="text-blue-600 dark:text-blue-500 select-none shrink-0">➜</span>
                        <span className={`${log.type === 'error' ? 'text-rose-500 dark:text-rose-400' :
                            log.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' :
                                log.type === 'warning' ? 'text-amber-600 dark:text-amber-400' :
                                    'text-slate-700 dark:text-slate-300'
                            }`}>
                            {log.msg}
                        </span>
                    </div>
                ))}

                {/* Active Input Line */}
                <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 mt-2">
                    <ChevronRight size={12} />
                    <div className="w-2 h-4 bg-cyan-600 dark:bg-cyan-400 animate-pulse"></div>
                </div>
            </div>

            {/* Background Glow */}
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-600/5 blur-[80px] pointer-events-none"></div>
        </div>
    );
};

export default ScanTerminal;