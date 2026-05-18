from sqlalchemy import Column, Integer, String

from db.db import Base


class Pool(Base):
    __tablename__ = "pool"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(String, unique=True, index=True)
