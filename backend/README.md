# Backend Scaffold (FastAPI + Flask)

This folder contains a ready-to-run Python backend scaffold with both FastAPI and Flask implementations. It provides:
- File upload endpoint to persist user-uploaded files
- Placeholder endpoints for core tasks:
  - Data Alchemy
  - Neural Canvas
  - Algorithmic Forge
  - Oracle Metrics
  - Data Codex

Note: This backend does not run inside the Lovable preview. Run it locally or deploy to your own infrastructure. The frontend can later call these endpoints at your chosen URL.

## Quick Start (FastAPI)

1) Create a virtual environment and install dependencies:

```
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\\Scripts\\activate
pip install -r requirements.txt
```

2) Run the server:

```
uvicorn app.main_fastapi:app --reload --host 0.0.0.0 --port 8000
```

3) Open docs: http://localhost:8000/docs

## Quick Start (Flask)

1) Create a virtual environment and install dependencies (same as above).

2) Run Flask:

```
export FLASK_APP=app/main_flask.py  # Windows: set FLASK_APP=app/main_flask.py
flask run --host 0.0.0.0 --port 8001
```

3) Test health: http://localhost:8001/health

## Folder Structure

```
backend/
  app/
    routers/
    services/
    utils/
    main_fastapi.py
    main_flask.py
    config.py
  storage/
    uploads/    # Saved uploads land here
  requirements.txt
  README.md
```

## API Overview (FastAPI)

- Health: GET /health
- Upload: POST /api/upload (multipart/form-data key: "file"; optional "delimiter" and "sheet_name" for CSV and Excel files)
- Tasks:
  - POST /api/tasks/data-alchemy
  - POST /api/tasks/neural-canvas
  - POST /api/tasks/algorithmic-forge
  - POST /api/tasks/oracle-metrics
  - POST /api/tasks/data-codex

### Example: Upload file (curl)

```
curl -X POST http://localhost:8000/api/upload \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/your.csv" \
  -F "delimiter=," \
  -F "sheet_name=Sheet1"
```

Use the `delimiter` field for CSV files and `sheet_name` to target a sheet in Excel uploads.

Response
```
{
  "id": "c2dbbcf0-...",
  "name": "your.csv",
  "path": "storage/uploads/c2dbbcf0-your.csv",
  "size": 12345
}
```

### Example: Run a task (curl)

```
curl -X POST http://localhost:8000/api/tasks/data-alchemy \
  -H "Content-Type: application/json" \
  -d '{
        "file_path": "storage/uploads/c2dbbcf0-your.csv",
        "params": {"strategy": "standardize"}
      }'
```

Response (placeholder)
```
{
  "task": "data_alchemy",
  "status": "ok",
  "message": "Data Alchemy placeholder executed",
  "output": { ... }
}
```

## Frontend Integration (later)

- Point your frontend to the base URL of your deployed backend (e.g., https://api.validatron.com)
- POST to /api/upload with the file
- Then POST to a task endpoint with the returned `path` and your parameters

## Notes

- CORS is open for local development. Restrict it in production.
- The services contain stub logic—replace with your real implementations.
- All uploads are stored under `backend/storage/uploads`. Clean up as needed.
