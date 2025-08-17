import os
import uuid
from typing import Dict
from pathlib import Path
from fastapi import UploadFile

from app.config import UPLOAD_DIR


def _safe_filename(name: str) -> str:
    # Remove path separators and keep extension
    base = os.path.basename(name)
    return base.replace("..", "")


def save_upload(file: UploadFile) -> Dict[str, str | int]:
    file_id = str(uuid.uuid4())
    original_name = _safe_filename(file.filename or f"upload_{file_id}")
    ext = os.path.splitext(original_name)[1].lower()
    target_name = f"{file_id}{ext}"
    target_path = UPLOAD_DIR / target_name
    target_path.parent.mkdir(parents=True, exist_ok=True)

    # Save to disk
    with open(target_path, "wb") as out:
        while True:
            chunk = file.file.read(1024 * 1024)
            if not chunk:
                break
            out.write(chunk)

    size = target_path.stat().st_size
    return {
        "id": file_id,
        "name": original_name,
        "path": str(Path("storage") / "uploads" / target_name),  # relative to backend/
        "size": size,
    }