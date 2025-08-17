import sys
from pathlib import Path

import pandas as pd
import pytest

# Ensure the 'app' package can be imported
sys.path.append(str(Path(__file__).resolve().parents[2]))

from app.utils.data_io import read_dataframe

def make_sample_df() -> pd.DataFrame:
    return pd.DataFrame({"a": [1, 2, 3], "b": ["x", "y", "z"]})


def test_read_csv(tmp_path):
    df = make_sample_df()
    path = tmp_path / "data.csv"
    df.to_csv(path, index=False)

    loaded = read_dataframe(str(path))
    assert loaded.shape == df.shape


def test_read_excel(tmp_path):
    df = make_sample_df()
    path = tmp_path / "data.xlsx"
    df.to_excel(path, index=False)

    loaded = read_dataframe(str(path))
    assert loaded.shape == df.shape


def test_read_parquet(tmp_path):
    df = make_sample_df()
    path = tmp_path / "data.parquet"
    df.to_parquet(path, index=False)

    loaded = read_dataframe(str(path))
    assert loaded.shape == df.shape


def test_unsupported_extension(tmp_path):
    path = tmp_path / "data.unsupported"
    path.write_text("dummy")

    with pytest.raises(ValueError):
        read_dataframe(str(path))
