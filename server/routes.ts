import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import { storage } from "./storage";
import { insertTransactionSchema, insertGoalSchema, insertFriendRequestSchema } from "@shared/schema";
import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

declare module "express-session" {
  interface SessionData {
    userId?: string;
    tempEmail?: string;
    tempName?: string;
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "finedu-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      },
    })
  );

  // Auth middleware
  const requireAuth = (req: Request, res: Response, next: Function) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    next();
  };

  // ==================== AUTH ROUTES ====================

  // Check current user
  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({ error: "User not found" });
    }
    res.json(user);
  });

  // Simulated Google OAuth init (in production, use passport-google-oauth20)
  app.get("/api/auth/google/init", async (req, res) => {
    // For demo purposes, simulate Google OAuth
    // In production, redirect to Google OAuth
    const demoEmail = `user${Date.now()}@gmail.com`;
    const demoName = "Demo User";
    
    // Check if user exists
    const existingUser = await storage.getUserByEmail(demoEmail);
    if (existingUser) {
      req.session.userId = existingUser.id;
      return res.json({ user: existingUser });
    }

    // Need to complete profile
    req.session.tempEmail = demoEmail;
    req.session.tempName = demoName;
    return res.json({
      requiresProfile: true,
      email: demoEmail,
      name: demoName,
    });
  });

  // Complete profile after OAuth
  app.post("/api/auth/complete-profile", async (req, res) => {
    const { email, fullName, age, region, gender } = req.body;

    if (!email || !fullName || !age || !region) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const user = await storage.createUser({
        email,
        fullName,
        age: parseInt(age),
        region,
        gender: gender || undefined,
        language: "az",
      });

      req.session.userId = user.id;
      res.json({ user });
    } catch (error) {
      console.error("Profile creation error:", error);
      res.status(500).json({ error: "Failed to create profile" });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  // ==================== TRANSACTION ROUTES ====================

  app.get("/api/transactions", requireAuth, async (req, res) => {
    const transactions = await storage.getTransactions(req.session.userId!);
    res.json(transactions);
  });

  app.post("/api/transactions", requireAuth, async (req, res) => {
    try {
      const data = {
        ...req.body,
        userId: req.session.userId,
      };
      const validated = insertTransactionSchema.parse(data);
      const transaction = await storage.createTransaction(validated);
      res.json(transaction);
    } catch (error) {
      console.error("Transaction creation error:", error);
      res.status(400).json({ error: "Invalid transaction data" });
    }
  });

  app.put("/api/transactions/:id", requireAuth, async (req, res) => {
    const { id } = req.params;
    const transaction = await storage.getTransaction(id);
    
    if (!transaction || transaction.userId !== req.session.userId) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    const updated = await storage.updateTransaction(id, req.body);
    res.json(updated);
  });

  app.delete("/api/transactions/:id", requireAuth, async (req, res) => {
    const { id } = req.params;
    const transaction = await storage.getTransaction(id);
    
    if (!transaction || transaction.userId !== req.session.userId) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    await storage.deleteTransaction(id);
    res.json({ success: true });
  });

  // ==================== GOALS ROUTES ====================

  app.get("/api/goals", requireAuth, async (req, res) => {
    const goals = await storage.getGoals(req.session.userId!);
    res.json(goals);
  });

  app.post("/api/goals", requireAuth, async (req, res) => {
    try {
      const data = {
        ...req.body,
        userId: req.session.userId,
      };
      const validated = insertGoalSchema.parse(data);
      const goal = await storage.createGoal(validated);
      res.json(goal);
    } catch (error) {
      console.error("Goal creation error:", error);
      res.status(400).json({ error: "Invalid goal data" });
    }
  });

  app.post("/api/goals/:id/add-savings", requireAuth, async (req, res) => {
    const { id } = req.params;
    const { amount } = req.body;

    const goal = await storage.getGoal(id);
    if (!goal || goal.userId !== req.session.userId) {
      return res.status(404).json({ error: "Goal not found" });
    }

    const newAmount = goal.currentAmount + parseFloat(amount);
    const updated = await storage.updateGoal(id, { currentAmount: newAmount });
    res.json(updated);
  });

  app.delete("/api/goals/:id", requireAuth, async (req, res) => {
    const { id } = req.params;
    const goal = await storage.getGoal(id);
    
    if (!goal || goal.userId !== req.session.userId) {
      return res.status(404).json({ error: "Goal not found" });
    }

    await storage.deleteGoal(id);
    res.json({ success: true });
  });

  // ==================== FRIENDS ROUTES ====================

  app.get("/api/friends", requireAuth, async (req, res) => {
    const friends = await storage.getFriends(req.session.userId!);
    res.json(friends);
  });

  app.get("/api/friends/requests", requireAuth, async (req, res) => {
    const user = await storage.getUser(req.session.userId!);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const requests = await storage.getPendingRequestsForUser(user.email);
    res.json(requests);
  });

  app.post("/api/friends/request", requireAuth, async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }

    try {
      const request = await storage.createFriendRequest({
        fromUserId: req.session.userId!,
        toUserEmail: email,
      });
      res.json(request);
    } catch (error) {
      console.error("Friend request error:", error);
      res.status(500).json({ error: "Failed to send request" });
    }
  });

  app.post("/api/friends/accept/:id", requireAuth, async (req, res) => {
    const { id } = req.params;
    const updated = await storage.updateFriendRequest(id, "accepted");
    if (!updated) {
      return res.status(404).json({ error: "Request not found" });
    }
    res.json(updated);
  });

  app.post("/api/friends/reject/:id", requireAuth, async (req, res) => {
    const { id } = req.params;
    const updated = await storage.updateFriendRequest(id, "rejected");
    if (!updated) {
      return res.status(404).json({ error: "Request not found" });
    }
    res.json(updated);
  });

  app.get("/api/friends/leaderboard", requireAuth, async (req, res) => {
    const friends = await storage.getFriends(req.session.userId!);
    const user = await storage.getUser(req.session.userId!);
    const userGoals = await storage.getGoals(req.session.userId!);
    
    // Add current user to leaderboard
    const mainGoal = userGoals[0];
    const userProgress = mainGoal ? Math.round((mainGoal.currentAmount / mainGoal.targetAmount) * 100) : 0;
    
    const entries = [
      ...friends.map(f => ({
        username: f.username,
        goalName: f.goalName,
        completion: f.goalProgress,
      })),
      {
        username: user?.fullName || "You",
        goalName: mainGoal?.name || "-",
        completion: userProgress,
      },
    ];

    // Sort by completion and add ranks
    const sorted = entries
      .sort((a, b) => b.completion - a.completion)
      .map((e, i) => ({ ...e, rank: i + 1 }));

    res.json(sorted);
  });

  // ==================== AVERAGES ROUTES ====================

  app.get("/api/averages", requireAuth, async (req, res) => {
    const user = await storage.getUser(req.session.userId!);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const averages = await storage.getAverages(user.region, user.age);
    res.json(averages);
  });

  // Route with path params for TanStack Query
  app.get("/api/averages/:region/:age", requireAuth, async (req, res) => {
    const { region, age } = req.params;
    const averages = await storage.getAverages(decodeURIComponent(region), parseInt(age));
    res.json(averages);
  });

  // ==================== USER ROUTES ====================

  app.put("/api/users/profile", requireAuth, async (req, res) => {
    const { fullName, age, region, gender } = req.body;
    
    const updated = await storage.updateUser(req.session.userId!, {
      fullName,
      age: parseInt(age),
      region,
      gender,
    });

    if (!updated) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user: updated });
  });

  // ==================== FINNY AI ROUTES ====================

  app.get("/api/finny/recent", requireAuth, async (req, res) => {
    const advice = await storage.getRecentAdvice(req.session.userId!);
    res.json(advice);
  });

  app.post("/api/finny/ask", requireAuth, async (req, res) => {
    const { question, language = "az" } = req.body;
    const user = await storage.getUser(req.session.userId!);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get user's financial context
    const transactions = await storage.getTransactions(req.session.userId!);
    const goals = await storage.getGoals(req.session.userId!);
    const averages = await storage.getAverages(user.region, user.age);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyTransactions = transactions.filter((t) => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const totalIncome = monthlyTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = monthlyTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenseByCategory: Record<string, number> = {};
    monthlyTransactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
      });

    const languageInstructions = {
      az: "Azərbaycan dilində cavab ver. Dost canlı və köməkçi ol.",
      en: "Respond in English. Be friendly and helpful.",
      ru: "Отвечай на русском языке. Будь дружелюбным и полезным.",
    };

    const systemPrompt = `You are Finny, a friendly AI financial advisor for FinEdu AZ, a financial education app in Azerbaijan.
${languageInstructions[language as keyof typeof languageInstructions] || languageInstructions.az}

User context:
- Name: ${user.fullName}
- Age: ${user.age} (age group: ${averages.ageGroup})
- Region: ${user.region}
- This month's income: ${totalIncome} AZN
- This month's expenses: ${totalExpense} AZN
- Savings: ${totalIncome - totalExpense} AZN
- Expense breakdown: ${JSON.stringify(expenseByCategory)}
- Regional average expense: ${averages.avgExpense} AZN
- Age group average expense: ${averages.avgExpense} AZN
- Active savings goals: ${goals.map(g => `${g.name} (${Math.round((g.currentAmount/g.targetAmount)*100)}% complete)`).join(", ") || "None"}

Provide personalized, actionable financial advice based on their spending patterns and regional/age group comparisons.
Keep responses concise (2-4 paragraphs max). Use specific numbers from their data.
If they're spending more than average, suggest specific ways to reduce.
If they're saving well, encourage them and suggest next steps.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question },
        ],
        max_completion_tokens: 500,
      });

      const advice = response.choices[0].message.content || "";
      
      // Save the advice
      const saved = await storage.saveAdvice(req.session.userId!, advice, "general");
      
      res.json(saved);
    } catch (error) {
      console.error("OpenAI error:", error);
      res.status(500).json({ error: "Failed to get advice" });
    }
  });

  app.get("/api/finny/monthly-advice", requireAuth, async (req, res) => {
    const user = await storage.getUser(req.session.userId!);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get user's financial context
    const transactions = await storage.getTransactions(req.session.userId!);
    const averages = await storage.getAverages(user.region, user.age);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    generateMonthlyAdvice(user, transactions, averages, currentMonth, currentYear, res);
  });

  // Route with month parameter for TanStack Query
  app.get("/api/finny/monthly-advice/:month", requireAuth, async (req, res) => {
    const user = await storage.getUser(req.session.userId!);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { month } = req.params;
    const [year, monthNum] = month.split("-").map(Number);
    
    const transactions = await storage.getTransactions(req.session.userId!);
    const averages = await storage.getAverages(user.region, user.age);

    generateMonthlyAdvice(user, transactions, averages, monthNum - 1, year, res);
  });

  function generateMonthlyAdvice(user: any, transactions: any[], averages: any, targetMonth: number, targetYear: number, res: Response) {
    const monthlyTransactions = transactions.filter((t: any) => {
      const date = new Date(t.date);
      return date.getMonth() === targetMonth && date.getFullYear() === targetYear;
    });

    const totalExpense = monthlyTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenseByCategory: Record<string, number> = {};
    monthlyTransactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
      });

    // Find highest spending category
    const topCategory = Object.entries(expenseByCategory)
      .sort(([, a], [, b]) => b - a)[0];

    const diff = totalExpense - averages.avgExpense;
    const language = user.language || "az";

    let advice = "";
    if (language === "az") {
      if (diff > 0) {
        advice = `Bu ay ${user.region} ${averages.ageGroup} yaş ortalamasından ${Math.abs(diff).toFixed(0)} AZN çox xərc etmisiniz. `;
        if (topCategory) {
          advice += `Ən çox xərc "${topCategory[0]}" kateqoriyasındadır (${topCategory[1]} AZN). Növbəti ay bu sahədə 10-15% azaltmağı tövsiyə edirəm.`;
        }
      } else {
        advice = `Əla nəticə! Bu ay ${user.region} ${averages.ageGroup} yaş ortalamasından ${Math.abs(diff).toFixed(0)} AZN az xərc etmisiniz. `;
        advice += `Bu qənaəti məqsədlərinizə yönləndirməyi unutmayın!`;
      }
    } else if (language === "ru") {
      if (diff > 0) {
        advice = `В этом месяце вы потратили на ${Math.abs(diff).toFixed(0)} AZN больше, чем средний показатель для возраста ${averages.ageGroup} в ${user.region}. `;
        if (topCategory) {
          advice += `Больше всего расходов в категории "${topCategory[0]}" (${topCategory[1]} AZN). Рекомендую сократить на 10-15% в следующем месяце.`;
        }
      } else {
        advice = `Отличный результат! Вы потратили на ${Math.abs(diff).toFixed(0)} AZN меньше среднего. `;
        advice += `Не забудьте направить эти сбережения на ваши цели!`;
      }
    } else {
      if (diff > 0) {
        advice = `This month you spent ${Math.abs(diff).toFixed(0)} AZN more than the ${averages.ageGroup} age group average in ${user.region}. `;
        if (topCategory) {
          advice += `Your highest spending category is "${topCategory[0]}" (${topCategory[1]} AZN). I recommend reducing this by 10-15% next month.`;
        }
      } else {
        advice = `Great job! You spent ${Math.abs(diff).toFixed(0)} AZN less than the average. `;
        advice += `Don't forget to put these savings toward your goals!`;
      }
    }

    res.json({ advice });
  }

  return httpServer;
}
