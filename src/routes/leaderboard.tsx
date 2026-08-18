import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, PageHeader } from "@/components/canvive/AppShell";
import { Meter } from "@/components/canvive/StatCard";
import { Button } from "@/components/ui/button";
import { CLASS_BOARD, COLLEGE_BOARD, LEADERBOARD_OTHERS } from "@/lib/canvive/data";
import { useCanVive } from "@/lib/canvive/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Campus Leaderboard — CanVive" },
      { name: "description", content: "See how you and your department rank in the CanVive campus recycling league." },
      { property: "og:title", content: "Campus Leaderboard — CanVive" },
      { property: "og:description", content: "Individual, class and college recycling rankings." },
    ],
  }),
  component: () => (
    <AppShell>
      <LeaderboardPage />
    </AppShell>
  ),
});

const TABS = ["Individual", "Class", "College"] as const;

function LeaderboardPage() {
  const { state, rank } = useCanVive();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Individual");

  const rows = useMemo(() => {
    const all = [
      ...LEADERBOARD_OTHERS.map((p) => ({ ...p, me: false })),
      { name: state.user.name.split(" ")[0] ?? "You", cans: state.cans, me: true },
    ].sort((a, b) => b.cans - a.cans);
    return all.map((r, i) => ({ ...r, rank: i + 1 }));
  }, [state.cans, state.user.name]);

  const group = tab === "Class" ? CLASS_BOARD : COLLEGE_BOARD;
  const maxGroup = Math.max(...group.map((g) => g.cans));

  return (
    <>
      <PageHeader
        title="Campus Leaderboard"
        subtitle="Friendly competition that keeps the cans moving."
        action={<div className="rounded-full bg-sage-soft px-5 py-2.5 text-sm font-medium">Your current rank: #{rank}</div>}
      />

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <Button key={t} size="sm" variant={tab === t ? "default" : "outline"} onClick={() => setTab(t)}>
            {t}
          </Button>
        ))}
      </div>

      {tab === "Individual" ? (
        <div className="card-soft mt-4 overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <caption className="sr-only">Individual leaderboard</caption>
            <thead className="bg-beige text-muted-foreground">
              <tr>
                <th scope="col" className="px-6 py-3 font-medium">Rank</th>
                <th scope="col" className="px-6 py-3 font-medium">Name</th>
                <th scope="col" className="px-6 py-3 font-medium">Cans</th>
                <th scope="col" className="px-6 py-3 font-medium">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r) => (
                <tr key={`${r.name}-${r.rank}`} className={cn(r.me && "bg-sage-soft font-medium")}>
                  <td className="px-6 py-3.5">#{r.rank}</td>
                  <td className="px-6 py-3.5">
                    {r.name} {r.me && <span className="ml-2 text-xs text-muted-foreground">(you)</span>}
                  </td>
                  <td className="px-6 py-3.5">{r.cans}</td>
                  <td className="px-6 py-3.5">{r.cans * 10}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-4 grid gap-4">
          {group.map((g) => (
            <div key={g.name} className="card-soft p-6">
              <div className="flex items-center justify-between">
                <p className="font-medium">{g.name}</p>
                <p className="text-sm text-muted-foreground">{g.cans.toLocaleString()} cans</p>
              </div>
              <div className="mt-3">
                <Meter value={g.cans} max={maxGroup} tone={tab === "Class" ? "sage" : "coral"} />
              </div>
            </div>
          ))}
          <p className="text-xs text-muted-foreground">Group totals are prototype/demo statistics.</p>
        </div>
      )}
    </>
  );
}
