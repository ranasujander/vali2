
from __future__ import annotations
from typing import Any, Dict
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, roc_auc_score, r2_score, mean_absolute_error
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from app.utils.data_io import read_dataframe

def _is_classification(y: pd.Series) -> bool:
    # Heuristic
    if y.dtype.kind in 'biu':
        if y.nunique() <= max(20, int(0.05 * len(y))):
            return True
    if y.dtype.kind == 'O':
        return True
    return False

def train(file_path: str, params: Dict[str, Any]) -> Dict[str, Any]:
    target = params.get('target')
    if not target:
        return {"summary": "No target provided", "metrics": {}}
    df = read_dataframe(file_path, delimiter=params.get('delimiter'), sheet_name=params.get('sheet_name'))
    if target not in df.columns:
        return {"summary": f"Target '{target}' not in data", "metrics": {}}
    # Basic preprocessing: drop rows with NA in target and simple numeric-only features
    df = df.dropna(subset=[target])
    y = df[target]
    X = df.drop(columns=[target]).select_dtypes(include=[np.number]).fillna(0)
    if X.empty:
        return {"summary": "No numeric features available", "metrics": {}}
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    if _is_classification(y):
        model = RandomForestClassifier(n_estimators=200, random_state=42)
        model.fit(X_train, y_train)
        preds = model.predict(X_test)
        proba = None
        try:
            proba = model.predict_proba(X_test)[:,1]
        except Exception:
            pass
        metrics = {"accuracy": float(accuracy_score(y_test, preds))}
        if proba is not None and y.nunique() == 2:
            metrics["roc_auc"] = float(roc_auc_score(y_test, proba))
    else:
        model = RandomForestRegressor(n_estimators=200, random_state=42)
        model.fit(X_train, y_train)
        preds = model.predict(X_test)
        metrics = {"r2": float(r2_score(y_test, preds)), "mae": float(mean_absolute_error(y_test, preds))}
    # Feature importances
    importances = getattr(model, 'feature_importances_', None)
    if importances is not None:
        feat_imp = sorted([{ 'feature': f, 'importance': float(i) } for f,i in zip(X.columns, importances)], key=lambda x: -x['importance'])[:20]
    else:
        feat_imp = []
    return {
        "summary": "Model trained",
        "metrics": metrics,
        "features": [c for c in X.columns],
        "importances": feat_imp,
    }
