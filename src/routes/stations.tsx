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

      <CampusMap onSelect={setOpenId} />


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
            disabled={station?.status !== "Active"}
            onClick={() => {
              if (station?.status === "Active") recycleCan(station.name);
              setOpenId(null);
            }}
          >
            {station?.status === "Active" ? "Demo: Recycle a Can here" : "Station unavailable"}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
