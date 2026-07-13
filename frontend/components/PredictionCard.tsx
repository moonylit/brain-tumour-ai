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
  return (
    <div className="mt-10 rounded-2xl border border-green-700 bg-slate-900 p-8">

      <h2 className="mb-6 text-3xl font-bold">
        Prediction Result
      </h2>

      <div className="mb-8">

        <h3 className="mb-4 text-xl font-semibold">
          Grad-CAM Heatmap
        </h3>

        <img
          src={`http://127.0.0.1:8000/heatmaps/${heatmapFilename}`}
          alt="Grad-CAM Heatmap"
          className="mx-auto max-h-96 rounded-xl border border-slate-700"
        />

      </div>

      <div className="space-y-3">

        <p>
          <strong>Prediction:</strong>{" "}
          {prediction.charAt(0).toUpperCase() + prediction.slice(1)}
        </p>

        <p>
          <strong>Confidence:</strong>{" "}
          {(confidence * 100).toFixed(2)}%
        </p>

        <p>
          <strong>Inference Time:</strong>{" "}
          {processingTime.toFixed(2)} ms
        </p>

      </div>

      <div className="mt-8">

        <h3 className="mb-4 text-xl font-semibold">
          Class Probabilities
        </h3>

        {Object.entries(probabilities).map(
          ([label, value]) => (
            <div
              key={label}
              className="mb-3"
            >
              <div className="mb-1 flex justify-between">
                <span>
                  {label.charAt(0).toUpperCase() + label.slice(1)}
                </span>

                <span>
                  {(value * 100).toFixed(2)}%
                </span>
              </div>

              <div className="h-3 rounded-full bg-slate-700">

                <div
                  className="h-3 rounded-full bg-blue-500"
                  style={{
                    width: `${value * 100}%`,
                  }}
                />

              </div>

            </div>
          ),
        )}

      </div>

    </div>
  );
}