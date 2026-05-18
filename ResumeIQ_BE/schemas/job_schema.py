from typing import List

from pydantic import BaseModel


class JobCreate(BaseModel):
    title: str
    required_skills: List[str]
    min_experience: int
