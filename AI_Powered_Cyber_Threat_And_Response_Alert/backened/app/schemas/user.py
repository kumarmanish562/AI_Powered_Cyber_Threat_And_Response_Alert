from pydantic import BaseModel, EmailStr
from typing import Optional

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    job_title: Optional[str] = None
    alert_email: Optional[EmailStr] = None

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    full_name: Optional[str]
    job_title: Optional[str]
    alert_email: Optional[str]

    class Config:
        from_attributes = True