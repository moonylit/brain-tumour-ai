import numpy as np
import tensorflow as tf

from tensorflow.keras.models import load_model

from app.config import (
    MODEL_PATH,
    IMAGE_SIZE,
    CLASS_NAMES,
)


class Predictor:

    def __init__(self):

        self.model = load_model(
            MODEL_PATH,
        )

    def preprocess(
        self,
        image_bytes,
    ):

        image = tf.image.decode_image(
            image_bytes,
            channels=3,
        )

        image = tf.image.resize(
            image,
            IMAGE_SIZE,
        )

        image = tf.keras.applications.resnet.preprocess_input(
            image,
        )

        image = tf.expand_dims(
            image,
            axis=0,
        )

        return image

    def predict(
        self,
        image_bytes,
    ):

        image = self.preprocess(
            image_bytes,
        )

        predictions = self.model.predict(
            image,
            verbose=0,
        )[0]

        index = np.argmax(
            predictions,
        )

        prediction = CLASS_NAMES[
            index
        ]

        confidence = float(
            predictions[index]
        )

        return prediction, confidence