from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    DATABASE_URL: str
    API_URL: str
    BETTER_AUTH_SECRET: str
    OPENAI_API_KEY: Optional[str] = None
    JWT_SECRET: Optional[str] = None

    class Config:
        env_file = ".env"


settings = Settings()