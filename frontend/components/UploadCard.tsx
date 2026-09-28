"use client";

import { useState } from "react";
import {
  predictMRI,
  getEvaluation,
  getEvaluationPlots,
  PredictionResponse,
  EvaluationMetrics,
  EvaluationPlots,
  formatApiError,
} from "@/lib/api";

import PredictionCard from "./PredictionCard";
import EvaluationCard from "./EvaluationCard";
import HistoryCard from "./HistoryCard";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png"];

export default function UploadCard() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationMetrics | null>(null);
  const [plots, setPlots] = useState<EvaluationPlots | null>(null);

  function validateFile(file: File): string | null {
    if (!file) {
      return "Please select an MRI image file before predicting.";
    }
    if (file.size === 0) {
      return "The selected image file is empty (0 bytes). Please select a valid MRI image.";
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return `File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the maximum allowed limit of 10 MB.`;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `Unsupported image format (${file.type || "unknown"}). Only JPG and PNG MRI scans are supported.`;
    }
    return null;
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    setErrorMessage(null);
    const file = event.target.files?.[0];

    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setErrorMessage(validationError);
      setSelectedImage(null);
      setPreview(null);
      return;
    }

    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setErrorMessage(null);
  }

  async function handleUpload() {
    if (!selectedImage) {
      setErrorMessage("Please select an MRI image file first.");
      return;
    }

    const validationError = validateFile(selectedImage);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      // 1. Send MRI for real model prediction
      const predictionData = await predictMRI(selectedImage);
      setResult(predictionData);

      // 2. Fetch evaluation metrics & plots
      try {
        const [metricsData, plotData] = await Promise.all([
          getEvaluation(),
          getEvaluationPlots(),
        ]);
        setEvaluation(metricsData);
        setPlots(plotData);
      } catch (evalError) {
        console.warn("Could not load evaluation data:", evalError);
      }

      // 3. Trigger history & stats refresh
      setRefreshTrigger((prev) => prev + 1);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("new-prediction"));
      }
    } catch (error: unknown) {
      console.error("Prediction failed:", error);
      setErrorMessage(formatApiError(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="upload" className="mx-auto max-w-5xl px-8 py-12">
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 sm:p-10 shadow-2xl">
        <div className="mb-6">
          <h2 className="text-3xl font-bold tracking-tight">Upload MRI Scan</h2>
          <p className="mt-2 text-sm text-slate-400">
            Select a brain MRI image (JPG or PNG, max 10MB) for neural network classification and Grad-CAM explainability analysis.
          </p>
        </div>

        {/* File Input Box */}
        <div className="rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950/50 p-6 text-center transition hover:border-blue-500">
          <input
            type="file"
            id="mri-file-input"
            accept="image/jpeg,image/png"
            onChange={handleImageChange}
            className="block w-full cursor-pointer text-sm text-slate-400 file:mr-4 file:rounded-xl file:border-0 file:bg-blue-600 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-500"
          />
          <p className="mt-3 text-xs text-slate-500">
            Supported formats: JPG, PNG • Max size: 10 MB
          </p>
        </div>

        {/* Error Notification Banner */}
        {errorMessage && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-800 bg-red-950/70 p-4 text-red-200">
            <span className="text-xl">⚠️</span>
            <div className="flex-1 text-sm">
              <strong className="block font-semibold text-red-300">
                Action Required
              </strong>
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* Preview and Action Button */}
        {preview && (
          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-300">
              Selected Image Preview
            </h3>
            <div className="flex flex-col items-center">
              <img
                src={preview}
                alt="MRI Preview"
                className="max-h-96 rounded-xl border border-slate-700 object-contain shadow-md"
              />
              <p className="mt-2 text-xs text-slate-400">
                {selectedImage?.name} ({((selectedImage?.size || 0) / 1024).toFixed(1)} KB)
              </p>

              <button
                onClick={handleUpload}
                disabled={loading}
                className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 font-semibold text-white shadow-lg transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-700"
              >
                {loading ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
                    <span>Analyzing Brain MRI...</span>
                  </>
                ) : (
                  <>
                    <span>🧠</span>
                    <span>Predict MRI</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Prediction Results */}
        {result && (
          <PredictionCard
            prediction={result.prediction}
            confidence={result.confidence}
            probabilities={result.probabilities}
            processingTime={result.processing_time_ms}
            heatmapFilename={result.heatmap_filename}
          />
        )}

        {/* Model Evaluation Metrics & Plots */}
        {evaluation && plots && (
          <EvaluationCard metrics={evaluation} plots={plots} />
        )}

        {/* Prediction History Component */}
        <HistoryCard refreshTrigger={refreshTrigger} />
      </div>
    </section>
  );
}