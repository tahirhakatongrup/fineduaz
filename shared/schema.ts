import { z } from "zod";

// User schema
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  fullName: z.string(),
  age: z.number().min(14).max(100),
  region: z.string(),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional(),
  registrationDate: z.string(),
  language: z.enum(["az", "en", "ru"]).default("az"),
});

export const insertUserSchema = userSchema.omit({ id: true, registrationDate: true });
export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;

// Transaction schema
export const transactionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  date: z.string(),
  category: z.enum([
    "food",
    "transport",
    "entertainment",
    "utilities",
    "shopping",
    "health",
    "education",
    "other",
    "salary",
    "freelance",
    "investment",
    "gift",
    "other_income"
  ]),
  amount: z.number().positive(),
  type: z.enum(["income", "expense"]),
  description: z.string().optional(),
});

export const insertTransactionSchema = transactionSchema.omit({ id: true });
export type Transaction = z.infer<typeof transactionSchema>;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

// Goal schema
export const goalSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  targetAmount: z.number().positive(),
  currentAmount: z.number().min(0).default(0),
  createdDate: z.string(),
  deadline: z.string().optional(),
  icon: z.string().optional(),
});

export const insertGoalSchema = goalSchema.omit({ id: true, createdDate: true, currentAmount: true });
export type Goal = z.infer<typeof goalSchema>;
export type InsertGoal = z.infer<typeof insertGoalSchema>;

// Friend request schema
export const friendRequestSchema = z.object({
  id: z.string(),
  fromUserId: z.string(),
  toUserEmail: z.string().email(),
  status: z.enum(["pending", "accepted", "rejected"]),
  createdDate: z.string(),
});

export const insertFriendRequestSchema = friendRequestSchema.omit({ id: true, createdDate: true, status: true });
export type FriendRequest = z.infer<typeof friendRequestSchema>;
export type InsertFriendRequest = z.infer<typeof insertFriendRequestSchema>;

// Finance data record (from finedu_data.json)
export const financeDataSchema = z.object({
  id: z.number(),
  name: z.string(),
  age: z.number(),
  city: z.string(),
  family: z.number(),
  income: z.number(),
  outcome: z.number(),
  saving: z.number(),
  how_saving: z.string(),
  loans: z.string(),
  planning: z.number(),
});

export type FinanceData = z.infer<typeof financeDataSchema>;

// Regional and age group averages
export const averagesSchema = z.object({
  region: z.string(),
  ageGroup: z.enum(["14-18", "19-25", "26-35"]),
  avgIncome: z.number(),
  avgExpense: z.number(),
  avgSaving: z.number(),
});

export type Averages = z.infer<typeof averagesSchema>;

// Finny AI advice
export const finnyAdviceSchema = z.object({
  id: z.string(),
  userId: z.string(),
  advice: z.string(),
  category: z.string(),
  createdDate: z.string(),
});

export type FinnyAdvice = z.infer<typeof finnyAdviceSchema>;

// Category translations and icons
export const categoryConfig = {
  food: { icon: "Utensils", color: "hsl(25, 95%, 53%)" },
  transport: { icon: "Car", color: "hsl(199, 89%, 48%)" },
  entertainment: { icon: "Gamepad2", color: "hsl(271, 91%, 65%)" },
  utilities: { icon: "Zap", color: "hsl(48, 96%, 53%)" },
  shopping: { icon: "ShoppingBag", color: "hsl(330, 81%, 60%)" },
  health: { icon: "Heart", color: "hsl(0, 84%, 60%)" },
  education: { icon: "GraduationCap", color: "hsl(142, 71%, 45%)" },
  other: { icon: "MoreHorizontal", color: "hsl(215, 16%, 47%)" },
  salary: { icon: "Briefcase", color: "hsl(142, 71%, 45%)" },
  freelance: { icon: "Laptop", color: "hsl(199, 89%, 48%)" },
  investment: { icon: "TrendingUp", color: "hsl(271, 91%, 65%)" },
  gift: { icon: "Gift", color: "hsl(330, 81%, 60%)" },
  other_income: { icon: "Coins", color: "hsl(48, 96%, 53%)" },
} as const;

// Regions in Azerbaijan
export const regions = [
  "Bakı",
  "Sumqayıt",
  "Gəncə",
  "Mingəçevir",
  "Şirvan",
  "Naxçıvan",
  "Lənkəran",
  "Şəki",
  "Yevlax",
  "Xankəndi",
  "Digər"
] as const;

export type Region = typeof regions[number];
