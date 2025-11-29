import { randomUUID } from "crypto";
import * as fs from "fs";
import * as path from "path";
import type { 
  User, InsertUser, 
  Transaction, InsertTransaction, 
  Goal, InsertGoal,
  FriendRequest, InsertFriendRequest,
  FinanceData,
  Averages,
  FinnyAdvice
} from "@shared/schema";

const DATA_DIR = path.join(process.cwd(), "data");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJsonFile<T>(filename: string, defaultValue: T): T {
  ensureDataDir();
  const filepath = path.join(DATA_DIR, filename);
  try {
    if (fs.existsSync(filepath)) {
      const data = fs.readFileSync(filepath, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
  }
  return defaultValue;
}

function writeJsonFile<T>(filename: string, data: T): void {
  ensureDataDir();
  const filepath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
}

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  
  // Transactions
  getTransactions(userId: string): Promise<Transaction[]>;
  getTransaction(id: string): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction | undefined>;
  deleteTransaction(id: string): Promise<boolean>;
  
  // Goals
  getGoals(userId: string): Promise<Goal[]>;
  getGoal(id: string): Promise<Goal | undefined>;
  createGoal(goal: InsertGoal): Promise<Goal>;
  updateGoal(id: string, updates: Partial<Goal>): Promise<Goal | undefined>;
  deleteGoal(id: string): Promise<boolean>;
  
  // Friends
  getFriendRequests(userId: string): Promise<FriendRequest[]>;
  getPendingRequestsForUser(email: string): Promise<(FriendRequest & { fromUsername: string })[]>;
  createFriendRequest(request: InsertFriendRequest): Promise<FriendRequest>;
  updateFriendRequest(id: string, status: "accepted" | "rejected"): Promise<FriendRequest | undefined>;
  getFriends(userId: string): Promise<{ id: string; username: string; goalName: string; goalProgress: number }[]>;
  
  // Averages
  getAverages(region: string, age: number): Promise<Averages>;
  
  // Finny Advice
  saveAdvice(userId: string, advice: string, category: string): Promise<FinnyAdvice>;
  getRecentAdvice(userId: string): Promise<FinnyAdvice[]>;
  
  // Finance Data
  getFinanceData(): Promise<FinanceData[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private transactions: Map<string, Transaction>;
  private goals: Map<string, Goal>;
  private friendRequests: Map<string, FriendRequest>;
  private finnyAdvice: Map<string, FinnyAdvice>;
  private financeData: FinanceData[];

  constructor() {
    this.users = new Map(Object.entries(readJsonFile<Record<string, User>>("users.json", {})));
    this.transactions = new Map(Object.entries(readJsonFile<Record<string, Transaction>>("transactions.json", {})));
    this.goals = new Map(Object.entries(readJsonFile<Record<string, Goal>>("goals.json", {})));
    this.friendRequests = new Map(Object.entries(readJsonFile<Record<string, FriendRequest>>("friend_requests.json", {})));
    this.finnyAdvice = new Map(Object.entries(readJsonFile<Record<string, FinnyAdvice>>("finny_advice.json", {})));
    this.financeData = this.loadFinanceData();
  }

  private loadFinanceData(): FinanceData[] {
    // Sample finance data based on the provided structure
    return [
      { id: 1, name: "Əli", age: 22, city: "Bakı", family: 0, income: 800, outcome: 550, saving: 250, how_saving: "bank", loans: "xeyr", planning: 2 },
      { id: 2, name: "Leyla", age: 25, city: "Bakı", family: 1, income: 1200, outcome: 900, saving: 300, how_saving: "investing", loans: "bəli", planning: 3 },
      { id: 3, name: "Rəşad", age: 19, city: "Sumqayıt", family: 0, income: 600, outcome: 450, saving: 150, how_saving: "cash", loans: "xeyr", planning: 1 },
      { id: 4, name: "Nigar", age: 28, city: "Sumqayıt", family: 2, income: 1500, outcome: 1100, saving: 400, how_saving: "bank", loans: "bəli", planning: 3 },
      { id: 5, name: "Tural", age: 16, city: "Bakı", family: 0, income: 200, outcome: 150, saving: 50, how_saving: "cash", loans: "xeyr", planning: 1 },
      { id: 6, name: "Aynur", age: 30, city: "Gəncə", family: 3, income: 1800, outcome: 1400, saving: 400, how_saving: "bank", loans: "bəli", planning: 3 },
      { id: 7, name: "Orxan", age: 24, city: "Bakı", family: 1, income: 1000, outcome: 700, saving: 300, how_saving: "investing", loans: "xeyr", planning: 2 },
      { id: 8, name: "Səbinə", age: 17, city: "Mingəçevir", family: 0, income: 150, outcome: 100, saving: 50, how_saving: "cash", loans: "xeyr", planning: 0 },
      { id: 9, name: "Kamran", age: 32, city: "Bakı", family: 4, income: 2200, outcome: 1800, saving: 400, how_saving: "bank", loans: "bəli", planning: 3 },
      { id: 10, name: "Günel", age: 21, city: "Sumqayıt", family: 0, income: 700, outcome: 500, saving: 200, how_saving: "bank", loans: "xeyr", planning: 2 },
      { id: 11, name: "Farid", age: 26, city: "Bakı", family: 2, income: 1400, outcome: 1000, saving: 400, how_saving: "investing", loans: "xeyr", planning: 3 },
      { id: 12, name: "Lamiyə", age: 15, city: "Şəki", family: 0, income: 100, outcome: 80, saving: 20, how_saving: "cash", loans: "xeyr", planning: 0 },
      { id: 13, name: "Ramin", age: 29, city: "Gəncə", family: 2, income: 1600, outcome: 1200, saving: 400, how_saving: "bank", loans: "bəli", planning: 2 },
      { id: 14, name: "Zəhra", age: 23, city: "Bakı", family: 1, income: 900, outcome: 650, saving: 250, how_saving: "bank", loans: "xeyr", planning: 2 },
      { id: 15, name: "İlkin", age: 18, city: "Lənkəran", family: 0, income: 300, outcome: 220, saving: 80, how_saving: "cash", loans: "xeyr", planning: 1 },
      { id: 16, name: "Nurlan", age: 34, city: "Bakı", family: 3, income: 2500, outcome: 1900, saving: 600, how_saving: "investing", loans: "bəli", planning: 3 },
      { id: 17, name: "Fidan", age: 20, city: "Sumqayıt", family: 0, income: 500, outcome: 380, saving: 120, how_saving: "bank", loans: "xeyr", planning: 1 },
      { id: 18, name: "Elvin", age: 27, city: "Bakı", family: 2, income: 1700, outcome: 1250, saving: 450, how_saving: "bank", loans: "xeyr", planning: 3 },
      { id: 19, name: "Ülviyyə", age: 14, city: "Naxçıvan", family: 0, income: 80, outcome: 60, saving: 20, how_saving: "cash", loans: "xeyr", planning: 0 },
      { id: 20, name: "Samir", age: 31, city: "Gəncə", family: 4, income: 2000, outcome: 1600, saving: 400, how_saving: "bank", loans: "bəli", planning: 2 },
    ];
  }

  private saveUsers() {
    writeJsonFile("users.json", Object.fromEntries(this.users));
  }

  private saveTransactions() {
    writeJsonFile("transactions.json", Object.fromEntries(this.transactions));
  }

  private saveGoals() {
    writeJsonFile("goals.json", Object.fromEntries(this.goals));
  }

  private saveFriendRequests() {
    writeJsonFile("friend_requests.json", Object.fromEntries(this.friendRequests));
  }

  private saveFinnyAdvice() {
    writeJsonFile("finny_advice.json", Object.fromEntries(this.finnyAdvice));
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      registrationDate: new Date().toISOString(),
      language: insertUser.language || "az",
    };
    this.users.set(id, user);
    this.saveUsers();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    this.saveUsers();
    return updatedUser;
  }

  // Transactions
  async getTransactions(userId: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(t => t.userId === userId);
  }

  async getTransaction(id: string): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = randomUUID();
    const transaction: Transaction = { ...insertTransaction, id };
    this.transactions.set(id, transaction);
    this.saveTransactions();
    return transaction;
  }

  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    if (!transaction) return undefined;
    const updated = { ...transaction, ...updates };
    this.transactions.set(id, updated);
    this.saveTransactions();
    return updated;
  }

  async deleteTransaction(id: string): Promise<boolean> {
    const deleted = this.transactions.delete(id);
    if (deleted) this.saveTransactions();
    return deleted;
  }

  // Goals
  async getGoals(userId: string): Promise<Goal[]> {
    return Array.from(this.goals.values()).filter(g => g.userId === userId);
  }

  async getGoal(id: string): Promise<Goal | undefined> {
    return this.goals.get(id);
  }

  async createGoal(insertGoal: InsertGoal): Promise<Goal> {
    const id = randomUUID();
    const goal: Goal = {
      ...insertGoal,
      id,
      currentAmount: 0,
      createdDate: new Date().toISOString(),
    };
    this.goals.set(id, goal);
    this.saveGoals();
    return goal;
  }

  async updateGoal(id: string, updates: Partial<Goal>): Promise<Goal | undefined> {
    const goal = this.goals.get(id);
    if (!goal) return undefined;
    const updated = { ...goal, ...updates };
    this.goals.set(id, updated);
    this.saveGoals();
    return updated;
  }

  async deleteGoal(id: string): Promise<boolean> {
    const deleted = this.goals.delete(id);
    if (deleted) this.saveGoals();
    return deleted;
  }

  // Friends
  async getFriendRequests(userId: string): Promise<FriendRequest[]> {
    return Array.from(this.friendRequests.values()).filter(r => r.fromUserId === userId);
  }

  async getPendingRequestsForUser(email: string): Promise<(FriendRequest & { fromUsername: string })[]> {
    const requests = Array.from(this.friendRequests.values())
      .filter(r => r.toUserEmail === email && r.status === "pending");
    
    return Promise.all(requests.map(async (r) => {
      const fromUser = await this.getUser(r.fromUserId);
      return { ...r, fromUsername: fromUser?.fullName || "Unknown" };
    }));
  }

  async createFriendRequest(insertRequest: InsertFriendRequest): Promise<FriendRequest> {
    const id = randomUUID();
    const request: FriendRequest = {
      ...insertRequest,
      id,
      status: "pending",
      createdDate: new Date().toISOString(),
    };
    this.friendRequests.set(id, request);
    this.saveFriendRequests();
    return request;
  }

  async updateFriendRequest(id: string, status: "accepted" | "rejected"): Promise<FriendRequest | undefined> {
    const request = this.friendRequests.get(id);
    if (!request) return undefined;
    const updated = { ...request, status };
    this.friendRequests.set(id, updated);
    this.saveFriendRequests();
    return updated;
  }

  async getFriends(userId: string): Promise<{ id: string; username: string; goalName: string; goalProgress: number }[]> {
    const user = await this.getUser(userId);
    if (!user) return [];

    // Get accepted friend requests where user is sender or recipient
    const acceptedRequests = Array.from(this.friendRequests.values())
      .filter(r => r.status === "accepted" && (r.fromUserId === userId || r.toUserEmail === user.email));

    const friends: { id: string; username: string; goalName: string; goalProgress: number }[] = [];

    for (const request of acceptedRequests) {
      let friendId: string;
      let friendUser: User | undefined;

      if (request.fromUserId === userId) {
        // User is sender, find recipient
        friendUser = await this.getUserByEmail(request.toUserEmail);
        friendId = friendUser?.id || "";
      } else {
        // User is recipient, friend is sender
        friendId = request.fromUserId;
        friendUser = await this.getUser(friendId);
      }

      if (friendUser) {
        const friendGoals = await this.getGoals(friendUser.id);
        const mainGoal = friendGoals[0];
        const progress = mainGoal ? Math.round((mainGoal.currentAmount / mainGoal.targetAmount) * 100) : 0;
        
        friends.push({
          id: friendUser.id,
          username: friendUser.fullName,
          goalName: mainGoal?.name || "-",
          goalProgress: progress,
        });
      }
    }

    return friends;
  }

  // Averages
  async getAverages(region: string, age: number): Promise<Averages> {
    const ageGroup = this.getAgeGroup(age);
    
    // Filter by region
    const regionData = this.financeData.filter(d => d.city === region);
    
    // Filter by age group
    const ageGroupData = this.financeData.filter(d => this.getAgeGroup(d.age) === ageGroup);

    // Calculate averages
    const calcAvg = (data: FinanceData[], field: "income" | "outcome" | "saving") => {
      if (data.length === 0) return 0;
      return Math.round(data.reduce((sum, d) => sum + d[field], 0) / data.length);
    };

    // Use region data if available, otherwise use age group data
    const dataToUse = regionData.length > 0 ? regionData : ageGroupData;

    return {
      region,
      ageGroup,
      avgIncome: calcAvg(dataToUse, "income"),
      avgExpense: calcAvg(dataToUse, "outcome"),
      avgSaving: calcAvg(dataToUse, "saving"),
    };
  }

  private getAgeGroup(age: number): "14-18" | "19-25" | "26-35" {
    if (age >= 14 && age <= 18) return "14-18";
    if (age >= 19 && age <= 25) return "19-25";
    return "26-35";
  }

  // Finny Advice
  async saveAdvice(userId: string, advice: string, category: string): Promise<FinnyAdvice> {
    const id = randomUUID();
    const finnyAdvice: FinnyAdvice = {
      id,
      userId,
      advice,
      category,
      createdDate: new Date().toISOString(),
    };
    this.finnyAdvice.set(id, finnyAdvice);
    this.saveFinnyAdvice();
    return finnyAdvice;
  }

  async getRecentAdvice(userId: string): Promise<FinnyAdvice[]> {
    return Array.from(this.finnyAdvice.values())
      .filter(a => a.userId === userId)
      .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
      .slice(0, 10);
  }

  // Finance Data
  async getFinanceData(): Promise<FinanceData[]> {
    return this.financeData;
  }
}

export const storage = new MemStorage();
