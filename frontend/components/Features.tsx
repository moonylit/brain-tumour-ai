export default function Features() {
  const features = [
    {
      title: "Fast Prediction",
      description:
        "Get MRI classification results within seconds using a fine-tuned ResNet50 model.",
      icon: "⚡",
    },
    {
      title: "Explainable AI",
      description:
        "Grad-CAM highlights the regions that influenced the model's prediction.",
      icon: "🧠",
    },
    {
      title: "Confidence Analysis",
      description:
        "View confidence scores and probability distribution for every prediction.",
      icon: "📊",
    },
  ];

  return (
    <section id="features" className="mx-auto max-w-7xl px-8 py-20">
      <h2 className="mb-12 text-center text-4xl font-bold">
        Features
      </h2>

      <div className="grid gap-8 md:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-8 transition hover:border-blue-500"
          >
            <div className="mb-4 text-5xl">
              {feature.icon}
            </div>

            <h3 className="mb-4 text-2xl font-semibold">
              {feature.title}
            </h3>

            <p className="text-slate-400">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}