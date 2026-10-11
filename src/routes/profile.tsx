import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/canvive/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ACHIEVEMENTS, LEVELS } from "@/lib/canvive/data";
import { useCanVive } from "@/lib/canvive/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — CanVive" },
      { name: "description", content: "Your CanVive profile: level, achievements, points and account details." },
      { property: "og:title", content: "Profile — CanVive" },
      { property: "og:description", content: "Manage your CanVive account and view your recycling achievements." },
    ],
  }),
  component: () => (
    <AppShell>
      <Profile />
    </AppShell>
  ),
});

function Profile() {
  const { state, updateUser, level, reset } = useCanVive();
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(state.user);

  const unlocked = (id: string) => {
    const cans = state.cans;
    const plants = state.completedPlants.length;
    if (id === "first-can") return cans >= 1;
    if (id === "first-sprout") return cans >= 5;
    if (id === "ten") return cans >= 10;
    if (id === "growing") return cans >= 25;
    if (id === "first-bloom") return plants >= 1;
    if (id === "builder") return plants >= 3;
    if (id === "gardener") return plants >= 5;
    return state.claimedChallenges.length >= 1;
  };

  return (
    <>
      <PageHeader title="Profile" subtitle="Your CanVive account and recycling identity." />

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="card-soft p-6 lg:col-span-2">
          <div className="flex items-center gap-4">
            <span
              className="grid h-16 w-16 place-items-center rounded-full bg-sage-soft font-display text-xl"
              aria-hidden
            >
              {state.user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
            <div>
              <h2 className="text-2xl">{state.user.name}</h2>
              <p className="text-sm text-muted-foreground">{state.user.college}</p>
            </div>
          </div>

          {edit ? (
            <form
              className="mt-6 grid gap-4 sm:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                updateUser(form);
                setEdit(false);
                toast.success("Profile updated");
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="p-name">Full Name</Label>
                <Input id="p-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="p-email">Email</Label>
                <Input id="p-email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="p-mobile">Mobile Number</Label>
                <Input id="p-mobile" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="p-college">College / Organization</Label>
                <Input
                  id="p-college"
                  value={form.college}
                  onChange={(e) => setForm({ ...form, college: e.target.value })}
                />
              </div>
              <div className="flex gap-2 sm:col-span-2">
                <Button type="submit">
                  Save changes
                </Button>
                <Button type="button" variant="outline" onClick={() => setEdit(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <>
              <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field label="Email" value={state.user.email} />
                <Field label="Mobile" value={state.user.mobile} />
                <Field label="Points" value={`${state.points} ⭐`} />
                <Field label="Cans Recycled" value={String(state.cans)} />
                <Field label="Current Level" value={level} />
                <Field label="Plants Grown" value={String(state.completedPlants.length)} />
              </dl>
              <Button
                className="mt-6"
                variant="outline"
                onClick={() => {
                  setForm(state.user);
                  setEdit(true);
                }}
              >
                Edit profile
              </Button>
            </>
          )}
        </section>

        <section className="card-soft p-6">
          <h2 className="text-xl">Levels</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {LEVELS.map((l) => (
              <li
                key={l.name}
                className={cn(
                  "flex items-center justify-between rounded-xl px-3 py-2",
                  l.name === level ? "bg-sage-soft font-medium" : "bg-beige text-muted-foreground",
                )}
              >
                <span>{l.name}</span>
                <span className="text-xs">
                  {l.min}
                  {l.max === Infinity ? "+" : `–${l.max}`} cans
                </span>
              </li>
            ))}
          </ul>
          <Button
            variant="ghost"
            className="mt-6 w-full"
            onClick={() => {
              reset();
              toast("Prototype data reset to the demo state.");
            }}
          >
            Reset demo data
          </Button>
        </section>
      </div>

      <section className="mt-10">
        <h2 className="text-2xl">Achievements</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ACHIEVEMENTS.map((a) => (
            <div key={a.id} className={cn("card-soft p-5", unlocked(a.id) ? "bg-sage-soft" : "opacity-70")}>
              <p className="text-sm font-medium">{a.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{a.description}</p>
              <p className="mt-3 text-xs font-medium">{unlocked(a.id) ? "Unlocked ✓" : "Locked"}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-beige px-4 py-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm font-medium">{value}</dd>
    </div>
  );
}
