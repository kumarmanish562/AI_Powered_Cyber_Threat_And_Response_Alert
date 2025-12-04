import React, { useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import gsap from "gsap";

// --- Custom Tooltip (Glassmorphism) ---
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-[#0f172a]/90 backdrop-blur-md border border-slate-700/50 p-3 rounded-lg shadow-xl">
        <p className="text-slate-200 text-xs font-bold mb-1">{data.name}</p>
        <div className="flex items-center gap-2">
          <span className="block w-2 h-2 rounded-full" style={{ backgroundColor: data.payload.color }}></span>
          <span className="text-cyan-400 font-mono text-sm">
            {data.value} <span className="text-slate-500 text-xs">events</span>
          </span>
        </div>
      </div>
    );
  }
  return null;
};

// --- Helper: Handle Empty Data ---
const processData = (data) => {
  // If data is missing or all zeros, show a placeholder
  if (!data || data.length === 0 || data.every(item => item.value === 0)) {
    return {
      data: [{ name: 'No Data', value: 1, color: '#1e293b' }],
      isPlaceholder: true
    };
  }
  return { data, isPlaceholder: false };
};

// --- Severity Chart Component ---
export const SeverityChart = ({ data }) => {
  const { data: chartData, isPlaceholder } = processData(data);
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(chartRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)"
      });
    }, chartRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={chartRef} className="h-[240px] min-h-[240px] min-w-0 w-full bg-slate-900/40 backdrop-blur-sm rounded-xl border border-slate-800/50 p-4 shadow-lg hover:border-slate-700 transition-colors">
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 text-center">Threat Severity Distribution</h4>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={40} // Donut Style
            dataKey="value"
            stroke="none"
            paddingAngle={isPlaceholder ? 0 : 4} // Add gaps only if real data
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke={isPlaceholder ? 'none' : 'rgba(0,0,0,0.2)'}
              />
            ))}
          </Pie>
          {!isPlaceholder && <Tooltip content={<CustomTooltip />} />}
          {!isPlaceholder && (
            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '11px', color: '#94a3b8', paddingTop: '10px' }}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// --- Status Chart Component ---
export const StatusChart = ({ data }) => {
  const { data: chartData, isPlaceholder } = processData(data);
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(chartRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        delay: 0.1,
        ease: "back.out(1.7)"
      });
    }, chartRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={chartRef} className="h-[240px] min-h-[240px] min-w-0 w-full bg-slate-900/40 backdrop-blur-sm rounded-xl border border-slate-800/50 p-4 shadow-lg hover:border-slate-700 transition-colors">
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 text-center">Resolution Status</h4>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            startAngle={180}
            endAngle={0}
            innerRadius={60} // Donut Style
            outerRadius={90}
            dataKey="value"
            stroke="none"
            paddingAngle={isPlaceholder ? 0 : 2}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke={isPlaceholder ? 'none' : 'rgba(0,0,0,0.2)'}
              />
            ))}
          </Pie>
          {!isPlaceholder && <Tooltip content={<CustomTooltip />} />}
          {!isPlaceholder && (
            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};