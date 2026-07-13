from typing import Dict

from pydantic import BaseModel


class PredictionResponse(BaseModel):

    prediction: str

    confidence: float

    probabilities: Dict[str, float]

    processing_time_ms: float

    heatmap_filename: str