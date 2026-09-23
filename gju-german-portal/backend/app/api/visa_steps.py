from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.visa_step import VisaStep
from app.schemas.visa_step import VisaStepRead
from app.services.localization import VISA_STEPS_AR

router = APIRouter(prefix="/api/visa-steps", tags=["visa"])


@router.get("", response_model=list[VisaStepRead])
def list_visa_steps(
    lang: str = Query(default="en", description="Language: 'en' or 'ar'"),
    db: Session = Depends(get_db),
) -> list[VisaStepRead]:
    steps = list(db.scalars(select(VisaStep).order_by(VisaStep.step_number)).all())
    if lang == "ar":
        result: list[VisaStepRead] = []
        for s in steps:
            ar_data = VISA_STEPS_AR.get(s.step_number, {})
            result.append(
                VisaStepRead(
                    id=s.id,
                    step_number=s.step_number,
                    title=ar_data.get("title", s.title),
                    description=ar_data.get("description", s.description),
                    category=ar_data.get("category", s.category),
                    recommended_weeks_before=s.recommended_weeks_before,
                )
            )
        return result
    return [VisaStepRead.model_validate(s) for s in steps]
