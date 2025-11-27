import axios from 'axios';

const API_URL = "http://127.0.0.1:8000";

export const api = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
});

// Add Token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const getProfile = async () => {
    const res = await api.get("/auth/me");
    return res.data;
};

export const updateProfile = async (userData) => {
    const res = await api.put("/auth/me", userData);
    return res.data;
};

// --- REAL TIME API ---
export const analyzeTraffic = async (trafficData) => {
    const res = await api.post("/api/analyze", trafficData);
    return res.data;
};

export const getDashboardStats = async () => {
    const res = await api.get("/api/stats");
    return res.data;
};

// NEW: Fetch list of threats
export const getThreats = async () => {
    const res = await api.get("/api/alerts");
    return res.data;
};

// NEW: Fetch remediation tasks
export const getRemediationTasks = async () => {
    const res = await api.get("/api/remediations");
    return res.data;
};

// NEW: Fetch security logs
export const getSecurityLogs = async () => {
    const res = await api.get("/api/logs");
    return res.data;
};

// ... (keep existing imports and code)

// NEW: Fetch network devices
export const getNetworkDevices = async () => {
    const res = await api.get("/api/network/devices");
    return res.data;
};

// ... (keep existing imports and code)

// NEW: Fetch log analytics stats
export const getLogStats = async () => {
    const res = await api.get("/api/logs/stats");
    return res.data;
};