from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from constants.response_codes import (INVALID_CREDENTIALS, SERVER_ERROR,
                                      SUCCESS, USER_NOT_FOUND)
from models.user_model import User
from utils.email import send_credentials_email
from utils.security import (generate_temp_password, hash_password,
                            verify_password)


async def create_user(db: Session, user_data):
    password_to_hash = user_data.password if user_data.password else generate_temp_password()
    hashed_pwd = hash_password(password_to_hash)
    is_first_login = not bool(user_data.password)

    user = User(
        name=user_data.name,
        email=user_data.email,
        password=hashed_pwd,
        is_first_login=is_first_login,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    # 📧 send email only if a temporary password was generated
    if not user_data.password:
        send_credentials_email(user.email, user.name, password_to_hash)

    return user


async def login_user(db: Session, user_data):
    try:
        user = db.query(User).filter(User.email == user_data.email).first()

        if not user:
            return {"code": USER_NOT_FOUND, "message": "User not found"}

        if not verify_password(user_data.password, user.password):
            return {"code": INVALID_CREDENTIALS, "message": "Invalid email or password"}

        # ✅ Allow login even with temporary password
        return {
            "status": SUCCESS,
            "message": "Login successful",
            "id": str(user.id),
            "name": user.name,
            "email": user.email,
            "is_first_login": user.is_first_login,  # optional (for future use)
        }

    except HTTPException:
        raise  # re-throw FastAPI errors

    except Exception as e:
        print("Login error:", str(e))  # debug log

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong",
        )


def get_all_users(db: Session):
    return db.query(User).all()


def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()


def delete_user(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        db.delete(user)
        db.commit()
    return user


