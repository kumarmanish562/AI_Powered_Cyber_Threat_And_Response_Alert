from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from app.api.deps import get_current_user
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.session import get_db
from app.db.models import Alert, User
from app.schemas.traffic import TrafficData
from app.services.ml_service import ml_engine
from app.services.email_service import send_alert_email, send_newsletter_subscription_email, send_mock_sms
from datetime import datetime, timedelta, timezone
import traceback
from typing import List
import random
import uuid
from pydantic import BaseModel, EmailStr

router = APIRouter()


# ============================================================
#  GET ALERTS ENDPOINT
# ============================================================
@router.get("/alerts")
@router.get("/alerts")
def get_alerts(limit: int = 50, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        # Show only alerts belonging to the user
        alerts = db.query(Alert).filter(Alert.user_id == current_user.id).order_by(Alert.timestamp.desc()).limit(limit).all()
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
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        result = ml_engine.predict(data.dict())

        new_alert = Alert(
            src_ip=data.srcip,
            prediction="Attack" if result['is_threat'] else "Normal",
            confidence=result['confidence'],
            severity=result['severity'],
            status="Active" if result['is_threat'] else "Safe",
            user_id=current_user.id  # Link to User
        )
        db.add(new_alert)
        db.commit()
        db.refresh(new_alert)

        if result['is_threat'] and (result['severity'] == "Critical" or result['confidence'] > 0.8):
            # Fetch subscribed users
            subscribed_users = db.query(User).filter(User.email_alerts == True).all()
            recipients = [u.email for u in subscribed_users]

            if recipients:
                alert_payload = data.dict()
                alert_payload.update(result)
                alert_payload['alert_id'] = new_alert.id
                alert_payload['src_ip'] = data.srcip # Explicitly map for email template
                background_tasks.add_task(send_alert_email, recipients, alert_payload)

            # --- MOCK SMS NOTIFICATION ---
            # --- MOCK SMS NOTIFICATION ---
            # Send ONLY to the current user if they have SMS enabled
            if current_user.sms_alerts:
                 sms_msg = f"Alert: {result['prediction']} detected from {data.srcip}. Severity: {result['severity']}."
                 background_tasks.add_task(send_mock_sms, current_user.email, sms_msg)

        return {
            "id": new_alert.id,
            "is_threat": result['is_threat'],
            "confidence": result['confidence'],
            "severity": result['severity'],
            "timestamp": new_alert.timestamp
        }

    except Exception as e:
        print(f"CRITICAL ERROR in analyze_traffic: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================
#  DASHBOARD STATS
# ============================================================
@router.get("/stats")
@router.get("/stats")
def get_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        # Base query filtered by user
        base_query = db.query(Alert).filter(Alert.user_id == current_user.id)

        total_scans = base_query.count()
        total_threats = base_query.filter(Alert.prediction == "Attack").count()

        critical = base_query.filter(Alert.severity == "Critical").count()
        high = base_query.filter(Alert.severity == "High").count()
        medium = base_query.filter(Alert.severity == "Medium").count()
        low = base_query.filter(Alert.severity == "Low").count()

        active = base_query.filter(Alert.status == "Active").count()
        remediated = base_query.filter(Alert.status == "Remediated").count()

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


# ============================================================
#  NEWSLETTER SUBSCRIPTION
# ============================================================
class SubscriptionRequest(BaseModel):
    email: EmailStr

@router.post("/subscribe")
async def subscribe_newsletter(
    request: SubscriptionRequest, 
    background_tasks: BackgroundTasks
):
    try:
        # In a real app, you'd save this to a database
        print(f"New subscriber: {request.email}")
        
        # Send confirmation email
        background_tasks.add_task(send_newsletter_subscription_email, request.email)
        
        return {"message": "Subscription successful"}
    except Exception as e:
        print(f"Error subscribing: {e}")
        raise HTTPException(status_code=500, detail="Failed to subscribe")


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

        # 3. Top Talkers+
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


# ============================================================
#  NEW ENDPOINT: EXECUTE PLAYBOOK (SIMULATION)
# ============================================================
class RemediationAction(BaseModel):
    action: str

@router.post("/remediations/execute")
def execute_playbook(db: Session = Depends(get_db)):
    try:
        # Simulate creating a new critical alert that needs remediation
        new_alert = Alert(
            src_ip=f"192.168.1.{random.randint(100, 200)}",
            prediction="Attack",
            confidence=0.98,
            severity="Critical",
            status="Active",
            timestamp=datetime.now(timezone.utc)
        )
        db.add(new_alert)
        db.commit()
        db.refresh(new_alert)
        
        return {"message": "Playbook executed successfully", "task_id": new_alert.id}
    except Exception as e:
        print(f"Error executing playbook: {e}")
        raise HTTPException(status_code=500, detail="Failed to execute playbook")


# ============================================================
#  NEW ENDPOINT: REMEDIATION ACTIONS
# ============================================================
@router.post("/remediations/{id}/action")
def remediation_action(id: int, action_data: RemediationAction, db: Session = Depends(get_db)):
    try:
        alert = db.query(Alert).filter(Alert.id == id).first()
        if not alert:
            raise HTTPException(status_code=404, detail="Task not found")

        action = action_data.action
        
        if action == "Approve":
            alert.status = "Remediated"
        elif action == "Retry":
            alert.status = "Active" # Reset to active to simulate retry
        elif action == "Rollback":
            alert.status = "Active" # Rollback to active
        elif action == "Stop":
            alert.status = "Safe" # Mark as safe/stopped
            
        db.commit()
        return {"message": f"Action {action} performed successfully", "status": alert.status}
    except Exception as e:
        print(f"Error performing action: {e}")
        raise HTTPException(status_code=500, detail="Failed to perform action")


# ============================================================
#  NEW ENDPOINT: SECURITY LOGS FOR A TASK
# ============================================================
@router.get("/remediations/{id}/logs")
def get_remediation_logs(id: int):
    # Simulate logs for a specific task
    logs = []
    base_time = datetime.now(timezone.utc)
    
    steps = [
        ("INFO", "Initializing playbook execution..."),
        ("INFO", "Scanning target IP address..."),
        ("WARNING", "High severity threat detected."),
        ("INFO", "Isolating host from network..."),
        ("SUCCESS", "Host isolated successfully."),
        ("INFO", "Applying firewall rules..."),
        ("SUCCESS", "Firewall rules updated."),
        ("INFO", "Verifying system integrity..."),
        ("SUCCESS", "Remediation complete.")
    ]
    
    for i, (level, msg) in enumerate(steps):
        logs.append({
            "timestamp": base_time - timedelta(seconds=(len(steps) - i) * 5),
            "level": level,
            "message": msg
        })
        
    return logs


# ============================================================
#  GET SECURITY LOGS (GENERAL)
# ============================================================
@router.get("/logs")
def get_security_logs(limit: int = 100, db: Session = Depends(get_db)):
    try:
        # For now, we can reuse the alerts table or create a separate logs table.
        # Since we don't have a dedicated logs table in the provided context, 
        # we will simulate logs based on alerts + some random system events.
        
        alerts = db.query(Alert).order_by(Alert.timestamp.desc()).limit(limit).all()
        logs = []
        
        for alert in alerts:
            logs.append({
                "id": f"log-{alert.id}",
                "timestamp": alert.timestamp,
                "level": "ERROR" if alert.severity in ["Critical", "High"] else "WARNING",
                "event": alert.prediction,
                "source": "IDS/IPS",
                "user": "System",
                "ip": alert.src_ip,
                "message": f"Threat detected: {alert.prediction} with {alert.confidence} confidence.",
                "trace_id": str(uuid.uuid4())
            })
            
        # Add some simulated INFO/SUCCESS logs
        base_time = datetime.now(timezone.utc)
        system_events = [
            ("INFO", "User Login", "Auth", "admin", "192.168.1.10"),
            ("SUCCESS", "Backup Completed", "System", "backup-service", "localhost"),
            ("INFO", "Health Check", "Monitor", "system", "localhost"),
            ("WARNING", "High CPU Usage", "System", "kernel", "localhost"),
        ]
        
        for i in range(20):
            level, event, source, user, ip = random.choice(system_events)
            logs.append({
                "id": f"sys-{i}",
                "timestamp": base_time - timedelta(minutes=random.randint(1, 60)),
                "level": level,
                "event": event,
                "source": source,
                "user": user,
                "ip": ip,
                "message": f"{event} event recorded.",
                "trace_id": str(uuid.uuid4())
            })
            
        # Sort by timestamp desc
        logs.sort(key=lambda x: x['timestamp'], reverse=True)
        return logs[:limit]

    except Exception as e:
        print(f"Error fetching security logs: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch security logs")