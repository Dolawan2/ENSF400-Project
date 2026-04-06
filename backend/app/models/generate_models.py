from pydantic import BaseModel, Field
from typing import List
from enum import Enum


class QuestionType(str, Enum):
    multipleChoice = "multiple_choice"
    shortAnswer    = "short_answer"


class GenerateRequest(BaseModel):
    notesText:    str          = Field(..., min_length=10)
    questionType: QuestionType
    numQuestions: int          = Field(default=5, ge=1, le=20)


class MultipleChoiceQuestion(BaseModel):
    question: str
    options:  List[str] = Field(..., min_length=4, max_length=4)
    answer:   str

class ShortAnswerQuestion(BaseModel):
    question:     str
    sampleAnswer: str


class MultipleChoiceResponse(BaseModel):
    questions: List[MultipleChoiceQuestion]

class ShortAnswerResponse(BaseModel):
    questions: List[ShortAnswerQuestion]

class SummarySection(BaseModel):
    title: str
    paragraphs: list[str] = Field(default_factory=list)
    bullets: list[str] = Field(default_factory=list)


class StructuredSummaryResponse(BaseModel):
    title: str
    sections: list[SummarySection]

class GenerateResponse(BaseModel):
    summary: str
    structuredSummary: StructuredSummaryResponse
    questionType: QuestionType
    questions: List[MultipleChoiceQuestion] | List[ShortAnswerQuestion]
    durationSeconds: float
