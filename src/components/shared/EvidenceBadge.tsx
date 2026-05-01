"use client";

import type { EvidenceItem } from "@/types";
import { cn } from "@/lib/utils/cn";

interface EvidenceBadgeProps {
  item: EvidenceItem;
  className?: string;
}

export function EvidenceBadge({ item, className }: EvidenceBadgeProps) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      title={`${item.title}\n\n"${item.snippet}"\n\nAccessed: ${item.accessed_at}`}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-blue-200",
        "bg-blue-50 px-2 py-0.5 text-xs text-blue-700 hover:bg-blue-100",
        "transition-colors",
        className,
      )}
    >
      <span>📎</span>
      <span className="max-w-[160px] truncate">{item.title}</span>
    </a>
  );
}

interface EvidenceListProps {
  items: EvidenceItem[];
  label?: string;
}

export function EvidenceList({ items, label = "Sources" }: EvidenceListProps) {
  if (items.length === 0) return null;

  return (
    <div className="mt-2">
      <p className="mb-1 text-xs font-medium text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <EvidenceBadge key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
