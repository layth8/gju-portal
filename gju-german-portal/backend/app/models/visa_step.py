from sqlalchemy import Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class VisaStep(Base):
    __tablename__ = "visa_steps"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    step_number: Mapped[int] = mapped_column(Integer, nullable=False, unique=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    recommended_weeks_before: Mapped[int] = mapped_column(Integer, nullable=False)
