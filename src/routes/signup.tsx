import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Logo } from "@/components/canvive/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCanVive } from "@/lib/canvive/store";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your account — CanVive" },
      { name: "description", content: "Sign up for CanVive and start turning recycled cans into points and rewards." },
      { property: "og:title", content: "Create your account — CanVive" },
      { property: "og:description", content: "Join the campus recycling community. Recycle. Earn. Grow." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const { signup } = useCanVive();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    college: "",
    password: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="mx-auto flex h-20 w-full max-w-6xl items-center px-4 sm:px-6">
        <Link to="/" aria-label="CanVive home">
          <Logo />
        </Link>
      </header>
      <main className="flex flex-1 items-start justify-center px-4 pb-16 pt-4">
        <div className="card-soft w-full max-w-md p-8">
          <h1 className="text-3xl">Create your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">Every can you recycle starts counting from today.</p>
          <form
            className="mt-8 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              signup({
                name: form.name || "Aanya Sharma",
                email: form.email || "demo@canvive.com",
                mobile: form.mobile,
                college: form.college || "Cummins College of Engineering",
              });
              toast.success("Account created. Welcome to CanVive 🌿");
              navigate({ to: "/dashboard" });
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={form.name} onChange={set("name")} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={set("email")} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input id="mobile" value={form.mobile} onChange={set("mobile")} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="college">College / Organization</Label>
              <Input id="college" value={form.college} onChange={set("college")} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={form.password} onChange={set("password")} required />
            </div>
            <Button type="submit" size="lg" className="w-full">
              Create Account
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already recycling?{" "}
            <Link to="/login" className="font-medium text-foreground underline underline-offset-4">
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
