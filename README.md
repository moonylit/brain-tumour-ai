# Brain Tumour AI

An end-to-end Deep Learning system for automated Brain Tumour classification using a fine-tuned ResNet50 Transfer Learning model, Grad-CAM explainability maps, interactive FastAPI backend, and Next.js frontend dashboard.

---

## Architecture Overview

- **Machine Learning**: TensorFlow / Keras ResNet50 transfer learning model trained on brain MRI scans.
- **Explainability**: Grad-CAM (Gradient-weighted Class Activation Mapping) visualizing regions influencing predictions.
- **Backend**: FastAPI REST API providing inference, prediction history with query parameters, analytics statistics, evaluation metrics, and PDF report generation.
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, providing a responsive dark-themed dashboard.

---

## Supported Tumour Classes

- `glioma`
- `meningioma`
- `pituitary`
- `notumor`

---

## Getting Started

### 1. Backend Setup

Prerequisites: Python 3.10+ and virtual environment.

```bash
# Navigate to the backend directory
cd backend

# Activate your virtual environment
# Windows:
..\.venv-gradcam\Scripts\activate
# Linux/macOS:
source ../.venv-gradcam/bin/activate

# Start the FastAPI server on port 8000
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

The API will be available at `http://127.0.0.1:8000`. Interactive Swagger documentation is available at `http://127.0.0.1:8000/docs`.

### 2. Frontend Setup

Prerequisites: Node.js 18+ and npm.

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Configure environment variables
# Copy .env.local.example to .env.local:
cp .env.local.example .env.local
```

The default `.env.local` contains:
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Start the frontend development server:
```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## API Endpoints & Specification

### `GET /health`
Returns the operational status of the service and model loading state.
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

### `POST /predict`
Upload a brain MRI scan (JPG or PNG, max 10MB) via `multipart/form-data` with field name `file`.
- **Response**:
  - `prediction`: predicted class name
  - `confidence`: confidence score float (0.0 to 1.0)
  - `probabilities`: dictionary of per-class probabilities
  - `processing_time_ms`: inference duration in milliseconds
  - `heatmap_filename`: Grad-CAM heatmap filename served under `/heatmaps/{filename}`

### `GET /history`
Retrieves past prediction records from history with support for pagination, filtering, and sorting.

- **Query Parameters**:
  - `limit` (*optional integer, gt=0*): maximum number of records to return. Returns `HTTP 422` if <= 0.
  - `prediction` (*optional string*): filter by class (`glioma`, `meningioma`, `pituitary`, `notumor`). Returns `HTTP 400` if invalid.
  - `sort` (*optional string, "asc" or "desc"*): sort order by timestamp. Default is `desc` (newest first). Returns `HTTP 422` if not `asc` or `desc`.

- **Examples**:
  - `GET /history?limit=10`
  - `GET /history?prediction=glioma`
  - `GET /history?sort=asc`
  - `GET /history?prediction=meningioma&limit=5&sort=desc`

### `GET /statistics`
Returns aggregated analytics calculated from prediction history:
- `total_predictions`: count of historical predictions
- `average_confidence`: mean confidence score across history
- `average_processing_time_ms`: mean inference time in milliseconds
- `class_distribution`: counts per tumour class
- `class_percentages`: percentage share per tumour class
- `most_common_prediction`: most frequently predicted class

### `GET /evaluation`
Returns model validation metrics:
- `accuracy`, `precision`, `recall`, `f1_score`

### `GET /evaluation/plots`
Returns static image paths for:
- Confusion Matrix (`/plots/confusion_matrix.png`)
- ROC Curve (`/plots/roc_curve.png`)
- Precision-Recall Curve (`/plots/precision_recall_curve.png`)

### `GET /report`
Generates and downloads a clinical-style PDF report for the latest prediction.

### `GET /heatmaps/{filename}`
Serves Grad-CAM explainability heatmaps corresponding to predictions.

---

## Frontend Integration

The Next.js frontend connects directly to the FastAPI backend:
- **Centralized API Client**: All network interactions pass through `frontend/lib/api.ts` configured via `NEXT_PUBLIC_API_URL`.
- **Live Health Indicator**: Navbar features a subtle `API Online` / `API Offline` badge polling `/health`.
- **Real-Time Classification**: Uploaded scans immediately trigger neural network inference and display explainability heatmaps.
- **Dynamic History Management**: Filter history records by class, adjust limits, toggle sort direction, and preview heatmaps in full modals.
- **Dynamic Analytics**: Dashboard cards and percentage bars update automatically with live data from `/statistics`.
- **One-Click PDF Report**: Initiates real binary PDF downloads from `/report` with download progress and error feedback.
- **Client Validation**: Validates image MIME type, 10MB file limit, and non-empty files before sending.
