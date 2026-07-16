from typing import Dict

from pydantic import BaseModel, Field


class PredictionResponse(BaseModel):

    prediction: str = Field(
        ...,
        description="Predicted brain tumour class.",
        examples=["meningioma"],
    )

    confidence: float = Field(
        ...,
        description="Confidence score of the predicted class.",
        examples=[0.9987],
    )

    probabilities: Dict[str, float] = Field(
        ...,
        description="Probability distribution across all tumour classes.",
        examples=[
            {
                "glioma": 0.001,
                "meningioma": 0.998,
                "pituitary": 0.0008,
                "notumor": 0.0002,
            }
        ],
    )

    processing_time_ms: float = Field(
        ...,
        description="Inference time in milliseconds.",
        examples=[2845.62],
    )

    heatmap_filename: str = Field(
        ...,
        description="Generated Grad-CAM heatmap filename.",
        examples=["4f9e83e9d0d741d8b89f6c5d0d1f0a2b.png"],
    )