export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-800">

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-8 py-8 text-slate-400 md:flex-row">

        <p>
          © 2026 BrainTumourAI
        </p>

        <p>
          Built with Next.js • FastAPI • TensorFlow • ResNet50
        </p>

      </div>

    </footer>
  );
}