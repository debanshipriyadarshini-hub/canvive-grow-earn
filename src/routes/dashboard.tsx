import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Coins, Gift, Receipt, Recycle, Sprout, Trophy } from "lucide-react";
import { AppShell } from "@/components/canvive/AppShell";
import { StatCard, Meter } from "@/components/canvive/StatCard";
import { PlantArt } from "@/components/canvive/PlantArt";
import { Button } from "@/components/ui/button";
import { useCanVive, formatDate } from "@/lib/canvive/store";
import { COMMUNITY_STATS, GROWTH_GOAL, REWARDS, plantMeta, stageIndex } from "@/lib/canvive/data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — CanVive" },
      { name: "description", content: "Your CanVive dashboard: cans recycled, points earned, garden growth and rank." },
      { property: "og:title", content: "Dashboard — CanVive" },
      { property: "og:description", content: "Track your recycling impact and grow your digital garden." },
    ],
  }),
  component: () => (
    <AppShell>
      <Dashboard />
    </AppShell>
  ),
});

function Dashboard() {
  const { state, recycleCan, rank, level, claimChallenge } = useCanVive();
  const [pulse, setPulse] = useState(0);

  const active = state.garden.find((p) => p.id === state.activePlant);
  const nextReward = REWARDS.find((r) => r.cost > state.points) ?? REWARDS[REWARDS.length - 1]!;
  const toNext = Math.max(0, nextReward.cost - state.points);
  const challengesDone = state.claimedChallenges.length;

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl">Good morning, {state.user.name.split(" ")[0]}! 👋</h1>
          <p className="mt-2 text-muted-foreground">Ready to make your next can count?</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-sage-soft px-4 py-2 text-sm font-medium">Level: {level}</span>
          <Button
            variant="accent"
            size="lg"
            onClick={() => {
              recycleCan();
              setPulse((p) => p + 1);
            }}
          >
            <Recycle className="h-4 w-4" /> Demo: Recycle a Can
          </Button>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Cans Recycled" value={state.cans} icon={<Recycle className="h-5 w-5" />} />
        <StatCard label="Points" value={state.points} icon={<Coins className="h-5 w-5" />} tone="coral" />
        <StatCard label="Plants" value={state.garden.length} icon={<Sprout className="h-5 w-5" />} tone="water" />
        <StatCard label="Campus Rank" value={`#${rank}`} icon={<Trophy className="h-5 w-5" />} tone="beige" />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="card-soft p-6 lg:col-span-2">
          <h2 className="text-xl">Your Progress</h2>
          <p className="mt-1 text-sm text-muted-foreground">Next reward: {nextReward.name}</p>
          <p className="mt-6 font-display text-2xl">
            {state.points} / {nextReward.cost} points
          </p>
          <div className="mt-3">
            <Meter value={state.points} max={nextReward.cost} tone="coral" />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {toNext > 0 ? `${toNext} more points to unlock your next reward.` : "You can redeem this reward now."}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <QuickAction to="/garden" label="Recycle a Can" hint="Log a can at a station" icon={<Recycle className="h-4 w-4" />} onClick={() => { recycleCan(); setPulse((p) => p + 1); }} />
            <QuickAction to="/contributions" label="View Contributions" hint="See your history" icon={<Receipt className="h-4 w-4" />} />
            <QuickAction to="/garden" label="My Garden" hint="Grow your plant" icon={<Sprout className="h-4 w-4" />} />
            <QuickAction to="/rewards" label="Redeem Rewards" hint="Spend your points" icon={<Gift className="h-4 w-4" />} />
          </div>
        </div>

        <div className="card-soft p-6">
          <h2 className="text-xl">My Garden</h2>
          {active ? (
            <>
              <div key={pulse} className="mt-4 overflow-hidden rounded-2xl">
                <PlantArt id={active.id} growth={active.growth} animate />
              </div>
              <p className="mt-4 font-medium">
                {plantMeta(active.id).emoji} {plantMeta(active.id).name}
              </p>
              <p className="text-sm text-muted-foreground">
                Stage: {plantMeta(active.id).stages[stageIndex(active.growth)]}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Growth: {active.growth} / {GROWTH_GOAL} cans
              </p>
              <div className="mt-2">
                <Meter value={active.growth} max={GROWTH_GOAL} />
              </div>
            </>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              You haven't planted a seed yet. Choose one to start your digital garden.
            </p>
          )}
          <Button asChild variant="outline" className="mt-6 w-full">
            <Link to="/garden">Open Garden</Link>
          </Button>
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="card-soft p-6 lg:col-span-2">
          <h2 className="text-xl">Recent Activity</h2>
          <ul className="mt-4 divide-y divide-border">
            {state.activity.slice(0, 6).map((a) => (
              <li key={a.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium">{a.label}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(a.date)}</p>
                </div>
                <span
                  className={
                    a.points >= 0
                      ? "rounded-full bg-sage-soft px-3 py-1 text-sm font-medium"
                      : "rounded-full bg-coral-soft px-3 py-1 text-sm font-medium"
                  }
                >
                  {a.points >= 0 ? `+${a.points}` : a.points} points
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card-soft p-6">
          <h2 className="text-xl">Your Impact</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex justify-between">
              <span>🥫 Cans recycled</span> <strong>{state.cans}</strong>
            </li>
            <li className="flex justify-between">
              <span>⭐ Points earned</span> <strong>{state.points}</strong>
            </li>
            <li className="flex justify-between">
              <span>🌱 Plants grown</span> <strong>{state.completedPlants.length}</strong>
            </li>
            <li className="flex justify-between">
              <span>🏆 Challenges completed</span> <strong>{challengesDone}</strong>
            </li>
          </ul>
          <h3 className="mt-6 text-base">Community Impact</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex justify-between">
              <span>Cans collected</span> <span>{COMMUNITY_STATS.cans.toLocaleString()}</span>
            </li>
            <li className="flex justify-between">
              <span>Participants</span> <span>{COMMUNITY_STATS.users.toLocaleString()}</span>
            </li>
            <li className="flex justify-between">
              <span>Points earned</span> <span>{COMMUNITY_STATS.points.toLocaleString()}</span>
            </li>
            <li className="flex justify-between">
              <span>Virtual plants grown</span> <span>{COMMUNITY_STATS.plants.toLocaleString()}</span>
            </li>
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">Community figures are prototype/demo statistics.</p>
          {state.cansThisWeek >= 10 && !state.claimedChallenges.includes("collector") && (
            <Button variant="accent" className="mt-5 w-full" onClick={() => claimChallenge("collector")}>
              Claim weekly challenge +100
            </Button>
          )}
        </div>
      </section>
    </>
  );
}

function QuickAction({
  to,
  label,
  hint,
  icon,
  onClick,
}: {
  to: "/garden" | "/contributions" | "/rewards";
  label: string;
  hint: string;
  icon: React.ReactNode;
  onClick?: () => void;
}) {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="rounded-2xl border border-border bg-beige p-4 text-left transition-transform hover:-translate-y-0.5"
      >
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-card" aria-hidden>
          {icon}
        </span>
        <p className="mt-3 text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </button>
    );
  }
  return (
    <Link
      to={to}
      className="rounded-2xl border border-border bg-card p-4 transition-transform hover:-translate-y-0.5"
    >
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-sage-soft" aria-hidden>
        {icon}
      </span>
      <p className="mt-3 text-sm font-medium">{label}</p>
      <p className="text-xs text-muted-foreground">{hint}</p>
    </Link>
  );
}
