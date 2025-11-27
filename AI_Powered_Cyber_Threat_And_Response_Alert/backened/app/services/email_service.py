from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from app.core.config import settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

async def send_alert_email(data: dict):
    # ... (Existing alert logic) ...
    pass 

async def send_otp_email(email: str, otp: str):
    """
    Sends Verification OTP
    """
    try:
        html = f"""
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
            <div style="background-color: #2563eb; padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">Verify Your Account</h1>
            </div>
            <div style="padding: 30px; background-color: #f8fafc; text-align: center;">
                <p style="color: #475569; margin-bottom: 20px;">Use the following code to complete your registration:</p>
                
                <div style="background-color: #e2e8f0; color: #1e293b; font-size: 32px; font-weight: bold; letter-spacing: 5px; padding: 15px; border-radius: 5px; display: inline-block;">
                    {otp}
                </div>
                
                <p style="color: #94a3b8; font-size: 12px; margin-top: 20px;">This code expires in 10 minutes.</p>
            </div>
        </div>
        """
        
        message = MessageSchema(
            subject="🔐 Your Verification Code - CyberSentinels",
            recipients=[email],
            body=html,
            subtype=MessageType.html
        )

        fm = FastMail(conf)
        await fm.send_message(message)
        logger.info(f"📧 OTP sent to {email}")

    except Exception as e:
        logger.error(f"❌ Failed to send OTP: {e}")

async def send_password_reset_email(email: str, otp: str):
    """
    Sends Password Reset OTP
    """
    try:
        html = f"""
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
            <div style="background-color: #dc2626; padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">Reset Your Password</h1>
            </div>
            <div style="padding: 30px; background-color: #f8fafc; text-align: center;">
                <p style="color: #475569; margin-bottom: 20px;">We received a request to reset your password. Use the code below:</p>
                
                <div style="background-color: #e2e8f0; color: #1e293b; font-size: 32px; font-weight: bold; letter-spacing: 5px; padding: 15px; border-radius: 5px; display: inline-block;">
                    {otp}
                </div>
                
                <p style="color: #94a3b8; font-size: 12px; margin-top: 20px;">If you didn't request this, you can safely ignore this email.</p>
            </div>
        </div>
        """
        
        message = MessageSchema(
            subject="🔑 Password Reset Request - CyberSentinels",
            recipients=[email],
            body=html,
            subtype=MessageType.html
        )

        fm = FastMail(conf)
        await fm.send_message(message)
        logger.info(f"📧 Password reset OTP sent to {email}")

    except Exception as e:
        logger.error(f"❌ Failed to send Reset OTP: {e}")