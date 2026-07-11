export default function Stats() {
  const stats = [
    {
      value: "98%",
      label: "Validation Accuracy",
    },
    {
      value: "4",
      label: "Tumour Classes",
    },
    {
      value: "~1.3s",
      label: "Average Inference",
    },
    {
      value: "ResNet50",
      label: "Transfer Learning",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-8 py-20">

      <div className="grid gap-8 md:grid-cols-4">

        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center"
          >
            <h3 className="text-4xl font-bold text-blue-400">
              {stat.value}
            </h3>

            <p className="mt-3 text-slate-400">
              {stat.label}
            </p>
          </div>
        ))}

      </div>

    </section>
  );
}