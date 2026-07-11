export default function Hero() {
  return (
    <section className="mx-auto flex max-w-7xl flex-col items-center justify-center px-6 py-24">

      <span className="rounded-full border border-blue-500/40 bg-blue-500/10 px-5 py-2 text-sm text-blue-300">
        AI Powered MRI Classification
      </span>

      <h1 className="mt-8 text-center text-7xl font-black tracking-tight">
        Brain Tumour
        <br />
        MRI Classifier
      </h1>

      <p className="mt-8 max-w-3xl text-center text-xl leading-9 text-slate-400">
        Upload MRI scans and receive instant predictions using
        a fine-tuned ResNet50 model with Explainable AI,
        confidence scores and probability analysis.
      </p>

      <div className="mt-14 flex gap-5">

        <button className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold transition hover:bg-blue-500">
          Upload MRI
        </button>

        <button className="rounded-xl border border-slate-700 px-8 py-4 text-lg font-semibold transition hover:bg-slate-900">
          Learn More
        </button>

      </div>

    </section>
  );
}