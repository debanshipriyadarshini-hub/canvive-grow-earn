import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/canvive/AppShell";
import { Meter } from "@/components/canvive/StatCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { REWARDS } from "@/lib/canvive/data";
import { formatDate, useCanVive, type Redemption } from "@/lib/canvive/store";

export const Route = createFileRoute("/rewards")({
  head: () => ({
    meta: [
      { title: "Rewards — CanVive" },
      { name: "description", content: "Redeem your CanVive points for café discounts, event coupons and merchandise." },
      { property: "og:title", content: "Rewards — CanVive" },
      { property: "og:description", content: "Turn recycled cans into real campus perks." },
    ],
  }),
  component: () => (
    <AppShell>
      <Rewards />
    </AppShell>
  ),
});

function Rewards() {
  const { state, redeem } = useCanVive();
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [result, setResult] = useState<Redemption | null>(null);

  const pending = REWARDS.find((r) => r.id === confirmId);

  return (
    <>
      <PageHeader
        title="Redeem Your Points"
        subtitle="Points earned from recycled cans, challenges and garden milestones."
        action={
          <div className="rounded-full bg-sage-soft px-5 py-2.5 text-sm font-medium">
            Available Points: {state.points} ⭐
          </div>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {REWARDS.map((r) => {
          const affordable = state.points >= r.cost;
          return (
            <article key={r.id} className="card-soft flex flex-col p-6">
              <h2 className="text-lg">{r.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{r.detail}</p>
              <p className="mt-4 font-display text-2xl">{r.cost} points</p>
              {!affordable && (
                <div className="mt-4">
                  <Meter value={state.points} max={r.cost} tone="coral" />
                  <p className="mt-2 text-xs text-muted-foreground">
                    {state.points} / {r.cost} · {r.cost - state.points} more points needed
                  </p>
                </div>
              )}
              <Button
                className="mt-auto w-full"
                variant={affordable ? "accent" : "outline"}
                disabled={!affordable}
                onClick={() => setConfirmId(r.id)}
              >
                {affordable ? "Redeem" : "Not enough points"}
              </Button>
            </article>
          );
        })}
      </div>

      <section className="mt-10">
        <h2 className="text-2xl">My Redeemed Rewards</h2>
        <div className="card-soft mt-4 overflow-x-auto">
          {state.redemptions.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-muted-foreground">
              No rewards redeemed yet. Keep recycling to unlock your first one.
            </p>
          ) : (
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="bg-beige text-muted-foreground">
                <tr>
                  <th scope="col" className="px-6 py-3 font-medium">Reward</th>
                  <th scope="col" className="px-6 py-3 font-medium">Status</th>
                  <th scope="col" className="px-6 py-3 font-medium">Redemption Code</th>
                  <th scope="col" className="px-6 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {state.redemptions.map((r) => (
                  <tr key={r.id}>
                    <td className="px-6 py-4">{r.name}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-sage-soft px-3 py-1 text-xs font-medium">Redeemed</span>
                    </td>
                    <td className="px-6 py-4 font-medium">{r.code}</td>
                    <td className="px-6 py-4">{formatDate(r.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <Dialog open={!!pending} onOpenChange={(o) => !o && setConfirmId(null)}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>Redeem this reward for {pending?.cost} points?</DialogTitle>
            <DialogDescription>{pending?.name} — prototype redemption, no real partner involved.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmId(null)}>
              Cancel
            </Button>
            <Button
              variant="accent"
              onClick={() => {
                const r = pending ? redeem(pending.id) : null;
                setConfirmId(null);
                if (r) {
                  setResult(r);
                  toast.success("Reward Unlocked! 🎉");
                }
              }}
            >
              Redeem
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!result} onOpenChange={(o) => !o && setResult(null)}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Reward Unlocked! 🎉</DialogTitle>
            <DialogDescription>Show this code at the partner counter.</DialogDescription>
          </DialogHeader>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Reward</dt>
              <dd className="font-medium">{result?.name}</dd>
            </div>
            <div className="flex justify-between rounded-2xl bg-sage-soft px-4 py-3">
              <dt className="text-muted-foreground">Code</dt>
              <dd className="font-display text-lg">{result?.code}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Points Used</dt>
              <dd className="font-medium">{result?.points}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Remaining Points</dt>
              <dd className="font-medium">{state.points}</dd>
            </div>
          </dl>
          <Button onClick={() => setResult(null)}>Done</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
