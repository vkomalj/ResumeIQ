from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.db import get_db
from schemas.job_schema import JobCreate
from services import job_service

router = APIRouter()


@router.post("/create-job")
async def create_job(job: JobCreate, db: Session = Depends(get_db)):
    return await job_service.create_job(db, job)


@router.get("/jobs")
def get_jobs(db: Session = Depends(get_db)):
    return job_service.get_all_jobs(db)


@router.delete("/jobs/{job_id}")
def delete_job(job_id: int, db: Session = Depends(get_db)):
    return job_service.delete_job_by_id(db, job_id)
