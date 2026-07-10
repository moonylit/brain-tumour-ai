from tensorflow.keras.models import load_model

from src.classification.dataset import load_datasets
from src.classification.model import build_model
from src.classification.trainer import Trainer

from scripts.plot_history import plot_history


train_dataset, validation_dataset = load_datasets(
    "data/processed/classification/train",
    "data/processed/classification/val",
)

# -----------------------------
# Stage 1
# -----------------------------

model = build_model(4)

trainer = Trainer(model)

trainer.compile()

history_stage1 = trainer.train(
    train_dataset,
    validation_dataset,
    epochs=10,
)

plot_history(history_stage1)

# -----------------------------
# Stage 2 Fine-Tuning
# -----------------------------

fine_tune_model = build_model(
    4,
    fine_tune=True,
)

fine_tune_model.load_weights(
    "models/resnet50_best.keras"
)

fine_tune_trainer = Trainer(
    fine_tune_model,
)

fine_tune_trainer.compile(
    learning_rate=1e-5,
)

history_stage2 = fine_tune_trainer.train(
    train_dataset,
    validation_dataset,
    epochs=5,
)

plot_history(history_stage2)

print("\nFine-Tuning Finished Successfully!")