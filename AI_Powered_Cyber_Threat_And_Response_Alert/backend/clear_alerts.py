from app.db.session import SessionLocal
from app.db.models import Alert
import sys

def clear_alerts():
    db = SessionLocal()
    try:
        num_deleted = db.query(Alert).delete()
        db.commit()
        print(f"✅ Successfully deleted {num_deleted} alerts.")
        print("The Dashboard and Threats page should now be empty.")
    except Exception as e:
        print(f"❌ Error deleting alerts: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Deleting all alerts...")
    clear_alerts()
