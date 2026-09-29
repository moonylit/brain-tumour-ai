"use client";

import { useState } from "react";
import {
  downloadReport,
  getHeatmapUrl,
  formatApiError,
  formatTumorClass,
} from "@/lib/api";

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
  const formattedPrediction = formatTumorClass(prediction);

  return (
    <div className="mt-10 rounded-2xl border border-emerald-800/80 bg-slate-900 p-8 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Inference Completed
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
            Prediction Result
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1 text-xs font-semibold text-emerald-300">
            {formattedPrediction}
          </span>
        </div>
      </div>

      {heatmapFilename && (
        <div className="mb-8">
          <h3 className="mb-4 text-lg font-semibold text-slate-200">
            Grad-CAM Heatmap Localization
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
            <p className="mt-2 text-xs text-slate-400 font-mono">
              Generated file: {heatmapFilename}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-xl border border-slate-800 bg-slate-950/50 p-5">
        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Predicted Class
          </span>
          <p className="mt-1 text-xl font-bold text-emerald-400">
            {formattedPrediction}
          </p>
        </div>

        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Confidence Score
          </span>
          <p className="mt-1 text-xl font-bold text-blue-400">
            {(confidence * 100).toFixed(2)}%
          </p>
        </div>

        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Inference Latency
          </span>
          <p className="mt-1 text-xl font-bold text-slate-200">
            {processingTime.toFixed(2)} ms
          </p>
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={handleDownloadReport}
          disabled={downloading}
          className="inline-flex items-center gap-2.5 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-700"
        >
          {downloading ? (
            <>
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
              <span>Generating Report...</span>
            </>
          ) : (
            <>
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <span>Download PDF Report</span>
            </>
          )}
        </button>

        {downloadError && (
          <div className="mt-3 rounded-lg border border-red-800 bg-red-950/60 p-3 text-sm text-red-300">
            {downloadError}
          </div>
        )}
      </div>

      {probabilities && Object.keys(probabilities).length > 0 && (
        <div className="mt-8 border-t border-slate-800 pt-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-200">
            Class Probabilities
          </h3>

          <div className="space-y-3">
            {Object.entries(probabilities).map(([label, value]) => {
              const percent = (value * 100).toFixed(2);
              const formattedLabel = formatTumorClass(label);
              return (
                <div key={label} className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-3">
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="font-medium text-slate-200">
                      {formattedLabel}
                    </span>
                    <span className="font-mono font-semibold text-slate-300">
                      {percent}%
                    </span>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-2.5 rounded-full bg-blue-500 transition-all duration-500"
                      style={{
                        width: `${Math.min(Math.max(value * 100, 0), 100)}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}