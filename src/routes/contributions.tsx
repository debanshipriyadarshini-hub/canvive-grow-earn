import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, PageHeader } from "@/components/canvive/AppShell";
import { StatCard } from "@/components/canvive/StatCard";
import { Button } from "@/components/ui/button";
import { formatDate, useCanVive } from "@/lib/canvive/store";
import { Coins, CalendarDays, Recycle } from "lucide-react";

export const Route = createFileRoute("/contributions")({
  head: () => ({
    meta: [
      { title: "My Contributions — CanVive" },
      { name: "description", content: "Every can you've recycled with CanVive, with dates, stations and points." },
      { property: "og:title", content: "My Contributions — CanVive" },
      { property: "og:description", content: "Track every can you've given a second life." },
    ],
  }),
  component: () => (
    <AppShell>
      <Contributions />
    </AppShell>
  ),
});

const FILTERS = ["All", "This Week", "This Month"] as const;

function Contributions() {
  const { state } = useCanVive();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  const rows = useMemo(() => {
    const now = Date.now();
    return state.contributions.filter((c) => {
      const age = (now - new Date(c.date).getTime()) / 86400000;
      if (filter === "This Week") return age <= 7;
      if (filter === "This Month") return age <= 30;
      return true;
    });
  }, [state.contributions, filter]);

  return (
    <>
      <PageHeader title="My Contributions" subtitle="Track every can you've given a second life." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Cans" value={state.cans} icon={<Recycle className="h-5 w-5" />} />
        <StatCard label="Total Points" value={state.points} icon={<Coins className="h-5 w-5" />} tone="coral" />
        <StatCard
          label="This Month"
          value={`${state.cansThisMonth} cans`}
          icon={<CalendarDays className="h-5 w-5" />}
          tone="water"
        />
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Button key={f} size="sm" variant={filter === f ? "default" : "outline"} onClick={() => setFilter(f)}>
            {f}
          </Button>
        ))}
      </div>

      <div className="card-soft mt-4 overflow-hidden">
        <table className="hidden w-full text-left sm:table">
          <caption className="sr-only">Recycling history</caption>
          <thead className="bg-beige text-sm text-muted-foreground">
            <tr>
              <th scope="col" className="px-6 py-3 font-medium">Date</th>
              <th scope="col" className="px-6 py-3 font-medium">Location</th>
              <th scope="col" className="px-6 py-3 font-medium">Cans</th>
              <th scope="col" className="px-6 py-3 font-medium">Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {rows.map((c) => (
              <tr key={c.id} className="transition-colors hover:bg-secondary/60">
                <td className="px-6 py-4">{formatDate(c.date)}</td>
                <td className="px-6 py-4">{c.location}</td>
                <td className="px-6 py-4">{c.cans}</td>
                <td className="px-6 py-4 font-medium">+{c.points}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <ul className="divide-y divide-border sm:hidden">
          {rows.map((c) => (
            <li key={c.id} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm font-medium">{c.location}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(c.date)} · {c.cans} cans
                </p>
              </div>
              <span className="rounded-full bg-sage-soft px-3 py-1 text-sm font-medium">+{c.points}</span>
            </li>
          ))}
        </ul>

        {rows.length === 0 && (
          <p className="px-6 py-10 text-center text-sm text-muted-foreground">
            No contributions in this period yet.
          </p>
        )}
      </div>
    </>
  );
}
