
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import generate

studyDigestApp = FastAPI(
    title="StudyDigest LLM Backend",
    version="1.0.0",
)

studyDigestApp.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

studyDigestApp.include_router(generate.router, prefix="/generate", tags=["Generate"])


@studyDigestApp.get("/health", tags=["Health"])
def healthCheck():
    return {"status": "ok"}
