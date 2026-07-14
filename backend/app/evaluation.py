import json
from pathlib import Path


REPORT_PATH = (
    Path(__file__).resolve().parents[2]
    / "outputs"
    / "reports"
    / "metrics.json"
)


def load_metrics():

    with open(
        REPORT_PATH,
        "r",
    ) as file:

        metrics = json.load(
            file,
        )

    return {
        "accuracy": metrics["accuracy"],
        "precision": metrics["macro avg"]["precision"],
        "recall": metrics["macro avg"]["recall"],
        "f1_score": metrics["macro avg"]["f1-score"],
    }