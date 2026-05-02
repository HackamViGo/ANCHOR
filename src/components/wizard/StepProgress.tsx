"use client";

import type { WizardPhase } from "@/types";
import { useWizardStore } from "@/store/wizard.store";
import { cn } from "@/lib/utils/cn";

interface StepProgressProps {
  phases: readonly WizardPhase[];
  current: WizardPhase;
}

const PHASE_LABELS: Record<WizardPhase, string> = {
  landing: "Start",
  discovery: "Discovery",
  architecture: "Architecture",
  documentation: "Documentation",
  skills: "Skills",
  automation: "Automation",
  validation: "Validation",
  export: "Export",
};

export function StepProgress({ phases, current }: StepProgressProps) {
  const phaseStatuses = useWizardStore((s) => s.phaseStatuses);
  const currentIndex = phases.indexOf(current);

  return (
    <nav className="border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto max-w-4xl px-4 py-3">
        <ol className="flex items-center gap-2 overflow-x-auto">
          {phases
            .filter((p) => p !== "landing")
            .map((phase, idx) => {
              const stepNumber = idx + 1;
              const status = phaseStatuses[phase];
              const isActive = phase === current;
              const isComplete = status === "complete";
              const isPast = phases.indexOf(phase) < phases.indexOf(current);

              return (
                <li key={phase} className="flex items-center gap-2">
                  {idx > 0 && (
                    <div
                      className={cn(
                        "h-px w-6 flex-shrink-0",
                        isPast || isComplete ? "bg-primary" : "bg-border",
                      )}
                    />
                  )}
                  <div
                    className={cn(
                      "flex items-center gap-1.5 whitespace-nowrap border border-border px-3 py-1 text-sm font-medium transition-colors",
                      isActive && "bg-primary text-primary-foreground",
                      isComplete && !isActive && "bg-primary/20 text-primary",
                      !isActive && !isComplete && "text-muted-foreground",
                    )}
                  >
                    <span className="text-xs">
                      {isComplete ? "✓" : stepNumber}
                    </span>
                    <span>{PHASE_LABELS[phase]}</span>
                  </div>
                </li>
              );
            })}
        </ol>
        <p className="mt-1 text-xs text-muted-foreground">
          Phase {currentIndex} of {phases.length - 1}
        </p>
      </div>
    </nav>
  );
}
