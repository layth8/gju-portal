from pydantic import BaseModel, ConfigDict


class VisaStepRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    step_number: int
    title: str
    description: str
    category: str
    recommended_weeks_before: int
