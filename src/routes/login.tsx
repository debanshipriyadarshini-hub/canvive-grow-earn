import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Logo } from "@/components/canvive/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCanVive } from "@/lib/canvive/store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — CanVive" },
      { name: "description", content: "Log in to your CanVive account to track cans, points and your impact garden." },
      { property: "og:title", content: "Log in — CanVive" },
      { property: "og:description", content: "Access your CanVive dashboard, rewards and digital garden." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useCanVive();
  const navigate = useNavigate();
  const [email, setEmail] = useState("demo@canvive.com");
  const [password, setPassword] = useState("canvive");

  const submit = (demo = false) => {
    login(demo ? { name: "Aanya Sharma", email: "demo@canvive.com" } : { email });
    toast.success("Welcome back to CanVive 🌿");
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="mx-auto flex h-20 w-full max-w-6xl items-center px-4 sm:px-6">
        <Link to="/" aria-label="CanVive home">
          <Logo />
        </Link>
      </header>
      <main className="flex flex-1 items-start justify-center px-4 pb-16 pt-4">
        <div className="card-soft w-full max-w-md p-8">
          <h1 className="text-3xl">Welcome Back</h1>
          <p className="mt-2 text-sm text-muted-foreground">Log in to continue your recycling streak.</p>
          <form
            className="mt-8 space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email or Mobile Number</Label>
              <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" variant="accent" className="w-full" size="lg">
              Login
            </Button>
            <Button type="button" variant="outline" className="w-full" size="lg" onClick={() => submit(true)}>
              Continue as Demo User
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium text-foreground underline underline-offset-4">
              Sign Up
            </Link>
          </p>
          <p className="mt-4 rounded-2xl bg-sage-soft p-3 text-center text-xs text-muted-foreground">
            Prototype demo account: Aanya Sharma · demo@canvive.com
          </p>
        </div>
      </main>
    </div>
  );
}
