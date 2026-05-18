from typing import Optional

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    name: Optional[str] = None
    email: EmailStr
    password: Optional[str] = None
    role: str = "employee"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class SetPassword(BaseModel):
    email: EmailStr
    new_password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str

    class Config:
        from_attributes = True
