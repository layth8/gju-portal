from pydantic import BaseModel, ConfigDict, Field, HttpUrl

from app.schemas.major import MajorRead


class UniversityCreate(BaseModel):
    name: str = Field(min_length=2, max_length=200)
    city: str = Field(min_length=2, max_length=100)
    state: str = Field(min_length=2, max_length=100)
    min_german_level: str = Field(min_length=1, max_length=32)
    min_english_level: str = Field(min_length=1, max_length=32)
    website_url: HttpUrl
    description: str = Field(min_length=10)
    major_ids: list[int] = Field(default_factory=list)


class UniversityUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=200)
    city: str | None = Field(default=None, min_length=2, max_length=100)
    state: str | None = Field(default=None, min_length=2, max_length=100)
    min_german_level: str | None = Field(default=None, min_length=1, max_length=32)
    min_english_level: str | None = Field(default=None, min_length=1, max_length=32)
    website_url: HttpUrl | None = None
    description: str | None = Field(default=None, min_length=10)
    major_ids: list[int] | None = None


class UniversityRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    city: str
    state: str
    min_german_level: str
    min_english_level: str
    website_url: str
    description: str
    majors: list[MajorRead] = Field(default_factory=list)
