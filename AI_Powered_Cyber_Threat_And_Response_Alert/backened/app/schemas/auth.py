from pydantic import BaseModel, EmailStr
from typing import Optional

class UserSignup(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    mfa_code: Optional[str] = None

class UserVerify(BaseModel):
    email: EmailStr
    otp: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str
    new_password: str

# --- Missing Class Added Here ---
class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: Optional[str] = None
    job_title: Optional[str] = None
    avatar: Optional[str] = None
    is_active: bool
    
    # New Fields for Settings
    mfa_enabled: bool = False
    email_alerts: bool = True
    sms_alerts: bool = False
    weekly_reports: bool = True
    api_key: Optional[str] = None
    
    class Config:
        from_attributes = True