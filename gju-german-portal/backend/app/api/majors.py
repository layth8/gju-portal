from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.major import Major
from app.schemas.major import MajorRead

router = APIRouter(prefix="/api/majors", tags=["majors"])


@router.get("", response_model=list[MajorRead])
def list_majors(db: Session = Depends(get_db)) -> list[Major]:
    return list(db.scalars(select(Major).order_by(Major.school, Major.name)).all())
