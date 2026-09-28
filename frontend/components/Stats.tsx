"use client";

import { useEffect, useState, useCallback } from "react";
import { StatisticsResponse, getStatistics, formatApiError } from "@/lib/api";

type Props = {
  refreshTrigger?: number;
};

export default function Stats({ refreshTrigger }: Props) {
  const [stats, setStats] = useState<StatisticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getStatistics();
      setStats(data);
    } catch (err) {
      console.error("Failed to load statistics:", err);
      setError(formatApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats, refreshTrigger]);

  function formatConfidence(avgConfidence: number): string {
    if (avgConfidence === undefined || avgConfidence === null) return "0.0%";
    // avg_confidence is e.g. 0.82 representing 82%
    const val = avgConfidence <= 1 ? avgConfidence * 100 : avgConfidence;
    return `${val.toFixed(1)}%`;
  }

  function formatTime(ms: number): string {
    if (!ms) return "0 ms";
    if (ms >= 1000) {
      return `${(ms / 1000).toFixed(2)}s`;
    }
    return `${ms.toFixed(0)} ms`;
  }

  const primaryCards = [
    {
      value: stats ? stats.total_predictions.toLocaleString() : "-",
      label: "Total Predictions",
      color: "text-blue-400",
    },
    {
      value: stats ? formatConfidence(stats.average_confidence) : "-",
      label: "Average Confidence",
      color: "text-emerald-400",
    },
    {
      value: stats ? formatTime(stats.average_processing_time_ms) : "-",
      label: "Average Inference",
      color: "text-amber-400",
    },
    {
      value: stats?.most_common_prediction
        ? stats.most_common_prediction.charAt(0).toUpperCase() +
          stats.most_common_prediction.slice(1)
        : "N/A",
      label: "Most Common Class",
      color: "text-purple-400",
    },
  ];

  const allClasses = ["glioma", "meningioma", "pituitary", "notumor"];

  return (
    <section id="stats" className="mx-auto max-w-7xl px-8 py-20">
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-bold tracking-tight">
          Prediction Statistics & Analytics
        </h2>
        <p className="mt-3 text-slate-400">
          Aggregated analytics computed in real-time from inference history
        </p>
      </div>

      {/* Loading Skeleton */}
      {loading && !stats && (
        <div className="grid gap-8 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center"
            >
              <div className="mx-auto h-10 w-24 rounded bg-slate-800" />
              <div className="mx-auto mt-4 h-4 w-32 rounded bg-slate-800/60" />
            </div>
          ))}
        </div>
      )}

      {/* Error Banner */}
      {error && !stats && (
        <div className="rounded-2xl border border-red-800 bg-red-950/40 p-8 text-center">
          <p className="text-red-300">Failed to load statistics from backend</p>
          <p className="mt-1 text-sm text-red-400">{error}</p>
          <button
            onClick={fetchStats}
            className="mt-4 rounded-xl bg-red-800 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Stats Display */}
      {stats && (
        <>
          <div className="grid gap-8 md:grid-cols-4">
            {primaryCards.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center shadow-lg transition hover:border-slate-700"
              >
                <h3 className={`text-4xl font-bold ${stat.color}`}>
                  {stat.value}
                </h3>
                <p className="mt-3 text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Class Distribution Breakdown */}
          {stats.total_predictions > 0 && (
            <div className="mt-12 rounded-2xl border border-slate-800 bg-slate-900 p-8">
              <h3 className="mb-6 text-xl font-semibold">
                Class Distribution & Percentages
              </h3>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {allClasses.map((cls) => {
                  const count = stats.class_distribution?.[cls] || 0;
                  const percentage = stats.class_percentages?.[cls] || 0;
                  const formattedClass =
                    cls === "notumor"
                      ? "No Tumour"
                      : cls.charAt(0).toUpperCase() + cls.slice(1);

                  return (
                    <div
                      key={cls}
                      className="rounded-xl border border-slate-800 bg-slate-950/60 p-5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">
                          {formattedClass}
                        </span>
                        <span className="text-sm font-bold text-blue-400">
                          {count} {count === 1 ? "scan" : "scans"}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                        <span>Share</span>
                        <span>{percentage.toFixed(1)}%</span>
                      </div>

                      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-blue-500 transition-all duration-500"
                          style={{
                            width: `${Math.min(Math.max(percentage, 0), 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}