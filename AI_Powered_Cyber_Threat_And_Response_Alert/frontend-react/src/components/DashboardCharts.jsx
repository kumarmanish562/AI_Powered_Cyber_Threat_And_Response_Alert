import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

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

  return (
    <div className="h-[220px] w-full animate-fade-in">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={80}
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

  return (
    <div className="h-[220px] w-full animate-fade-in">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            startAngle={180}
            endAngle={0}
            innerRadius={60} // Donut Style
            outerRadius={100}
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