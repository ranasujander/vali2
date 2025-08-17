
from __future__ import annotations
from typing import Any, Dict
import pandas as pd
import numpy as np
from pathlib import Path
from sklearn.ensemble import IsolationForest

from app.utils.data_io import read_dataframe

def _trim_strings(df: pd.DataFrame) -> pd.DataFrame:
    for col in df.select_dtypes(include=['object']).columns:
        df[col] = df[col].astype(str).str.strip()
    return df

def _coerce_numeric(df: pd.DataFrame, columns: list[str] | None = None) -> pd.DataFrame:
    cols = columns or df.columns.tolist()
    for c in cols:
        df[c] = pd.to_numeric(df[c], errors='ignore')
    return df

def _fillna(df: pd.DataFrame, strategy: str = 'none') -> pd.DataFrame:
    if strategy == 'none':
        return df
    if strategy == 'zero':
        num_cols = df.select_dtypes(include=[np.number]).columns
        df[num_cols] = df[num_cols].fillna(0)
        return df
    if strategy in ('mean','median'):
        num_cols = df.select_dtypes(include=[np.number]).columns
        if strategy == 'mean':
            df[num_cols] = df[num_cols].fillna(df[num_cols].mean())
        else:
            df[num_cols] = df[num_cols].fillna(df[num_cols].median())
        return df
    if strategy == 'mode':
        for col in df.columns:
            df[col] = df[col].fillna(df[col].mode().iloc[0] if not df[col].mode().empty else df[col].median() if df[col].dtype.kind in 'if' else '')
        return df
    return df

def _detect_outliers(df: pd.DataFrame, method: str = 'iqr', columns: list[str] | None = None) -> Dict[str, Any]:
    cols = columns or df.select_dtypes(include=[np.number]).columns.tolist()
    outlier_idx = set()
    details: Dict[str,int] = {}
    if method == 'iqr':
        for c in cols:
            q1 = df[c].quantile(0.25)
            q3 = df[c].quantile(0.75)
            iqr = q3 - q1
            lower = q1 - 1.5 * iqr
            upper = q3 + 1.5 * iqr
            idx = df.index[(df[c] < lower) | (df[c] > upper)]
            details[c] = int(len(idx))
            outlier_idx.update(idx.tolist())
    elif method == 'zscore':
        for c in cols:
            mu = df[c].mean()
            sigma = df[c].std(ddof=0)
            if sigma == 0 or pd.isna(sigma):
                continue
            z = (df[c] - mu).abs() / sigma
            idx = df.index[z > 3]
            details[c] = int(len(idx))
            outlier_idx.update(idx.tolist())
    elif method == 'isolation':
        if not cols:
            return {"count": 0, "indices": [], "details": {}}
        iso = IsolationForest(n_estimators=100, contamination='auto', random_state=42)
        X = df[cols].select_dtypes(include=[np.number]).fillna(0)
        if X.empty:
            return {"count": 0, "indices": [], "details": {}}
        labels = iso.fit_predict(X)
        idx = df.index[labels == -1]
        details['isolation_forest'] = int(len(idx))
        outlier_idx.update(idx.tolist())
    else:
        return {"count": 0, "indices": [], "details": {}}
    idx_list = sorted(list(outlier_idx))
    return {"count": int(len(idx_list)), "indices": idx_list, "details": details}

def run(file_path: str, params: Dict[str, Any]) -> Dict[str, Any]:
    df = read_dataframe(file_path, delimiter=params.get('delimiter'), sheet_name=params.get('sheet_name'))
    # Basic operations
    if params.get('trim_strings'):
        df = _trim_strings(df)
    if params.get('coerce_numeric'):
        df = _coerce_numeric(df)
    if params.get('fillna'):
        df = _fillna(df, strategy=params.get('fillna', 'none'))
    # Outlier detection
    outlier_method = params.get('outlier_method')
    outliers = None
    if outlier_method in ('iqr','zscore','isolation'):
        outliers = _detect_outliers(df, method=outlier_method, columns=params.get('outlier_columns'))
        if params.get('remove_outliers'):
            df = df.drop(index=outliers['indices'])
    # Save transformed copy
    out_path = Path(file_path).with_name(Path(file_path).stem + "__cleaned.parquet")
    try:
        df.to_parquet(out_path)
        saved_path = out_path.name
    except Exception:
        # Fallback to CSV
        out_csv = Path(file_path).with_name(Path(file_path).stem + "__cleaned.csv")
        df.to_csv(out_csv, index=False)
        saved_path = out_csv.name
    return {
        "summary": "Data transformation pipeline executed",
        "file": file_path,
        "artifacts": {"cleaned_path": str(out_path), "head": df.head(5).to_dict(orient='records')},
        "outliers": outliers,
        "rows": int(df.shape[0]),
        "cols": int(df.shape[1]),
    }
