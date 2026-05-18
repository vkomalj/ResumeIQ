# from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
# import os
#
# conf = ConnectionConfig(
#     MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
#     MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
#     MAIL_FROM=os.getenv("MAIL_FROM"),
#     MAIL_PORT=int(os.getenv("MAIL_PORT")),
#     MAIL_SERVER=os.getenv("MAIL_SERVER"),
#     MAIL_STARTTLS=True,
#     MAIL_SSL_TLS=False,
# )
#
# async def send_credentials_email(email: str, name: str, password: str):
#     message = MessageSchema(
#         subject="Your HRMS Login Credentials",
#         recipients=[email],
#         body=f"""
#         Hello {name},
#
#         Your account has been created.
#
#         Email: {email}
#         Temporary Password: {password}
#
#         Please login and change your password.
#
#         Thanks,
#         HR Team
#         """,
#         subtype="plain"
#     )
#
#     fm = FastMail(conf)
#     await fm.send_message(message)


import os
import smtplib
from email.mime.text import MIMEText


def send_credentials_email(to_email, name, password):
    from_email = os.getenv("MAIL_FROM")
    app_password = os.getenv("MAIL_PASSWORD")

    subject = "HRMS Login Credentials"

    body = f"""
Hello {name},

Your account has been created.

Email: {to_email}
Temporary Password: {password}

Please login and change your password.

Thanks,
HR Team
"""

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = from_email
    msg["To"] = to_email

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(from_email, app_password)
            server.send_message(msg)
            print("Email sent successfully")

    except Exception as e:
        print(" Email error:", str(e))


