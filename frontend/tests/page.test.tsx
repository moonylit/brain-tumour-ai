import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "../app/page";
import * as api from "../lib/api";

vi.mock("../lib/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../lib/api")>();
  return {
    ...actual,
    checkBackendHealth: vi.fn().mockResolvedValue({ status: "healthy", model_loaded: true }),
    getHistory: vi.fn().mockResolvedValue([]),
    getStatistics: vi.fn().mockResolvedValue({
      total_predictions: 10,
      average_confidence: 0.95,
      average_processing_time_ms: 100,
      class_distribution: { glioma: 4, meningioma: 3, pituitary: 2, notumor: 1 },
      class_percentages: { glioma: 40, meningioma: 30, pituitary: 20, notumor: 10 },
      most_common_prediction: "glioma",
    }),
  };
});

describe("Page Integration (app/page.tsx)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all top-level landing page sections without crashing", async () => {
    render(<Home />);

    // Navbar
    expect(screen.getByText("🧠 BrainTumourAI")).toBeInTheDocument();

    // Hero section
    expect(
      screen.getByText("AI Powered MRI Classification"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: /Brain Tumour/i }),
    ).toBeInTheDocument();

    // Upload section
    expect(screen.getByText("Upload MRI Scan")).toBeInTheDocument();

    // Features section
    expect(
      screen.getByRole("heading", { level: 2, name: "Features" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Fast Prediction")).toBeInTheDocument();
    expect(screen.getByText("Explainable AI")).toBeInTheDocument();

    // Stats section
    expect(
      screen.getByText("Prediction Statistics & Analytics"),
    ).toBeInTheDocument();

    // History section (inside UploadCard)
    expect(screen.getByText("Prediction History")).toBeInTheDocument();

    // Footer
    expect(
      screen.getByText(/Built with Next\.js • FastAPI • TensorFlow • ResNet50/i),
    ).toBeInTheDocument();
    expect(screen.getByText("© 2026 BrainTumourAI")).toBeInTheDocument();
  });
});
