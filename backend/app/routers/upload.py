from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.utils.storage import save_upload
from app.config import BASE_DIR
from app.utils.data_io import read_dataframe, dtypes_as_str
from pathlib import Path

router = APIRouter(prefix="/api", tags=["upload"])

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    delimiter: str | None = Form(default=None),
    sheet_name: str | None = Form(default=None),
):
    if not file:
        raise HTTPException(status_code=400, detail="No file provided")
    saved = save_upload(file)
    abs_path = Path(BASE_DIR) / saved["path"]
    try:
        df = read_dataframe(str(abs_path), delimiter=delimiter, sheet_name=sheet_name)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read file: {e}")
    cols = list(df.columns.astype(str))
    dtypes = dtypes_as_str(df)
    return { **saved, "columns": cols, "dtypes": dtypes, "row_count": int(df.shape[0]) }
