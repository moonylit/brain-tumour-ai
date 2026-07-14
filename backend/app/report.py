from io import BytesIO
from pathlib import Path

from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Image,
)


def generate_report(
    prediction: str,
    confidence: float,
    processing_time_ms: float,
    heatmap_filename: str,
):
    buffer = BytesIO()

    document = SimpleDocTemplate(
        buffer,
    )

    styles = getSampleStyleSheet()

    elements = []

    elements.append(
        Paragraph(
            "<b>Brain Tumour AI Report</b>",
            styles["Title"],
        )
    )

    elements.append(
        Paragraph(
            f"Prediction: {prediction}",
            styles["BodyText"],
        )
    )

    elements.append(
        Paragraph(
            f"Confidence: {(confidence * 100):.2f}%",
            styles["BodyText"],
        )
    )

    elements.append(
        Paragraph(
            f"Inference Time: {processing_time_ms:.2f} ms",
            styles["BodyText"],
        )
    )

    heatmap_path = (
        Path(__file__).resolve().parents[1]
        / "heatmaps"
        / heatmap_filename
    )

    if heatmap_path.exists():

        elements.append(
            Paragraph(
                "<br/><b>Grad-CAM Heatmap</b>",
                styles["Heading2"],
            )
        )

        elements.append(
            Image(
                str(heatmap_path),
                width=300,
                height=300,
            )
        )

    document.build(elements)

    buffer.seek(0)

    return buffer