import asyncio
import logging
import time
from google import genai
from google.genai import types

from app.core.config import settings

from app.models.generate_models import (
    QuestionType,
    MultipleChoiceQuestion,
    ShortAnswerQuestion,
    MultipleChoiceResponse,
    ShortAnswerResponse,
    StructuredSummaryResponse
)

logger = logging.getLogger(__name__)

geminiClient = genai.Client(api_key=settings.GEMINI_API_KEY)


def buildSummaryMessages(notesText: str) -> list[dict]:
    return [
        {
            "role": "system",
            "content": (
                "You are an expert academic tutor. "
                "Read the student notes and produce a concise, well-structured summary. "
                "Focus on key concepts, definitions, and important relationships. "
                "Respond with ONLY the summary text, no preamble."
            ),
        },
        {
            "role": "user",
            "content": f"Please summarise these notes:\n\n{notesText}",
        },
    ]


def buildMultipleChoiceMessages(notesText: str, numQuestions: int) -> list[dict]:
    return [
        {
            "role": "system",
            "content": (
                f"You are an expert quiz writer. Generate exactly {numQuestions} multiple-choice questions "
                "based on the student notes provided.\n\n"
                "Rules:\n"
                "- Each question must have exactly 4 options labelled A, B, C, D.\n"
                "- Exactly one option must be correct.\n"
                "- The 'answer' field must be the label of the correct option (e.g. 'A').\n"
                "- Questions should test understanding, not just memorisation.\n"
                "- Return ONLY valid JSON matching the schema, no extra text."
            ),
        },
        {
            "role": "user",
            "content": f"Generate {numQuestions} multiple-choice questions from these notes:\n\n{notesText}",
        },
    ]


def buildShortAnswerMessages(notesText: str, numQuestions: int) -> list[dict]:
    return [
        {
            "role": "system",
            "content": (
                f"You are an expert quiz writer. Generate exactly {numQuestions} short-answer questions "
                "based on the student notes provided.\n\n"
                "Rules:\n"
                "- Each question should be answerable in 1-3 sentences.\n"
                "- Include a 'sampleAnswer' that a strong student would give.\n"
                "- Questions should test understanding, not just memorisation.\n"
                "- Return ONLY valid JSON matching the schema, no extra text."
            ),
        },
        {
            "role": "user",
            "content": f"Generate {numQuestions} short-answer questions from these notes:\n\n{notesText}",
        },
    ]

def buildStructuredSummaryMessages(summaryText: str) -> list[dict]:
    return [
        {
            "role": "system",
            "content": (
                "You are an expert academic editor. "
                "Convert the provided study summary into a clean structured JSON format.\n\n"
                "Rules:\n"
                "- Organize the summary into clear sections.\n"
                "- Each section must have a short title.\n"
                "- Put explanatory content into paragraphs.\n"
                "- Put lists, tips, and grouped items into bullets.\n"
                "- Keep the meaning of the summary unchanged.\n"
                "- Do not add new facts.\n"
                "- Return ONLY valid JSON matching the schema."
            ),
        },
        {
            "role": "user",
            "content": f"Convert this summary into structured JSON:\n\n{summaryText}",
        },
    ]

async def generateStructuredSummary(summaryText: str) -> StructuredSummaryResponse:
    structuredMessages = buildStructuredSummaryMessages(summaryText)

    rawResponse = await asyncio.to_thread(
        geminiClient.models.generate_content,
        model=settings.geminiModel,
        contents=[msg["content"] for msg in structuredMessages],
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=StructuredSummaryResponse,
            temperature=0.2,
        ),
    )

    parsedResponse: StructuredSummaryResponse = rawResponse.parsed
    return parsedResponse

async def generateSummary(notesText: str) -> str:
    summaryMessages = buildSummaryMessages(notesText)

    summaryResponse = await asyncio.to_thread(
        geminiClient.models.generate_content,
        model=settings.geminiModel,
        contents=[msg["content"] for msg in summaryMessages],
        config=types.GenerateContentConfig(temperature=0.4),
    )

    return summaryResponse.text.strip()


async def generateQuestions(
    notesText: str,
    questionType: QuestionType,
    numQuestions: int,
) -> list[MultipleChoiceQuestion] | list[ShortAnswerQuestion]:

    if questionType == QuestionType.multipleChoice:
        questionMessages = buildMultipleChoiceMessages(notesText, numQuestions)
        responseSchema   = MultipleChoiceResponse
    else:
        questionMessages = buildShortAnswerMessages(notesText, numQuestions)
        responseSchema   = ShortAnswerResponse

    rawResponse = await asyncio.to_thread(
        geminiClient.models.generate_content,
        model=settings.geminiModel,
        contents=[msg["content"] for msg in questionMessages],
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=responseSchema,
            temperature=0.6,
        ),
    )

    parsedResponse: MultipleChoiceResponse | ShortAnswerResponse = rawResponse.parsed
    return parsedResponse.questions


async def _runGenerationInner(
    notesText: str,
    questionType: QuestionType,
    numQuestions: int,
) -> tuple[str, StructuredSummaryResponse, list, dict]:
    timings: dict = {}

    summaryStart = time.perf_counter()
    summary = await generateSummary(notesText)
    timings["summary"] = round(time.perf_counter() - summaryStart, 3)

    parallelStart = time.perf_counter()
    structuredSummary, questions = await asyncio.gather(
        generateStructuredSummary(summary),
        generateQuestions(notesText, questionType, numQuestions),
    )
    timings["structuredAndQuestions"] = round(time.perf_counter() - parallelStart, 3)

    return summary, structuredSummary, questions, timings


async def runGeneration(
    notesText: str,
    questionType: QuestionType,
    numQuestions: int,
) -> tuple[str, StructuredSummaryResponse, list, float]:
    overallStart = time.perf_counter()
    try:
        summary, structuredSummary, questions, timings = await asyncio.wait_for(
            _runGenerationInner(notesText, questionType, numQuestions),
            timeout=settings.generationTimeout,
        )
        totalDuration = round(time.perf_counter() - overallStart, 3)

        logger.info(
            "Generation finished in %.3fs (summary=%.3fs, structured+questions=%.3fs)",
            totalDuration,
            timings["summary"],
            timings["structuredAndQuestions"],
        )
        if totalDuration > 30:
            logger.warning(
                "Slow generation: %.3fs (>30s threshold)", totalDuration
            )
        return summary, structuredSummary, questions, totalDuration

    except asyncio.TimeoutError:
        elapsed = round(time.perf_counter() - overallStart, 3)
        logger.warning(
            "Generation timed out after %.3fs (limit=%ds)",
            elapsed,
            settings.generationTimeout,
        )
        raise

    except Exception as apiError:
        logger.error("Gemini API error: %s", str(apiError))
        raise