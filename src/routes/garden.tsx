import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Recycle } from "lucide-react";
import { AppShell, PageHeader } from "@/components/canvive/AppShell";
import { Meter } from "@/components/canvive/StatCard";
import { PlantArt } from "@/components/canvive/PlantArt";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCanVive } from "@/lib/canvive/store";
import { ACHIEVEMENTS, GROWTH_GOAL, PLANTS, plantMeta, stageIndex } from "@/lib/canvive/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/garden")({
  head: () => ({
    meta: [
      { title: "My Impact Garden — CanVive" },
      {
        name: "description",
        content: "Grow a digital sunflower, rose, sakura, willow, lily or lotus as you recycle more cans.",
      },
      { property: "og:title", content: "My Impact Garden — CanVive" },
      { property: "og:description", content: "Every can you recycle helps your virtual garden grow." },
    ],
  }),
  component: () => (
    <AppShell>
      <Garden />
    </AppShell>
  ),
});

function Garden() {
  const { state, choosePlant, setActivePlant, recycleCan } = useCanVive();
  const [pulse, setPulse] = useState(0);
  const [celebrate, setCelebrate] = useState<string | null>(null);
  const [picking, setPicking] = useState(false);

  const active = state.garden.find((p) => p.id === state.activePlant);

  useEffect(() => {
    if (active && active.growth >= GROWTH_GOAL) setCelebrate(active.id);
  }, [active?.growth, active?.id, active]);

  if (state.garden.length === 0 || picking) {
    return (
      <>
        <PageHeader
          title="Choose Your Seed"
          subtitle="Pick a plant to grow. Your garden is digital — it reflects your recycling journey."
          action={
            state.garden.length > 0 ? (
              <Button variant="outline" onClick={() => setPicking(false)}>
                Back to garden
              </Button>
            ) : undefined
          }
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PLANTS.map((p) => {
            const owned = state.garden.some((g) => g.id === p.id);
            return (
              <article key={p.id} className="card-soft overflow-hidden">
                <div className="h-44">
                  <PlantArt id={p.id} growth={GROWTH_GOAL} />
                </div>
                <div className="p-5">
                  <h2 className="text-lg">
                    {p.emoji} {p.name}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
                  <p className="mt-3 text-xs text-muted-foreground">{p.stages.join(" → ")}</p>
                  <Button
                    className="mt-5 w-full"
                    variant={owned ? "outline" : "accent"}
                    onClick={() => {
                      choosePlant(p.id);
                      setPicking(false);
                      setCelebrate(null);
                    }}
                  >
                    {owned ? "Switch to this plant" : "Choose"}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </>
    );
  }

  const meta = active ? plantMeta(active.id) : null;

  return (
    <>
      <PageHeader
        title="My Impact Garden"
        subtitle="Every can you recycle helps your virtual garden grow."
        action={
          <Button
            variant="accent"
            onClick={() => {
              recycleCan();
              setPulse((p) => p + 1);
            }}
          >
            <Recycle className="h-4 w-4" /> Demo: Recycle a Can
          </Button>
        }
      />

      {active && meta && (
        <section className="grid gap-6 lg:grid-cols-5">
          <div className="card-soft overflow-hidden p-4 lg:col-span-3">
            <div key={pulse} className="overflow-hidden rounded-2xl">
              <PlantArt id={active.id} growth={active.growth} animate />
            </div>
          </div>
          <div className="card-soft p-6 lg:col-span-2">
            <h2 className="text-2xl">
              {meta.emoji} {meta.name}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Current stage: {meta.stages[stageIndex(active.growth)]}
            </p>
            <p className="mt-6 font-display text-2xl">
              {active.growth} / {GROWTH_GOAL} cans
            </p>
            <div className="mt-3">
              <Meter value={active.growth} max={GROWTH_GOAL} />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {active.growth >= GROWTH_GOAL
                ? `Your ${meta.name} is fully grown.`
                : `Recycle ${GROWTH_GOAL - active.growth} more cans to fully grow your ${meta.name}.`}
            </p>
            <ol className="mt-6 space-y-2 text-sm">
              {meta.stages.map((s, i) => (
                <li
                  key={s}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2",
                    i <= stageIndex(active.growth) ? "bg-sage-soft" : "bg-beige text-muted-foreground",
                  )}
                >
                  <span className="text-xs font-medium">{i <= stageIndex(active.growth) ? "✓" : i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
            <Button variant="outline" className="mt-6 w-full" onClick={() => setPicking(true)}>
              Plant another seed
            </Button>
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-2xl">My CanVive Garden</h2>
        <p className="mt-1 text-sm text-muted-foreground">Switch between the plants you're growing.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {state.garden.map((p) => {
            const m = plantMeta(p.id);
            return (
              <button
                key={p.id}
                onClick={() => setActivePlant(p.id)}
                className={cn(
                  "card-soft overflow-hidden text-left transition-transform hover:-translate-y-0.5",
                  p.id === state.activePlant && "ring-2 ring-sage",
                )}
              >
                <div className="h-28">
                  <PlantArt id={p.id} growth={p.growth} />
                </div>
                <div className="p-4">
                  <p className="text-sm font-medium">
                    {m.emoji} {m.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {p.growth} / {GROWTH_GOAL} cans · {m.stages[stageIndex(p.growth)]}
                  </p>
                  <div className="mt-2">
                    <Meter value={p.growth} max={GROWTH_GOAL} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl">Garden Achievements</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ACHIEVEMENTS.map((a) => {
            const done = achievementDone(a.id, state.cans, state.completedPlants.length, state.claimedChallenges.length);
            return (
              <div
                key={a.id}
                className={cn("card-soft p-5", done ? "bg-sage-soft" : "opacity-70")}
              >
                <p className="text-sm font-medium">{a.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{a.description}</p>
                <p className="mt-3 text-xs font-medium">{done ? "Unlocked ✓" : "Locked"}</p>
              </div>
            );
          })}
        </div>
      </section>

      <Dialog open={!!celebrate} onOpenChange={(o) => !o && setCelebrate(null)}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Your {celebrate ? plantMeta(celebrate as never).name : "plant"} is fully grown!{" "}
              {celebrate ? plantMeta(celebrate as never).emoji : ""}
            </DialogTitle>
            <DialogDescription>You gave 50 cans a second life.</DialogDescription>
          </DialogHeader>
          {celebrate && (
            <div className="h-48 overflow-hidden rounded-2xl">
              <PlantArt id={celebrate as never} growth={GROWTH_GOAL} animate />
            </div>
          )}
          <Button
            variant="accent"
            onClick={() => {
              setCelebrate(null);
              setPicking(true);
            }}
          >
            Choose Another Seed
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

function achievementDone(id: string, cans: number, plants: number, challenges: number) {
  switch (id) {
    case "first-can":
      return cans >= 1;
    case "first-sprout":
      return cans >= 5;
    case "ten":
      return cans >= 10;
    case "growing":
      return cans >= 25;
    case "first-bloom":
      return plants >= 1;
    case "builder":
      return plants >= 3;
    case "gardener":
      return plants >= 5;
    case "challenge":
      return challenges >= 1;
    default:
      return false;
  }
}
