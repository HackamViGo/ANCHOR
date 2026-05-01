/**
 * ⚓ ANCHOR — Documentation Phase Component
 * Generates and displays the project documentation pack.
 */

import { useWizardStore, selectApiKey, selectProjectSpec } from "@/store/wizard.store";
import { orchestrate } from "@/lib/agents/orchestrator";
import { FileText, Loader2, CheckCircle2 } from "lucide-react";

export function DocumentationPhase() {
  const apiKey = useWizardStore(selectApiKey);
  const spec = useWizardStore(selectProjectSpec);
  const { addArtifacts, goNextPhase, isLoading, setLoading, setError, error } = useWizardStore();
  const artifacts = useWizardStore((state) => state.artifacts);

  async function handleGenerate() {
    if (!apiKey || !spec) return;

    setLoading(true);
    try {
      const output = await orchestrate(apiKey, "docs", spec);
      if (output.artifacts.length > 0) {
        addArtifacts(output.artifacts);
      }
      if (output.errors.length > 0) {
        setError(output.errors[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  const hasDocs = artifacts.some((a) => a.path.startsWith("docs/") || a.path === "README.md");

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Documentation Generator
        </h2>
        <p className="mt-1 text-muted-foreground">
          Generate the canonical documentation pack for your project.
        </p>
      </div>

      {!hasDocs ? (
        <div className="rounded-xl border-2 border-dashed border-border p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
          <h3 className="mt-4 font-semibold">No documentation generated yet</h3>
          <p className="text-sm text-muted-foreground">
            ANCHOR will generate AGENTS.md, ROADMAP.md, SECURITY.md, and more based on your project vision.
          </p>
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating Pack...
              </>
            ) : (
              "Generate Documentation Pack"
            )}
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {artifacts
            .filter((a) => a.path.endsWith(".md"))
            .map((artifact) => (
              <div
                key={artifact.path}
                className="group relative rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/30"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm font-mono font-bold">{artifact.path}</span>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </div>
                <div className="mt-2 text-[10px] text-muted-foreground line-clamp-3 font-mono bg-background/50 p-2 rounded">
                  {artifact.content.slice(0, 150)}...
                </div>
              </div>
            ))}
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end pt-8">
        <button
          onClick={goNextPhase}
          disabled={!hasDocs || isLoading}
          className="rounded-lg bg-primary px-6 py-2.5 font-semibold text-primary-foreground disabled:opacity-40"
        >
          Next: Architecture →
        </button>
      </div>
    </div>
  );
}
