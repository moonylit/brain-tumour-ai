export default function Navbar() {
  return (
    <nav className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">

      <h1 className="text-2xl font-bold">
        🧠 BrainTumourAI
      </h1>

      <div className="flex gap-8 text-slate-300">

        <a
          href="#"
          className="transition hover:text-white"
        >
          Home
        </a>

        <a
          href="#"
          className="transition hover:text-white"
        >
          About
        </a>

        <a
          href="#"
          className="transition hover:text-white"
        >
          API
        </a>

      </div>

    </nav>
  );
}