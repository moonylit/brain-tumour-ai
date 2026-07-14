type HistoryItem = {
  timestamp: string;
  filename: string;
  prediction: string;
  confidence: number;
  processing_time_ms: number;
  heatmap_filename: string;
};

type Props = {
  history: HistoryItem[];
};

export default function HistoryCard({
  history,
}: Props) {
  return (
    <div className="mt-10 rounded-2xl border border-purple-700 bg-slate-900 p-8">

      <h2 className="mb-8 text-3xl font-bold">
        Prediction History
      </h2>

      {history.length === 0 ? (
        <p>No predictions yet.</p>
      ) : (
        <div className="space-y-4">

          {history
            .slice()
            .reverse()
            .map((item, index) => (
              <div
                key={index}
                className="rounded-xl bg-slate-800 p-5"
              >

                <p>
                  <strong>File:</strong>{" "}
                  {item.filename}
                </p>

                <p>
                  <strong>Prediction:</strong>{" "}
                  {item.prediction}
                </p>

                <p>
                  <strong>Confidence:</strong>{" "}
                  {(item.confidence * 100).toFixed(2)}%
                </p>

                <p>
                  <strong>Inference Time:</strong>{" "}
                  {item.processing_time_ms.toFixed(2)} ms
                </p>

                <p>
                  <strong>Timestamp:</strong>{" "}
                  {new Date(
                    item.timestamp,
                  ).toLocaleString()}
                </p>

              </div>
            ))}

        </div>
      )}

    </div>
  );
}