from fastapi import (
    FastAPI,
    UploadFile,
    File,
    HTTPException,
)

from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.history import save_prediction
from app.history_api import load_prediction_history
from fastapi.responses import StreamingResponse
from app.report import generate_report

from app.predictor import Predictor
from app.schemas import PredictionResponse
from app.evaluation import (
    load_metrics,
    load_plot_paths,
)


app = FastAPI(
    title="Brain Tumour MRI Classification API",
    description="""
Production-ready REST API for Brain Tumour Classification using
ResNet50 Transfer Learning.

Features:
- MRI Classification
- Confidence Scores
- Class Probabilities
- Inference Time
""",
    version="1.0.0",
)

app.mount(
    "/heatmaps",
    StaticFiles(
        directory="heatmaps",
    ),
    name="heatmaps",
)

app.mount(
    "/plots",
    StaticFiles(
        directory="../outputs/plots",
    ),
    name="plots",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

predictor = Predictor()


@app.get(
    "/",
    summary="API Information",
    tags=["System"],
)
def root():

    return {
        "message": "Brain Tumour AI Backend is Running!"
    }


@app.get(
    "/health",
    summary="Health Check",
    tags=["System"],
)
def health():

    return {
        "status": "healthy",
        "model_loaded": predictor.model is not None,
    }


@app.post(
    "/predict",
    response_model=PredictionResponse,
    summary="Predict Brain Tumour Class",
    description="Upload an MRI image and receive the predicted tumour class, confidence score, probability distribution, and inference time.",
    tags=["Prediction"],
)
async def predict(
    file: UploadFile = File(...),
):

    ALLOWED_TYPES = {
        "image/jpeg",
        "image/png",
    }

    if file.content_type not in ALLOWED_TYPES:

        raise HTTPException(
            status_code=400,
            detail="Only JPG and PNG images are supported.",
        )

    image_bytes = await file.read()

    MAX_FILE_SIZE = 10 * 1024 * 1024

    if len(image_bytes) > MAX_FILE_SIZE:

        raise HTTPException(
            status_code=413,
            detail="Image size exceeds 10 MB.",
        )

    (
        prediction,
        confidence,
        probabilities,
        processing_time_ms,
        heatmap_filename,
    ) = predictor.predict(
        image_bytes,
    )

    save_prediction(
    filename=file.filename,
    prediction=prediction,
    confidence=confidence,
    processing_time_ms=processing_time_ms,
    heatmap_filename=heatmap_filename,
    )

    return PredictionResponse(
        prediction=prediction,
        confidence=confidence,
        probabilities=probabilities,
        processing_time_ms=processing_time_ms,
        heatmap_filename=heatmap_filename,
    )


@app.get(
    "/evaluation",
    tags=["Evaluation"],
)
def evaluation():

    return load_metrics()


@app.get(
    "/evaluation/plots",
    tags=["Evaluation"],
)
def evaluation_plots():

    return load_plot_paths()

@app.get(
    "/history",
    tags=["History"],
    summary="Prediction History",
)
def history():

    return load_prediction_history()

@app.get(
    "/report",
    tags=["Report"],
    summary="Download PDF Report",
)
def report():

    pdf = generate_report(
        prediction="Demo Prediction",
        confidence=0.98,
        processing_time_ms=123.45,
        heatmap_filename="9a2c7760983b43eea698be323f33735a.png",
    )

    return StreamingResponse(
        pdf,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
            "attachment; filename=brain_tumour_report.pdf",
        },
    )