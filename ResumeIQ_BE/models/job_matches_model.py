from sqlalchemy import JSON, Column, DateTime, Float, Integer, String

from db.db import Base


class JobMatch(Base):
    __tablename__ = "job_matches"

    id = Column(Integer, primary_key=True)
    candidate_id = Column(Integer)
    job_id = Column(Integer)
    match_percentage = Column(Float)
