
from __future__ import annotations
from typing import Any, Dict
import pandas as pd
import numpy as np
from app.utils.data_io import read_dataframe

def compute(file_path: str, params: Dict[str, Any]) -> Dict[str, Any]:
    df = read_dataframe(file_path, delimiter=params.get('delimiter'), sheet_name=params.get('sheet_name'))
    na_counts = df.isna().sum().to_dict()
    desc = df.describe(include='all', datetime_is_numeric=True).to_dict()
    mem = df.memory_usage(deep=True).sum()
    return {
        "summary": "Oracle Metrics computed",
        "rows": int(df.shape[0]),
        "cols": int(df.shape[1]),
        "na_counts": na_counts,
        "describe": desc,
        "memory_bytes": int(mem),
        "columns": list(df.columns.astype(str)),
        "dtypes": {c: str(t) for c,t in df.dtypes.items()},
    }
