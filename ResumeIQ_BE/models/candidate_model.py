from datetime import datetime

from sqlalchemy import JSON, Column, DateTime, Float, Integer, String

from db.db import Base


class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=True)
    email = Column(String, nullable=True)
    phone = Column(String)
    skills = Column(JSON)  # store list directly
    experience = Column(Float)
    resume_file = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    job_role = Column(String)
    predicted_salary = Column(Float)
