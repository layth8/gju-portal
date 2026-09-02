from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.core.security import require_admin_key
from app.database import get_db
from app.models.major import Major
from app.models.university import University
from app.schemas.university import UniversityCreate, UniversityRead, UniversityUpdate

router = APIRouter(
    prefix="/api/admin",
    tags=["admin"],
    dependencies=[Depends(require_admin_key)],
)


def _load_university(db: Session, university_id: int) -> University | None:
    return db.scalar(
        select(University)
        .options(selectinload(University.majors))
        .where(University.id == university_id)
    )


def _assign_majors(db: Session, university: University, major_ids: list[int]) -> None:
    if not major_ids:
        university.majors = []
        return
    majors = list(db.scalars(select(Major).where(Major.id.in_(major_ids))).all())
    if len(majors) != len(set(major_ids)):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="One or more major IDs are invalid")
    university.majors = majors


@router.post("/universities", response_model=UniversityRead, status_code=status.HTTP_201_CREATED)
def create_university(payload: UniversityCreate, db: Session = Depends(get_db)) -> University:
    existing = db.scalar(select(University).where(University.name == payload.name))
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="University already exists")

    university = University(
        name=payload.name,
        city=payload.city,
        state=payload.state,
        min_german_level=payload.min_german_level,
        min_english_level=payload.min_english_level,
        website_url=str(payload.website_url),
        description=payload.description,
    )
    _assign_majors(db, university, payload.major_ids)
    db.add(university)
    db.commit()
    db.refresh(university)
    return _load_university(db, university.id) or university


@router.put("/universities/{university_id}", response_model=UniversityRead)
def update_university(
    university_id: int,
    payload: UniversityUpdate,
    db: Session = Depends(get_db),
) -> University:
    university = _load_university(db, university_id)
    if university is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="University not found")

    data = payload.model_dump(exclude_unset=True)
    major_ids = data.pop("major_ids", None)
    if "website_url" in data and data["website_url"] is not None:
        data["website_url"] = str(data["website_url"])

    for field, value in data.items():
        setattr(university, field, value)

    if major_ids is not None:
        _assign_majors(db, university, major_ids)

    db.commit()
    db.refresh(university)
    return _load_university(db, university.id) or university


@router.delete("/universities/{university_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_university(university_id: int, db: Session = Depends(get_db)) -> None:
    university = db.get(University, university_id)
    if university is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="University not found")
    db.delete(university)
    db.commit()
