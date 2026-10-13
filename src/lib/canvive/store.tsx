import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  CHALLENGES,
  GROWTH_GOAL,
  LEADERBOARD_OTHERS,
  PLANTS,
  REWARDS,
  levelFor,
  plantMeta,
  stageIndex,
  type PlantId,
  type MerchProduct,
} from "./data";

export type Contribution = {
  id: string;
  date: string; // ISO
  location: string;
  cans: number;
  points: number;
};

export type GardenPlant = {
  id: PlantId;
  growth: number;
  startedAt: string;
};

export type Redemption = {
  id: string;
  rewardId: string;
  name: string;
  code: string;
  points: number;
  date: string;
};

export type Activity = { id: string; label: string; points: number; date: string };

export type User = {
  name: string;
  email: string;
  mobile: string;
  college: string;
  qrId: string;
};

export type RecyclingStatus =
  | "ready"
  | "connecting"
  | "connected"
  | "ready_to_recycle"
  | "can_recorded"
  | "session_complete"
  | "qr_expired"
  | "connection_error";

export type RecyclingSession = {
  id: string;
  token: string;
  status: RecyclingStatus;
  createdAt: string;
  expiresAt: string;
  userName: string;
  machineName: string;
};

export type State = {
  authed: boolean;
  user: User;
  cans: number;
  points: number;
  cansThisWeek: number;
  cansThisMonth: number;
  contributions: Contribution[];
  garden: GardenPlant[];
  activePlant: PlantId | null;
  completedPlants: PlantId[];
  redemptions: Redemption[];
  claimedChallenges: string[];
  activity: Activity[];
  recyclingSession: RecyclingSession | null;
};

const iso = (d: Date) => d.toISOString();
const daysAgo = (n: number) => iso(new Date(Date.now() - n * 86400000));

