from pathlib import Path
import tempfile

import streamlit as st
from tensorflow.keras.models import load_model

from src.classification.predictor import Predictor


MODEL_PATH = "models/resnet50_best.keras"

CLASS_NAMES = [
    "glioma",
    "meningioma",
    "notumor",
    "pituitary",
]


@st.cache_resource
def load_prediction_model():
    return load_model(MODEL_PATH)


model = load_prediction_model()
predictor = Predictor(model)


st.set_page_config(
    page_title="Brain Tumour MRI Classifier",
    page_icon="🧠",
    layout="wide",
)

st.title("🧠 Brain Tumour MRI Classifier")

st.write(
    "Upload an MRI image to classify the tumour."
)

uploaded_file = st.file_uploader(
    "Choose an MRI image",
    type=["jpg", "jpeg", "png"],
)

if uploaded_file is not None:

    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=".jpg",
    ) as temp:

        temp.write(uploaded_file.read())
        temp_path = Path(temp.name)

    prediction, confidence = predictor.predict(
        temp_path
    )

    image = predictor.preprocess(temp_path)

    probabilities = model.predict(
        image,
        verbose=0,
    )[0]

    left, right = st.columns([1.2, 1])

    with left:

        st.image(
            temp_path,
            caption="Uploaded MRI",
            width=450,
        )

    with right:

        st.success("Prediction Complete!")

        prediction_col, confidence_col = st.columns(2)

        with prediction_col:

            st.metric(
                label="Prediction",
                value=prediction.capitalize(),
            )

        with confidence_col:

            st.metric(
                label="Confidence",
                value=f"{confidence:.2%}",
            )

        st.markdown("### Confidence Level")

        if confidence >= 0.90:

            st.success(
                "🟢 High Confidence"
            )

        elif confidence >= 0.70:

            st.warning(
                "🟡 Medium Confidence"
            )

        else:

            st.error(
                "🔴 Low Confidence"
            )

            st.info(
                "The model is not very confident about this prediction. "
                "Please verify the result with a medical professional."
            )

    st.divider()

    st.subheader("Class Probabilities")

    for class_name, probability in zip(
        CLASS_NAMES,
        probabilities,
    ):

        st.write(
            f"**{class_name.capitalize()}** — {probability:.2%}"
        )

        st.progress(
            float(probability)
        )

    st.divider()

    st.caption(
        "Model: ResNet50 Transfer Learning"
    )

    st.caption(
        "Classes: Glioma | Meningioma | No Tumor | Pituitary"
    )