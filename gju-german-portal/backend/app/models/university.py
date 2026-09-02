from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.major import Major


class UniversityMajor(Base):
    __tablename__ = "university_majors"

    university_id: Mapped[int] = mapped_column(ForeignKey("universities.id", ondelete="CASCADE"), primary_key=True)
    major_id: Mapped[int] = mapped_column(ForeignKey("majors.id", ondelete="CASCADE"), primary_key=True)


class University(Base):
    __tablename__ = "universities"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(200), unique=True, nullable=False)
    city: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    state: Mapped[str] = mapped_column(String(100), nullable=False)
    min_german_level: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    min_english_level: Mapped[str] = mapped_column(String(32), nullable=False)
    website_url: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)

    majors: Mapped[list["Major"]] = relationship(
        secondary="university_majors",
        back_populates="universities",
    )
