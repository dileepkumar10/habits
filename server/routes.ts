import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertHabitSchema, insertCompletionSchema, insertUserSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(userData);
      res.status(201).json({ id: user.id, username: user.username });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  // Habit routes
  app.get("/api/habits", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const habits = await storage.getHabitsByUserId(userId);
      res.json(habits);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch habits" });
    }
  });
  
  app.post("/api/habits", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const habitData = insertHabitSchema.parse(req.body);
      const habit = await storage.createHabit(userId, habitData);
      res.status(201).json(habit);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to create habit" });
    }
  });
  
  app.put("/api/habits/:id", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const habitId = parseInt(req.params.id);
      const habitData = insertHabitSchema.parse(req.body);
      
      const existingHabit = await storage.getHabit(habitId);
      if (!existingHabit || existingHabit.userId !== userId) {
        return res.status(404).json({ message: "Habit not found" });
      }
      
      const updatedHabit = await storage.updateHabit(habitId, habitData);
      res.json(updatedHabit);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to update habit" });
    }
  });
  
  app.delete("/api/habits/:id", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const habitId = parseInt(req.params.id);
      
      const existingHabit = await storage.getHabit(habitId);
      if (!existingHabit || existingHabit.userId !== userId) {
        return res.status(404).json({ message: "Habit not found" });
      }
      
      await storage.deleteHabit(habitId);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete habit" });
    }
  });
  
  // Completion routes
  app.post("/api/completions", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const completionData = insertCompletionSchema.parse(req.body);
      
      const habit = await storage.getHabit(completionData.habitId);
      if (!habit || habit.userId !== userId) {
        return res.status(404).json({ message: "Habit not found" });
      }
      
      const completion = await storage.createCompletion(userId, completionData.habitId);
      
      // Update streak
      await storage.updateHabitStreak(completionData.habitId, habit.streak + 1);
      
      res.status(201).json(completion);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to create completion" });
    }
  });
  
  app.get("/api/completions", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const completions = await storage.getCompletionsByUserId(userId);
      res.json(completions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch completions" });
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