const generateQrId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `cv-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
};

const withQrId = (user: Partial<User> = {}): User => ({
  name: user.name ?? "Aanya Sharma",
  email: user.email ?? "demo@canvive.com",
  mobile: user.mobile ?? "+91 98765 43210",
  college: user.college ?? "Cummins College of Engineering",
  qrId: typeof user.qrId === "string" && user.qrId.trim() ? user.qrId : generateQrId(),
});

const initialState: State = {
  authed: false,
  user: withQrId({
    name: "Aanya Sharma",
    email: "demo@canvive.com",
    mobile: "+91 98765 43210",
    college: "Cummins College of Engineering",
  }),
  cans: 42,
  points: 420,
  cansThisWeek: 12,
  cansThisMonth: 22,
  contributions: [
    { id: "c1", date: daysAgo(1), location: "College Campus", cans: 5, points: 50 },
    { id: "c2", date: daysAgo(3), location: "Café Station", cans: 3, points: 30 },
    { id: "c3", date: daysAgo(5), location: "Vending Zone", cans: 4, points: 40 },
    { id: "c4", date: daysAgo(7), location: "College Campus", cans: 6, points: 60 },
    { id: "c5", date: daysAgo(12), location: "Café Station", cans: 4, points: 40 },
    { id: "c6", date: daysAgo(19), location: "Vending Zone", cans: 8, points: 80 },
    { id: "c7", date: daysAgo(26), location: "College Campus", cans: 12, points: 120 },
  ],
  garden: [],
  activePlant: null,
  completedPlants: [],
  redemptions: [],
  claimedChallenges: [],
  activity: [
    { id: "a1", label: "Can recycled", points: 10, date: daysAgo(1) },
    { id: "a2", label: "Challenge completed", points: 20, date: daysAgo(2) },
    { id: "a3", label: "Can recycled", points: 10, date: daysAgo(3) },
    { id: "a4", label: "Reward milestone reached", points: 50, date: daysAgo(5) },
  ],
  recyclingSession: null,
};

const KEY = "canvive-state-v1";

type Ctx = {
  state: State;
  ready: boolean;
  login: (user?: Partial<User>) => void;
  signup: (user: Partial<User>) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  recycleCan: (location?: string) => void;
  startRecyclingSession: () => void;
  connectRecyclingMachine: () => void;
  recordRecyclingCan: (location?: string) => void;
  expireRecyclingSession: () => void;
  clearRecyclingSession: () => void;
  choosePlant: (id: PlantId) => void;
  setActivePlant: (id: PlantId) => void;
  redeem: (rewardId: string) => Redemption | null;
  redeemMerch: (product: MerchProduct) => Redemption | null;
  claimChallenge: (id: string) => void;
  reset: () => void;
  rank: number;
  level: string;
  challengeProgress: (metric: string) => number;
};

const StoreContext = createContext<Ctx | null>(null);

const uid = () => Math.random().toString(36).slice(2, 9);

function normalizePlantId(value: unknown): PlantId | null {
  const id = value === "willow" ? "lavender" : value;
  return PLANTS.some((plant) => plant.id === id) ? (id as PlantId) : null;
}

function normalizeState(saved: Partial<State>): State {
  const garden = Array.isArray(saved.garden)
    ? saved.garden.flatMap((plant) => {
        const id = normalizePlantId(plant?.id);
        if (!id) return [];
        const growth = typeof plant.growth === "number" && Number.isFinite(plant.growth) ? plant.growth : 0;
        return [{ ...plant, id, growth: Math.max(0, Math.min(GROWTH_GOAL, growth)) }];
      })
    : initialState.garden;
  const activePlant = normalizePlantId(saved.activePlant);
  const completedPlants = Array.isArray(saved.completedPlants)
    ? saved.completedPlants.flatMap((id) => {
        const normalized = normalizePlantId(id);
        return normalized ? [normalized] : [];
      })
    : initialState.completedPlants;

  const user = withQrId({
    ...initialState.user,
    ...saved.user,
    qrId: typeof saved.user?.qrId === "string" && saved.user.qrId.trim() ? saved.user.qrId : undefined,
  });

  return {
    ...initialState,
    ...saved,
    user,
    garden,
    activePlant: activePlant && garden.some((plant) => plant.id === activePlant) ? activePlant : garden[0]?.id ?? null,
    completedPlants,
  };
}

function cansInPeriod(contributions: Contribution[], days: number) {
  const cutoff = Date.now() - days * 86400000;
  return contributions.reduce((total, contribution) => {
    const timestamp = new Date(contribution.date).getTime();
    return timestamp >= cutoff && timestamp <= Date.now() ? total + contribution.cans : total;
  }, 0);
}

export function CanViveProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initialState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState(normalizeState(JSON.parse(raw) as Partial<State>));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, ready]);

  const rank = useMemo(() => {
    const above = LEADERBOARD_OTHERS.filter((p) => p.cans > state.cans).length;
    return above + 1;
  }, [state.cans]);

  const challengeProgress = useCallback(
    (metric: string) => {
      if (metric === "weekCans") return cansInPeriod(state.contributions, 7);
      if (metric === "cans") return state.cans;
      return state.completedPlants.length;
    },
    [state],
  );

  const login = useCallback((user?: Partial<User>) => {
    setState((s) => {
      const mergedUser = withQrId({ ...s.user, ...user });
      return { ...s, authed: true, user: mergedUser };
    });
  }, []);

  const signup = useCallback((user: Partial<User>) => {
    setState((s) => {
      const mergedUser = withQrId({ ...s.user, ...user });
      return { ...s, authed: true, user: mergedUser };
    });
  }, []);

  const logout = useCallback(() => setState((s) => ({ ...s, authed: false })), []);

  const updateUser = useCallback((user: Partial<User>) => {
    setState((s) => ({ ...s, user: withQrId({ ...s.user, ...user }) }));
  }, []);

  const startRecyclingSession = useCallback(() => {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 4 * 60 * 1000);

    setState((s) => ({
      ...s,
      recyclingSession: {
        id: uid(),
        token: `CV-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
        status: "ready",
        createdAt: iso(now),
        expiresAt: iso(expiresAt),
        userName: s.user.name.split(" ")[0],
        machineName: "Campus Recycling Station 03",
      },
    }));
  }, []);

  const connectRecyclingMachine = useCallback(() => {
    setState((s) => {
      if (!s.recyclingSession || s.recyclingSession.status === "qr_expired") return s;
      const nextStatus = s.recyclingSession.status === "ready" ? "connecting" : s.recyclingSession.status;

      setTimeout(() => {
        setState((current) => {
          if (!current.recyclingSession) return current;
          return {
            ...current,
            recyclingSession: {
              ...current.recyclingSession,
              status: "connected",
            },
          };
        });

        setTimeout(() => {
          setState((current) => {
            if (!current.recyclingSession) return current;
            return {
              ...current,
              recyclingSession: {
                ...current.recyclingSession,
                status: "ready_to_recycle",
              },
            };
          });
        }, 1400);
      }, 1200);

      return {
        ...s,
        recyclingSession: {
          ...s.recyclingSession,
          status: nextStatus,
          createdAt: s.recyclingSession.createdAt,
          expiresAt: s.recyclingSession.expiresAt,
          userName: s.recyclingSession.userName,
          machineName: s.recyclingSession.machineName,
        },
      };
    });
  }, []);

  const recycleCan = useCallback(
    (location = "College Campus") => {
      const before = state.garden.find((p) => p.id === state.activePlant);
      const nextGrowth = before ? Math.min(GROWTH_GOAL, before.growth + 1) : null;
      const points = state.points + 10;
      const previousRank = LEADERBOARD_OTHERS.filter((p) => p.cans > state.cans).length + 1;
      const nextRank = LEADERBOARD_OTHERS.filter((p) => p.cans > state.cans + 1).length + 1;

      setState((s) => {
        const now = new Date();
        const garden = s.garden.map((p) =>
          p.id === s.activePlant && p.growth < GROWTH_GOAL ? { ...p, growth: Math.min(GROWTH_GOAL, p.growth + 1) } : p,
        );
        const active = garden.find((p) => p.id === s.activePlant);
        const cans = s.cans + 1;

        const completedPlants =
          active && active.growth >= GROWTH_GOAL && !s.completedPlants.includes(active.id)
            ? [...s.completedPlants, active.id]
            : s.completedPlants;

        const contributions = [{ id: uid(), date: iso(now), location, cans: 1, points: 10 }, ...s.contributions];

        return {
          ...s,
          cans,
          points,
          cansThisWeek: cansInPeriod(contributions, 7),
          cansThisMonth: cansInPeriod(contributions, 30),
          contributions,
          garden,
          completedPlants,
          activity: [{ id: uid(), label: "Can recycled", points: 10, date: iso(now) }, ...s.activity].slice(0, 12),
        };
      });

      toast.success("Can recycled successfully! +10 points ⭐");
      if (nextGrowth !== null && nextGrowth > (before?.growth ?? 0) && before) {
        toast.success(`Can recycled! 🌱 Your ${plantMeta(before.id).name} is growing.`);
        if (stageIndex(nextGrowth) > stageIndex(before.growth)) {
          toast(`Your garden grew! 🌱 ${plantMeta(before.id).name} is now ${plantMeta(before.id).stages[stageIndex(nextGrowth)]}.`);
        }
      }
      const unlocked = REWARDS.find((r) => r.cost > state.points && r.cost <= points);
      if (unlocked) toast(`You unlocked a new reward! 🎁 ${unlocked.name}`);
      if (nextRank < previousRank) toast(`You moved up to #${nextRank} on the leaderboard!`);
    },
    [state],
  );

  const recordRecyclingCan = useCallback(
    (location = "CanVive Station") => {
      setState((s) => {
        if (!s.recyclingSession) return s;
        return {
          ...s,
          recyclingSession: {
            ...s.recyclingSession,
            status: "can_recorded",
          },
        };
      });

      recycleCan(location);

      setTimeout(() => {
        setState((s) => {
          if (!s.recyclingSession) return s;
          return {
            ...s,
            recyclingSession: {
              ...s.recyclingSession,
              status: "session_complete",
            },
          };
        });
      }, 1200);
    },
    [recycleCan],
  );

  const expireRecyclingSession = useCallback(() => {
    setState((s) => {
      if (!s.recyclingSession || s.recyclingSession.status === "session_complete") return s;
      return {
        ...s,
        recyclingSession: {
          ...s.recyclingSession,
          status: "qr_expired",
        },
      };
    });
  }, []);

  const clearRecyclingSession = useCallback(() => {
    setState((s) => ({ ...s, recyclingSession: null }));
  }, []);

  const choosePlant = useCallback((id: PlantId) => {
    setState((s) => {
      if (s.garden.some((p) => p.id === id)) return { ...s, activePlant: id };
      return {
        ...s,
        garden: [...s.garden, { id, growth: 0, startedAt: iso(new Date()) }],
        activePlant: id,
      };
    });
  }, []);

  const setActivePlant = useCallback((id: PlantId) => setState((s) => ({ ...s, activePlant: id })), []);

  const redeem = useCallback((rewardId: string) => {
    const reward = REWARDS.find((r) => r.id === rewardId);
    if (!reward) return null;
    let created: Redemption | null = null;
    setState((s) => {
      if (s.points < reward.cost) return s;
      created = {
        id: uid(),
        rewardId: reward.id,
        name: reward.name,
        code: `CV-${Math.floor(10000 + Math.random() * 89999)}`,
        points: reward.cost,
        date: iso(new Date()),
      };
      return {
        ...s,
        points: s.points - reward.cost,
        redemptions: [created, ...s.redemptions],
        activity: [
          { id: uid(), label: `Redeemed ${reward.name}`, points: -reward.cost, date: iso(new Date()) },
          ...s.activity,
        ].slice(0, 12),
      };
    });
    return created;
  }, []);

  const redeemMerch = useCallback((product: MerchProduct) => {
    let created: Redemption | null = null;
    setState((s) => {
      if (s.points < product.redeemPoints) return s;
      created = {
        id: uid(),
        rewardId: `merch-${product.id}`,
        name: product.name,
        code: `MERCH-${Math.floor(10000 + Math.random() * 89999)}`,
        points: product.redeemPoints,
        date: iso(new Date()),
      };
      return {
        ...s,
        points: s.points - product.redeemPoints,
        redemptions: [created, ...s.redemptions],
        activity: [
          { id: uid(), label: `Redeemed ${product.name}`, points: -product.redeemPoints, date: iso(new Date()) },
          ...s.activity,
        ].slice(0, 12),
      };
    });
    return created;
  }, []);

  const claimChallenge = useCallback((id: string) => {
    const challenge = CHALLENGES.find((c) => c.id === id);
    if (!challenge) return;
    setState((s) => {
      if (s.claimedChallenges.includes(id)) return s;
      setTimeout(() => toast.success(`Challenge completed! +${challenge.reward} points 🏆`), 0);
      return {
        ...s,
        points: s.points + challenge.reward,
        claimedChallenges: [...s.claimedChallenges, id],
        activity: [
          { id: uid(), label: `${challenge.name} completed`, points: challenge.reward, date: iso(new Date()) },
          ...s.activity,
        ].slice(0, 12),
      };
    });
  }, []);

  const reset = useCallback(() => setState(initialState), []);

  const value: Ctx = {
    state,
    ready,
    login,
    signup,
    logout,
    updateUser,
    recycleCan,
    startRecyclingSession,
    connectRecyclingMachine,
    recordRecyclingCan,
    expireRecyclingSession,
    clearRecyclingSession,
    choosePlant,
    setActivePlant,
    redeem,
    redeemMerch,
    claimChallenge,
    reset,
    rank,
    level: levelFor(state.cans).name,
    challengeProgress,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useCanVive() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useCanVive must be used inside CanViveProvider");
  return ctx;
}

export const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
