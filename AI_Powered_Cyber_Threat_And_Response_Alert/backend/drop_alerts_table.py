import sys
import os
from sqlalchemy import text

# Ensure we can import from 'app'
sys.path.append(os.getcwd())

from app.db.session import engine

def drop_alerts_table():
    try:
        with engine.connect() as connection:
            connection.execute(text("DROP TABLE IF EXISTS alerts CASCADE"))
            connection.commit()
        print("✅ Successfully dropped 'alerts' table.")
    except Exception as e:
        print(f"❌ Error dropping table: {e}")

if __name__ == "__main__":
    drop_alerts_table()
