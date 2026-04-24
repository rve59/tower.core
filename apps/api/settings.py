from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    cors_origins: List[str] = ["http://localhost:5173", "http://localhost:9041", "http://localhost:3000"]
    database_url: str = "sqlite:///./tower.db"
    parquet_data_dir: str = "./data/parquet"
    arelle_version: str = "2.7.9"  # TODO: resolve from installed arelle package

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
