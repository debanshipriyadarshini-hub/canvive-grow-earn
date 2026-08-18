import { cn } from "@/lib/utils";

export function Logo({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        aria-hidden
        className="grid h-9 w-9 place-items-center rounded-2xl bg-sage text-primary-foreground"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d="M8 6h8l-1 13a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2L8 6Z" />
          <path d="M9 3.5h6" />
          <path d="M12 17c2.5-1.2 3.2-3.4 3-6-2.6.2-4 1.8-3 6Z" fill="currentColor" stroke="none" opacity=".5" />
        </svg>
      </span>
      {!compact && (
        <span className="font-display text-xl font-semibold tracking-tight text-foreground">CanVive</span>
      )}
    </span>
  );
}
