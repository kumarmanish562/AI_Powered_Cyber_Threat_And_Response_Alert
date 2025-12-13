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

async def send_alert_email(recipients: list, data: dict):
    """
    Sends Security Alert Email to subscribed users
    """
    if not recipients:
        return

    try:
        # Determine Color/Icon based on severity
        severity = data.get('severity', 'Medium')
        color = "#eab308" # Yellow
        if severity == "Critical": color = "#dc2626" # Red
        elif severity == "High": color = "#f97316" # Orange
        elif severity == "Low": color = "#3b82f6" # Blue

        html = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
            <div style="background-color: {color}; padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">⚠️ Security Alert: {severity}</h1>
            </div>
            <div style="padding: 30px; background-color: #f8fafc;">
                <p style="color: #475569; margin-bottom: 20px; font-size: 16px;">
                    <strong>ThreatWatch AI</strong> has detected a potential threat on your network.
                </p>
                
                <div style="background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px; color: #64748b; font-size: 14px;">Prediction</td>
                            <td style="padding: 8px; color: #0f172a; font-weight: bold;">{data.get('prediction', 'Unknown')}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; color: #64748b; font-size: 14px;">Source IP</td>
                            <td style="padding: 8px; color: #0f172a; font-family: monospace;">{data.get('src_ip', 'N/A')}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; color: #64748b; font-size: 14px;">Confidence</td>
                            <td style="padding: 8px; color: #0f172a;">{float(data.get('confidence', 0)) * 100:.1f}%</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; color: #64748b; font-size: 14px;">Time</td>
                            <td style="padding: 8px; color: #0f172a;">{data.get('timestamp', 'Just now')}</td>
                        </tr>
                    </table>
                </div>

                <a href="http://localhost:5173/dashboard" style="display: block; width: 100%; padding: 12px; background-color: #0f172a; color: white; text-align: center; text-decoration: none; border-radius: 6px; font-weight: bold;">
                    View Incident Details
                </a>
                
                <p style="color: #94a3b8; font-size: 12px; margin-top: 20px; text-align: center;">
                    Alert ID: {data.get('alert_id', 'N/A')}
                </p>
            </div>
        </div>
        """
        
        message = MessageSchema(
            subject=f"🚨 {severity} Threat Detected: {data.get('prediction')}",
            recipients=recipients,
            body=html,
            subtype=MessageType.html
        )

        fm = FastMail(conf)
        await fm.send_message(message)
        logger.info(f"📧 Security Alert sent to {len(recipients)} recipients")

    except Exception as e:
        logger.error(f"❌ Failed to send Alert Email: {e}") 

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
            subject="🔐 Your Verification Code - ThreatWatch AI AI",
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
            subject="🔑 Password Reset Request - ThreatWatch AI AI",
            recipients=[email],
            body=html,
            subtype=MessageType.html
        )

        fm = FastMail(conf)
        await fm.send_message(message)
        logger.info(f"📧 Password reset OTP sent to {email}")

    except Exception as e:
        logger.error(f"❌ Failed to send Reset OTP: {e}")

async def send_newsletter_subscription_email(email: str):
    """
    Sends Newsletter Subscription Confirmation
    """
    try:
        html = f"""
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
            <div style="background-color: #10b981; padding: 20px; text-align: center;">
                <img src="https://img.icons8.com/color/96/000000/security-checked--v1.png" alt="ThreatWatch AI AI Logo" style="width: 64px; height: 64px; margin-bottom: 10px;">
                <h1 style="color: white; margin: 0; font-size: 24px;">Subscription Confirmed!</h1>
            </div>
            <div style="padding: 30px; background-color: #f8fafc; text-align: center;">
                <p style="color: #475569; margin-bottom: 20px;">Thank you for subscribing to ThreatWatch AI AI updates.</p>
                
                <div style="background-color: #ecfdf5; color: #047857; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                    You will now receive the latest threat intelligence and security alerts directly to your inbox.
                </div>
                
                <p style="color: #94a3b8; font-size: 12px; margin-top: 20px;">If you didn't subscribe, please ignore this email.</p>
            </div>
        </div>
        """
        
        message = MessageSchema(
            subject="✅ Subscription Confirmed - ThreatWatch AI AI",
            recipients=[email],
            body=html,
            subtype=MessageType.html
        )

        fm = FastMail(conf)
        await fm.send_message(message)
        logger.info(f"📧 Newsletter confirmation sent to {email}")

    except Exception as e:
        logger.error(f"❌ Failed to send Newsletter Confirmation: {e}")

async def send_mock_sms(email: str, message_text: str):
    """
    Simulates sending an SMS by sending a short email.
    In a real production environment, this would use Twilio or AWS SNS.
    """
    try:
        html = f"""
        <div style="font-family: monospace; padding: 20px; border: 2px solid #333; border-radius: 10px; max-width: 300px; background-color: #f0f0f0; margin: auto;">
            <div style="border-bottom: 1px solid #ccc; padding-bottom: 10px; margin-bottom: 10px; display: flex; justify-content: space-between;">
                 <span style="font-weight: bold;">💬 Messages</span>
                 <span style="color: #666;">Now</span>
            </div>
            <div style="background-color: #e5e5ea; padding: 10px; border-radius: 15px; display: inline-block; max-width: 80%;">
                <p style="margin: 0; font-size: 14px; color: black;">{message_text}</p>
            </div>
            <div style="margin-top: 15px; font-size: 10px; color: #888; text-align: center;">
                Sent via ThreatWatch AI SMS Gateway (Simulation)
            </div>
        </div>
        """
        
        message = MessageSchema(
            subject=f"📱 SMS: {message_text[:30]}...",
            recipients=[email],
            body=html,
            subtype=MessageType.html
        )

        fm = FastMail(conf)
        await fm.send_message(message)
        logger.info(f"📱 Mock SMS sent to {email}")

    except Exception as e:
        logger.error(f"❌ Failed to send Mock SMS: {e}")