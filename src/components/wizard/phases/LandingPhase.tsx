import { useEffect, useState } from "react";
import { useWizardStore } from "@/store/wizard.store";
import { validateGeminiKey } from "@/lib/utils/sanitize";
import { listProjects, deleteProject } from "@/lib/db/dexie";
import type { StoredProject } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export function LandingPhase() {
  const [key, setKey] = useState("");
  const [keyError, setKeyError] = useState<string | null>(null);
  const [recentProjects, setRecentProjects] = useState<StoredProject[]>([]);
  
  const { setApiKey, setPhase, restoreProject } = useWizardStore();

  useEffect(() => {
    async function loadRecent() {
      const projects = await listProjects();
      setRecentProjects(projects);
    }
    loadRecent();
  }, []);

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

  async function handleResume(project: StoredProject) {
    const trimmed = key.trim();
    if (!validateGeminiKey(trimmed)) {
      setKeyError("Please enter your Gemini API key first to resume this project.");
      return;
    }
    setApiKey(trimmed);
    restoreProject(project);
  }

  async function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this draft?")) {
      await deleteProject(id);
      setRecentProjects((prev) => prev.filter((p) => p.id !== id));
    }
  }

  return (
    <div className="flex flex-col items-center gap-8 py-16 text-center">
      {/* Logo & slogan */}
      <div className="animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-5xl font-bold tracking-tight">⚓ ANCHOR</h1>
        <p className="mt-2 text-xl font-medium text-primary">
          AI Needs Clear Human-defined Organization & Rules
        </p>
        <p className="mt-1 text-muted-foreground italic">
          Stop the drift. Give your AI a place to stand.
        </p>
      </div>

      <div className="grid w-full max-w-5xl gap-12 lg:grid-cols-2">
        {/* Left Side: New Project */}
        <Card className="bg-card/50">
          <CardHeader className="text-left px-8 pt-8">
            <CardTitle className="text-xl">New Project</CardTitle>
            <CardDescription>
              Bring your idea and your Gemini key. We'll build the rest.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-left px-8 pb-8">
            <div className="space-y-2">
              <label htmlFor="gemini-key" className="text-sm font-medium">
                Your Gemini API Key
              </label>
              <Input
                id="gemini-key"
                type="password"
                value={key}
                onChange={(e) => {
                  setKey(e.target.value);
                  setKeyError(null);
                }}
                placeholder="AIza..."
                className="font-mono"
                autoComplete="off"
              />
              {keyError && <p className="text-xs text-destructive">{keyError}</p>}
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              🔒 Your key is held in memory only. It is never stored, never logged,
              and never sent to servers.{" "}
              <a href="/kb/SECURITY.md" className="underline hover:text-primary transition-colors">
                Security Policy
              </a>
            </p>

            <Button
              type="button"
              onClick={handleStart}
              disabled={!key.trim()}
              className="w-full h-12"
            >
              Start Building →
            </Button>
          </CardContent>
        </Card>

        {/* Right Side: Recent Drafts */}
        <Card className="bg-card/50">
          <CardHeader className="text-left px-8 pt-8">
            <CardTitle className="text-xl">Recent Drafts</CardTitle>
            <CardDescription>
              Continue where you left off.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 px-8 pb-8">
            {recentProjects.length > 0 ? (
              recentProjects.slice(0, 4).map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleResume(p)}
                  className="group flex items-center justify-between border border-border bg-background/50 p-4 text-left transition-all hover:border-primary/50 hover:bg-background"
                >
                  <div className="overflow-hidden">
                    <h3 className="truncate font-medium text-sm">
                      {p.spec.title || "Untitled Project"}
                    </h3>
                    <p className="text-[10px] text-muted-foreground">
                      Updated {new Date(p.updated_at).toLocaleDateString()} at {new Date(p.updated_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="text-xs font-medium text-primary">Resume</span>
                    <span
                      role="button"
                      onClick={(e) => handleDelete(p.id, e)}
                      className="p-1.5 hover:bg-destructive/10 hover:text-destructive"
                      title="Delete draft"
                    >
                      🗑️
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className="flex h-32 flex-col items-center justify-center border border-dashed border-border text-muted-foreground">
                <p className="text-xs italic">No recent drafts found.</p>
              </div>
            )}
            
            {recentProjects.length > 4 && (
              <p className="text-[10px] text-center text-muted-foreground italic">
                Showing latest 4 of {recentProjects.length} drafts
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Feature highlights */}
      <div className="grid max-w-4xl grid-cols-2 gap-4 text-left sm:grid-cols-3 lg:grid-cols-6">
        {[
          { icon: "📄", label: "AGENTS.md", desc: "AI Rules" },
          { icon: "🔒", label: "Evidence", desc: "Citations" },
          { icon: "📦", label: "Skills", desc: "Bundled" },
          { icon: "🔐", label: "BYOK", desc: "Private" },
          { icon: "🗜️", label: "ZIP", desc: "Portable" },
          { icon: "✅", label: "Deterministic", desc: "Stable" },
        ].map((f) => (
          <div key={f.label} className="flex flex-col items-center border border-border p-3 text-center transition-colors hover:bg-card">
            <span className="text-xl mb-1">{f.icon}</span>
            <strong className="text-[10px] font-bold block">{f.label}</strong>
            <p className="text-[10px] text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
