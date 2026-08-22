import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight, Check, Droplets, Leaf, Recycle, Sparkles, Sprout, Sun, Target, Trophy, Waves } from "lucide-react";
import { AppShell } from "@/components/canvive/AppShell";
import { Meter } from "@/components/canvive/StatCard";
import { PlantArt } from "@/components/canvive/PlantArt";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCanVive } from "@/lib/canvive/store";
import { ACHIEVEMENTS, GROWTH_GOAL, PLANTS, plantMeta, stageIndex, type PlantId } from "@/lib/canvive/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/garden")({
  head: () => ({
    meta: [
      { title: "My Impact Garden — CanVive" },
      {
        name: "description",
        content: "Grow a digital sunflower, rose, sakura, lavender, lily or lotus as you recycle more cans.",
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
  const { state, choosePlant, setActivePlant } = useCanVive();
  const [pulse] = useState(0);
  const [celebrate, setCelebrate] = useState<PlantId | null>(null);
  const [picking, setPicking] = useState(false);

  const active = state.garden.find((p) => p.id === state.activePlant);
  const activeStage = active ? stageIndex(active.growth) : 0;
  const meta = active ? plantMeta(active.id) : null;
  const progress = active ? Math.min(100, Math.max(0, Math.round((active.growth / GROWTH_GOAL) * 100))) : 0;
  const stageStart = active ? [0, 5, 10, 15, 25][activeStage]! : 0;
  const stageEnd = active ? [5, 10, 15, 25, 25][activeStage]! : 5;
  const stageProgress = active
    ? activeStage === 4
      ? 100
      : Math.min(100, Math.round(((active.growth - stageStart) / Math.max(1, stageEnd - stageStart)) * 100))
    : 0;
  const nextStage = active && activeStage < 4 ? meta?.stages[activeStage + 1] : "Biome complete";

  useEffect(() => {
    if (active && active.growth >= GROWTH_GOAL) setCelebrate(active.id);
  }, [active?.growth, active?.id, active]);

  if (state.garden.length === 0 || picking) {
    return (
      <div className="garden-page">
        <div className="garden-heading garden-heading-picker">
          <div><p className="garden-kicker"><Sprout className="h-4 w-4" /> Start your living collection</p><h1>Choose a seed. Change a world.</h1><p>Every recycled can helps your chosen biome become more alive.</p></div>
          {state.garden.length > 0 && <Button variant="outline" onClick={() => setPicking(false)}>Back to garden</Button>}
        </div>
        <section className="garden-intro-band">
          <div><p className="garden-kicker"><Sparkles className="h-4 w-4" /> Six worlds, one real impact</p><h2>Plant something worth growing.</h2><p>Your recycled cans feed the seed you choose. The world around it evolves with your progress.</p></div>
          <Sprout className="garden-intro-icon" aria-hidden />
        </section>
        <div className="garden-seed-grid">
          {PLANTS.map((p) => {
            const owned = state.garden.some((g) => g.id === p.id);
            return (
              <article key={p.id} className={cn("garden-seed-card", `garden-seed-card-${p.id}`)}>
                <div className="garden-seed-art">
                  <PlantArt id={p.id} growth={GROWTH_GOAL} />
                </div>
                <div className="garden-seed-copy">
                  <p className="garden-card-eyebrow">{p.environment === "water" ? "Water garden" : "Green biome"}</p>
                  <h2>
                    {p.emoji} {p.name}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
                  <p className="garden-stage-line">{p.stages.join("  •  ")}</p>
                  <Button
                    className="mt-5 w-full"
                    variant={owned ? "outline" : "accent"}
                    onClick={() => {
                      choosePlant(p.id);
                      setPicking(false);
                      setCelebrate(null);
                    }}
                  >
                    {owned ? "Switch to this biome" : "Plant this seed"} <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="garden-page">
      <header className="garden-header-stack">
        <p className="garden-kicker"><Sprout className="h-4 w-4" /> Your living collection</p>
        <h1>My CanVive Garden</h1>
        <p className="garden-header-copy">Switch between your garden views and watch your recycled cans become part of your journey.</p>
      </header>

      <p className="garden-header-note">Recycle cans from Home to grow your plant 🌱</p>

      <section className="garden-section garden-collection-section">
        <div className="garden-section-heading"><span className="garden-collection-count">{state.garden.length} / 6 planted</span></div>
        <div className="garden-collection-grid">
          {state.garden.map((p) => {
            const m = plantMeta(p.id);
            return (
              <button
                key={p.id}
                onClick={() => setActivePlant(p.id)}
                className={cn(
                  "garden-collection-card overflow-hidden text-left",
                  p.id === state.activePlant && "is-active",
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

      <section className="garden-impact-strip" aria-label="Garden impact summary">
        <div className="garden-impact-stat"><span className="garden-stat-icon garden-stat-icon-green"><Recycle /></span><div><strong>{state.cans}</strong><span>cans recycled</span></div></div>
        <div className="garden-impact-stat"><span className="garden-stat-icon garden-stat-icon-gold"><Sparkles /></span><div><strong>{state.points}</strong><span>points earned</span></div></div>
        <div className="garden-impact-stat"><span className="garden-stat-icon garden-stat-icon-pink"><Sprout /></span><div><strong>{state.garden.length}</strong><span>worlds growing</span></div></div>
        <div className="garden-impact-message"><Target className="h-5 w-5" /><span><strong>{GROWTH_GOAL - (active?.growth ?? 0)} cans</strong> until your next transformation</span></div>
      </section>

      {active && meta && (
        <>
        <section className={cn("garden-hero", `garden-hero-${active.id}`, `garden-biome-stage-${activeStage}`)}>
            <div className="garden-hero-copy"><p className="garden-kicker"><Leaf className="h-4 w-4" /> Your living impact</p><h2>{meta.emoji} {meta.name}</h2><p className="garden-biome-name">{meta.environment === "water" ? "Serene water garden" : "Vibrant green habitat"}</p><div className="garden-hero-stats"><span><strong>{active.growth}</strong> cans invested</span><span><strong>{progress}%</strong> grown</span></div></div>
          <div key={pulse} className="garden-hero-art">
              <PlantArt id={active.id} growth={active.growth} animate />
              <span className="garden-scene-label">{active.id === "sunflower" ? "Your Meadow" : active.id === "rose" ? "Blooming Garden" : active.id === "sakura" ? "Cherry Blossom Grove" : active.id === "lavender" ? "Lavender Field" : active.id === "lily" ? "Pond Garden" : "Serene Water Garden"}</span>
            </div><div className="garden-hero-note"><Sun className="h-4 w-4" /> {activeStage === 4 ? "Your biome is thriving" : "Every can adds a little more life"}</div>
        </section>
        <section className="garden-progress-layout"><div className="garden-progress-panel">
          <div className="card-soft p-6 lg:col-span-2">
            <div className="garden-panel-heading"><div><p className="garden-card-eyebrow">Growth dashboard</p><h2>
              {meta.emoji} {meta.name}
            </h2></div><span className="garden-percentage">{progress}%</span></div>
            <p className="garden-biome-name">
              {meta.environment === "water" ? <Waves className="mr-1 inline h-4 w-4" /> : <Leaf className="mr-1 inline h-4 w-4" />} {meta.environment === "water" ? "Water biome" : "Sunny biome"} · Current stage: {meta.stages[activeStage]}
            </p>
            <p className="garden-growth-number">
              {active.growth} / {GROWTH_GOAL} cans
            </p>
            <div className="garden-organic-meter">
              <div style={{ width: `${progress}%` }} />
            </div>
            <div className="garden-progress-meta"><span>{activeStage === 4 ? `Your ${meta.name} is fully grown.` : `${stageEnd - active.growth} cans to ${nextStage}`}</span><span>{stageProgress}% of stage</span></div>
            <ol className="garden-stage-path">
              {meta.stages.map((s, i) => (
                <li
                  key={s}
                  className={cn(
                    "garden-stage",
                    i <= activeStage && "is-complete",
                    i === activeStage && "is-current",
                  )}
                >
                  <span className="text-xs font-medium">{i < activeStage ? <Check className="h-3 w-3" /> : i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
            <Button variant="outline" className="mt-6 w-full" onClick={() => setPicking(true)}>
              Plant another seed
            </Button>
          </div><div className="garden-impact-panel"><div className="garden-impact-icon"><Recycle /></div><p className="garden-card-eyebrow">Your contribution</p><h3>{state.cans} cans recycled</h3><p>That is <strong>{state.points} points</strong> moving through your CanVive journey.</p><div className="garden-impact-rule"><Droplets className="h-4 w-4" /> Recycling powers your next bloom</div></div></div></section>
        </>
      )}

      <section className="garden-section">
        <div className="garden-section-heading"><div><p className="garden-kicker"><Trophy className="h-4 w-4" /> Keep growing</p><h2>Garden milestones</h2><p>Small actions build a healthier world.</p></div></div>
        <div className="garden-achievement-grid">
          {ACHIEVEMENTS.map((a) => {
            const done = achievementDone(a.id, state.cans, state.completedPlants.length, state.claimedChallenges.length);
            return (
              <div key={a.id} className={cn("garden-achievement", done && "is-done")}>
                <span className="garden-achievement-icon"><Trophy className="h-4 w-4" /></span><div><p className="text-sm font-medium">{a.name}</p><p className="mt-1 text-xs text-muted-foreground">{a.description}</p><p className="mt-3 text-xs font-bold">{done ? "Unlocked" : "In progress"}</p></div>
              </div>
            );
          })}
        </div>
      </section>

      <Dialog open={!!celebrate} onOpenChange={(o) => !o && setCelebrate(null)}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Your {celebrate ? plantMeta(celebrate).name : "plant"} is fully grown!{" "}
              {celebrate ? plantMeta(celebrate).emoji : ""}
            </DialogTitle>
            <DialogDescription>You gave 25 cans a second life.</DialogDescription>
          </DialogHeader>
          {celebrate && (
            <div className="h-48 overflow-hidden rounded-2xl">
              <PlantArt id={celebrate} growth={GROWTH_GOAL} animate />
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
    </div>
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
