from fastapi import (
    FastAPI,
    UploadFile,
    File,
    HTTPException,
)

from app.predictor import Predictor
from app.schemas import PredictionResponse


app = FastAPI(
    title="Brain Tumour AI API",
    version="1.0.0",
)

predictor = Predictor()


@app.get("/")
def root():

    return {
        "message": "Brain Tumour AI Backend is Running!"
    }


@app.get("/health")
def health():

    return {
        "status": "healthy",
        "model_loaded": predictor.model is not None,
    }


@app.post(
    "/predict",
    response_model=PredictionResponse,
)
async def predict(
    file: UploadFile = File(...),
):

    if not file.content_type.startswith("image/"):

        raise HTTPException(
            status_code=400,
            detail="Please upload an image.",
        )

    image_bytes = await file.read()

    prediction, confidence = predictor.predict(
        image_bytes,
    )

    return PredictionResponse(
        prediction=prediction,
        confidence=confidence,
    )