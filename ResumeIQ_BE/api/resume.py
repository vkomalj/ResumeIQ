from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from db.db import get_db
from models.candidate_model import Candidate
from models.job_matches_model import JobMatch
from models.job_model import Job
from services.matching_service import match_resume_with_job
from services.resume_service import (analyze_resume_file, analyze_text,
                                     smart_search)
from utils.vector_store import get_all_candidates

router = APIRouter()


@router.post("/match-resume-job")
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    job_description: str = Form(...),
):

    # Analyze resume (This automatically handles the duplicate-proof Postgres & ChromaDB upsert)
    resume_data = await analyze_resume_file(db, file, job_description)

    candidate_skills = resume_data["skills"]
    candidate_exp = resume_data["experience"]
    candidate_details = resume_data["candidate"]
    candidate_id = resume_data["candidate_id"]

    # ✅ Fetch jobs
    jobs = db.query(Job).all()

    results = []

    for job in jobs:
        #  Convert DB skills to list
        job_skills = [s.strip().lower() for s in job.required_skills]

        job_data = {"required_skills": job_skills, "min_experience": job.min_experience}

        match_result = match_resume_with_job(
            candidate_skills,
            candidate_exp,
            job_data,
        )
        match_entry = JobMatch(
            candidate_id=candidate_id,
            job_id=job.id,
            match_percentage=match_result["match_percentage"],
        )
        db.add(match_entry)

        results.append(
            {
                "job_id": job.id,
                "title": job.title,
                "match_percentage": match_result["match_percentage"],
                "matched_skills": match_result["matched_skills"],
                "missing_skills": match_result["missing_skills"],
                "experience_match": match_result["experience_match"],
            }
        )

    db.commit()

    # ✅ Sort best match first
    results = sorted(results, key=lambda x: x["match_percentage"], reverse=True)

    return {
        "code": 1000,
        "message": "Resume matched with jobs successfully",
        "data": {"resume_analysis": resume_data, "job_matches": results},
    }


@router.get("/candidates")
def getallcandidates(db: Session = Depends(get_db)):
    candidates = db.query(Candidate).all()
    return {
        "candidates": [
            {
                "id": c.id,
                "name": c.name,
                "email": c.email,
                "phone": c.phone,
                "skills": c.skills,
                "experience": c.experience,
                "predicted_salary": c.predicted_salary,
                "job_role": c.job_role,
                "resume_file": c.resume_file,
            }
            for c in candidates
        ]
    }


@router.get("/search")
def search(query: str):
    return smart_search(query)


@router.post("/analyze")
def analyze_resume(text: str):
    return analyze_text(text)
