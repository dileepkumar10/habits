import { 
  users, type User, type InsertUser,
  habits, type Habit, type InsertHabit,
  completions, type Completion, type InsertCompletion
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Habit methods
  getHabit(id: number): Promise<Habit | undefined>;
  getHabitsByUserId(userId: number): Promise<Habit[]>;
  createHabit(userId: number, habit: InsertHabit): Promise<Habit>;
  updateHabit(id: number, habit: InsertHabit): Promise<Habit>;
  updateHabitStreak(id: number, streak: number): Promise<Habit>;
  deleteHabit(id: number): Promise<void>;
  
  // Completion methods
  getCompletion(id: number): Promise<Completion | undefined>;
  getCompletionsByUserId(userId: number): Promise<Completion[]>;
  getCompletionsByHabitId(habitId: number): Promise<Completion[]>;
  createCompletion(userId: number, habitId: number): Promise<Completion>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private habits: Map<number, Habit>;
  private completions: Map<number, Completion>;
  private userIdCounter: number;
  private habitIdCounter: number;
  private completionIdCounter: number;

  constructor() {
    this.users = new Map();
    this.habits = new Map();
    this.completions = new Map();
    this.userIdCounter = 1;
    this.habitIdCounter = 1;
    this.completionIdCounter = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Habit methods
  async getHabit(id: number): Promise<Habit | undefined> {
    return this.habits.get(id);
  }
  
  async getHabitsByUserId(userId: number): Promise<Habit[]> {
    return Array.from(this.habits.values()).filter(
      (habit) => habit.userId === userId,
    );
  }
  
  async createHabit(userId: number, insertHabit: InsertHabit): Promise<Habit> {
    const id = this.habitIdCounter++;
    const habit: Habit = { 
      ...insertHabit, 
      id, 
      userId, 
      streak: 0,
      createdAt: new Date()
    };
    this.habits.set(id, habit);
    return habit;
  }
  
  async updateHabit(id: number, insertHabit: InsertHabit): Promise<Habit> {
    const habit = this.habits.get(id);
    if (!habit) {
      throw new Error(`Habit with ID ${id} not found`);
    }
    
    const updatedHabit: Habit = { 
      ...habit, 
      ...insertHabit,
    };
    
    this.habits.set(id, updatedHabit);
    return updatedHabit;
  }
  
  async updateHabitStreak(id: number, streak: number): Promise<Habit> {
    const habit = this.habits.get(id);
    if (!habit) {
      throw new Error(`Habit with ID ${id} not found`);
    }
    
    const updatedHabit: Habit = { 
      ...habit, 
      streak,
    };
    
    this.habits.set(id, updatedHabit);
    return updatedHabit;
  }
  
  async deleteHabit(id: number): Promise<void> {
    this.habits.delete(id);
    
    // Also delete all completions for this habit
    const completionsToDelete = Array.from(this.completions.values())
      .filter(completion => completion.habitId === id);
      
    for (const completion of completionsToDelete) {
      this.completions.delete(completion.id);
    }
  }
  
  // Completion methods
  async getCompletion(id: number): Promise<Completion | undefined> {
    return this.completions.get(id);
  }
  
  async getCompletionsByUserId(userId: number): Promise<Completion[]> {
    return Array.from(this.completions.values()).filter(
      (completion) => completion.userId === userId,
    );
  }
  
  async getCompletionsByHabitId(habitId: number): Promise<Completion[]> {
    return Array.from(this.completions.values()).filter(
      (completion) => completion.habitId === habitId,
    );
  }
  
  async createCompletion(userId: number, habitId: number): Promise<Completion> {
    const id = this.completionIdCounter++;
    const completion: Completion = {
      id,
      userId,
      habitId,
      completedAt: new Date(),
    };
    
    this.completions.set(id, completion);
    return completion;
  }
}

export const storage = new MemStorage();
