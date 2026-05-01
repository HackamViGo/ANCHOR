"use client";

import { cn } from "@/lib/utils/cn";

interface OptionCardProps {
  label: string;
  description?: string;
  icon?: string;
  selected?: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function OptionCard({
  label,
  description,
  icon,
  selected = false,
  onClick,
  disabled = false,
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex w-full flex-col gap-1 rounded-xl border p-4 text-left transition-all",
        "hover:border-primary/60 hover:bg-primary/5",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        selected
          ? "border-primary bg-primary/10 shadow-sm"
          : "border-border bg-background",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      <div className="flex items-center gap-2">
        {icon && <span className="text-xl">{icon}</span>}
        <span className="font-semibold text-foreground">{label}</span>
        {selected && <span className="ml-auto text-primary text-sm">✓</span>}
      </div>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </button>
  );
}
