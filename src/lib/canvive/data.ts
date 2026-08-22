export type PlantId = "sunflower" | "rose" | "sakura" | "lavender" | "lily" | "lotus";

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
    description: "A bright meadow bloom that turns toward every bit of light.",
    environment: "garden",
    stages: ["Seed", "Sprout", "Young Plant", "Growing Plant", "Full Bloom"],
  },
  {
    id: "rose",
    name: "Rose",
    emoji: "🌹",
    description: "A patient garden rose with rich foliage and coral blooms.",
    environment: "garden",
    stages: ["Seed", "Sprout", "Young Plant", "Growing Plant", "Full Bloom"],
  },
  {
    id: "sakura",
    name: "Sakura",
    emoji: "🌸",
    description: "A cherry blossom grove that gathers delicate pink petals over time.",
    environment: "garden",
    stages: ["Seed", "Sprout", "Young Plant", "Growing Plant", "Full Bloom"],
  },
  {
    id: "lavender",
    name: "Lavender Land",
    emoji: "🪻",
    description: "Grow a peaceful field of fragrant lavender.",
    environment: "garden",
    stages: ["Seed", "Sprout", "Young Plant", "Growing Plant", "Full Bloom"],
  },
  {
    id: "lily",
    name: "Lily",
    emoji: "🪻",
    description: "An elegant pond flower surrounded by pads and gentle ripples.",
    environment: "water",
    stages: ["Seed", "Sprout", "Young Plant", "Growing Plant", "Full Bloom"],
  },
  {
    id: "lotus",
    name: "Lotus",
    emoji: "🪷",
    description: "A serene water garden with broad leaves and a rewarding bloom.",
    environment: "water",
    stages: ["Seed", "Sprout", "Young Plant", "Growing Plant", "Full Bloom"],
  },
];

export const plantMeta = (id: PlantId) => PLANTS.find((p) => p.id === id)!;

export const GROWTH_GOAL = 25;
export const STAGE_THRESHOLDS = [0, 5, 10, 15, 25];

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

export type MerchProduct = {
  id: string;
  name: string;
  description: string;
  story: string;
  category: "accessories" | "badges" | "desk" | "lighting";
  priceRupees: number;
  pointsCost: number;
  icon: string;
  tag: string;
  available: boolean;
};

export const MERCH_PRODUCTS: MerchProduct[] = [
  {
    id: "star-keychain",
    name: "Star Can Keychain",
    description: "A small star-shaped keychain handcrafted from a collected aluminium beverage can.",
    story: "This keychain started as an aluminium can. Through collection and creative reuse, it was transformed into something you can carry every day.",
    category: "accessories",
    priceRupees: 99,
    pointsCost: 400,
    icon: "⭐",
    tag: "Made from 1 collected can",
    available: true,
  },
  {
    id: "can-badges-eco-warrior",
    name: "Eco Warrior Badge",
    description: "A collectible badge made from aluminium cans, featuring the Eco Warrior design.",
    story: "Transform your recycling commitment into wearable pride. Each badge represents your dedication to environmental sustainability.",
    category: "badges",
    priceRupees: 49,
    pointsCost: 200,
    icon: "🛡️",
    tag: "Made from recycled aluminium",
    available: true,
  },
  {
    id: "can-badges-recycle-hero",
    name: "Recycle Hero Badge",
    description: "A circular badge celebrating recycling heroes made from upcycled aluminium.",
    story: "Every can you collect makes you a hero. This badge honors your commitment to building a circular economy.",
    category: "badges",
    priceRupees: 49,
    pointsCost: 200,
    icon: "🌍",
    tag: "Made from recycled aluminium",
    available: true,
  },
  {
    id: "can-badges-planet-protector",
    name: "Planet Protector Badge",
    description: "A leaf-inspired badge protecting the planet, crafted from aluminium cans.",
    story: "Protect our planet, one can at a time. This badge symbolizes your role in global environmental change.",
    category: "badges",
    priceRupees: 49,
    pointsCost: 200,
    icon: "🌿",
    tag: "Made from recycled aluminium",
    available: true,
  },
  {
    id: "badge-set",
    name: "CanVive Badge Collection Set",
    description: "Collect all three unique badges in this premium set. Eco Warrior, Recycle Hero, and Planet Protector.",
    story: "Build your complete badge collection and show your commitment to CanVive's mission across all aspects of sustainability.",
    category: "badges",
    priceRupees: 249,
    pointsCost: 900,
    icon: "🎖️",
    tag: "3 unique collectible badges",
    available: true,
  },
  {
    id: "can-pen-stand",
    name: "Upcycled Can Pen Stand",
    description: "A functional desk organizer created by transforming collected cans into a smooth, modern workspace accessory.",
    story: "Watch waste become workspace inspiration. This pen stand keeps your desk organized while telling the story of circular design.",
    category: "desk",
    priceRupees: 149,
    pointsCost: 600,
    icon: "✏️",
    tag: "1 can. A new purpose.",
    available: true,
  },
  {
    id: "mini-lamp",
    name: "Upcycled Mini Lamp",
    description: "A compact decorative lamp created by creatively transforming collected aluminium cans into ambient lighting.",
    story: "Waste transformed into light. This lamp illuminates both your space and the possibilities of sustainable design.",
    category: "lighting",
    priceRupees: 299,
    pointsCost: 1200,
    icon: "💡",
    tag: "Waste transformed into light.",
    available: true,
  },
];

export const MERCH_IMPACT_STEPS = [
  {
    step: 1,
    title: "Can Collected",
    emoji: "🥫",
    description: "A beverage can is collected through the CanVive network.",
  },
  {
    step: 2,
    title: "Sorted",
    emoji: "📋",
    description: "Cans are sorted by material and quality.",
  },
  {
    step: 3,
    title: "Recycled & Upcycled",
    emoji: "♻️",
    description: "Materials are processed and prepared for creative transformation.",
  },
  {
    step: 4,
    title: "Crafted into Product",
    emoji: "🛠️",
    description: "Artisans transform aluminium into unique merchandise.",
  },
  {
    step: 5,
    title: "Redeemed or Purchased",
    emoji: "🎁",
    description: "Products reach you, closing the circular loop.",
  },
];
