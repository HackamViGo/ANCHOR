"use client";

import { useState } from "react";
import { useWizardStore } from "@/store/wizard.store";
import { validateGeminiKey } from "@/lib/utils/sanitize";

export function LandingPhase() {
  const [key, setKey] = useState("");
  const [keyError, setKeyError] = useState<string | null>(null);
  const { setApiKey, setPhase } = useWizardStore();

  function handleStart() {
    const trimmed = key.trim();
    if (!validateGeminiKey(trimmed)) {
      setKeyError(
        'Invalid Gemini API key format. Keys start with "AIza" and are 39 characters long.',
      );
      return;
    }
    setKeyError(null);
    setApiKey(trimmed);
    setPhase("discovery");
  }

  return (
    <div className="flex flex-col items-center gap-8 py-16 text-center">
      {/* Logo & slogan */}
      <div>
        <h1 className="text-5xl font-bold tracking-tight">⚓ ANCHOR</h1>
        <p className="mt-2 text-xl font-medium text-primary">
          AI Needs Clear Human-defined Organization & Rules
        </p>
        <p className="mt-1 text-muted-foreground italic">
          Stop the drift. Give your AI a place to stand.
        </p>
      </div>

      {/* What it does */}
      <div className="max-w-xl text-sm text-muted-foreground">
        <p>
          ANCHOR turns your rough idea into a{" "}
          <strong>complete, agent-executable project blueprint</strong> — docs,
          skills, guardrails, and CI — ready to drop into any new repo.
        </p>
        <p className="mt-2">
          <strong>
            You bring your Gemini key. ANCHOR brings the structure.
          </strong>
        </p>
      </div>

      {/* BYOK input */}
      <div className="w-full max-w-md space-y-3">
        <label
          htmlFor="gemini-key"
          className="block text-left text-sm font-medium"
        >
          Your Gemini API Key
        </label>
        <input
          id="gemini-key"
          type="password"
          value={key}
          onChange={(e) => {
            setKey(e.target.value);
            setKeyError(null);
          }}
          placeholder="AIza..."
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
          autoComplete="off"
          spellCheck={false}
        />
        {keyError && <p className="text-xs text-red-600">{keyError}</p>}

        {/* Privacy notice */}
        <p className="text-xs text-muted-foreground">
          🔒 Your key is held in memory only. It is never stored, never logged,
          and never sent to ANCHOR servers. It clears when you close this tab.{" "}
          <a
            href="kb/SECURITY.md"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Security details
          </a>
        </p>

        <button
          type="button"
          onClick={handleStart}
          disabled={!key.trim()}
          className="w-full rounded-lg bg-primary px-4 py-2.5 font-semibold text-primary-foreground transition-opacity disabled:opacity-40"
        >
          Start Building →
        </button>
      </div>

      {/* Feature highlights */}
      <div className="grid max-w-2xl grid-cols-2 gap-3 text-left text-sm sm:grid-cols-3">
        {[
          { icon: "📄", label: "AGENTS.md", desc: "Canonical AI rules" },
          { icon: "🔒", label: "Evidence-first", desc: "Every claim cited" },
          { icon: "📦", label: "Skills bundle", desc: "Curated + scanned" },
          { icon: "🔐", label: "BYOK only", desc: "Your key, your control" },
          { icon: "🗜️", label: "ZIP export", desc: "Drop into any repo" },
          { icon: "✅", label: "Deterministic", desc: "Same input = same ZIP" },
        ].map((f) => (
          <div key={f.label} className="rounded-lg border border-border p-3">
            <div className="flex items-center gap-1.5">
              <span>{f.icon}</span>
              <strong className="text-xs">{f.label}</strong>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
