"use client";

import { useEffect } from "react";
import {
  useWizardStore,
  selectCurrentPhase,
  selectIsLoading,
  selectError,
} from "@/store/wizard.store";
import { SafariPersistBanner } from "./SafariPersistBanner";
import { StepProgress } from "./StepProgress";
import { isStoragePersisted, requestPersistentStorage } from "@/lib/db/dexie";

// Phase components (scaffold — filled in per phase)
import { LandingPhase } from "./phases/LandingPhase";
import { DiscoveryPhase } from "./phases/DiscoveryPhase";

const PHASES = [
  "landing",
  "discovery",
  "architecture",
  "documentation",
  "skills",
  "automation",
  "validation",
  "export",
] as const;

export function WizardShell() {
  const currentPhase = useWizardStore(selectCurrentPhase);
  const isLoading = useWizardStore(selectIsLoading);
  const error = useWizardStore(selectError);

  const [storagePersisted, setStoragePersisted] = useState<boolean | null>(
    null,
  );

  useEffect(() => {
    async function initStorage() {
      const persisted = await isStoragePersisted();
      if (!persisted) {
        const result = await requestPersistentStorage();
        setStoragePersisted(result);
      } else {
        setStoragePersisted(true);
      }
    }
    initStorage();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Safari IndexedDB eviction warning */}
      {storagePersisted === false && <SafariPersistBanner />}

      {/* Step progress (hidden on landing) */}
      {currentPhase !== "landing" && (
        <StepProgress phases={PHASES} current={currentPhase} />
      )}

      {/* Error boundary wrapper per phase */}
      <main className="mx-auto max-w-4xl px-4 py-8">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}

        {isLoading && (
          <div className="mb-4 text-center text-sm text-muted-foreground">
            Agent is thinking...
          </div>
        )}

        {/* Phase routing */}
        {currentPhase === "landing" && <LandingPhase />}
        {currentPhase === "discovery" && <DiscoveryPhase />}
        {/* Additional phases added per roadmap */}
      </main>
    </div>
  );
}

// Missing import — add at top
import { useState } from "react";
