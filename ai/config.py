from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    # MLflow配置
    mlflow_server_url: str = os.getenv("MLFLOW_SERVER_URL", "http://localhost:5000")
    mlflow_tracking_uri: str = os.getenv("MLFLOW_TRACKING_URI", "http://localhost:5000")
    
    # 应用配置
    app_port: int = int(os.getenv("APP_PORT", 8000))
    debug_mode: bool = os.getenv("DEBUG_MODE", "False").lower() == "true"
    
    # 数据库配置
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./mcp.db")

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()