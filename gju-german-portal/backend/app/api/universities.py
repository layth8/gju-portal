from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.database import get_db
from app.models.university import University, UniversityMajor
from app.schemas.university import UniversityRead

router = APIRouter(prefix="/api/universities", tags=["universities"])


def _university_query():
    return select(University).options(selectinload(University.majors)).order_by(University.name)


@router.get("", response_model=list[UniversityRead])
def list_universities(
    major_id: int | None = Query(default=None),
    german_level: str | None = Query(default=None),
    city: str | None = Query(default=None, description="Search by city or university name"),
    db: Session = Depends(get_db),
) -> list[University]:
    stmt = _university_query()

    if major_id is not None:
        stmt = stmt.join(UniversityMajor).where(UniversityMajor.major_id == major_id)

    if german_level:
        stmt = stmt.where(University.min_german_level == german_level)

    if city:
        like = f"%{city.strip()}%"
        stmt = stmt.where((University.city.ilike(like)) | (University.name.ilike(like)))

    stmt = stmt.distinct()
    return list(db.scalars(stmt).unique().all())


@router.get("/{university_id}", response_model=UniversityRead)
def get_university(university_id: int, db: Session = Depends(get_db)) -> University:
    university = db.scalar(_university_query().where(University.id == university_id))
    if university is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="University not found")
    return university
