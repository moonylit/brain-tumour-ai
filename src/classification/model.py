import tensorflow as tf


def build_model(num_classes):

    base_model = tf.keras.applications.ResNet50(
        weights="imagenet",
        include_top=False,
        input_shape=(224, 224, 3),
    )

    base_model.trainable = False

    inputs = tf.keras.Input(
        shape=(224, 224, 3),
        name="input_image",
    )

    x = inputs

    x = base_model(
        x,
        training=False,
    )

    x = tf.keras.layers.GlobalAveragePooling2D(
        name="global_pool",
    )(x)

    x = tf.keras.layers.Dropout(
        0.3,
        name="dropout",
    )(x)

    outputs = tf.keras.layers.Dense(
        num_classes,
        activation="softmax",
        name="classifier",
    )(x)

    model = tf.keras.Model(
        inputs,
        outputs,
        name="brain_tumour_classifier",
    )

    return model