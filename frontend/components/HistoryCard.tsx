"use client";

import { useEffect, useState, useCallback } from "react";
import {
  HistoryItem,
  HistoryQueryParams,
  getHistory,
  getHeatmapUrl,
  formatTumorClass,
  formatApiError,
} from "@/lib/api";

type Props = {
  initialHistory?: HistoryItem[];
  refreshTrigger?: number;
};

const VALID_CLASSES = [
  { label: "All Classes", value: "" },
  { label: "Glioma", value: "glioma" },
  { label: "Meningioma", value: "meningioma" },
  { label: "Pituitary", value: "pituitary" },
  { label: "No Tumor", value: "notumor" },
];

export default function HistoryCard({
  initialHistory,
  refreshTrigger,
}: Props) {
  const [history, setHistory] = useState<HistoryItem[]>(initialHistory || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter and pagination state
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [limit, setLimit] = useState<number | undefined>(10);
  const [selectedHeatmap, setSelectedHeatmap] = useState<string | null>(null);

  const fetchHistoryData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: HistoryQueryParams = {
        sort: sortOrder,
      };

      if (selectedClass) {
        params.prediction = selectedClass;
      }
      if (limit && limit > 0) {
        params.limit = limit;
      }

      const data = await getHistory(params);
      setHistory(data);
    } catch (err) {
      console.error("Failed to load history:", err);
      setError(formatApiError(err));
    } finally {
      setLoading(false);
    }
  }, [selectedClass, sortOrder, limit]);

  useEffect(() => {
    fetchHistoryData();
  }, [fetchHistoryData, refreshTrigger]);

  function getBadgeColor(prediction: string) {
    switch (prediction.toLowerCase()) {
      case "glioma":
        return "bg-amber-950/40 text-amber-300 border-amber-800/80";
      case "meningioma":
        return "bg-rose-950/40 text-rose-300 border-rose-800/80";
      case "pituitary":
        return "bg-purple-950/40 text-purple-300 border-purple-800/80";
      case "notumor":
      case "no tumor":
      case "no_tumor":
        return "bg-emerald-950/40 text-emerald-300 border-emerald-800/80";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  }

  return (
    <div
      id="history"
      className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-xl"
    >
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
            Audit Trail
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
            Prediction History
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Historical MRI classification inferences, latency logs, and explainability maps
          </p>
        </div>

        <button
          onClick={fetchHistoryData}
          disabled={loading}
          className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700 hover:text-white disabled:opacity-50"
        >
          {loading ? (
            <>
              <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-300 border-r-transparent" />
              <span>Refreshing...</span>
            </>
          ) : (
            <>
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              <span>Refresh</span>
            </>
          )}
        </button>
      </div>

      {/* Query Controls */}
      <div className="mb-6 grid grid-cols-1 gap-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4 sm:grid-cols-3">
        {/* Class Filter */}
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Filter by Class
          </label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
          >
            {VALID_CLASSES.map((cls) => (
              <option key={cls.value} value={cls.value}>
                {cls.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Sort Order
          </label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "desc" | "asc")}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
          >
            <option value="desc">Newest First (Desc)</option>
            <option value="asc">Oldest First (Asc)</option>
          </select>
        </div>

        {/* Limit */}
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Display Limit
          </label>
          <select
            value={limit || ""}
            onChange={(e) =>
              setLimit(e.target.value ? Number(e.target.value) : undefined)
            }
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
          >
            <option value="5">5 records</option>
            <option value="10">10 records</option>
            <option value="25">25 records</option>
            <option value="">All records</option>
          </select>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-800 bg-red-950/60 p-4">
          <p className="font-semibold text-red-300">
            Error loading prediction history
          </p>
          <p className="mt-1 text-sm text-red-200">{error}</p>
          <button
            onClick={fetchHistoryData}
            className="mt-3 rounded-lg bg-red-800 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="py-12 text-center text-slate-400">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent align-[-0.125em]" />
          <p className="mt-4 text-sm">Fetching prediction records...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && history.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-800 p-12 text-center text-slate-400">
          <p className="text-lg font-medium text-slate-300">
            No prediction history found
          </p>
          <p className="mt-1 text-sm">
            {selectedClass
              ? `No records found for class "${formatTumorClass(selectedClass)}". Try adjusting your filters.`
              : "Upload an MRI scan to generate your first prediction."}
          </p>
        </div>
      )}

      {/* History List */}
      {!loading && !error && history.length > 0 && (
        <div className="space-y-4">
          {history.map((item, index) => {
            const heatmapUrl = item.heatmap_filename
              ? getHeatmapUrl(item.heatmap_filename)
              : null;
            const formattedPrediction = formatTumorClass(item.prediction);

            return (
              <div
                key={`${item.timestamp}-${index}`}
                className="flex flex-col gap-4 rounded-xl border border-slate-800/80 bg-slate-800/60 p-5 transition hover:border-slate-700 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-4">
                  {/* Grad-CAM Thumbnail */}
                  {heatmapUrl ? (
                    <div
                      className="group relative h-20 w-20 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg border border-slate-700 bg-slate-900"
                      onClick={() => setSelectedHeatmap(heatmapUrl)}
                      title="Click to view full heatmap"
                    >
                      <img
                        src={heatmapUrl}
                        alt={`Heatmap for ${item.filename}`}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100">
                        <span className="text-[11px] font-semibold text-white">Inspect</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-xs text-slate-500">
                      No map
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-white">
                        {item.filename}
                      </span>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${getBadgeColor(
                          item.prediction,
                        )}`}
                      >
                        {formattedPrediction}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-300">
                      <p>
                        <span className="text-slate-400">Confidence:</span>{" "}
                        <strong className="text-blue-400">
                          {(item.confidence * 100).toFixed(2)}%
                        </strong>
                      </p>
                      <p>
                        <span className="text-slate-400">Inference Time:</span>{" "}
                        <span>{item.processing_time_ms.toFixed(2)} ms</span>
                      </p>
                    </div>

                    <p className="text-xs text-slate-400">
                      {item.timestamp
                        ? new Date(item.timestamp).toLocaleString()
                        : "Unknown date"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Heatmap Modal Dialog */}
      {selectedHeatmap && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedHeatmap(null)}
        >
          <div
            className="relative max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                Grad-CAM Explainability Heatmap
              </h3>
              <button
                onClick={() => setSelectedHeatmap(null)}
                aria-label="Close modal"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <img
              src={selectedHeatmap}
              alt="Full Grad-CAM Heatmap"
              className="max-h-[70vh] w-auto rounded-xl object-contain mx-auto"
            />
            <div className="mt-4 flex justify-end">
              <a
                href={selectedHeatmap}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition"
              >
                Open in New Tab
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}