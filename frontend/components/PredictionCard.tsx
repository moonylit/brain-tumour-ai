"use client";

import { useState } from "react";
import { downloadReport, getHeatmapUrl, formatApiError } from "@/lib/api";

type Props = {
  prediction: string;
  confidence: number;
  probabilities: Record<string, number>;
  processingTime: number;
  heatmapFilename: string;
};

export default function PredictionCard({
  prediction,
  confidence,
  probabilities,
  processingTime,
  heatmapFilename,
}: Props) {
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  async function handleDownloadReport() {
    try {
      setDownloading(true);
      setDownloadError(null);
      await downloadReport();
    } catch (error) {
      console.error("PDF download failed:", error);
      setDownloadError(formatApiError(error));
    } finally {
      setDownloading(false);
    }
  }

  const heatmapUrl = getHeatmapUrl(heatmapFilename);

  return (
    <div className="mt-10 rounded-2xl border border-green-700 bg-slate-900 p-8">
      <h2 className="mb-6 text-3xl font-bold">
        Prediction Result
      </h2>

      {heatmapFilename && (
        <div className="mb-8">
          <h3 className="mb-4 text-xl font-semibold">
            Grad-CAM Heatmap
          </h3>

          <div className="flex flex-col items-center">
            <img
              src={heatmapUrl}
              alt={`Grad-CAM Heatmap for ${prediction}`}
              className="mx-auto max-h-96 rounded-xl border border-slate-700 object-contain shadow-lg"
              onError={(e) => {
                // Fallback if image fails to load
                (e.target as HTMLElement).style.display = "none";
              }}
            />
            <p className="mt-2 text-xs text-slate-400">
              Generated file: {heatmapFilename}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <p>
          <strong>Prediction:</strong>{" "}
          <span className="font-semibold text-emerald-400">
            {prediction.charAt(0).toUpperCase() + prediction.slice(1)}
          </span>
        </p>

        <p>
          <strong>Confidence:</strong>{" "}
          <span className="font-semibold text-blue-400">
            {(confidence * 100).toFixed(2)}%
          </span>
        </p>

        <p>
          <strong>Inference Time:</strong>{" "}
          <span>{processingTime.toFixed(2)} ms</span>
        </p>
      </div>

      <div className="mt-8">
        <button
          onClick={handleDownloadReport}
          disabled={downloading}
          className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-700"
        >
          {downloading ? "⏳ Generating PDF..." : "📄 Download PDF Report"}
        </button>

        {downloadError && (
          <div className="mt-3 rounded-lg border border-red-800 bg-red-950/60 p-3 text-sm text-red-300">
            {downloadError}
          </div>
        )}
      </div>

      {probabilities && Object.keys(probabilities).length > 0 && (
        <div className="mt-8">
          <h3 className="mb-4 text-xl font-semibold">
            Class Probabilities
          </h3>

          {Object.entries(probabilities).map(([label, value]) => {
            const percent = (value * 100).toFixed(2);
            return (
              <div key={label} className="mb-3">
                <div className="mb-1 flex justify-between text-sm">
                  <span>
                    {label.charAt(0).toUpperCase() + label.slice(1)}
                  </span>
                  <span className="font-medium text-slate-300">{percent}%</span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-700">
                  <div
                    className="h-3 rounded-full bg-blue-500 transition-all duration-500"
                    style={{
                      width: `${Math.min(Math.max(value * 100, 0), 100)}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}