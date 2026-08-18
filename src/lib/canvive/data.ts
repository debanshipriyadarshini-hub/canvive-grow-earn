export type PlantId = "sunflower" | "rose" | "sakura" | "willow" | "lily" | "lotus";

export type PlantMeta = {
  id: PlantId;
  name: string;
  emoji: string;
  description: string;
  environment: "garden" | "water";
  stages: [string, string, string, string, string];
};

export const PLANTS: PlantMeta[] = [
  {
    id: "sunflower",
    name: "Sunflower",
    emoji: "🌻",
    description: "Warm and cheerful. Turns towards every bit of light it can find.",
    environment: "garden",
    stages: ["Seed", "Sprout", "Stem", "Bud", "Full Sunflower"],
  },
  {
    id: "rose",
    name: "Rose",
    emoji: "🌹",
    description: "Soft petals, patient growth. A classic for a steady recycler.",
    environment: "garden",
    stages: ["Seed", "Sprout", "Stem", "Rose Bud", "Blooming Rose"],
  },
  {
    id: "sakura",
    name: "Sakura",
    emoji: "🌸",
    description: "A cherry blossom tree with delicate pastel-pink flowers.",
    environment: "garden",
    stages: ["Seed", "Small Tree", "Branches", "Blossom Buds", "Full Sakura Tree"],
  },
  {
    id: "willow",
    name: "Willow",
    emoji: "🌳",
    description: "Long hanging branches beside a quiet stream.",
    environment: "garden",
    stages: ["Seed", "Sapling", "Small Tree", "Hanging Branches", "Full Willow"],
  },
  {
    id: "lily",
    name: "Lily",
    emoji: "🪻",
    description: "An elegant flower resting on calm pastel water.",
    environment: "water",
    stages: ["Seed", "Water Sprout", "Lily Pad", "Bud", "Blooming Lily"],
  },
  {
    id: "lotus",
    name: "Lotus",
    emoji: "🪷",
    description: "A peaceful pond bloom. The calmest corner of your garden.",
    environment: "water",
    stages: ["Seed", "Water Sprout", "Lily Pad", "Lotus Bud", "Full Blooming Lotus"],
  },
];

export const plantMeta = (id: PlantId) => PLANTS.find((p) => p.id === id)!;

export const GROWTH_GOAL = 50;
export const STAGE_THRESHOLDS = [0, 5, 15, 30, 50];

export function stageIndex(growth: number) {
  let i = 0;
  STAGE_THRESHOLDS.forEach((t, idx) => {
    if (growth >= t) i = idx;
  });
  return i;
}

export type Reward = {
  id: string;
  name: string;
  cost: number;
  detail: string;
};

export const REWARDS: Reward[] = [
  { id: "cafe10", name: "10% Café Discount", cost: 100, detail: "Valid at all campus café partners." },
  { id: "event", name: "Event Coupon", cost: 250, detail: "Entry coupon for one campus event." },
  { id: "beverage", name: "Free Beverage", cost: 300, detail: "One free beverage from a partner outlet." },
  { id: "merch", name: "CanVive Merchandise", cost: 500, detail: "Tote bag or bottle from the CanVive kit." },
  { id: "pass", name: "Community Event Pass", cost: 750, detail: "Season pass for community clean-up events." },
];

export type Challenge = {
  id: string;
  name: string;
  description: string;
  goal: number;
  reward: number;
  metric: "weekCans" | "cans" | "plants";
  weekly?: boolean;
};

export const CHALLENGES: Challenge[] = [
  {
    id: "collector",
    name: "Can Collector",
    description: "Recycle 10 cans this week.",
    goal: 10,
    reward: 100,
    metric: "weekCans",
    weekly: true,
  },
  { id: "weekend", name: "Weekend Recycler", description: "Recycle 5 cans.", goal: 5, reward: 50, metric: "weekCans" },
  { id: "campus", name: "Campus Champion", description: "Recycle 25 cans.", goal: 25, reward: 250, metric: "cans" },
  { id: "gardenstart", name: "Garden Starter", description: "Grow your first plant.", goal: 1, reward: 100, metric: "plants" },
  {
    id: "community",
    name: "Community Builder",
    description: "Participate in a group challenge.",
    goal: 1,
    reward: 150,
    metric: "plants",
  },
];

