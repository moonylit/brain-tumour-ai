"use client";

import { EvaluationMetrics, EvaluationPlots, getPlotUrl } from "@/lib/api";

type Props = {
  metrics: EvaluationMetrics;
  plots: EvaluationPlots;
};

export default function EvaluationCard({ metrics, plots }: Props) {
  return (
    <div id="evaluation" className="mt-10 rounded-2xl border border-blue-700 bg-slate-900 p-8">
      <h2 className="mb-8 text-3xl font-bold">
        Model Evaluation
      </h2>

      <div className="mb-10 grid grid-cols-2 gap-6 md:grid-cols-4">
        <div className="rounded-xl bg-slate-800 p-5 text-center">
          <p className="text-sm text-slate-400">
            Accuracy
          </p>
          <p className="mt-2 text-2xl font-bold text-green-400">
            {(metrics.accuracy * 100).toFixed(2)}%
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 p-5 text-center">
          <p className="text-sm text-slate-400">
            Precision
          </p>
          <p className="mt-2 text-2xl font-bold text-blue-400">
            {(metrics.precision * 100).toFixed(2)}%
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 p-5 text-center">
          <p className="text-sm text-slate-400">
            Recall
          </p>
          <p className="mt-2 text-2xl font-bold text-yellow-400">
            {(metrics.recall * 100).toFixed(2)}%
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 p-5 text-center">
          <p className="text-sm text-slate-400">
            F1 Score
          </p>
          <p className="mt-2 text-2xl font-bold text-pink-400">
            {(metrics.f1_score * 100).toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="space-y-12">
        {plots.confusion_matrix && (
          <div>
            <h3 className="mb-4 text-2xl font-semibold">
              Confusion Matrix
            </h3>
            <img
              src={getPlotUrl(plots.confusion_matrix)}
              alt="Confusion Matrix"
              className="w-full rounded-xl border border-slate-700"
            />
          </div>
        )}

        {plots.roc_curve && (
          <div>
            <h3 className="mb-4 text-2xl font-semibold">
              ROC Curve
            </h3>
            <img
              src={getPlotUrl(plots.roc_curve)}
              alt="ROC Curve"
              className="w-full rounded-xl border border-slate-700"
            />
          </div>
        )}

        {plots.precision_recall_curve && (
          <div>
            <h3 className="mb-4 text-2xl font-semibold">
              Precision-Recall Curve
            </h3>
            <img
              src={getPlotUrl(plots.precision_recall_curve)}
              alt="Precision Recall Curve"
              className="w-full rounded-xl border border-slate-700"
            />
          </div>
        )}
      </div>
    </div>
  );
}