
from __future__ import annotations
from typing import Any, Dict
import pandas as pd
from app.utils.data_io import read_dataframe

def profile(file_path: str, params: Dict[str, Any]) -> Dict[str, Any]:
    df = read_dataframe(file_path, delimiter=params.get('delimiter'), sheet_name=params.get('sheet_name'))
    head = df.head(10).to_dict(orient='records')
    nunique = df.nunique(dropna=False).to_dict()
    return {
        "summary": "Data Codex profile",
        "head": head,
        "unique_counts": {k: int(v) for k,v in nunique.items()},
    }
