from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks, UploadFile, File, Form, Body
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import User
from app.schemas.auth import (
    UserSignup, UserLogin, UserVerify, Token, UserResponse, 
    ChangePasswordRequest, ForgotPasswordRequest, ResetPasswordRequest
)
from app.core.security import get_password_hash, verify_password, create_access_token
from app.services.email_service import send_otp_email, send_password_reset_email, send_alert_email
from app.api.deps import get_current_user
from datetime import datetime, timedelta, timezone
import random
import shutil
import uuid # For API Key
import os
from typing import Optional
import pyotp

router = APIRouter()

# --- GET PROFILE ---
@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

# --- UPDATE GENERAL / NOTIFICATIONS ---
@router.put("/me", response_model=UserResponse)
def update_user_me(
    full_name: Optional[str] = Form(None),
    job_title: Optional[str] = Form(None),
    email_alerts: Optional[bool] = Form(None),
    sms_alerts: Optional[bool] = Form(None),
    weekly_reports: Optional[bool] = Form(None),
    mfa_enabled: Optional[bool] = Form(None),
    avatar: Optional[UploadFile] = File(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Update Text Fields
    if full_name is not None: current_user.full_name = full_name
    if job_title is not None: current_user.job_title = job_title
    
    # Update Notifications
    if email_alerts is not None: current_user.email_alerts = email_alerts
    if sms_alerts is not None: current_user.sms_alerts = sms_alerts
    if weekly_reports is not None: current_user.weekly_reports = weekly_reports
    
    # Update MFA
    if mfa_enabled is not None: current_user.mfa_enabled = mfa_enabled

    # Handle Avatar
    if avatar:
        os.makedirs("uploads", exist_ok=True)
        file_extension = avatar.filename.split(".")[-1]
        filename = f"user_{current_user.id}_{int(datetime.now().timestamp())}.{file_extension}"
        file_path = f"uploads/{filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(avatar.file, buffer)
        current_user.avatar = f"http://127.0.0.1:8000/{file_path}"

    db.commit()
    db.refresh(current_user)
    return current_user

# --- CHANGE PASSWORD ---
@router.post("/me/change-password")
async def change_password(
    data: ChangePasswordRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not verify_password(data.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect current password")
    
    current_user.hashed_password = get_password_hash(data.new_password)
    db.commit()
    
    # Send Security Alert Email
    # (Mocking the alert structure to reuse existing service or creating a new one)
    email_data = {
        "src_ip": "Your Device",
        "prediction": "Password Change",
        "severity": "Info",
        "confidence": 1.0,
        "timestamp": datetime.now().isoformat()
    }
    # In a real app, make a dedicated send_security_notification function
    # For now, we simulate sending an alert that the password changed.
    
    return {"message": "Password updated successfully"}

# --- GENERATE API KEY ---
@router.post("/me/api-key")
def generate_api_key(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_key = f"sk_live_{uuid.uuid4().hex}"
    current_user.api_key = new_key
    db.commit()
    return {"api_key": new_key}

# ... (Keep existing auth routes: signup, verify, login, etc.) ...
@router.post("/signup", response_model=UserResponse)
def signup(user: UserSignup, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        if db_user.is_active: raise HTTPException(status_code=400, detail="Email already registered")
        else: 
            db.delete(db_user)
            db.commit()

    otp_code = "".join([str(random.randint(0, 9)) for _ in range(6)])
    new_user = User(
        email=user.email,
        username=user.email,
        full_name=user.full_name,
        hashed_password=get_password_hash(user.password),
        is_active=False,
        otp=otp_code,
        otp_expiry=datetime.now(timezone.utc) + timedelta(minutes=10),
        job_title="Security Analyst"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    background_tasks.add_task(send_otp_email, user.email, otp_code)
    return new_user

@router.post("/verify")
def verify_user(data: UserVerify, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user: raise HTTPException(status_code=404, detail="User not found")
    if user.is_active: return {"message": "Account already active"}
    if user.otp != data.otp: raise HTTPException(status_code=400, detail="Invalid OTP code")
    user.is_active = True
    user.otp = None
    db.commit()
    return {"message": "Account verified successfully"}

# --- ADD THIS NEW ENDPOINT ---
@router.get("/me/mfa/setup")
def setup_mfa(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    secret = pyotp.random_base32()
    current_user.mfa_secret = secret 
    db.commit()
    
    uri = pyotp.totp.TOTP(secret).provisioning_uri(
        name=current_user.email, 
        issuer_name="CyberSentinels"
    )
    return {"secret": secret, "qr_uri": uri}

# --- REPLACE YOUR EXISTING LOGIN FUNCTION WITH THIS ---
@router.post("/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_data.email).first()
    
    # 1. Basic Credential Check
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account not verified.")

    # 2. MFA Enforcement Logic (MISSING IN YOUR CODE)
    if user.mfa_enabled:
        if not user_data.mfa_code:
            # Signal frontend to show the code input
            raise HTTPException(status_code=403, detail="MFA_REQUIRED")
        
        # Verify the provided code
        if not user.mfa_secret:
             raise HTTPException(status_code=400, detail="MFA is enabled but not configured.")
             
        totp = pyotp.TOTP(user.mfa_secret)
        if not totp.verify(user_data.mfa_code):
            raise HTTPException(status_code=401, detail="Invalid MFA Code")

    return {"access_token": create_access_token(data={"sub": user.email}), "token_type": "bearer"}