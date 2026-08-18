import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin } from "lucide-react";
import { AppShell, PageHeader } from "@/components/canvive/AppShell";
import { Meter } from "@/components/canvive/StatCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { STATIONS } from "@/lib/canvive/data";
import { useCanVive } from "@/lib/canvive/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/stations")({
  head: () => ({
    meta: [
      { title: "Find a CanVive Station — CanVive" },
      { name: "description", content: "Locate nearby CanVive collection stations, their capacity and availability." },
      { property: "og:title", content: "Find a CanVive Station — CanVive" },
      { property: "og:description", content: "Find the nearest place to give your next can a second life." },
    ],
  }),
  component: () => (
    <AppShell>
      <Stations />
    </AppShell>
  ),
});

const statusTone: Record<string, string> = {
  Active: "bg-sage-soft",
  "Almost Full": "bg-coral-soft",
  Unavailable: "bg-beige",
};

function Stations() {
  const { recycleCan } = useCanVive();
  const [openId, setOpenId] = useState<string | null>(null);
  const station = STATIONS.find((s) => s.id === openId);

  return (
    <>
      <PageHeader
        title="Find a CanVive Station"
        subtitle="Find the nearest place to give your next can a second life."
      />

      <div className="card-soft relative mb-8 h-64 overflow-hidden sm:h-80">
        <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="h-full w-full" aria-hidden>
          <rect width="100" height="60" fill="var(--sage-soft)" />
          <rect x="0" y="24" width="100" height="6" fill="var(--beige)" />
          <rect x="44" y="0" width="6" height="60" fill="var(--beige)" />
          <rect x="8" y="6" width="26" height="14" rx="2" fill="var(--card)" />
          <rect x="58" y="8" width="30" height="12" rx="2" fill="var(--card)" />
          <rect x="12" y="36" width="24" height="16" rx="2" fill="var(--card)" />
          <ellipse cx="78" cy="46" rx="14" ry="8" fill="var(--water)" />
        </svg>
        {STATIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setOpenId(s.id)}
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-card px-3 py-1.5 text-xs font-medium shadow-soft transition-transform hover:-translate-y-[55%]"
          >
            <MapPin className="mr-1 inline h-3.5 w-3.5" aria-hidden />
            {s.name}
          </button>
        ))}
        <p className="absolute bottom-3 right-4 text-xs text-muted-foreground">Illustrative campus map (prototype)</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {STATIONS.map((s) => (
          <article key={s.id} className="card-soft flex flex-col p-6">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg">{s.name}</h2>
              <span className={cn("rounded-full px-3 py-1 text-xs font-medium", statusTone[s.status])}>
                {s.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{s.address}</p>
            <p className="mt-4 text-sm">Capacity: {s.capacity}%</p>
            <div className="mt-2">
              <Meter value={s.capacity} max={100} tone={s.capacity > 80 ? "coral" : "sage"} />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">Distance: {s.distance}</p>
            <Button variant="outline" className="mt-auto pt-2" onClick={() => setOpenId(s.id)}>
              View Station
            </Button>
          </article>
        ))}
      </div>

      <Dialog open={!!station} onOpenChange={(o) => !o && setOpenId(null)}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>{station?.name}</DialogTitle>
            <DialogDescription>{station?.address}</DialogDescription>
          </DialogHeader>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Status</dt>
              <dd>{station?.status}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Capacity</dt>
              <dd>{station?.capacity}%</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Distance</dt>
              <dd>{station?.distance}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Hours</dt>
              <dd>{station?.hours}</dd>
            </div>
          </dl>
          <Button
            variant="accent"
            disabled={station?.status === "Unavailable"}
            onClick={() => {
              if (station) recycleCan(station.name);
              setOpenId(null);
            }}
          >
            Demo: Recycle a Can here
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
