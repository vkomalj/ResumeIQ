import chromadb
import numpy as np

client = chromadb.PersistentClient(path="./chroma_db")
from models.candidate_model import Candidate

collection = client.get_or_create_collection(name="candidates")


from models.job_matches_model import JobMatch

def save_candidate(db, data, job_role, salary, resume_filename=None):

    if isinstance(salary, np.generic):
        salary = float(salary)

    # 🔍 Check if candidate already exists in Postgres by email
    candidate = db.query(Candidate).filter(Candidate.email == data["email"]).first()

    if candidate:
        # Update existing candidate details in PostgreSQL
        candidate.name = data["name"]
        candidate.phone = data["phone"]
        candidate.skills = data["technical_skills"]
        candidate.experience = data["years_of_experience"]
        candidate.predicted_salary = salary
        if resume_filename:
            candidate.resume_file = resume_filename
    else:
        # Create a new candidate in PostgreSQL
        candidate = Candidate(
            name=data["name"],
            email=data["email"],
            phone=data["phone"],
            skills=data["technical_skills"],
            experience=data["years_of_experience"],
            predicted_salary=salary,
            resume_file=resume_filename
        )
        db.add(candidate)

    db.commit()
    db.refresh(candidate)

    candidate_id = str(candidate.id)

    # Clean up any existing job match entries for this candidate to prevent duplicates
    db.query(JobMatch).filter(JobMatch.candidate_id == candidate.id).delete()
    db.commit()

    # Vector DB (Only used for fuzzy search/queries)
    searchable_text = f"""
    {data["name"]}
    {data["technical_skills"]}
    {job_role}
    """

    collection.upsert(
        documents=[searchable_text],
        metadatas=[
            {
                "candidate_id": candidate_id,
                "name": data["name"],
                "skills": data["technical_skills"],
            }
        ],
        ids=[candidate_id],
    )

    return candidate


from db.db import SessionLocal

def search_candidates(query):
    results = collection.query(query_texts=[query], n_results=10)

    candidate_ids = []
    for i in range(len(results["documents"][0])):
        meta = results["metadatas"][0][i]
        c_id = meta.get("candidate_id")
        if c_id:
            try:
                candidate_ids.append(int(c_id))
            except ValueError:
                pass

    if not candidate_ids:
        return []

    db = SessionLocal()
    try:
        candidates = db.query(Candidate).filter(Candidate.id.in_(candidate_ids)).all()
        candidates_map = {c.id: c for c in candidates}
        
        response = []
        seen = set()
        
        for c_id in candidate_ids:
            c = candidates_map.get(c_id)
            if not c:
                continue
                
            email = c.email
            if email in seen:
                continue
            seen.add(email)
            
            response.append({
                "name": c.name,
                "email": c.email,
                "phone": c.phone,
                "skills": c.skills or [],
                "experience": c.experience or 0,
                "job_role": c.job_role or "Candidate",
                "predicted_salary": c.predicted_salary or 0
            })
            
        return response
    finally:
        db.close()


def get_all_candidates():
    results = collection.get(include=["metadatas"])
    seen = set()
    unique_candidates = []

    for meta in results.get("metadatas", []):
        if not meta:
            continue

        email = meta.get("email")

        if email and email not in seen:
            seen.add(email)
            unique_candidates.append(meta)

    return {"candidates": unique_candidates}
