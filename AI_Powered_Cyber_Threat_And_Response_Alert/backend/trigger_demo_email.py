import asyncio
import sys
import os

# Ensure we can import from 'app'
sys.path.append(os.getcwd())

from app.services.email_service import send_alert_email
from app.db.session import SessionLocal
from app.db.models import User
from datetime import datetime

async def main():
    print("Triggering Demo Alert Email for Presentation...")
    
    # 1. Get Recipients
    db = SessionLocal()
    try:
        subscribed_users = db.query(User).filter(User.email_alerts == True).all()
        recipients = [u.email for u in subscribed_users]
    except Exception as e:
        print(f"DB Error: {e}")
        return
    finally:
        db.close()
    
    if not recipients:
        print("No users found with email_alerts enabled. Please check database.")
        # Fallback for demo
        # recipients = ["your_email@example.com"] 
        return

    print(f"Sending to: {recipients}")

    # 2. Mock Alert Data
    demo_data = {
        "prediction": "Simulation: SQL Injection Attack",
        "src_ip": "192.168.0.105 (Suspicious)",
        "confidence": 0.98,
        "severity": "Critical",
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "alert_id": "DEMO-12345"
    }

    # 3. Send Email
    try:
        await send_alert_email(recipients, demo_data)
        print("Demo Email Sent Successfully! Check your inbox.")
    except Exception as e:
        print(f"Failed to send email: {e}")

if __name__ == "__main__":
    # Windows SelectorPolicy fix for asyncio if needed, but usually fine for simple tasks
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
        
    asyncio.run(main())
