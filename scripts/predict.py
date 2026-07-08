from pathlib import Path

from tensorflow.keras.models import load_model

from src.classification.predictor import Predictor


MODEL_PATH = "models/resnet50_best.keras"

TEST_FOLDER = Path(
    "data/processed/classification/val/glioma"
)

image = next(TEST_FOLDER.glob("*"))

model = load_model(MODEL_PATH)

predictor = Predictor(model)

prediction, confidence = predictor.predict(image)

print(f"Image      : {image.name}")
print(f"Prediction : {prediction}")
print(f"Confidence : {confidence:.4f}")
