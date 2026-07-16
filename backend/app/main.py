from fastapi import (
    FastAPI,
    UploadFile,
    File,
    HTTPException,
)
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.history import save_prediction
from app.history_api import load_prediction_history
from app.report import generate_report
from app.predictor import Predictor
from app.schemas import PredictionResponse
from app.evaluation import (
    load_metrics,
    load_plot_paths,
)


app = FastAPI(
    title="Brain Tumour AI REST API",
    description="""
## Brain Tumour MRI Classification API

A production-ready REST API for automated brain tumour classification
using a ResNet50 Transfer Learning model.

### Features

- Brain MRI classification
- Grad-CAM explainability
- Confidence score estimation
- Class probability distribution
- PDF report generation
- Prediction history
- Model evaluation metrics

### Supported Classes

- Glioma
- Meningioma
- Pituitary
- No Tumour
""",
    version="1.1.0",
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
    summary="Classify Brain MRI",
    description="""
Upload a brain MRI image in JPG or PNG format.

The API returns:

- Predicted tumour class
- Confidence score
- Probability distribution
- Inference time
- Generated Grad-CAM heatmap filename
""",
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
    summary="Model Evaluation Metrics",
    description="""
Retrieve the evaluation metrics of the trained brain tumour classification model.

Returns:

- Accuracy
- Precision
- Recall
- F1 Score
""",
)
def evaluation():

    return load_metrics()


@app.get(
    "/evaluation/plots",
    tags=["Evaluation"],
    summary="Evaluation Plots",
    description="""
Retrieve the available evaluation plot filenames.

These plots include confusion matrix, ROC curve,
precision-recall curve, and training history.
""",
)
def evaluation_plots():

    return load_plot_paths()


@app.get(
    "/history",
    tags=["History"],
    summary="Prediction History",
    description="""
Retrieve the complete prediction history.

Each record contains:

- Uploaded MRI filename
- Predicted class
- Confidence score
- Processing time
- Grad-CAM filename
- Timestamp
""",
)
def history():

    return load_prediction_history()


@app.get(
    "/report",
    tags=["Report"],
    summary="Download PDF Report",
    description="""
Generate and download a professional PDF report for the latest prediction.

The report contains:

- MRI filename
- Prediction
- Confidence score
- Inference time
- Model evaluation metrics
- Grad-CAM heatmap
- Report metadata
""",
)
def report():

    history = load_prediction_history()

    if not history:

        raise HTTPException(
            status_code=404,
            detail="No prediction history found.",
        )

    latest = history[-1]

    metrics = load_metrics()

    pdf = generate_report(
        prediction=latest["prediction"],
        confidence=latest["confidence"],
        processing_time_ms=latest["processing_time_ms"],
        heatmap_filename=latest["heatmap_filename"],
        filename=latest["filename"],
        metrics=metrics,
    )

    return StreamingResponse(
        pdf,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
            "attachment; filename=brain_tumour_report.pdf",
        },
    )