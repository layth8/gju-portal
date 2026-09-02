from typing import TYPE_CHECKING

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.university import University


class Major(Base):
    __tablename__ = "majors"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    school: Mapped[str] = mapped_column(String(32), nullable=False, index=True)

    universities: Mapped[list["University"]] = relationship(
        secondary="university_majors",
        back_populates="majors",
    )
