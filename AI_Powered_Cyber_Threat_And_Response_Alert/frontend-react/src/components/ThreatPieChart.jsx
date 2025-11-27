import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Data for Chart 1: Severity
const severityData = [
  { name: 'Critical', value: 35, color: '#ef4444' }, // Red
  { name: 'High', value: 25, color: '#f97316' },     // Orange
  { name: 'Medium', value: 20, color: '#eab308' },   // Yellow
  { name: 'Low', value: 20, color: '#3b82f6' },      // Blue
];

// Data for Chart 2: Status
const statusData = [
  { name: 'Active', value: 45, color: '#ef4444' },       // Red
  { name: 'Remediated', value: 40, color: '#22c55e' }, // Green
  { name: 'Investigating', value: 15, color: '#6366f1' } // Indigo
];

// --- Custom Tooltip (Glassmorphism) ---
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-[#0f172a]/90 backdrop-blur-md border border-slate-700/50 p-3 rounded-lg shadow-xl">
        <p className="text-slate-200 text-xs font-bold mb-1">{data.name}</p>
        <div className="flex items-center gap-2">
            <span className="block w-2 h-2 rounded-full" style={{ backgroundColor: data.payload.fill }}></span>
            <span className="text-cyan-400 font-mono text-sm">
              {data.value}%
            </span>
        </div>
      </div>
    );
  }
  return null;
};

const ThreatPieChart = ({ type }) => {
  const data = type === 'severity' ? severityData : statusData;
  const title = type === 'severity' ? 'Threat Severity' : 'Remediation Status';
  const glowColor = type === 'severity' ? 'bg-rose-500/10' : 'bg-emerald-500/10';

  return (
    <div className="group relative bg-[#151f32]/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-800/60 transition-all duration-300 hover:border-slate-600 hover:shadow-2xl overflow-hidden h-full flex flex-col">
      
      {/* Ambient Background Glow */}
      <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-30 ${glowColor}`}></div>

      <div className="relative z-10 flex-1 flex flex-col">
        <h3 className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.1em] mb-4 flex items-center gap-2">
           {title}
        </h3>

        <div className="flex-1 min-h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    className="transition-all duration-300 hover:opacity-80"
                    stroke="rgba(0,0,0,0)" 
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '11px', color: '#94a3b8', paddingTop: '10px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ThreatPieChart;