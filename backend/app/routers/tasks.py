
from typing import Any, Dict, Optional
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException
from pathlib import Path
from app.config import BASE_DIR
from app.services import data_alchemy, neural_canvas, algorithmic_forge, oracle_metrics, data_codex

router = APIRouter(prefix="/api/tasks", tags=["tasks"])

class TaskInput(BaseModel):
    file_path: str
    params: Optional[Dict[str, Any]] = None

def _abs_path(rel: str) -> str:
    p = Path(BASE_DIR) / rel
    if not p.exists():
        raise HTTPException(status_code=404, detail=f"File not found: {rel}")
    return str(p)

@router.post("/data-alchemy")
async def task_data_alchemy(payload: TaskInput):
    out = data_alchemy.run(_abs_path(payload.file_path), payload.params or {})
    return {"task": "data_alchemy", "status": "ok", "message": "Data Alchemy executed", "output": out}

@router.post("/neural-canvas")
async def task_neural_canvas(payload: TaskInput):
    out = neural_canvas.generate(_abs_path(payload.file_path), payload.params or {})
    return {"task": "neural_canvas", "status": "ok", "message": "Neural Canvas executed", "output": out}

@router.post("/algorithmic-forge")
async def task_algorithmic_forge(payload: TaskInput):
    out = algorithmic_forge.train(_abs_path(payload.file_path), payload.params or {})
    return {"task": "algorithmic_forge", "status": "ok", "message": "Algorithmic Forge executed", "output": out}

@router.post("/oracle-metrics")
async def task_oracle_metrics(payload: TaskInput):
    out = oracle_metrics.compute(_abs_path(payload.file_path), payload.params or {})
    return {"task": "oracle_metrics", "status": "ok", "message": "Oracle Metrics executed", "output": out}

@router.post("/data-codex")
async def task_data_codex(payload: TaskInput):
    out = data_codex.profile(_abs_path(payload.file_path), payload.params or {})
    return {"task": "data_codex", "status": "ok", "message": "Data Codex executed", "output": out}
