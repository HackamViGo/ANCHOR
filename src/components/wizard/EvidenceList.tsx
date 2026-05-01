/**
 * ⚓ ANCHOR — Evidence List Component
 * Displays discovered EvidenceItems with links and snippets.
 */

import { useWizardStore, selectEvidenceBundle } from "@/store/wizard.store";
import { ExternalLink, ShieldCheck } from "lucide-react";

export function EvidenceList() {
  const bundle = useWizardStore(selectEvidenceBundle);
  const evidence = bundle.items;

  if (evidence.length === 0) return null;

  return (
    <div className="mt-8 space-y-4 rounded-xl border border-border bg-card/50 p-6 backdrop-blur-sm">
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <ShieldCheck className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Evidence Log</h3>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
          {evidence.length} CITATIONS
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {evidence.map((item, index) => (
          <a
            key={`${item.url}-${index}`}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-lg border border-border bg-background/50 p-3 transition-all hover:border-primary/50 hover:bg-background"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="truncate text-xs font-bold text-primary group-hover:underline">
                {item.title}
              </span>
              <ExternalLink className="h-3 w-3 shrink-0 opacity-40 group-hover:opacity-100" />
            </div>
            <p className="mt-1 line-clamp-2 text-[10px] text-muted-foreground">
              {item.snippet}
            </p>
            <div className="mt-2 flex items-center gap-1 text-[9px] text-muted-foreground/60 uppercase tracking-wider">
              <span>Accessed:</span>
              <span>{new Date(item.accessed_at).toLocaleDateString()}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
