export default function Hero() {
  return (
    <section className="mx-auto flex max-w-7xl flex-col items-center justify-center px-6 pt-20 pb-16 text-center">
      {/* Precision Badge */}
      <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-500/[0.08] px-4 py-1.5 text-xs font-medium tracking-wide text-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.15)]">
        <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
        <span>AI Powered MRI Classification</span>
        <span className="text-sky-500/60">•</span>
        <span className="font-mono text-[11px] text-slate-400">ResNet-50 v2</span>
      </div>

      {/* Main Clinical Heading */}
      <h1 className="mt-8 max-w-4xl text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
        Clinical Neuroimaging &amp;{" "}
        <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-300 to-indigo-300">
          Brain Tumour Diagnostics
        </span>
      </h1>

      {/* Medical Subtitle */}
      <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-400">
        High-resolution automated MRI triage and explainable Grad-CAM spatial
        attention localization across glioma, meningioma, pituitary, and
        non-tumour cranial scans.
      </p>

      {/* Polished Action Buttons */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <a
          href="#upload"
          className="btn-primary inline-flex items-center justify-center gap-2.5 rounded-xl px-7 py-3.5 text-sm font-semibold text-white"
        >
          <svg
            className="h-4 w-4 text-sky-200"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span>Analyze MRI Scan</span>
        </a>

        <a
          href="#evaluation"
          className="btn-secondary inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-medium text-slate-300"
        >
          <svg
            className="h-4 w-4 text-slate-400"
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
          <span>Model Benchmarks</span>
        </a>
      </div>

      {/* Telemetry Micro-Badges */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-400 border-t border-white/[0.06] pt-8">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>98.09% Validation Accuracy</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
          <span>&lt;150ms Neural Latency</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
          <span>Grad-CAM Spatial Heatmap</span>
        </div>
      </div>
    </section>
  );
}