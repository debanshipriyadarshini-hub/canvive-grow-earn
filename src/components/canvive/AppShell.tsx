import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Receipt,
  Sprout,
  Gift,
  Target,
  Trophy,
  MapPin,
  User as UserIcon,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { Logo } from "./Logo";
import { useCanVive } from "@/lib/canvive/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/contributions", label: "Contributions", icon: Receipt },
  { to: "/garden", label: "Impact Garden", icon: Sprout },
  { to: "/rewards", label: "Rewards", icon: Gift },
  { to: "/challenges", label: "Challenges", icon: Target },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/stations", label: "Stations", icon: MapPin },
  { to: "/profile", label: "Profile", icon: UserIcon },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { state, ready, logout } = useCanVive();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (ready && !state.authed) navigate({ to: "/login" });
  }, [ready, state.authed, navigate]);

  if (!ready) return <div className="min-h-screen bg-background" />;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
          <Link to="/dashboard" aria-label="CanVive home">
            <Logo />
          </Link>
          <nav className="ml-4 hidden flex-1 items-center gap-1 lg:flex" aria-label="Main">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground sm:flex">
              <span aria-hidden>⭐</span>
              <span>{state.points} pts</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:inline-flex"
              aria-label="Log out"
              onClick={() => {
                logout();
                navigate({ to: "/" });
              }}
            >
              <LogOut className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        {open && (
          <nav className="border-t border-border bg-background px-4 py-3 lg:hidden" aria-label="Mobile">
            <ul className="grid gap-1">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary data-[status=active]:bg-secondary data-[status=active]:text-foreground"
                  >
                    <item.icon className="h-4 w-4" aria-hidden />
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary"
                  onClick={() => {
                    logout();
                    navigate({ to: "/" });
                  }}
                >
                  <LogOut className="h-4 w-4" aria-hidden />
                  Log out
                </button>
              </li>
            </ul>
          </nav>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-28 pt-8 sm:px-6 lg:pb-16">{children}</main>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-2 py-1.5 backdrop-blur sm:hidden"
        aria-label="Bottom"
      >
        <ul className="flex items-center justify-between">
          {NAV.filter((n) => ["/dashboard", "/contributions", "/garden", "/rewards", "/profile"].includes(n.to)).map(
            (item) => (
              <li key={item.to} className="flex-1">
                <Link
                  to={item.to}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[11px] font-medium text-muted-foreground",
                    "data-[status=active]:bg-secondary data-[status=active]:text-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4" aria-hidden />
                  {item.label.replace("Impact ", "")}
                </Link>
              </li>
            ),
          )}
        </ul>
      </nav>
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-semibold sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
