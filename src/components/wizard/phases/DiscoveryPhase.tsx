"use client";

import { useState } from "react";
import { useWizardStore, selectApiKey } from "@/store/wizard.store";
import { OptionCard } from "../OptionCard";
import { orchestrate } from "@/lib/agents/orchestrator";
import type { ProjectTemplate, TeamSize } from "@/types";

const TEMPLATES: Array<{
  id: ProjectTemplate;
  label: string;
  icon: string;
  desc: string;
}> = [
  {
    id: "web-app",
    label: "Web App",
    icon: "🌐",
    desc: "SaaS, dashboard, consumer app",
  },
  {
    id: "mobile",
    label: "Mobile",
    icon: "📱",
    desc: "iOS, Android, React Native",
  },
  {
    id: "api",
    label: "API / Backend",
    icon: "⚙️",
    desc: "REST, GraphQL, microservice",
  },
  {
    id: "ml",
    label: "ML / AI",
    icon: "🤖",
    desc: "Model training, inference, pipelines",
  },
  {
    id: "e-commerce",
    label: "E-Commerce",
    icon: "🛒",
    desc: "Store, payments, catalog",
  },
  {
    id: "custom",
    label: "Custom",
    icon: "✏️",
    desc: "Something else entirely",
  },
];

const TEAM_SIZES: Array<{ id: TeamSize; label: string; icon: string }> = [
  { id: "solo", label: "Solo developer", icon: "👤" },
  { id: "small", label: "Small team (2–5)", icon: "👥" },
  { id: "mid", label: "Mid-size (5–20)", icon: "🏢" },
  { id: "enterprise", label: "Enterprise (20+)", icon: "🏦" },
];

export function DiscoveryPhase() {
  const apiKey = useWizardStore(selectApiKey);
  const {
    setProjectSpec,
    setPhaseStatus,
    goNextPhase,
    addEvidenceItems,
    isLoading,
    setLoading,
    setError,
    error,
  } = useWizardStore();

  const [goal, setGoal] = useState("");
  const [template, setTemplate] = useState<ProjectTemplate | null>(null);
  const [teamSize, setTeamSize] = useState<TeamSize | null>(null);

  async function handleNext() {
    if (!apiKey || !goal.trim() || !template || !teamSize) return;

    setLoading(true);
    setPhaseStatus("discovery", "loading");

    try {
      const partialSpec = {
        goal: goal.trim(),
        project_template: template,
        team_size: teamSize,
      };

      setProjectSpec(partialSpec);

      const output = await orchestrate(apiKey, "discovery", partialSpec);

      if (output.evidence.length > 0) {
        addEvidenceItems(output.evidence);
      }

      setPhaseStatus("discovery", "complete");
      goNextPhase();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Discovery failed";
      setError(message);
      setPhaseStatus("discovery", "error");
    } finally {
      setLoading(false);
    }
  }

  const canProceed = !!goal.trim() && !!template && !!teamSize && !isLoading;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">📋 Discovery</h2>
        <p className="mt-1 text-muted-foreground">
          Tell us about your project. Keep it simple — 1–3 sentences.
        </p>
      </div>

      {/* Goal */}
      <div className="space-y-2">
        <label htmlFor="goal" className="text-sm font-medium">
          What are you building?
        </label>
        <textarea
          id="goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="e.g. A SaaS app that helps freelancers track their invoices and get paid faster."
          rows={3}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Template */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Project type</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {TEMPLATES.map((t) => (
            <OptionCard
              key={t.id}
              icon={t.icon}
              label={t.label}
              description={t.desc}
              selected={template === t.id}
              onClick={() => setTemplate(t.id)}
            />
          ))}
        </div>
      </div>

      {/* Team size */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Team size</p>
        <div className="grid grid-cols-2 gap-2">
          {TEAM_SIZES.map((t) => (
            <OptionCard
              key={t.id}
              icon={t.icon}
              label={t.label}
              selected={teamSize === t.id}
              onClick={() => setTeamSize(t.id)}
            />
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Navigation */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleNext}
          disabled={!canProceed}
          className="rounded-lg bg-primary px-6 py-2.5 font-semibold text-primary-foreground disabled:opacity-40"
        >
          {isLoading ? "Thinking..." : "Next: Architecture →"}
        </button>
      </div>
    </div>
  );
}
