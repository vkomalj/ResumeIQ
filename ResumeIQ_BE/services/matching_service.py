def match_resume_with_job(candidate_skills, candidate_exp, job_data):
    resume_skills = set([s.lower() for s in candidate_skills])
    job_skills = set([s.lower() for s in job_data["required_skills"]])

    matched_skills = resume_skills.intersection(job_skills)
    missing_skills = job_skills - resume_skills

    match_percentage = (
        (len(matched_skills) / len(job_skills)) * 100 if job_skills else 0
    )

    experience_match = candidate_exp >= job_data["min_experience"]

    return {
        "match_percentage": round(match_percentage, 2),
        "matched_skills": list(matched_skills),
        "missing_skills": list(missing_skills),
        "experience_match": experience_match,
    }
