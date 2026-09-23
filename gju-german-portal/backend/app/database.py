import logging
from collections.abc import Generator
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.core.config import get_settings

logger = logging.getLogger(__name__)


class Base(DeclarativeBase):
    pass


settings = get_settings()
db_url = settings.database_url

try:
    if "mysql" in db_url:
        engine = create_engine(
            db_url,
            pool_pre_ping=True,
            pool_recycle=3600,
            connect_args={"connect_timeout": 2},
        )
        # Test connection
        with engine.connect() as conn:
            pass
    else:
        engine = create_engine(db_url)
except Exception as exc:
    logger.warning(
        "Could not connect to configured MySQL database (%s). Falling back to local SQLite database: %s",
        db_url,
        exc,
    )
    sqlite_path = Path(__file__).resolve().parents[1] / "gju_portal.db"
    engine = create_engine(
        f"sqlite:///{sqlite_path}",
        connect_args={"check_same_thread": False},
    )

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, expire_on_commit=False)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
