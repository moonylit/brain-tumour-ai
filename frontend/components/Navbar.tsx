"use client";

import { useEffect, useState } from "react";
import { checkBackendHealth } from "@/lib/api";

export default function Navbar() {
  const [isBackendOnline, setIsBackendOnline] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function checkHealth() {
      try {
        const res = await checkBackendHealth();
        if (isMounted) {
          setIsBackendOnline(res?.status === "healthy");
        }
      } catch {
        if (isMounted) {
          setIsBackendOnline(false);
        }
      }
    }

    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <nav className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
      <div className="flex items-center gap-3">
        <a
          href="#"
          className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-white hover:text-slate-200 transition"
        >
          <svg
            className="h-6 w-6 text-blue-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z" />
            <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z" />
          </svg>
          <span>BrainTumourAI</span>
        </a>

        {/* Minimal Backend Status Pill */}
        {isBackendOnline !== null && (
          <span
            className={`hidden items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium sm:inline-flex ${
              isBackendOnline
                ? "border border-emerald-800/80 bg-emerald-950/40 text-emerald-400"
                : "border border-slate-800 bg-slate-900 text-slate-400"
            }`}
            title={
              isBackendOnline
                ? "Backend connected and healthy"
                : "Backend is currently unreachable"
            }
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isBackendOnline ? "bg-emerald-400" : "bg-slate-500"
              }`}
            />
            {isBackendOnline ? "API Online" : "API Offline"}
          </span>
        )}
      </div>

      <div className="flex items-center gap-6 text-sm text-slate-300">
        <a href="#upload" className="transition hover:text-white">
          Upload
        </a>
        <a href="#evaluation" className="transition hover:text-white">
          Evaluation
        </a>
        <a href="#stats" className="transition hover:text-white">
          Statistics
        </a>
        <a href="#history" className="transition hover:text-white">
          History
        </a>
        <a href="#features" className="transition hover:text-white">
          Features
        </a>
      </div>
    </nav>
  );
}