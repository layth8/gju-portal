from pydantic import BaseModel, ConfigDict


class MajorRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    school: str
