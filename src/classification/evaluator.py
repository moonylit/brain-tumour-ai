import numpy as np
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
)


class Evaluator:

    def __init__(self, model):
        self.model = model

    def evaluate(self, dataset):

        all_predictions = []
        all_labels = []

        for images, labels in dataset:

            predictions = self.model.predict(images, verbose=0)

            predicted_labels = np.argmax(
                predictions,
                axis=1,
            )

            all_predictions.extend(predicted_labels)
            all_labels.extend(labels.numpy())

        print("\nClassification Report\n")

        print(
            classification_report(
                all_labels,
                all_predictions,
                digits=4,
            )
        )

        print("\nConfusion Matrix\n")

        print(
            confusion_matrix(
                all_labels,
                all_predictions,
            )
        )