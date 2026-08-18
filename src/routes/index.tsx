import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Coins, Gift, Recycle, Sprout } from "lucide-react";
import { Logo } from "@/components/canvive/Logo";
import { Button } from "@/components/ui/button";
import { COMMUNITY_STATS } from "@/lib/canvive/data";
import { PlantArt } from "@/components/canvive/PlantArt";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CanVive — Every Can. A New Possibility." },
      {
        name: "description",
        content:
          "CanVive turns everyday beverage-can recycling into points, rewards and a growing digital garden for campus communities.",
      },
      { property: "og:title", content: "CanVive — Every Can. A New Possibility." },
      {
        property: "og:description",
        content: "Recycle. Earn. Grow. Join the campus recycling ecosystem that rewards every can.",
      },
    ],
  }),
  component: Landing,
});

const STATS = [
  { value: "12,450", label: "Cans Collected" },
  { value: "850", label: "Active Users" },
  { value: "124,500", label: "Points Earned" },
  { value: "1,240", label: "Plants Grown" },
];

const STEPS = [
  { icon: Recycle, title: "Recycle a Can", text: "Drop your can at any CanVive station on campus." },
  { icon: Coins, title: "Earn Points", text: "Every verified can adds 10 points to your balance." },
  { icon: Sprout, title: "Grow Your Garden", text: "Your points nurture a digital plant of your choice." },
  { icon: Gift, title: "Redeem Rewards", text: "Trade points for café perks, passes and merchandise." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link to="/login">Log in</Link>
          </Button>
          <Button asChild>
            <Link to="/signup">Get started</Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-sage-soft px-4 py-1.5 text-sm font-medium text-primary-foreground">
            Recycle. Earn. Grow.
          </span>
          <h1 className="mt-6 text-4xl leading-[1.05] sm:text-6xl">Every Can. A New Possibility.</h1>
          <p className="mt-5 max-w-lg text-lg text-muted-foreground">
            Turn everyday recycling into points, rewards and a growing digital garden.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="accent">
              <Link to="/login">
                Start Recycling <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#how-it-works">How It Works</a>
            </Button>
          </div>
          <p className="mt-8 max-w-md text-sm text-muted-foreground">
            CanVive connects physical beverage-can recycling with a digital reward, engagement and impact system.
          </p>
        </div>

        <div className="relative">
          <div className="card-soft relative overflow-hidden p-8">
            <KioskArt />
          </div>
          <div className="card-soft absolute -bottom-8 -left-4 hidden w-44 p-4 sm:block">
            <p className="text-xs font-medium text-muted-foreground">Your garden</p>
            <div className="mt-2 h-24 overflow-hidden rounded-xl">
              <PlantArt id="sakura" growth={50} />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="card-soft p-6 text-center">
              <p className="font-display text-3xl font-semibold">{s.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">Prototype figures shown for demonstration.</p>
      </section>

      <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
        <h2 className="text-center text-3xl sm:text-4xl">How CanVive works</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
          Four simple steps that turn a single can into a habit worth keeping.
        </p>
        <ol className="mt-10 grid gap-4 md:grid-cols-4">
          {STEPS.map((step, i) => (
            <li key={step.title} className="card-soft p-6">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sage-soft" aria-hidden>
                <step.icon className="h-5 w-5" />
              </span>
              <p className="mt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">Step {i + 1}</p>
              <h3 className="mt-1 text-lg">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card-soft bg-sage-soft p-6">
            <p className="text-sm text-muted-foreground">Community cans</p>
            <p className="font-display text-2xl">{COMMUNITY_STATS.cans.toLocaleString()}</p>
          </div>
          <div className="card-soft bg-coral-soft p-6">
            <p className="text-sm text-muted-foreground">Participants</p>
            <p className="font-display text-2xl">{COMMUNITY_STATS.users.toLocaleString()}</p>
          </div>
          <div className="card-soft bg-water p-6">
            <p className="text-sm text-muted-foreground">Points earned</p>
            <p className="font-display text-2xl">{COMMUNITY_STATS.points.toLocaleString()}</p>
          </div>
          <div className="card-soft bg-beige p-6">
            <p className="text-sm text-muted-foreground">Virtual plants grown</p>
            <p className="font-display text-2xl">{COMMUNITY_STATS.plants.toLocaleString()}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="card-soft bg-sage-soft px-6 py-14 text-center">
          <h2 className="text-3xl sm:text-4xl">Give Your Next Can a Second Life.</h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Join a campus community that makes recycling simple, social and rewarding.
          </p>
          <Button asChild size="lg" variant="accent" className="mt-8">
            <Link to="/signup">Join CanVive</Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 text-sm text-muted-foreground sm:px-6">
          <Logo />
          <p>CanVive — Every Can. A New Possibility. Prototype build.</p>
        </div>
      </footer>
    </div>
  );
}

function KioskArt() {
  return (
    <svg viewBox="0 0 360 300" role="img" aria-label="Illustration of a CanVive recycling station" className="w-full">
      <rect width="360" height="300" rx="24" fill="var(--sage-soft)" />
      <ellipse cx="180" cy="262" rx="130" ry="20" fill="var(--sage)" opacity="0.35" />
      <rect x="108" y="60" width="144" height="196" rx="28" fill="var(--card)" stroke="var(--border)" />
      <rect x="126" y="82" width="108" height="70" rx="16" fill="var(--water)" />
      <rect x="140" y="100" width="60" height="8" rx="4" fill="var(--sage)" />
      <rect x="140" y="116" width="80" height="8" rx="4" fill="var(--beige)" />
      <rect x="140" y="132" width="44" height="8" rx="4" fill="var(--coral)" />
      <rect x="146" y="170" width="68" height="14" rx="7" fill="var(--beige)" />
      <circle cx="180" cy="214" r="24" fill="var(--coral-soft)" />
      <path d="M172 214h16M180 206v16" stroke="var(--coral)" strokeWidth="4" strokeLinecap="round" />
      <g>
        <rect x="272" y="150" width="34" height="58" rx="12" fill="var(--beige)" stroke="var(--border)" />
        <rect x="278" y="142" width="22" height="10" rx="5" fill="var(--sage)" />
      </g>
      <g className="float-slow">
        <rect x="54" y="120" width="34" height="58" rx="12" fill="var(--card)" stroke="var(--border)" />
        <rect x="60" y="112" width="22" height="10" rx="5" fill="var(--coral)" />
      </g>
      <circle cx="300" cy="76" r="26" fill="var(--sun)" opacity="0.7" />
    </svg>
  );
}
