import numpy as np
import tensorflow as tf


class Predictor:

    def __init__(self, model):

        self.model = model

        self.class_names = [
            "glioma",
            "meningioma",
            "notumor",
            "pituitary",
        ]

    def predict(self, image_path):

        image = tf.keras.utils.load_img(
            image_path,
            target_size=(224, 224),
        )

        image = tf.keras.utils.img_to_array(image)

        image = np.expand_dims(
            image,
            axis=0,
        )

        predictions = self.model.predict(
            image,
            verbose=0,
        )

        confidence = float(
            np.max(predictions)
        )

        predicted_index = int(
            np.argmax(predictions)
        )

        return (
            self.class_names[predicted_index],
            confidence,
        )