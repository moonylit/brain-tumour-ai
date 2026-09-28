import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import EvaluationCard from "../components/EvaluationCard";
import { EvaluationMetrics, EvaluationPlots, API_BASE_URL } from "../lib/api";

describe("EvaluationCard Component", () => {
  const mockMetrics: EvaluationMetrics = {
    accuracy: 0.9654,
    precision: 0.9662,
    recall: 0.9650,
    f1_score: 0.9655,
  };

  const mockPlots: EvaluationPlots = {
    confusion_matrix: "/static/confusion_matrix.png",
    roc_curve: "/static/roc_curve.png",
    precision_recall_curve: "/static/pr_curve.png",
  };

  it("renders heading and all 4 model performance metrics", () => {
    render(<EvaluationCard metrics={mockMetrics} plots={mockPlots} />);

    expect(screen.getByText("Model Evaluation")).toBeInTheDocument();
    expect(screen.getByText("Accuracy")).toBeInTheDocument();
    expect(screen.getByText("96.54%")).toBeInTheDocument();

    expect(screen.getByText("Precision")).toBeInTheDocument();
    expect(screen.getByText("96.62%")).toBeInTheDocument();

    expect(screen.getByText("Recall")).toBeInTheDocument();
    expect(screen.getByText("96.50%")).toBeInTheDocument();

    expect(screen.getByText("F1 Score")).toBeInTheDocument();
    expect(screen.getByText("96.55%")).toBeInTheDocument();
  });

  it("renders all three evaluation plot images with appropriate static paths", () => {
    render(<EvaluationCard metrics={mockMetrics} plots={mockPlots} />);

    expect(screen.getByText("Confusion Matrix")).toBeInTheDocument();
    const cmImg = screen.getByAltText("Confusion Matrix") as HTMLImageElement;
    expect(cmImg.src).toBe(`${API_BASE_URL}/static/confusion_matrix.png`);

    expect(screen.getByText("ROC Curve")).toBeInTheDocument();
    const rocImg = screen.getByAltText("ROC Curve") as HTMLImageElement;
    expect(rocImg.src).toBe(`${API_BASE_URL}/static/roc_curve.png`);

    expect(screen.getByText("Precision-Recall Curve")).toBeInTheDocument();
    const prImg = screen.getByAltText("Precision Recall Curve") as HTMLImageElement;
    expect(prImg.src).toBe(`${API_BASE_URL}/static/pr_curve.png`);
  });

  it("omits plot sections when plot paths are empty", () => {
    const emptyPlots: EvaluationPlots = {
      confusion_matrix: "",
      roc_curve: "",
      precision_recall_curve: "",
    };

    render(<EvaluationCard metrics={mockMetrics} plots={emptyPlots} />);

    expect(screen.queryByText("Confusion Matrix")).not.toBeInTheDocument();
    expect(screen.queryByText("ROC Curve")).not.toBeInTheDocument();
    expect(screen.queryByText("Precision-Recall Curve")).not.toBeInTheDocument();
  });
});
