# Brain Tumour AI — Next.js Frontend Dashboard

Modern web dashboard for Brain Tumour MRI classification, interactive explainability heatmaps, history exploration, and model analytics.

---

## Getting Started

### 1. Configure Backend API URL
Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Ensure `NEXT_PUBLIC_API_URL` points to the running FastAPI server:
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

### 2. Run Development Server

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Build for Production

```bash
npm run build
npm run start
```

---

## Features

- **MRI Upload & Neural Inference**: Select JPG/PNG MRI scans up to 10MB.
- **Grad-CAM Visualizer**: Real-time explainability overlay highlighting relevant anatomical features.
- **Interactive History Browser**: Filter by tumour class, customize limit, toggle ascending/descending order, and inspect heatmaps.
- **Real-Time Analytics**: View aggregated predictions, average confidence, latency, and class distribution percentages.
- **PDF Report Generation**: Download official diagnostic summary PDFs with one click.
- **Live Health Status**: Real-time minimal backend connection indicator.
