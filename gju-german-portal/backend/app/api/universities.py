from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.database import get_db
from app.models.university import University, UniversityMajor
from app.schemas.university import UniversityRead

from app.services.localization import (
    CITIES_AR,
    MAJORS_AR,
    SCHOOLS_AR,
    STATES_AR,
    UNI_DESCRIPTIONS_AR,
    UNI_NAMES_AR,
)
from app.schemas.major import MajorRead

router = APIRouter(prefix="/api/universities", tags=["universities"])


def _university_query():
    return select(University).options(selectinload(University.majors)).order_by(University.name)


def _format_uni(u: University, lang: str) -> UniversityRead:
    if lang == "ar":
        localized_majors = [
            MajorRead(
                id=m.id,
                name=MAJORS_AR.get(m.name, m.name),
                school=SCHOOLS_AR.get(m.school, m.school),
            )
            for m in u.majors
        ]
        return UniversityRead(
            id=u.id,
            name=UNI_NAMES_AR.get(u.name, u.name),
            city=CITIES_AR.get(u.city, u.city),
            state=STATES_AR.get(u.state, u.state),
            min_german_level=u.min_german_level,
            min_english_level=u.min_english_level,
            website_url=u.website_url,
            description=UNI_DESCRIPTIONS_AR.get(u.name, u.description),
            majors=localized_majors,
        )
    return UniversityRead.model_validate(u)


@router.get("", response_model=list[UniversityRead])
def list_universities(
    major_id: int | None = Query(default=None),
    german_level: str | None = Query(default=None),
    city: str | None = Query(default=None, description="Search by city or university name"),
    lang: str = Query(default="en", description="Language: 'en' or 'ar'"),
    db: Session = Depends(get_db),
) -> list[UniversityRead]:
    stmt = _university_query()

    if major_id is not None:
        stmt = stmt.join(UniversityMajor).where(UniversityMajor.major_id == major_id)

    if german_level:
        stmt = stmt.where(University.min_german_level == german_level)

    if city:
        if lang != "ar":
            like = f"%{city.strip()}%"
            stmt = stmt.where((University.city.ilike(like)) | (University.name.ilike(like)))

    unis = list(db.scalars(stmt).unique().all())
    formatted = [_format_uni(u, lang) for u in unis]

    if city and lang == "ar":
        query_text = city.strip().lower()
        return [
            u for u in formatted
            if query_text in u.name.lower() or query_text in u.city.lower() or query_text in u.state.lower()
        ]

    return formatted


@router.get("/{university_id}", response_model=UniversityRead)
def get_university(
    university_id: int,
    lang: str = Query(default="en", description="Language: 'en' or 'ar'"),
    db: Session = Depends(get_db),
) -> UniversityRead:
    university = db.scalar(_university_query().where(University.id == university_id))
    if university is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="University not found")
    return _format_uni(university, lang)
