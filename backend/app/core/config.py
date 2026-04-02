from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    GEMINI_API_KEY: str
    geminiModel: str = "gemini-2.5-flash"
    generationTimeout: int = 60
    maxNotesCharacters: int = 50_000

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()