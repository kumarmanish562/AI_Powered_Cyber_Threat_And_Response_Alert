import asyncio
import os
import sys

# Ensure we can import from app
sys.path.append(os.getcwd())

from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from app.core.config import settings
from pydantic import EmailStr

# Setup Config
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

async def test_send_email():
    print(f"Testing Email Configuration...")
    print(f"Server: {settings.MAIL_SERVER}:{settings.MAIL_PORT}")
    print(f"User: {settings.MAIL_USERNAME}")
    
    body = """
    <h1>Test Email</h1>
    <p>If you see this, the email configuration is working correctly!</p>
    """

    message = MessageSchema(
        subject="Test Email - Debugging",
        recipients=[settings.MAIL_USERNAME], # Send to self
        body=body,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    try:
        await fm.send_message(message)
        print("✅ Email sent successfully!")
    except Exception as e:
        print(f"❌ Email sending failed:")
        print(e)

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(test_send_email())
