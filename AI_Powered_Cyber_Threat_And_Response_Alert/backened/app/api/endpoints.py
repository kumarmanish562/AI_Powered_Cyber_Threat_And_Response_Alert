from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.session import get_db
from app.db.models import Alert
from app.schemas.traffic import TrafficData
from app.services.ml_service import ml_engine
from app.services.email_service import send_alert_email
from datetime import datetime, timedelta, timezone  # <--- Updated Import
import traceback
from typing import List
import random
import uuid

router = APIRouter()


# ============================================================
#  GET ALERTS ENDPOINT
# ============================================================
@router.get("/alerts")
def get_alerts(limit: int = 50, db: Session = Depends(get_db)):
    try:
        alerts = db.query(Alert).order_by(Alert.timestamp.desc()).limit(limit).all()
        return alerts
    except Exception as e:
        print(f"Error getting alerts: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch alerts")


# ============================================================
#  REAL-TIME TRAFFIC ANALYSIS
# ============================================================
@router.post("/analyze")
async def analyze_traffic(
    data: TrafficData,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    try:
        result = ml_engine.predict(data.dict())

        new_alert = Alert(
            src_ip=data.srcip,
            prediction="Attack" if result['is_threat'] else "Normal",
            confidence=result['confidence'],
            severity=result['severity'],
            status="Active" if result['is_threat'] else "Safe"
        )
        db.add(new_alert)
        db.commit()
        db.refresh(new_alert)

        if result['is_threat'] and result['confidence'] > 0.8:
            alert_payload = data.dict()
            alert_payload.update(result)
            alert_payload['alert_id'] = new_alert.id
            background_tasks.add_task(send_alert_email, alert_payload)

        return {
            "id": new_alert.id,
            "is_threat": result['is_threat'],
            "confidence": result['confidence'],
            "severity": result['severity'],
            "timestamp": new_alert.timestamp
        }

    except Exception as e:
        print(f"Error in analyze_traffic: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================
#  DASHBOARD STATS
# ============================================================
@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    try:
        total_scans = db.query(Alert).count()
        total_threats = db.query(Alert).filter(Alert.prediction == "Attack").count()

        critical = db.query(Alert).filter(Alert.severity == "Critical").count()
        high = db.query(Alert).filter(Alert.severity == "High").count()
        medium = db.query(Alert).filter(Alert.severity == "Medium").count()
        low = db.query(Alert).filter(Alert.severity == "Low").count()

        active = db.query(Alert).filter(Alert.status == "Active").count()
        remediated = db.query(Alert).filter(Alert.status == "Remediated").count()

        return {
            "total_scans": total_scans,
            "total_threats": total_threats,
            "severity_distribution": [
                {"name": "Critical", "value": critical, "color": "#ef4444"},
                {"name": "High", "value": high, "color": "#f97316"},
                {"name": "Medium", "value": medium, "color": "#eab308"},
                {"name": "Low", "value": low, "color": "#3b82f6"},
            ],
            "status_distribution": [
                {"name": "Active", "value": active, "color": "#ef4444"},
                {"name": "Remediated", "value": remediated, "color": "#22c55e"},
            ]
        }

    except Exception as e:
        print(f"Error in get_stats: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================
#  REMEDIATION TASKS
# ============================================================
@router.get("/remediations")
def get_remediation_tasks(db: Session = Depends(get_db)):
    try:
        alerts = db.query(Alert).order_by(Alert.timestamp.desc()).limit(20).all()
        tasks = []

        for alert in alerts:

            # Playbook logic
            playbook = "Basic Firewall Rule"
            if alert.severity == "Critical":
                playbook = "Isolate Host & Kill Process"
            elif alert.severity == "High":
                playbook = "Block IP & Reset Session"
            elif alert.severity == "Medium":
                playbook = "WAF Rate Limiting"

            # Status logic
            if alert.status in ["Remediated", "Safe"]:
                task_status = "Completed"
                progress = 100
                duration = "45s"
            else:
                task_status = "In Progress"
                progress = (alert.id * 7) % 90 + 10
                duration = "Running..."

            tasks.append({
                "id": alert.id,
                "threat": f"{alert.prediction} detected from {alert.src_ip}",
                "playbook": playbook,
                "type": "Automated" if alert.severity in ["Critical", "High"] else "Manual",
                "startTime": alert.timestamp,
                "duration": duration,
                "progress": progress,
                "status": task_status
            })

        return tasks

    except Exception as e:
        print(f"Error fetching remediations: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch remediation tasks")


# ============================================================
#  NEW ENDPOINT: SECURITY LOGS
# ============================================================
@router.get("/logs")
def get_security_logs(db: Session = Depends(get_db)):
    try:
        logs = []

        # 1. Convert Database Alerts into Log Entries
        alerts = db.query(Alert).order_by(Alert.timestamp.desc()).limit(15).all()

        for alert in alerts:
            logs.append({
                "id": f"LOG-{alert.id}",
                "timestamp": alert.timestamp,
                "level": "ERROR" if alert.severity in ["Critical", "High"] else "WARNING",
                "event": f"Threat: {alert.prediction}",
                "source": "AI Detection Engine",
                "user": "SYSTEM",
                "ip": alert.src_ip,
                "message": f"Automated block triggered for {alert.prediction} (Confidence: {alert.confidence:.2f})",
                "trace_id": f"TR-{alert.id}-{str(uuid.uuid4())[:4]}"
            })

        # 2. Simulated System Events
        # FIX: Use timezone-aware datetime (UTC) to match database Alert timestamps
        current_time = datetime.now(timezone.utc)

        system_events = [
            {"ev": "User Login Success", "src": "Auth Service", "usr": "admin", "lvl": "SUCCESS", "msg": "Authenticated via MFA"},
            {"ev": "File Accessed", "src": "File Share", "usr": "j.doe", "lvl": "INFO", "msg": "Read access to /confidential/report.pdf"},
            {"ev": "Health Check", "src": "Load Balancer", "usr": "SYSTEM", "lvl": "INFO", "msg": "Node healthy"},
            {"ev": "Config Change", "src": "System Settings", "usr": "admin", "lvl": "WARNING", "msg": "Firewall rule updated"},
            {"ev": "API Request", "src": "Gateway", "usr": "api_client", "lvl": "INFO", "msg": "POST /api/v1/data returned 200"},
        ]

        for i in range(10):
            evt = random.choice(system_events)
            # Subtracting timedelta from an aware datetime results in an aware datetime
            log_time = current_time - timedelta(
                minutes=random.randint(0, 20),
                seconds=random.randint(0, 59)
            )

            logs.append({
                "id": f"SYS-{random.randint(1000, 9999)}",
                "timestamp": log_time,
                "level": evt["lvl"],
                "event": evt["ev"],
                "source": evt["src"],
                "user": evt["usr"],
                "ip": f"192.168.1.{random.randint(2, 254)}",
                "message": evt["msg"],
                "trace_id": str(uuid.uuid4())[:8]
            })

        # Sort logs newest first (Both are now timezone-aware)
        logs.sort(key=lambda x: x["timestamp"], reverse=True)

        return logs

    except Exception as e:
        print(f"Error fetching logs: {e}")
        # traceback.print_exc() # Useful for debugging
        raise HTTPException(status_code=500, detail="Failed to fetch security logs")


# --- NEW ENDPOINT: NETWORK DEVICES ---
@router.get("/network/devices")
def get_network_devices():
    """
    Returns a simulated list of network assets with dynamic statuses 
    to mimic real-time health monitoring.
    """
    try:
        # Base list of devices
        devices = [
            {"ip": "192.168.1.1", "hostname": "Gateway-Main", "type": "Gateway", "os": "Cisco IOS", "ports": [80, 443, 22]},
            {"ip": "192.168.1.10", "hostname": "File-Server-01", "type": "Server", "os": "Ubuntu 22.04", "ports": [22, 445, 8080]},
            {"ip": "192.168.1.45", "hostname": "Dev-Workstation", "type": "Desktop", "os": "Windows 11", "ports": [3389]},
            {"ip": "192.168.1.102", "hostname": "Smart-Thermostat", "type": "IoT", "os": "Embedded Linux", "ports": [23, 80]},
            {"ip": "192.168.1.15", "hostname": "Database-Prod", "type": "Server", "os": "RHEL 9", "ports": [5432]},
            {"ip": "192.168.1.200", "hostname": "Guest-Mobile", "type": "Mobile", "os": "Android 14", "ports": []},
        ]

        # Add dynamic status (Simulation)
        for device in devices:
            # Randomly assign status
            rand = random.random()
            if rand > 0.9:
                device["status"] = "Critical"
            elif rand > 0.7:
                device["status"] = "Warning"
            else:
                device["status"] = "Safe"
                
            # Randomly add "latency" or extra fields if needed
            device["latency"] = f"{random.randint(2, 50)}ms"

        return devices

    except Exception as e:
        print(f"Error fetching network devices: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch network devices")
    
    # --- NEW ENDPOINT: LOG ANALYTICS ---
@router.get("/logs/stats")
def get_log_stats():
    """
    Returns dynamic statistics for the Log Analysis dashboard:
    - Time-series histogram data
    - Log source distribution
    - Top talkers (IPs)
    - Summary counts
    """
    try:
        # 1. Simulate Time Series Data (24h)
        # We regenerate this to simulate 'live' changes in the last hour
        histogram = []
        for i in range(24):
            base_value = 500 if i < 8 else 1500 # Lower at night
            noise = random.randint(-200, 300)
            value = max(100, base_value + noise)
            
            # Simulate random anomalies
            is_anomaly = False
            if random.random() > 0.95:
                value += 2000
                is_anomaly = True
                
            histogram.append({
                "label": f"{i:02}:00",
                "value": value,
                "isAnomaly": is_anomaly
            })

        # 2. Simulate Source Distribution
        total_events = sum(d["value"] for d in histogram)
        sources = [
            {"label": "Firewall Logs", "count": int(total_events * 0.45), "color": "bg-orange-500"},
            {"label": "Auth / Identity", "count": int(total_events * 0.25), "color": "bg-purple-500"},
            {"label": "System / OS", "count": int(total_events * 0.20), "color": "bg-blue-500"},
            {"label": "Database", "count": int(total_events * 0.10), "color": "bg-emerald-500"},
        ]

        # 3. Top Talkers
        talkers = [
            {"ip": "192.168.140.253", "country": "Internal", "requests": random.randint(12000, 16000), "risk": "High"},
            {"ip": "45.22.19.112", "country": "Russia", "requests": random.randint(6000, 9000), "risk": "Critical"},
            {"ip": "10.0.0.55", "country": "Internal", "requests": random.randint(4000, 7000), "risk": "Low"},
            {"ip": "203.0.113.44", "country": "China", "requests": random.randint(2000, 5000), "risk": "Medium"},
            {"ip": "172.16.20.5", "country": "Internal", "requests": random.randint(1000, 3000), "risk": "Low"},
        ]

        return {
            "total_events": total_events,
            "data_ingested": f"{round(total_events * 0.0005, 2)} GB", # Approximate size
            "anomalies": len([h for h in histogram if h["isAnomaly"]]),
            "histogram": histogram,
            "sources": sources,
            "top_talkers": sorted(talkers, key=lambda x: x['requests'], reverse=True)
        }

    except Exception as e:
        print(f"Error fetching log stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch log stats")