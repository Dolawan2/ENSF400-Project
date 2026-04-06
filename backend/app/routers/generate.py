import asyncio
import logging
from fastapi import APIRouter, HTTPException, status

from app.services.llm_service import runGeneration
from app.models.generate_models import GenerateRequest, GenerateResponse
from app.core.config import settings

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/", response_model=GenerateResponse)
async def generateStudyMaterial(request: GenerateRequest):
    if len(request.notesText) > settings.maxNotesCharacters:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Notes exceed the maximum length of {settings.maxNotesCharacters} characters.",
        )

    try:
        summary, structuredSummary, questions, durationSeconds = await runGeneration(
            notesText=request.notesText,
            questionType=request.questionType,
            numQuestions=request.numQuestions,
        )

    except asyncio.TimeoutError:
        raise HTTPException(
            status_code=status.HTTP_408_REQUEST_TIMEOUT,
            detail="Generation timed out. Please try with shorter notes.",
        )

    except Exception as e:
        logger.exception("Generation failed: %s", e)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="The AI service is temporarily unavailable. Please try again.",
        )

    return GenerateResponse(
        summary=summary,
        structuredSummary=structuredSummary,
        questionType=request.questionType,
        questions=questions,
        durationSeconds=durationSeconds,
    )


@router.post("/regenerate", response_model=GenerateResponse)
async def regenerateStudyMaterial(request: GenerateRequest):
    return await generateStudyMaterial(request)