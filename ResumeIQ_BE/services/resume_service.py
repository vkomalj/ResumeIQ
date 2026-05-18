import re
import os
import shutil
import uuid

from rapidfuzz import fuzz

from utils.ai_extractor import extract_skills_ai
from utils.pdf_reader import extract_text_from_pdf
from utils.skill_extractor import extract_skills, predict_salary
from utils.vector_store import save_candidate, search_candidates


async def analyze_resume_file(db, file, job_description):
    # Save the file to disk
    os.makedirs("uploads", exist_ok=True)
    unique_filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join("uploads", unique_filename)
    
    # Reset stream pointer and save contents
    await file.seek(0)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Reset pointer for PyPDF2 extraction
    await file.seek(0)
    text = extract_text_from_pdf(file.file)

    data = extract_skills_ai(text)

    skills = data["technical_skills"]
    exp = data["years_of_experience"]

    salary = predict_salary(exp, len(skills))

    # Save FULL candidate info
    candidate = save_candidate(db, data, job_description, salary, resume_filename=unique_filename)

    return {
        "candidate": {
            "name": data["name"],
            "email": data["email"],
            "phone": data["phone"],
        },
        "skills": skills,
        "experience": exp,
        "predicted_salary": int(salary),
        "candidate_id": candidate.id,
    }


def analyze_text(text: str):
    skills = extract_skills(text)

    return {"skills_found": skills, "total_skills": len(skills)}


def search_resume(query: str):
    results = search_candidates(query)

    return {"query": query, "results": results}


def is_similar(word, skill, threshold=80):
    return fuzz.ratio(word, skill) >= threshold


def smart_search(query: str):
    def normalize(skill):
        return skill.lower().split("(")[0].strip()

    # Step 1: Fetch candidates
    candidates = search_candidates(query)
    print(candidates, "candidates")

    # Step 2: Build dynamic skill set
    all_skills = set()
    for c in candidates:
        for s in c.get("skills", []):
            all_skills.add(normalize(s))

    # Step 3: Extract skills from query (with typo tolerance)
    words = re.split(r"[,\s]+", query.lower())
    skills_filter = set()

    for word in words:
        for skill in all_skills:
            if is_similar(word, skill):
                skills_filter.add(skill)

    skills_filter = list(skills_filter)

    # Step 4: Extract experience
    min_exp = 0
    match = re.search(r"\d+", query)
    if match:
        min_exp = int(match.group())

    exact_matches = []
    partial_matches = []

    # Step 5: Match candidates
    for c in candidates:
        candidate_skills = [normalize(s) for s in c.get("skills", [])]

        # Fuzzy skill match
        if not skills_filter:
            skill_match = False
        else:
            skill_match = any(
                f.lower() in cs.lower()
                for f in skills_filter
                for cs in candidate_skills
            )

        exp_match = c.get("experience", 0) >= min_exp

        if skill_match and exp_match:
            exact_matches.append(c)
        elif skill_match:
            partial_matches.append(c)

    # Step 6: Final response
    if exact_matches:
        results = exact_matches
        message = "Exact match"
    elif partial_matches:
        results = partial_matches
        message = "Partial match"
    else:
        results = []
        message = "No relevant candidates found"

    results = dedupe(results)
    return {
        "query": query,
        "filters": {"skills": skills_filter, "min_experience": min_exp},
        "message": message,
        "results": results,
    }


def dedupe(candidates):
    seen = set()
    unique = []

    for c in candidates:
        if c["email"] in seen:
            continue
        seen.add(c["email"])
        unique.append(c)

    return unique
