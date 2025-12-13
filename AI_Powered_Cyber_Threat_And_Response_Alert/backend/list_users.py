from app.db.session import SessionLocal
from app.db.models import User

def list_users():
    db = SessionLocal()
    try:
        users = db.query(User).all()
        print(f"Found {len(users)} users:")
        for user in users:
            print(f"ID: {user.id} | Email: {user.email} | Active: {user.is_active} | OTP: {user.otp} | Alerts: {user.email_alerts} | SMS: {user.sms_alerts} | Role: {user.job_title}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    list_users()
