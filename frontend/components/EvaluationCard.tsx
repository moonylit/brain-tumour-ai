"use client";

import { useEffect, useState, useCallback } from "react";
import {
  EvaluationMetrics,
  EvaluationPlots,
  getEvaluation,
  getEvaluationPlots,
  getPlotUrl,
  formatTumorClass,
  formatApiError,
} from "@/lib/api";

type Props = {
  metrics?: EvaluationMetrics;
  plots?: EvaluationPlots;
};

type EvaluationTab = "confusion_matrix" | "roc_curve" | "precision_recall";

const TAB_CONFIG: {
  id: EvaluationTab;
  label: string;
  explanation: string;
}[] = [
  {
    id: "confusion_matrix",
    label: "Confusion Matrix",
    explanation:
      "Shows how often the model correctly identifies each tumor class and where classifications are confused.",
  },
  {
    id: "roc_curve",
    label: "ROC Curve",
    explanation:
      "Shows the model's class discrimination performance across classification thresholds.",
  },
  {
    id: "precision_recall",
    label: "Precision-Recall",
    explanation:
      "Shows the trade-off between precision and recall across classification thresholds.",
  },
];

export default function EvaluationCard({
  metrics: initialMetrics,
  plots: initialPlots,
}: Props) {
  const [metrics, setMetrics] = useState<EvaluationMetrics | null>(
    initialMetrics || null,
  );
  const [plots, setPlots] = useState<EvaluationPlots | null>(
    initialPlots || null,
  );
  const [activeTab, setActiveTab] =
    useState<EvaluationTab>("confusion_matrix");
  const [loading, setLoading] = useState(!initialMetrics || !initialPlots);
  const [error, setError] = useState<string | null>(null);

  const fetchEvaluationData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [metricsData, plotsData] = await Promise.all([
        getEvaluation(),
        getEvaluationPlots(),
      ]);
      setMetrics(metricsData);
      setPlots(plotsData);
    } catch (err) {
      console.error("Failed to load evaluation data:", err);
      setError(formatApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialMetrics) {
      setMetrics(initialMetrics);
    }
    if (initialPlots) {
      setPlots(initialPlots);
    }
    if (!initialMetrics || !initialPlots) {
      fetchEvaluationData();
    }
  }, [initialMetrics, initialPlots, fetchEvaluationData]);

  const activeTabConfig = TAB_CONFIG.find((tab) => tab.id === activeTab)!;

  return (
    <section id="evaluation" className="mx-auto max-w-7xl px-8 py-16">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 sm:p-10 shadow-2xl backdrop-blur-sm">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold tracking-wide text-blue-400">
              Validated Test Performance
            </div>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Model Evaluation
            </h2>
            <p className="mt-2 text-sm text-slate-400 max-w-2xl">
              Independent benchmark metrics and statistical diagnostics computed
              across validation MRI datasets using the trained ResNet50 neural network.
            </p>
          </div>

          {error && (
            <button
              onClick={fetchEvaluationData}
              className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition"
            >
              Retry Load
            </button>
          )}
        </div>

        {/* Loading Skeleton */}
        {loading && !metrics && (
          <div className="space-y-8 animate-pulse">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 text-center"
                >
                  <div className="mx-auto h-4 w-20 rounded bg-slate-800" />
                  <div className="mx-auto mt-3 h-8 w-24 rounded bg-slate-800/80" />
                </div>
              ))}
            </div>
            <div className="h-96 rounded-2xl border border-slate-800 bg-slate-950/40" />
          </div>
        )}

        {/* Error State */}
        {error && !metrics && (
          <div className="rounded-2xl border border-red-900/60 bg-red-950/30 p-8 text-center">
            <p className="font-semibold text-red-300">
              Unable to load model evaluation data
            </p>
            <p className="mt-1 text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Evaluation Metrics Cards */}
        {metrics && (
          <div className="mb-10 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            <div className="rounded-2xl border border-slate-800/90 bg-slate-950/50 p-6 text-center transition hover:border-slate-700">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Accuracy
              </span>
              <p className="mt-2 text-3xl font-bold tracking-tight text-emerald-400">
                {(metrics.accuracy * 100).toFixed(2)}%
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800/90 bg-slate-950/50 p-6 text-center transition hover:border-slate-700">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Precision
              </span>
              <p className="mt-2 text-3xl font-bold tracking-tight text-blue-400">
                {(metrics.precision * 100).toFixed(2)}%
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800/90 bg-slate-950/50 p-6 text-center transition hover:border-slate-700">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Recall
              </span>
              <p className="mt-2 text-3xl font-bold tracking-tight text-amber-400">
                {(metrics.recall * 100).toFixed(2)}%
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800/90 bg-slate-950/50 p-6 text-center transition hover:border-slate-700">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                F1 Score
              </span>
              <p className="mt-2 text-3xl font-bold tracking-tight text-purple-400">
                {(metrics.f1_score * 100).toFixed(2)}%
              </p>
            </div>
          </div>
        )}

        {/* Segmented Control Tabs */}
        <div className="mb-6 border-b border-slate-800 pb-6">
          <div
            role="tablist"
            aria-label="Model Evaluation Visualizations"
            className="inline-flex flex-wrap rounded-2xl border border-slate-800 bg-slate-950/80 p-1.5 shadow-inner"
          >
            {TAB_CONFIG.map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-selected={isSelected}
                  aria-controls={`panel-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-md shadow-blue-900/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Visualization One-Line Explanation */}
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-300">
            <span className="font-semibold text-blue-400">
              {activeTabConfig.label}:
            </span>
            <span>{activeTabConfig.explanation}</span>
          </div>
        </div>

        {/* Selected Visualization Panel (Displays ONLY the active tab) */}
        {plots && (
          <div
            role="tabpanel"
            id={`panel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
            className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6 sm:p-8"
          >
            {activeTab === "confusion_matrix" && plots.confusion_matrix && (
              <div className="flex flex-col items-center">
                <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
                  <img
                    src={getPlotUrl(plots.confusion_matrix)}
                    alt="Confusion Matrix"
                    className="w-full object-contain"
                  />
                </div>

                {metrics?.confusion_matrix && metrics?.class_labels && (
                  <div className="mt-8 w-full max-w-2xl">
                    <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
                      Class Confusion Matrix Summary
                    </h4>
                    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80">
                      <table className="w-full text-left text-xs">
                        <thead className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                          <tr>
                            <th className="px-4 py-2.5 font-medium">True \ Pred</th>
                            {metrics.class_labels.map((label) => (
                              <th key={label} className="px-4 py-2.5 font-semibold text-slate-300">
                                {formatTumorClass(label)}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-mono">
                          {metrics.confusion_matrix.map((row, rowIdx) => {
                            const rowLabel = metrics.class_labels![rowIdx];
                            return (
                              <tr key={rowLabel} className="hover:bg-slate-800/30">
                                <td className="px-4 py-2.5 font-sans font-medium text-slate-300">
                                  {formatTumorClass(rowLabel)}
                                </td>
                                {row.map((val, colIdx) => (
                                  <td
                                    key={colIdx}
                                    className={`px-4 py-2.5 ${
                                      rowIdx === colIdx
                                        ? "font-bold text-emerald-400 bg-emerald-950/20"
                                        : val > 0
                                        ? "text-amber-400"
                                        : "text-slate-500"
                                    }`}
                                  >
                                    {val}
                                  </td>
                                ))}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "roc_curve" && plots.roc_curve && (
              <div className="flex flex-col items-center">
                <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
                  <img
                    src={getPlotUrl(plots.roc_curve)}
                    alt="ROC Curve"
                    className="w-full object-contain"
                  />
                </div>

                {metrics?.roc_curve && (
                  <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 w-full max-w-2xl">
                    {Object.entries(metrics.roc_curve).map(([cls, curve]) => (
                      <div
                        key={cls}
                        className="rounded-xl border border-slate-800 bg-slate-900/90 p-3 text-center"
                      >
                        <span className="text-xs text-slate-400">
                          {formatTumorClass(cls)}
                        </span>
                        <p className="mt-1 font-mono text-sm font-bold text-blue-400">
                          AUC {curve.auc.toFixed(3)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "precision_recall" && plots.precision_recall_curve && (
              <div className="flex flex-col items-center">
                <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
                  <img
                    src={getPlotUrl(plots.precision_recall_curve)}
                    alt="Precision Recall Curve"
                    className="w-full object-contain"
                  />
                </div>

                {metrics?.precision_recall_curve && (
                  <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 w-full max-w-2xl">
                    {Object.entries(metrics.precision_recall_curve).map(
                      ([cls, curve]) => (
                        <div
                          key={cls}
                          className="rounded-xl border border-slate-800 bg-slate-900/90 p-3 text-center"
                        >
                          <span className="text-xs text-slate-400">
                            {formatTumorClass(cls)}
                          </span>
                          <p className="mt-1 font-mono text-sm font-bold text-purple-400">
                            AP {curve.average_precision.toFixed(3)}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}