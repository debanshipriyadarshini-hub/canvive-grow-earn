import { cn } from "@/lib/utils";

export function Logo({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        aria-hidden
        className="grid h-9 w-9 place-items-center rounded-xl border border-emerald-200/80 bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-sm"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 4.25V7.5M15 4.25V7.5M7.5 8.5h9a1.5 1.5 0 0 1 1.5 1.5v7.25a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 6 17.25V10a1.5 1.5 0 0 1 1.5-1.5Z" />
          <path d="M12 15.5c2.2-1.2 3.3-2.9 3.2-5.2-.9.1-2 .8-2.7 2.2-.7 1.3-.7 2.1-.5 3Z" fill="currentColor" stroke="none" />
          <path d="M8.3 15.8c1.2-.5 2.3-.8 3.7-.8" />
        </svg>
      </span>
      {!compact && (
        <span className="text-lg font-semibold tracking-[-0.04em] text-foreground">CanVive</span>
      )}
    </span>
  );
}
