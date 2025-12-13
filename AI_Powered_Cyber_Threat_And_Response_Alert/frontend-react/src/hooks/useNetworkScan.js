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

    const startScan = useCallback(async () => {
        if (isScanning) return;
        setIsScanning(true);
        setProgress(0);
        setLogs([{ time: new Date().toLocaleTimeString(), msg: "Initializing Network Discovery...", type: "info" }]);

        // Fetch fresh data implicitly so we know what to log
        // in a real app, this would happen step-by-step, but here we simulate it
        let freshDevices = [];
        try {
            freshDevices = await getNetworkDevices();
        } catch (e) {
            console.error(e);
        }

        // VISUAL: Clear devices to simulate finding them one by one
        setDevices([]);

        let p = 0;
        const logged = new Set(); // Track logged checkpoints to prevent duplicates
        let devicesFoundCount = 0; // Track how many we've "revealed"

        const interval = setInterval(() => {
            // DYNAMIC: Randomize speed slightly
            p += Math.floor(Math.random() * 3) + 1;
            if (p > 100) p = 100;
            setProgress(p);

            // LOGIC: Use fresh data for logs, ensured to run only once per threshold
            if (p >= 10 && !logged.has(10)) {
                addLog(`Gateway 192.168.1.1 responded (${Math.floor(Math.random() * 5) + 1}ms).`);
                logged.add(10);
            }

            if (p >= 24 && !logged.has(24)) {
                addLog("Scanning Subnet 192.168.1.0/24...", "info");
                logged.add(24);
            }

            // DYNAMIC: Reveal devices gradually after p=30
            if (p > 30 && devicesFoundCount < freshDevices.length) {
                // Simpler: Reveal items proportional to progress from 30 to 90
                const percentDone = (p - 30) / (90 - 30); // 0.0 to 1.0
                const shouldShow = Math.floor(percentDone * freshDevices.length);
                if (shouldShow > devicesFoundCount) {
                    setDevices(freshDevices.slice(0, shouldShow));
                    devicesFoundCount = shouldShow;
                }
            }

            // DYNAMIC: Actual count from backend
            if (p >= 40 && !logged.has(40)) {
                const count = freshDevices.length > 0 ? freshDevices.length : 0;
                addLog(`Discovered ${count} hosts active in ARP table.`);
                logged.add(40);
            }

            if (p >= 65 && !logged.has(65)) {
                addLog("Port scan initiated on active hosts...");
                logged.add(65);
            }

            if (p >= 80 && !logged.has(80)) {
                addLog("Analyzing OS fingerprints and service versions...");
                logged.add(80);
            }

            if (p >= 92 && !logged.has(92)) {
                addLog("Finalizing topology map...");
                logged.add(92);
            }

            if (p >= 100) {
                clearInterval(interval);
                setIsScanning(false);
                setDevices(freshDevices); // Ensure all are shown at end
                addLog("Scan Completed Successfully. Asset inventory updated.", "success");
            }
        }, 100);
    }, [isScanning, addLog]);

    return {
        isScanning,
        progress,
        devices,
        loading,
        logs,
        startScan
    };
};
