import sys
import os

# Ensure we can import from 'app'
sys.path.append(os.getcwd())

from app.db.session import SessionLocal
from app.db.models import User

def enable_all_sms():
    db = SessionLocal()
    try:
        users = db.query(User).all()
        for user in users:
            user.sms_alerts = True
            user.email_alerts = True
            print(f"Enabled SMS & Email for {user.email}")
            
        db.commit()
        print(f"Successfully updated {len(users)} users.")
    except Exception as e:
        print(f"Error updating users: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    enable_all_sms()
