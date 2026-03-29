import asyncio
import logging
from google import genai
from google.genai import types

from Config import settings
from Models import (
    QuestionType,
    MultipleChoiceQuestion,
    ShortAnswerQuestion,
    MultipleChoiceResponse,
    ShortAnswerResponse,
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


async def generateSummary(notesText: str) -> str:
    summaryMessages = buildSummaryMessages(notesText)

    summaryResponse = await asyncio.wait_for(
        asyncio.to_thread(
            geminiClient.models.generate_content,
            model=settings.geminiModel,
            contents=[msg["content"] for msg in summaryMessages],
            config=types.GenerateContentConfig(temperature=0.4),
        ),
        timeout=settings.generationTimeout,
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

    rawResponse = await asyncio.wait_for(
        asyncio.to_thread(
            geminiClient.models.generate_content,
            model=settings.geminiModel,
            contents=[msg["content"] for msg in questionMessages],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=responseSchema,
                temperature=0.6,
            ),
        ),
        timeout=settings.generationTimeout,
    )

    parsedResponse: MultipleChoiceResponse | ShortAnswerResponse = rawResponse.parsed
    return parsedResponse.questions


async def runGeneration(
    notesText: str,
    questionType: QuestionType,
    numQuestions: int,
) -> tuple[str, list]:
    try:
        summary, questions = await asyncio.gather(
            generateSummary(notesText),
            generateQuestions(notesText, questionType, numQuestions),
        )
        return summary, questions

    except asyncio.TimeoutError:
        logger.warning("Generation timed out after %ds", settings.generationTimeout)
        raise

    except Exception as apiError:
        logger.error("Gemini API error: %s", str(apiError))
        raise