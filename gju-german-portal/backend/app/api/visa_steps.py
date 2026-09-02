from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.visa_step import VisaStep
from app.schemas.visa_step import VisaStepRead

router = APIRouter(prefix="/api/visa-steps", tags=["visa"])


@router.get("", response_model=list[VisaStepRead])
def list_visa_steps(db: Session = Depends(get_db)) -> list[VisaStep]:
    return list(db.scalars(select(VisaStep).order_by(VisaStep.step_number)).all())
