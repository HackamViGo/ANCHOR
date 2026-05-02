"use client";

import { useEffect, useState } from "react";
import {
  useWizardStore,
  selectCurrentPhase,
  selectIsLoading,
  selectError,
} from "@/store/wizard.store";
import { SafariPersistBanner } from "./SafariPersistBanner";
import { StepProgress } from "./StepProgress";
import { isStoragePersisted, requestPersistentStorage, saveProject } from "@/lib/db/dexie";
import type { ProjectSpec } from "@/types";

// Phase components (scaffold — filled in per phase)
import { LandingPhase } from "./phases/LandingPhase";
import { DiscoveryPhase } from "./phases/DiscoveryPhase";
import { DocumentationPhase } from "./phases/DocumentationPhase";
import { EvidenceList } from "./EvidenceList";

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

  // ⚓ ANCHOR — Auto-save logic
  const projectId = useWizardStore((state) => state.projectId);
  const projectSpec = useWizardStore((state) => state.projectSpec);
  const artifacts = useWizardStore((state) => state.artifacts);
  const evidenceBundle = useWizardStore((state) => state.evidenceBundle);
  
  useEffect(() => {
    if (projectId && projectSpec.title) {
      const timeout = setTimeout(async () => {
        try {
          await saveProject({
            id: projectId as string,
            spec: projectSpec as ProjectSpec, // Cast to complete spec for DB
            phases: [], // To be populated with granular phase states
            evidence: evidenceBundle,
            artifacts: artifacts,
            updated_at: new Date().toISOString(),
          });
          console.log("⚓ Project auto-saved to Dexie");
        } catch (err) {
          console.error("Failed to auto-save project:", err);
        }
      }, 1000); // Debounce save
      
      return () => clearTimeout(timeout);
    }
  }, [projectId, projectSpec, evidenceBundle, artifacts]);

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
        {currentPhase === "documentation" && <DocumentationPhase />}
        {/* Additional phases added per roadmap */}

        <EvidenceList />
      </main>
    </div>
  );
}


