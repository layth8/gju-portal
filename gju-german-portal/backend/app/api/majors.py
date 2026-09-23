from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.major import Major
from app.schemas.major import MajorRead
from app.services.localization import MAJORS_AR, SCHOOLS_AR

router = APIRouter(prefix="/api/majors", tags=["majors"])


@router.get("", response_model=list[MajorRead])
def list_majors(
    lang: str = Query(default="en", description="Language: 'en' or 'ar'"),
    db: Session = Depends(get_db),
) -> list[MajorRead]:
    majors = list(db.scalars(select(Major).order_by(Major.school, Major.name)).all())
    if lang == "ar":
        return [
            MajorRead(
                id=m.id,
                name=MAJORS_AR.get(m.name, m.name),
                school=SCHOOLS_AR.get(m.school, m.school),
            )
            for m in majors
        ]
    return [MajorRead.model_validate(m) for m in majors]
