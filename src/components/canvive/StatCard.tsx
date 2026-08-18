import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon,
  tone = "sage",
  hint,
}: {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  tone?: "sage" | "coral" | "water" | "beige";
  hint?: string;
}) {
  const tones = {
    sage: "bg-sage-soft",
    coral: "bg-coral-soft",
    water: "bg-water",
    beige: "bg-beige",
  } as const;

  return (
    <div className="card-soft p-5 transition-transform duration-300 hover:-translate-y-0.5">
      <div className="flex items-center gap-3">
        {icon && (
          <span className={cn("grid h-10 w-10 place-items-center rounded-2xl text-foreground", tones[tone])} aria-hidden>
            {icon}
          </span>
        )}
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
      </div>
      <p className="mt-4 font-display text-3xl font-semibold">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function Meter({ value, max, tone = "sage" }: { value: number; max: number; tone?: "sage" | "coral" | "water" }) {
  const pct = Math.min(100, Math.round((value / Math.max(max, 1)) * 100));
  const tones = { sage: "bg-sage", coral: "bg-coral", water: "bg-water" } as const;
  return (
    <div
      className="h-2.5 w-full overflow-hidden rounded-full bg-beige"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div className={cn("h-full rounded-full transition-all duration-700", tones[tone])} style={{ width: `${pct}%` }} />
    </div>
  );
}
