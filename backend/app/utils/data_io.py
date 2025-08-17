
from __future__ import annotations
from typing import Dict, Any, Optional
from pathlib import Path
import pandas as pd

def read_dataframe(file_path: str, *, delimiter: Optional[str] = None, sheet_name: Optional[str] = None) -> pd.DataFrame:
    p = Path(file_path)
    ext = p.suffix.lower()
    if ext in [".csv", ".txt"]:
        return pd.read_csv(p, delimiter=delimiter or ",", engine="python")
    elif ext in [".xlsx", ".xls"]:
        if sheet_name is None or sheet_name == "":
            return pd.read_excel(p, sheet_name=0)
        else:
            return pd.read_excel(p, sheet_name=sheet_name)
    elif ext in [".parquet", ".pq"]:
        return pd.read_parquet(p)
    else:
        raise ValueError(f"Unsupported file type: {ext}")

def dtypes_as_str(df: pd.DataFrame) -> Dict[str, str]:
    return {col: str(dtype) for col, dtype in df.dtypes.items()}
