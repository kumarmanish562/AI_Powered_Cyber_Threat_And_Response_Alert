import sys
import os
sys.path.append(os.getcwd())
from app.db.session import SessionLocal
from app.db.models import Alert, User

def check_alerts():
    db = SessionLocal()
    users = db.query(User).all()
    print(f"Total Users: {len(users)}")
    for user in users:
        print(f"User {user.email} | Email Alerts: {user.email_alerts} | SMS Alerts: {user.sms_alerts}")
        count = db.query(Alert).filter(Alert.user_id == user.id).count()
        threats = db.query(Alert).filter(Alert.user_id == user.id, Alert.prediction == "Attack").count()
        print(f"User {user.email} (ID: {user.id}) -> Total Alerts: {count}, Threats: {threats}")
        if count > 0:
            last = db.query(Alert).filter(Alert.user_id == user.id).order_by(Alert.timestamp.desc()).first()
            print(f"  Last Alert: {last.prediction} | Severity: {last.severity} | Time: {last.timestamp}")

if __name__ == "__main__":
    check_alerts()
