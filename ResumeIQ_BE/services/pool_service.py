from sqlalchemy.orm import Session
from models.pool import Pool


def add_to_pool(db: Session, candidate_id: str):
    # Check if already exists
    existing = db.query(Pool).filter(Pool.candidate_id == candidate_id).first()
    if existing:
        return {"message": "Candidate already in pool"}

    # Add to pool
    pool_entry = Pool(candidate_id=candidate_id)
    db.add(pool_entry)
    db.commit()

    return {"message": "Candidate added to pool"}


def remove_from_pool(db: Session, candidate_id: str):
    entry = db.query(Pool).filter(Pool.candidate_id == candidate_id).first()
    if entry:
        db.delete(entry)
        db.commit()
        return {"message": "Candidate removed from pool"}
    return {"message": "Candidate not in pool"}


def get_pool_candidates(db: Session):
    pool_entries = db.query(Pool).all()
    # Support both string and integer candidate IDs
    candidate_ids = []
    for p in pool_entries:
        try:
            candidate_ids.append(int(p.candidate_id))
        except ValueError:
            candidate_ids.append(p.candidate_id)
    return {"candidate_ids": candidate_ids}
