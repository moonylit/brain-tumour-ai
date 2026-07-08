import tensorflow as tf

AUTOTUNE = tf.data.AUTOTUNE


def load_datasets(
    train_dir,
    val_dir,
    image_size=(224, 224),
    batch_size=32,
):

    train_dataset = tf.keras.utils.image_dataset_from_directory(
        train_dir,
        shuffle=True,
        image_size=image_size,
        batch_size=batch_size,
    )

    validation_dataset = tf.keras.utils.image_dataset_from_directory(
        val_dir,
        shuffle=False,
        image_size=image_size,
        batch_size=batch_size,
    )

    train_dataset = train_dataset.prefetch(AUTOTUNE)
    validation_dataset = validation_dataset.prefetch(AUTOTUNE)

    return train_dataset, validation_dataset