export const ACHIEVEMENTS = [
  { id: "first-can", name: "First Can", description: "Recycle your first can." },
  { id: "first-sprout", name: "First Sprout", description: "Recycle your first 5 cans." },
  { id: "ten", name: "10 Cans", description: "Recycle 10 cans." },
  { id: "growing", name: "Growing Green", description: "Recycle 25 cans." },
  { id: "first-bloom", name: "First Bloom", description: "Fully grow your first plant." },
  { id: "builder", name: "Garden Builder", description: "Grow 3 plants." },
  { id: "gardener", name: "CanVive Gardener", description: "Grow 5 different plants." },
  { id: "challenge", name: "Challenge Winner", description: "Complete a challenge." },
];

export const STATIONS = [
  {
    id: "campus",
    name: "College Campus",
    status: "Active" as const,
    capacity: 70,
    distance: "0.3 km",
    hours: "Open 8:00 – 22:00",
    address: "Main academic block, near the library entrance",
    x: 30,
    y: 38,
  },
  {
    id: "cafe",
    name: "Café Station",
    status: "Active" as const,
    capacity: 35,
    distance: "0.7 km",
    hours: "Open 9:00 – 23:00",
    address: "Beside the central canteen courtyard",
    x: 62,
    y: 60,
  },
  {
    id: "vending",
    name: "Vending Zone",
    status: "Almost Full" as const,
    capacity: 82,
    distance: "1.1 km",
    hours: "Open 24 hours",
    address: "Hostel block C, vending corridor",
    x: 76,
    y: 26,
  },
  {
    id: "sports",
    name: "Sports Complex",
    status: "Unavailable" as const,
    capacity: 100,
    distance: "1.6 km",
    hours: "Under maintenance",
    address: "Gate 4, outside the athletics ground",
    x: 44,
    y: 78,
  },
];

export const LEADERBOARD_OTHERS = [
  { name: "Aditi", cans: 245 },
  { name: "Riya", cans: 210 },
  { name: "Sneha", cans: 185 },
  { name: "Kabir", cans: 168 },
  { name: "Meera", cans: 152 },
  { name: "Ishaan", cans: 141 },
  { name: "Tanvi", cans: 130 },
  { name: "Arjun", cans: 118 },
  { name: "Nikita", cans: 104 },
  { name: "Rohit", cans: 96 },
  { name: "Diya", cans: 88 },
  { name: "Vivaan", cans: 80 },
  { name: "Saanvi", cans: 72 },
  { name: "Neel", cans: 66 },
  { name: "Priya", cans: 58 },
  { name: "Kavya", cans: 52 },
  { name: "Om", cans: 46 },
  { name: "Zoya", cans: 38 },
  { name: "Aryan", cans: 30 },
];

export const CLASS_BOARD = [
  { name: "Computer Engineering", cans: 1250 },
  { name: "IT Engineering", cans: 1180 },
  { name: "ENTC", cans: 980 },
  { name: "Mechanical", cans: 720 },
];

export const COLLEGE_BOARD = [
  { name: "Cummins College of Engineering", cans: 4130 },
  { name: "COEP Technological University", cans: 3820 },
  { name: "MIT World Peace University", cans: 3110 },
  { name: "VIT Pune", cans: 2480 },
];

export const COMMUNITY_STATS = {
  cans: 12450,
  users: 850,
  points: 124500,
  plants: 1240,
};

export const LEVELS = [
  { name: "Green Starter", min: 0, max: 50 },
  { name: "Can Champion", min: 51, max: 150 },
  { name: "Can Hero", min: 151, max: 300 },
  { name: "CanVive Ambassador", min: 301, max: Infinity },
];

export const levelFor = (cans: number) => LEVELS.find((l) => cans >= l.min && cans <= l.max)!;
