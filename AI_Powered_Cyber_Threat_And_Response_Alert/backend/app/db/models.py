from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey
from sqlalchemy.sql import func
from app.db.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String, nullable=True)
    job_title = Column(String, nullable=True, default="Security Analyst")
    avatar = Column(String, nullable=True)
    
    # --- Auth & Security ---
    is_active = Column(Boolean, default=False)
    mfa_enabled = Column(Boolean, default=False) # New
    mfa_secret = Column(String, nullable=True)  # <--- ADD THIS LINE
    api_key = Column(String, nullable=True, unique=True) # New
    otp = Column(String, nullable=True)
    otp_expiry = Column(DateTime(timezone=True), nullable=True) 
    
    # --- Notification Preferences ---
    email_alerts = Column(Boolean, default=True) # New
    sms_alerts = Column(Boolean, default=False)  # New
    weekly_reports = Column(Boolean, default=True) # New
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, index=True)
    src_ip = Column(String, index=True)
    prediction = Column(String)
    confidence = Column(Float)
    severity = Column(String)
    status = Column(String, default="Active")
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    # Link to User
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)