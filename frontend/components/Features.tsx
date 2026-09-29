export default function Features() {
  const features = [
    {
      tag: "Sub-Second Latency",
      title: "Fast Prediction",
      description:
        "Deterministic inference delivering classification results within milliseconds using a GPU/CPU optimized ResNet50 neural architecture.",
      icon: (
        <svg
          className="h-6 w-6 text-sky-400"
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
      glow: "border-sky-500/20 bg-sky-500/10 text-sky-400",
    },
    {
      tag: "Spatial Localization",
      title: "Explainable AI",
      description:
        "Gradient-weighted Class Activation Mapping (Grad-CAM) highlights exact anatomical regions and focal lesions that drive neural predictions.",
      icon: (
        <svg
          className="h-6 w-6 text-emerald-400"
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
      glow: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    },
    {
      tag: "Statistical Telemetry",
      title: "Confidence Analysis",
      description:
        "Comprehensive softmax probability distribution and confidence score metrics for complete diagnostic transparency and clinical verification.",
      icon: (
        <svg
          className="h-6 w-6 text-purple-400"
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
      glow: "border-purple-500/20 bg-purple-500/10 text-purple-400",
    },
  ];

  return (
    <section id="features" className="mx-auto max-w-7xl px-6 sm:px-8 py-20">
      <div className="mb-14 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1 text-xs font-mono text-sky-400">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
          <span>Diagnostic Capabilities</span>
        </div>
        <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Features &amp; Capabilities
        </h2>
        <p className="mt-3 text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          Engineered for clinical reproducibility, sub-second neural inference, and transparent neuroimaging decision support.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="glass-card-interactive rounded-3xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div
                className={`inline-flex p-3 rounded-2xl border ${feature.glow} shadow-lg`}
              >
                {feature.icon}
              </div>
              <span className="font-mono text-[11px] text-slate-400 uppercase tracking-wider">
                {feature.tag}
              </span>
            </div>

            <h3 className="mb-2 text-xl font-bold text-white tracking-tight">
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