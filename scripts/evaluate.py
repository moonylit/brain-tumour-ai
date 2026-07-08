from tensorflow.keras.models import load_model

from src.classification.dataset import load_datasets
from src.classification.evaluator import Evaluator


train_dataset, validation_dataset = load_datasets(
    "data/processed/classification/train",
    "data/processed/classification/val",
)

model = load_model(
    "models/resnet50_best.keras"
)

evaluator = Evaluator(model)

evaluator.evaluate(validation_dataset)