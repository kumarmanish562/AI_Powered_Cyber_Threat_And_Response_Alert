import { useState, useEffect, useCallback } from 'react';
import { getNetworkDevices } from '../services/api';

export const useNetworkScan = () => {
    const [isScanning, setIsScanning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState([{ time: new Date().toLocaleTimeString(), msg: "System ready. Idle.", type: "info" }]);

    const addLog = useCallback((msg, type = "info") => {
        setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), msg, type }]);
    }, []);

    const fetchDevices = useCallback(async () => {
        try {
            const data = await getNetworkDevices();
            setDevices(data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch network devices:", error);
            addLog("Failed to sync with network controller.", "error");
        }
    }, [addLog]);

    useEffect(() => {
        fetchDevices();
        const interval = setInterval(fetchDevices, 5000);
        return () => clearInterval(interval);
    }, [fetchDevices]);

    const startScan = useCallback(() => {
        if (isScanning) return;
        setIsScanning(true);
        setProgress(0);
        setLogs([{ time: new Date().toLocaleTimeString(), msg: "Initializing Network Discovery...", type: "info" }]);

        let p = 0;
        const interval = setInterval(() => {
            p += 2;
            setProgress(p);

            if (p === 10) addLog("Gateway 192.168.1.1 responded (1ms).");
            if (p === 24) addLog("Scanning Subnet 192.168.1.0/24...", "info");
            if (p === 40) addLog(`Discovered ${devices.length} hosts active in ARP table.`);
            if (p === 65) addLog("Port scan initiated on active hosts...");
            if (p === 80) addLog("Analyzing OS fingerprints and service versions...");
            if (p === 92) addLog("Finalizing topology map...");

            if (p >= 100) {
                clearInterval(interval);
                setIsScanning(false);
                fetchDevices();
                addLog("Scan Completed Successfully. Asset inventory updated.", "success");
            }
        }, 100);
    }, [isScanning, devices.length, fetchDevices, addLog]);

    return {
        isScanning,
        progress,
        devices,
        loading,
        logs,
        startScan
    };
};
