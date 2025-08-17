
from __future__ import annotations
from typing import Any, Dict, List
import pandas as pd
from app.utils.data_io import read_dataframe

def _aggregate(df: pd.DataFrame, x: str, y: str | None, agg: str | None, color: str | None = None):
    if not x:
        raise ValueError("x is required")
    if y and agg:
        if color:
            grouped = df.groupby([x, color])[y].agg(agg).reset_index()
        else:
            grouped = df.groupby([x])[y].agg(agg).reset_index()
        return grouped
    else:
        return df[[x] + ([y] if y else [])]

def generate(file_path: str, params: Dict[str, Any]) -> Dict[str, Any]:
    df = read_dataframe(file_path, delimiter=params.get('delimiter'), sheet_name=params.get('sheet_name'))
    chart_type = params.get('chart_type', 'bar')
    x = params.get('x')
    y = params.get('y')
    agg = params.get('agg', 'sum')
    color = params.get('color')

    if not x:
        # pick first column
        x = df.columns[0]

    if chart_type in ('bar','line','pie','box','scatter'):
        # build data traces
        traces: List[Dict[str,Any]] = []
        layout: Dict[str,Any] = {"title": f"{chart_type.title()} chart"}
        if chart_type in ('bar','line','pie'):
            grouped = _aggregate(df, x, y, agg, color)
            if chart_type == 'pie':
                traces.append({"type": "pie", "labels": grouped[x].astype(str).tolist(), "values": grouped[y].tolist()})
            else:
                if color and color in grouped.columns:
                    for name, part in grouped.groupby(color):
                        traces.append({"type": chart_type, "name": str(name), "x": part[x].astype(str).tolist(), "y": part[y].tolist()})
                else:
                    traces.append({"type": chart_type, "x": grouped[x].astype(str).tolist(), "y": grouped[y].tolist()})
        elif chart_type == 'scatter':
            if not y:
                # choose next numeric column
                num_cols = df.select_dtypes(include='number').columns.tolist()
                y = num_cols[1] if len(num_cols) > 1 else num_cols[0] if num_cols else None
            traces.append({"type": "scatter", "mode": "markers", "x": df[x].astype(str).tolist(), "y": df[y].tolist() if y else []})
        elif chart_type == 'box':
            if y:
                traces.append({"type": "box", "y": df[y].tolist(), "name": y})
            else:
                # box for numeric columns
                for col in df.select_dtypes(include='number').columns[:5]:
                    traces.append({"type": "box", "y": df[col].tolist(), "name": col})
        figure = {"data": traces, "layout": layout}
        return {"figure": figure, "x": x, "y": y, "agg": agg, "color": color}
    else:
        return {"figure": {"data": [], "layout": {"title": "Unsupported chart"}}}
