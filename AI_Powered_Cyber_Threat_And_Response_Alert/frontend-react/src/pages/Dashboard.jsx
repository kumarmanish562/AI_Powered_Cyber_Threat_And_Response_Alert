import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import NotificationToast from '../components/NotificationToast';
// Import the new Chart components
import { SeverityChart, StatusChart } from '../components/DashboardCharts';
import { getDashboardStats, analyzeTraffic, getProfile, getNetworkDevices } from '../services/api';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle,
  Shield,
  Activity,
  Server,
  Zap,
  Clock,
  Globe,
  Laptop,
  Smartphone,
  Wifi
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

// --- Helper: Live Clock Component ---
const LiveClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2 text-slate-400 font-mono text-sm bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
      <Clock size={14} />
      <span>{time.toLocaleTimeString()}</span>
    </div>
  );
};

const Dashboard = () => {
  // --- State Management ---
  const [stats, setStats] = useState({
    total_scans: 0,
    total_threats: 0,
    severity_distribution: [],
    status_distribution: []
  });

  const [alert, setAlert] = useState(null);
  const [user, setUser] = useState(null);

  // Simulated Live Traffic Data (for the Area Chart)
  const [trafficData, setTrafficData] = useState([]);

  // Real-time System Health Simulation
  const [systemHealth, setSystemHealth] = useState({
    cpu: 24,
    ram: 58,
    db: 12
  });

  // Connected Devices (Real-time Status)
  const [devices, setDevices] = useState([]);

  // --- API & Data Fetching ---
  const fetchData = async () => {
    try {
      const [statsData, userData, devicesData] = await Promise.all([
        getDashboardStats(),
        getProfile(),
        getNetworkDevices()
      ]);
      setStats(statsData);
      setUser(userData);
      setDevices(devicesData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    fetchData(); // Initial load
    const interval = setInterval(() => {
      fetchData(); // Stats & Devices

      // Simulate System Health Fluctuation
      setSystemHealth(prev => ({
        cpu: Math.min(100, Math.max(10, prev.cpu + Math.floor(Math.random() * 10) - 5)),
        ram: Math.min(90, Math.max(30, prev.ram + Math.floor(Math.random() * 8) - 4)),
        db: Math.min(100, Math.max(5, prev.db + Math.floor(Math.random() * 5) - 2))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // --- Live Traffic Simulation Effect ---
  useEffect(() => {
    // Generate initial data
    const initialData = Array.from({ length: 20 }, (_, i) => ({
      time: i,
      mbps: Math.floor(Math.random() * 50) + 20
    }));
    setTrafficData(initialData);

    // Update every second to simulate "Live" network flow
    const trafficInterval = setInterval(() => {
      setTrafficData(prev => {
        const newData = [...prev.slice(1), {
          time: prev[prev.length - 1].time + 1,
          mbps: Math.floor(Math.random() * 60) + 30 // Random throughput
        }];
        return newData;
      });
    }, 1000);

    return () => clearInterval(trafficInterval);
  }, []);

  // --- Dynamic Attack Simulation Logic ---
  const runSimulation = async () => {
    setAlert({ message: "Initiating Deep Packet Inspection...", type: "info" });

    // Helper: Generate Random IP
    const getRandomIP = () => {
      return Array(4).fill(0).map((_, i) =>
        // Bias towards external IPs for variety, but allow internal range 192.168.x.x occasionally
        i === 0 ? Math.floor(Math.random() * 223) + 1 : Math.floor(Math.random() * 256)
      ).join('.');
    };

    // Helper: Generate Random Port
    const getRandomPort = () => {
      const ports = [80, 443, 8080, 22, 21, 3389, 53, 23];
      return ports[Math.floor(Math.random() * ports.length)];
    };

    // Helper: Generate Varied Traffic Data
    const generatePacket = () => {
      return {
        srcip: getRandomIP(), // DYNAMIC: Random Source IP
        sport: getRandomPort(),
        dstip: "10.0.0.5",
        dsport: getRandomPort(),
        proto: ["tcp", "udp", "icmp"][Math.floor(Math.random() * 3)],
        state: "FIN",
        dur: Number((Math.random() * 5).toFixed(2)),
        sbytes: Math.floor(Math.random() * 5000) + 200,
        dbytes: Math.floor(Math.random() * 2000),
        sttl: Math.floor(Math.random() * 64) + 30,
        dttl: 0,
        sloss: 0,
        dloss: 0,
        service: ["http", "ssh", "ftp", "dns", "rdp"][Math.floor(Math.random() * 5)],
        Sload: Math.random() * 1000,
        Dload: 0.0,
        Spkts: Math.floor(Math.random() * 20) + 1,
        Dpkts: 0,
        swin: 255,
        dwin: 0,
        stcpb: 0,
        dtcpb: 0,
        smeansz: Math.floor(Math.random() * 100) + 40,
        dmeansz: 0,
        trans_depth: 0,
        res_bdy_len: 0,
        Sjit: 0.0,
        Djit: 0.0,
        Stime: 1420000000,
        Ltime: 1420000000,
        Sintpkt: 0.1,
        Dintpkt: 0.0,
        tcprtt: 0.0,
        synack: 0.0,
        ackdat: 0.0,
        is_sm_ips_ports: 0,
        ct_state_ttl: Math.floor(Math.random() * 6),
        ct_flw_http_mthd: 0,
        is_ftp_login: 0,
        ct_ftp_cmd: 0,
        ct_srv_src: Math.floor(Math.random() * 10),
        ct_dst_ltm: Math.floor(Math.random() * 10),
        ct_src_dport_ltm: Math.floor(Math.random() * 5),
        ct_dst_sport_ltm: 1,
        ct_dst_src_ltm: Math.floor(Math.random() * 5),
        // NOTE: Missing fields from schema will be auto-filled by defaults or ignored if robust, 
        // but let's ensure we match the backend schema logic if needed. 
        // Backend schema expects all fields. Let's ensure we provide them.
        ct_srv_dst: Math.floor(Math.random() * 10),
        ct_src_ltm: Math.floor(Math.random() * 10),
        simulation: true // Flag to trigger backend simulation mode
      };
    };

    const attackPacket = generatePacket();

    try {
      // Small delay to make it feel like "processing" in real-time
      setTimeout(async () => {
        const result = await analyzeTraffic(attackPacket);

        // Show result regardless of threat status for better feedback
        if (result.is_threat) {
          setAlert({
            message: `THREAT DETECTED: Source ${attackPacket.srcip} blocked.`,
            type: "critical"
          });

          if (Notification.permission === "granted") {
            new Notification("🚨 Threat Blocked", {
              body: `Severity: ${result.severity} | Source: ${attackPacket.srcip}`,
              icon: '/shield-alert.png' // hypothetical icon
            });
          }
        } else {
          setAlert({
            message: `TRAFFIC CLEARED: Source ${attackPacket.srcip} is safe.`,
            type: "success"
          });
        }

        fetchData(); // Refresh stats immediately
      }, 800 + Math.random() * 1000); // Randomize processing time too
    } catch (err) {
      console.error(err);
      setAlert({ message: "Simulation failed. Check console.", type: "error" });
    }
  };

  useEffect(() => {
    if (Notification.permission !== "granted") Notification.requestPermission();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#0b1120] font-sans text-slate-200">

      {/* Toast Notifications */}
      {alert && (
        <NotificationToast
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      <Sidebar />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Background Gradients for Cyber feel */}
        <div className="absolute top-0 left-0 w-full h-96 bg-blue-600/5 blur-[120px] pointer-events-none"></div>

        {/* --- Header --- */}
        <header className="px-8 py-6 border-b border-slate-800/60 bg-[#0b1120]/80 backdrop-blur-sm z-10 flex justify-between items-center shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Shield className="text-blue-500 fill-blue-500/10" size={28} />
              {user ? `Welcome, ${user.full_name}` : 'Command Center'}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">System Operational</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <LiveClock />

            <button
              onClick={runSimulation}
              className="group relative px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/50 rounded-lg text-sm font-bold transition-all overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-rose-500/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>
              <span className="relative flex items-center gap-2">
                <Zap size={16} /> Simulate Attack
              </span>
            </button>
          </div>
        </header>

        {/* --- Scrollable Content --- */}
        <div className="flex-1 overflow-y-auto p-8 scroll-smooth">

          {/* 1. Stat Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Threats Blocked"
              count={stats.total_threats}
              colorClass="text-rose-500"
              borderColor="border-rose-500"
              icon={<ShieldAlert size={24} />}
            />
            <StatCard
              title="Packets Scanned"
              count={stats.total_scans}
              colorClass="text-blue-500"
              borderColor="border-blue-500"
              icon={<Activity size={24} />}
            />
            <StatCard
              title="Auto-Remediated"
              count={stats.status_distribution.find(x => x.name === "Remediated")?.value || 0}
              colorClass="text-emerald-500"
              borderColor="border-emerald-500"
              icon={<CheckCircle size={24} />}
            />
            <StatCard
              title="Active Incidents"
              count={stats.status_distribution.find(x => x.name === "Active")?.value || 0}
              colorClass="text-amber-500"
              borderColor="border-amber-500"
              icon={<AlertTriangle size={24} />}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

            {/* 2. Live Network Traffic (Area Chart) - Takes up 2/3 width */}
            <div className="lg:col-span-2 bg-[#151f32]/60 backdrop-blur-sm rounded-xl border border-slate-800 p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Server size={120} />
              </div>

              <div className="flex justify-between items-center mb-6 relative z-10">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Activity className="text-blue-400" size={18} /> Network Throughput
                  </h3>
                  <p className="text-slate-500 text-xs mt-1">Real-time packet analysis velocity (Mbps)</p>
                </div>
                <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs font-mono rounded border border-blue-500/20 animate-pulse">
                  LIVE FEED
                </span>
              </div>

              <div className="h-[250px] w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trafficData}>
                    <defs>
                      <linearGradient id="colorMb" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="time" hide />
                    <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                      itemStyle={{ color: '#60a5fa' }}
                      labelStyle={{ display: 'none' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="mbps"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorMb)"
                      isAnimationActive={false} // Disable animation for smoother "live" feel
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 3. Threat Severity (Pie Chart) - Takes up 1/3 width */}
            <div className="bg-[#151f32]/60 backdrop-blur-sm rounded-xl border border-slate-800 p-6 shadow-xl flex flex-col">
              <h3 className="text-lg font-bold text-white mb-2">Threat Severity</h3>
              <p className="text-slate-500 text-xs mb-4">Distribution by risk level</p>

              <div className="flex-1 flex items-center justify-center">
                {/* --- SEVERITY CHART COMPONENT --- */}
                <SeverityChart data={stats.severity_distribution} />
              </div>
            </div>
          </div>

          {/* 4. Bottom Row: Status & System Health */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Status Donut */}
            <div className="bg-[#151f32]/60 backdrop-blur-sm rounded-xl border border-slate-800 p-6 shadow-xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Remediation Status</h3>
                  <p className="text-slate-500 text-xs mt-1">Action taken on detected threats</p>
                </div>
                <Globe className="text-slate-600" size={20} />
              </div>

              {/* --- STATUS CHART COMPONENT --- */}
              <StatusChart data={stats.status_distribution} />
            </div>

            {/* Quick System Health (Visual Only) */}
            <div className="bg-[#151f32]/60 backdrop-blur-sm rounded-xl border border-slate-800 p-6 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-6">System Health</h3>

                <div className="space-y-6">
                  {/* CPU Usage */}
                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-2">
                      <span>AI Inference Engine (CPU)</span>
                      <span className="text-emerald-400 font-mono">{systemHealth.cpu}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-in-out"
                        style={{ width: `${systemHealth.cpu}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Memory Usage */}
                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-2">
                      <span>Log Buffer (RAM)</span>
                      <span className="text-blue-400 font-mono">{systemHealth.ram}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-in-out"
                        style={{ width: `${systemHealth.ram}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Database */}
                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-2">
                      <span>PostgreSQL Connections</span>
                      <span className="text-purple-400 font-mono">{systemHealth.db} / 100</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full transition-all duration-500 ease-in-out"
                        style={{ width: `${systemHealth.db}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700/50 flex gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1"><CheckCircle size={12} className="text-emerald-500" /> Database Connected</span>
                <span className="flex items-center gap-1"><CheckCircle size={12} className="text-emerald-500" /> API Gateway Stable</span>
              </div>
            </div>

          </div>

          {/* 5. Network Devices Row (New) */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Wifi className="text-cyan-400" size={20} /> Network Devices (Live Monitoring)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {devices.map((device, idx) => (
                <div key={idx} className="bg-[#151f32]/60 backdrop-blur-sm rounded-lg border border-slate-800 p-4 flex items-center justify-between hover:border-slate-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${device.status === 'Critical' ? 'bg-red-500/20 text-red-500' :
                        device.status === 'Warning' ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-500/20 text-emerald-500'
                      }`}>
                      {device.type === 'Server' ? <Server size={18} /> :
                        device.type === 'Mobile' ? <Smartphone size={18} /> :
                          <Laptop size={18} />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-200">{device.hostname}</h4>
                      <p className="text-xs text-slate-500 font-mono">{device.ip}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block mb-1 ${device.status === 'Critical' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        device.status === 'Warning' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                      {device.status}
                    </div>
                    <p className="text-[10px] text-slate-600 font-mono flex items-center gap-1 justify-end">
                      <Activity size={10} /> {device.latency}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;