"use client";

import { useState } from "react";
import axios from "axios";
import PredictionCard from "./PredictionCard";

export default function UploadCard() {
  const [selectedImage, setSelectedImage] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState<any>(null);

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));

    // Clear previous prediction
    setResult(null);
  }

  async function handleUpload() {
    if (!selectedImage) {
      alert("Please select an MRI image first.");
      return;
    }

    const formData = new FormData();

    formData.append(
      "file",
      selectedImage,
    );

    try {
      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:8000/predict",
        formData,
      );

      setResult(response.data);

    } catch (error: any) {
      console.error(error);

      if (error.response) {
        alert(JSON.stringify(error.response.data));
      } else {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-5xl px-8 py-20">
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-10">

        <h2 className="mb-6 text-3xl font-bold">
          Upload MRI Scan
        </h2>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />

        {preview && (
          <div className="mt-8">

            <img
              src={preview}
              alt="MRI Preview"
              className="max-h-96 rounded-xl"
            />

            <button
              onClick={handleUpload}
              disabled={loading}
              className="mt-8 block rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500 disabled:bg-slate-700"
            >
              {loading
                ? "Predicting..."
                : "Predict MRI"}
            </button>

          </div>
        )}

        {result && (
          <PredictionCard
            prediction={result.prediction}
            confidence={result.confidence}
            probabilities={result.probabilities}
            processingTime={result.processing_time_ms}
          />
        )}

      </div>
    </section>
  );
}