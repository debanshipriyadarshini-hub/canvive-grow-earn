import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/canvive/AppShell";
import { Meter } from "@/components/canvive/StatCard";
import { Button } from "@/components/ui/button";
import { CHALLENGES } from "@/lib/canvive/data";
import { useCanVive } from "@/lib/canvive/store";

export const Route = createFileRoute("/challenges")({
  head: () => ({
    meta: [
      { title: "Challenges — CanVive" },
      { name: "description", content: "Weekly and campus recycling challenges with bonus CanVive points." },
      { property: "og:title", content: "Challenges — CanVive" },
      { property: "og:description", content: "Recycle together. Earn together." },
    ],
  }),
  component: () => (
    <AppShell>
      <Challenges />
    </AppShell>
  ),
});

function Challenges() {
  const { state, challengeProgress, claimChallenge } = useCanVive();

  const active = CHALLENGES.filter((c) => !state.claimedChallenges.includes(c.id));
  const done = CHALLENGES.filter((c) => state.claimedChallenges.includes(c.id));
  const weekly = active.find((c) => c.weekly);

  return (
    <>
      <PageHeader title="Challenges" subtitle="Recycle together. Earn together." />

      {weekly && (
        <section className="card-soft bg-sage-soft p-6 sm:p-8">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Weekly Challenge</p>
          <h2 className="mt-2 text-2xl">{weekly.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{weekly.description}</p>
          <p className="mt-6 font-display text-2xl">
            {Math.min(challengeProgress(weekly.metric), weekly.goal)} / {weekly.goal}
          </p>
          <div className="mt-3 max-w-md">
            <Meter value={challengeProgress(weekly.metric)} max={weekly.goal} tone="coral" />
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-card px-4 py-1.5 text-sm font-medium">
              Reward: +{weekly.reward} bonus points
            </span>
            <Button
              variant="accent"
              disabled={challengeProgress(weekly.metric) < weekly.goal}
              onClick={() => claimChallenge(weekly.id)}
            >
              {challengeProgress(weekly.metric) >= weekly.goal ? "Claim reward" : "Keep recycling"}
            </Button>
          </div>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-2xl">Open challenges</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {active
            .filter((c) => !c.weekly)
            .map((c) => {
              const progress = Math.min(challengeProgress(c.metric), c.goal);
              const complete = progress >= c.goal;
              return (
                <article key={c.id} className="card-soft flex flex-col p-6">
                  <h3 className="text-lg">{c.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
                  <p className="mt-4 text-sm font-medium">
                    {progress} / {c.goal}
                  </p>
                  <div className="mt-2">
                    <Meter value={progress} max={c.goal} />
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">+{c.reward} points</p>
                  <Button
                    className="mt-auto pt-2"
                    variant={complete ? "accent" : "outline"}
                    disabled={!complete}
                    onClick={() => claimChallenge(c.id)}
                  >
                    {complete ? "Claim reward" : "In progress"}
                  </Button>
                </article>
              );
            })}
        </div>
      </section>

      {done.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl">Completed challenges</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {done.map((c) => (
              <div key={c.id} className="card-soft bg-beige p-5">
                <p className="font-medium">{c.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
                <p className="mt-3 text-xs font-medium">Completed ✓ +{c.reward} points</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
