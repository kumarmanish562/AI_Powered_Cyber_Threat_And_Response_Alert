from app.db.session import SessionLocal
from app.db.models import Alert
from datetime import datetime, timezone

db = SessionLocal()

try:
    new_alert = Alert(
        src_ip="192.168.1.200",
        prediction="Attack",
        confidence=0.95,
        severity="Critical",
        status="Active",
        timestamp=datetime.now(timezone.utc)
    )
    db.add(new_alert)
    db.commit()
    print(f"Inserted Alert ID: {new_alert.id}")
except Exception as e:
    print(f"Error: {e}")
finally:
    db.close()
