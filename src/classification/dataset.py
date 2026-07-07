import tensorflow as tf


def load_datasets(
    train_dir,
    image_size=(224, 224),
    batch_size=32,
    validation_split=0.2,
):

    train_dataset = tf.keras.utils.image_dataset_from_directory(
        train_dir,
        validation_split=validation_split,
        subset="training",
        seed=42,
        image_size=image_size,
        batch_size=batch_size,
    )

    validation_dataset = tf.keras.utils.image_dataset_from_directory(
        train_dir,
        validation_split=validation_split,
        subset="validation",
        seed=42,
        image_size=image_size,
        batch_size=batch_size,
    )

    return train_dataset, validation_dataset