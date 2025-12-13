from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text
from app.db.session import engine, Base
from app.api import auth, endpoints
import os

# 1. Ensure upload directory exists
os.makedirs("uploads", exist_ok=True)

# 2. Run Auto-Migration for new columns
def run_migrations():
    try:
        with engine.connect() as connection:
            # Avatar
            connection.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar VARCHAR"))
            
            # Security Settings
            connection.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS mfa_enabled BOOLEAN DEFAULT FALSE"))
            connection.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS api_key VARCHAR"))
            
            # Notification Preferences
            connection.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS email_alerts BOOLEAN DEFAULT TRUE"))
            connection.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS sms_alerts BOOLEAN DEFAULT FALSE"))
            connection.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS weekly_reports BOOLEAN DEFAULT TRUE"))
            
            # ... existing migrations ...
            connection.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS mfa_secret VARCHAR"))
            connection.commit()
            print("Database migration successful: All columns verified.")
    except Exception as e:
        print(f"Migration warning: {e}")

# Run the migration
run_migrations()

# Create other tables if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Cyber Defense Backend")

# 3. Mount the uploads directory to serve images
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(endpoints.router, prefix="/api", tags=["Threat Analysis"])

@app.get("/")
def root():
    return {"status": "System Online", "message": "Backend is running."}