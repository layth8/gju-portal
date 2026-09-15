from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.admin import router as admin_router
from app.api.majors import router as majors_router
from app.api.universities import router as universities_router
from app.api.visa_steps import router as visa_steps_router
from app.core.config import get_settings
from app.database import Base, engine
from app.models import Major, University, UniversityMajor, VisaStep  # noqa: F401

settings = get_settings()


@asynccontextmanager
async def lifespan(_app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="GJU German Year Portal",
    description="API for GJU students preparing for the German Year: partner universities, language tracks, and embassy visa steps.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://gju-portal.vercel.app",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(majors_router)
app.include_router(universities_router)
app.include_router(visa_steps_router)
app.include_router(admin_router)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
