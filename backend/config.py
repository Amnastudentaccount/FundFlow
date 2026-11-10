from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    PAYPAL_MOCK_MODE: bool = True
    PAYPAL_CLIENT_ID: str = ""
    PAYPAL_CLIENT_SECRET: str = ""
    PAYPAL_BASE_URL: str = "https://api-m.sandbox.paypal.com"
    
    ANTHROPIC_API_KEY: str = ""
    CHANNEL3_API_KEY: str = ""
    
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql+psycopg://fundflow:fundflow@localhost:5432/fundflow")

    class Config:
        env_file = ".env"

settings = Settings()