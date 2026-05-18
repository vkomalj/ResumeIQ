from sqlalchemy import JSON, Column, Integer, String

from db.db import Base


class Job(Base):
    __tablename__ = "jobs"
    __allow_unmapped__ = True

    id = Column(Integer, primary_key=True)
    title = Column(String)
    required_skills = Column(JSON)
    min_experience = Column(Integer)
