import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  CHALLENGES,
  GROWTH_GOAL,
  LEADERBOARD_OTHERS,
  REWARDS,
  levelFor,
  plantMeta,
  stageIndex,
  type PlantId,
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
};

const iso = (d: Date) => d.toISOString();
const daysAgo = (n: number) => iso(new Date(Date.now() - n * 86400000));

const initialState: State = {
  authed: false,
  user: {
    name: "Aanya Sharma",
    email: "demo@canvive.com",
    mobile: "+91 98765 43210",
    college: "Cummins College of Engineering",
  },
  cans: 42,
  points: 420,
  cansThisWeek: 7,
  cansThisMonth: 18,
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
  choosePlant: (id: PlantId) => void;
  setActivePlant: (id: PlantId) => void;
  redeem: (rewardId: string) => Redemption | null;
  claimChallenge: (id: string) => void;
  reset: () => void;
  rank: number;
  level: string;
  challengeProgress: (metric: string) => number;
};

const StoreContext = createContext<Ctx | null>(null);

const uid = () => Math.random().toString(36).slice(2, 9);

export function CanViveProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initialState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...initialState, ...JSON.parse(raw) });
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
      if (metric === "weekCans") return state.cansThisWeek;
      if (metric === "cans") return state.cans;
      return state.completedPlants.length;
    },
    [state],
  );

  const login = useCallback((user?: Partial<User>) => {
    setState((s) => ({ ...s, authed: true, user: { ...s.user, ...user } }));
  }, []);

  const signup = useCallback((user: Partial<User>) => {
    setState((s) => ({ ...s, authed: true, user: { ...s.user, ...user } }));
  }, []);

  const logout = useCallback(() => setState((s) => ({ ...s, authed: false })), []);

  const updateUser = useCallback((user: Partial<User>) => {
    setState((s) => ({ ...s, user: { ...s.user, ...user } }));
  }, []);

  const recycleCan = useCallback(
    (location = "College Campus") => {
      setState((s) => {
        const prevRank = LEADERBOARD_OTHERS.filter((p) => p.cans > s.cans).length + 1;
        const now = new Date();
        const garden = s.garden.map((p) =>
          p.id === s.activePlant && p.growth < GROWTH_GOAL ? { ...p, growth: p.growth + 1 } : p,
        );
        const active = garden.find((p) => p.id === s.activePlant);
        const before = s.garden.find((p) => p.id === s.activePlant);
        const cans = s.cans + 1;
        const points = s.points + 10;

        const completedPlants =
          active && active.growth >= GROWTH_GOAL && !s.completedPlants.includes(active.id)
            ? [...s.completedPlants, active.id]
            : s.completedPlants;

        setTimeout(() => {
          toast.success("Can recycled successfully! +10 points ⭐");
          if (active && before && stageIndex(active.growth) > stageIndex(before.growth)) {
            toast(`Your garden grew! 🌱 ${plantMeta(active.id).name} is now a ${plantMeta(active.id).stages[stageIndex(active.growth)]}.`);
          }
          const unlocked = REWARDS.find((r) => r.cost > s.points && r.cost <= points);
          if (unlocked) toast(`You unlocked a new reward! 🎁 ${unlocked.name}`);
          const newRank = LEADERBOARD_OTHERS.filter((p) => p.cans > cans).length + 1;
          if (newRank < prevRank) toast(`You moved up to #${newRank} on the leaderboard!`);
        }, 0);

        const sameDay = s.contributions.find(
          (c) => new Date(c.date).toDateString() === now.toDateString() && c.location === location,
        );
        const contributions = sameDay
          ? s.contributions.map((c) =>
              c.id === sameDay.id ? { ...c, cans: c.cans + 1, points: c.points + 10 } : c,
            )
          : [{ id: uid(), date: iso(now), location, cans: 1, points: 10 }, ...s.contributions];

        return {
          ...s,
          cans,
          points,
          cansThisWeek: s.cansThisWeek + 1,
          cansThisMonth: s.cansThisMonth + 1,
          contributions,
          garden,
          completedPlants,
          activity: [{ id: uid(), label: "Can recycled", points: 10, date: iso(now) }, ...s.activity].slice(0, 12),
        };
      });
    },
    [],
  );

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
    choosePlant,
    setActivePlant,
    redeem,
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
