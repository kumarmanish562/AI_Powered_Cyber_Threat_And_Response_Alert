import sys
import os

# Ensure we can import from 'app'
sys.path.append(os.getcwd())

from app.db.session import SessionLocal
from app.db.models import User

def delete_all_users():
    db = SessionLocal()
    try:
        # Delete all users
        num_deleted = db.query(User).delete()
        db.commit()
        print(f"Successfully deleted {num_deleted} users from the database.")
    except Exception as e:
        print(f"Error deleting users: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Starting user deletion process...")
    delete_all_users()
