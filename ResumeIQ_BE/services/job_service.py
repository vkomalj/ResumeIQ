from sqlalchemy.orm import Session

from models.job_model import Job


async def create_job(db: Session, job_data):
    job = Job(
        title=job_data.title,
        required_skills=job_data.required_skills,
        min_experience=job_data.min_experience,
    )

    db.add(job)
    db.commit()
    db.refresh(job)

    return {
        "code": 1000,
        "message": "Job created successfully",
        "data": {"id": job.id, "title": job.title},
    }


def get_all_jobs(db: Session):
    jobs = db.query(Job).all()
    return {
        "code": 1000,
        "message": "Jobs fetched successfully",
        "data": [
            {
                "id": job.id,
                "title": job.title,
                "required_skills": job.required_skills,
                "min_experience": job.min_experience,
            }
            for job in jobs
        ],
    }


def delete_job_by_id(db: Session, job_id: int):
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        return None  # or raise exception

    db.delete(job)
    db.commit()

    return job
