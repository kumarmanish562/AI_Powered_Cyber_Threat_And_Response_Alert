import React, { useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';

const ScanTerminal = ({ logs }) => {
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="bg-[#0b1120] border border-slate-800 rounded-lg p-4 font-mono text-xs h-full flex flex-col shadow-inner relative overflow-hidden">
            {/* Scanline effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-[10px] w-full animate-scan pointer-events-none"></div>

            <div className="flex items-center gap-2 mb-2 border-b border-slate-800 pb-2 z-10">
                <Terminal size={14} className="text-slate-500" />
                <span className="text-slate-400">Scanner Output (Console)</span>
            </div>
            <div ref={scrollRef} className="overflow-y-auto flex-1 space-y-1 z-10 scrollbar-thin scrollbar-thumb-slate-800">
                {logs.map((log, idx) => (
                    <div key={idx} className="break-all font-medium">
                        <span className="text-slate-600">[{log.time}]</span>{" "}
                        <span className={log.type === 'error' ? 'text-rose-400' : log.type === 'success' ? 'text-emerald-400' : 'text-slate-300'}>
                            {log.msg}
                        </span>
                    </div>
                ))}
                <div className="animate-pulse text-cyan-500 font-bold">_</div>
            </div>
        </div>
    );
};

export default ScanTerminal;
