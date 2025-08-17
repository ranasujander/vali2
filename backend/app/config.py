from pathlib import Path

# Base directory of the backend folder
BASE_DIR = Path(__file__).resolve().parent.parent

# Storage directories
STORAGE_DIR = BASE_DIR / "storage"
UPLOAD_DIR = STORAGE_DIR / "uploads"

# Ensure directories exist
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# CORS origins (adjust in production)
CORS_ORIGINS = [
    "*",  # open for local dev; tighten in prod
]
