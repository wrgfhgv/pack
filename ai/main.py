from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import json
import logging
from sqlalchemy import create_engine, Column, String, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import settings
from fastapi import Depends

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 数据库配置
engine = create_engine(settings.database_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 数据库模型
class ModelDB(Base):
    __tablename__ = "models"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    version = Column(String, index=True)
    framework = Column(String)
    deployment_endpoint = Column(String, nullable=True)
    metadata = Column(JSON)

# 创建数据表
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI MCP Application", version="1.0")

# CORS配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境限制具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 模型元数据结构
class ModelInfo(BaseModel):
    name: str
    version: str
    framework: str  # 如 "tensorflow", "pytorch"
    deployment_endpoint: str = None

# 依赖项：数据库会话
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 生成唯一ID
import uuid
def generate_id(): return str(uuid.uuid4())

# 1. 注册模型
@app.post("/models/register")
def register_model(model: ModelInfo, db: Session = Depends(get_db)):
    model_id = generate_id()
    db_model = ModelDB(
        id=model_id,
        name=model.name,
        version=model.version,
        framework=model.framework,
        metadata={}
    )
    db.add(db_model)
    db.commit()
    db.refresh(db_model)
    logger.info(f"Registered model: {model.name} v{model.version}")
    return {"status": "success", "model_id": model_id, "model": model.dict()}

# 2. 部署模型（调用MLflow部署接口）
@app.post("/models/deploy/{model_name}/{version}")

def deploy_model(model_name: str, version: str, db: Session = Depends(get_db)):
    model = db.query(ModelDB).filter(
        ModelDB.name == model_name, 
        ModelDB.version == version
    ).first()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    
    # 调用MLflow部署API
    deploy_response = requests.post(
        f"{settings.mlflow_server_url}/api/2.0/mlflow/models/deploy",
        json={"name": model_name, "version": version, "target": "kubernetes"},
        timeout=30
    )
    
    if deploy_response.status_code != 200:
        logger.error(f"Deployment failed: {deploy_response.text}")
        raise HTTPException(status_code=500, detail=f"Deployment failed: {deploy_response.text}")
    
    if deploy_response.status_code == 200:
        model["deployment_endpoint"] = f"http://model-svc/{model_name}/{version}"
        return {"status": "deployed", "endpoint": model["deployment_endpoint"]}
    return {"status": "failed", "error": deploy_response.text}

# 3. 模型预测路由（调度请求）
@app.post("/predict")
def predict(model_name: str, version: str, input_data: dict):
    model = next((m for m in models_db if m["name"] == model_name and m["version"] == version), None)
    if not model or not model["deployment_endpoint"]:
        raise HTTPException(status_code=404, detail="Model not deployed")
    
    # 转发请求到模型服务
    response = requests.post(model["deployment_endpoint"], json=input_data)
    return response.json()

# 4. 监控指标接口（集成Prometheus）
@app.get("/models/metrics/{model_name}")
def get_model_metrics(model_name: str):
    # 实际应从Prometheus查询延迟、吞吐量等指标
    return {
        "latency": "50ms",
        "throughput": "100 req/s",
        "accuracy": "92.5%"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
