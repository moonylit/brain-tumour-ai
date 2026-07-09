from src.classification.dataset import load_datasets
from src.classification.model import build_model
from src.classification.trainer import Trainer

from scripts.plot_history import plot_history


train_dataset, validation_dataset = load_datasets(
    "data/processed/classification/train",
    "data/processed/classification/val",
)

model = build_model(4)

trainer = Trainer(model)

trainer.compile()

history = trainer.train(
    train_dataset,
    validation_dataset,
    epochs=10,
)

plot_history(history)

print("\nTraining Finished Successfully!")