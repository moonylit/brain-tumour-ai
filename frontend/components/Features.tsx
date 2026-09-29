export default function Features() {
  const features = [
    {
      title: "Fast Prediction",
      description:
        "Get MRI classification results within seconds using a fine-tuned ResNet50 model.",
      icon: (
        <svg
          className="h-8 w-8 text-blue-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
    },
    {
      title: "Explainable AI",
      description:
        "Grad-CAM highlights the regions that influenced the model's prediction.",
      icon: (
        <svg
          className="h-8 w-8 text-emerald-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
    },
    {
      title: "Confidence Analysis",
      description:
        "View confidence scores and probability distribution for every prediction.",
      icon: (
        <svg
          className="h-8 w-8 text-purple-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
    },
  ];

  return (
    <section id="features" className="mx-auto max-w-7xl px-8 py-20">
      <div className="mb-12 text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
          Platform Architecture
        </span>
        <h2 className="mt-2 text-4xl font-bold tracking-tight text-white">
          Features & Capabilities
        </h2>
        <p className="mt-3 text-sm text-slate-400 max-w-xl mx-auto">
          Built for clinical transparency, rapid neural inference, and reproducible decision support.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 transition hover:border-slate-700 hover:bg-slate-900"
          >
            <div className="mb-5 inline-flex p-3 rounded-xl border border-slate-800 bg-slate-950/60">
              {feature.icon}
            </div>

            <h3 className="mb-3 text-xl font-bold text-white">
              {feature.title}
            </h3>

            <p className="text-sm leading-relaxed text-slate-400">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}