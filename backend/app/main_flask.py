from flask import Flask, jsonify, request
from app.utils.storage import save_upload
from app.services import data_alchemy, neural_canvas, algorithmic_forge, oracle_metrics, data_codex

app = Flask(__name__)


@app.get("/health")
def health():
    return jsonify({"status": "ok"})


@app.post("/api/upload")
def upload():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400
    file = request.files["file"]
    # Wrap to mimic FastAPI UploadFile-like interface
    class _Wrapper:
        def __init__(self, f):
            self.file = f.stream
            self.filename = f.filename
    result = save_upload(_Wrapper(file))
    return jsonify(result)


@app.post("/api/tasks/data-alchemy")
def task_data_alchemy():
    payload = request.get_json(force=True)
    out = data_alchemy.run(payload.get("file_path"), payload.get("params"))
    return jsonify({"task": "data_alchemy", "status": "ok", "message": "Data Alchemy placeholder executed", "output": out})


@app.post("/api/tasks/neural-canvas")
def task_neural_canvas():
    payload = request.get_json(force=True)
    out = neural_canvas.generate(payload.get("file_path"), payload.get("params"))
    return jsonify({"task": "neural_canvas", "status": "ok", "message": "Neural Canvas placeholder executed", "output": out})


@app.post("/api/tasks/algorithmic-forge")
def task_algorithmic_forge():
    payload = request.get_json(force=True)
    out = algorithmic_forge.train(payload.get("file_path"), payload.get("params"))
    return jsonify({"task": "algorithmic_forge", "status": "ok", "message": "Algorithmic Forge placeholder executed", "output": out})


@app.post("/api/tasks/oracle-metrics")
def task_oracle_metrics():
    payload = request.get_json(force=True)
    out = oracle_metrics.compute(payload.get("file_path"), payload.get("params"))
    return jsonify({"task": "oracle_metrics", "status": "ok", "message": "Oracle Metrics placeholder executed", "output": out})


@app.post("/api/tasks/data-codex")
def task_data_codex():
    payload = request.get_json(force=True)
    out = data_codex.profile(payload.get("file_path"), payload.get("params"))
    return jsonify({"task": "data_codex", "status": "ok", "message": "Data Codex placeholder executed", "output": out})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8001, debug=True)
