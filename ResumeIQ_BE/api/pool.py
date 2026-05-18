from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.db import get_db
from services import pool_service

router = APIRouter()


@router.post("/{candidate_id}")
def add_to_pool(candidate_id: str, db: Session = Depends(get_db)):
    return pool_service.add_to_pool(db, candidate_id)


@router.delete("/{candidate_id}")
def remove_from_pool(candidate_id: str, db: Session = Depends(get_db)):
    return pool_service.remove_from_pool(db, candidate_id)


@router.get("")
def get_pool(db: Session = Depends(get_db)):
    return pool_service.get_pool_candidates(db)
