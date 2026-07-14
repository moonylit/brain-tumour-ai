from io import BytesIO
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph


def generate_report(
    prediction: str,
    confidence: float,
    processing_time_ms: float,
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

    document.build(
        elements,
    )

    buffer.seek(0)

    return buffer