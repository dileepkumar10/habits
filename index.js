// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  habits;
  completions;
  userIdCounter;
  habitIdCounter;
  completionIdCounter;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.habits = /* @__PURE__ */ new Map();
    this.completions = /* @__PURE__ */ new Map();
    this.userIdCounter = 1;
    this.habitIdCounter = 1;
    this.completionIdCounter = 1;
  }
  // User methods
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.userIdCounter++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  // Habit methods
  async getHabit(id) {
    return this.habits.get(id);
  }
  async getHabitsByUserId(userId) {
    return Array.from(this.habits.values()).filter(
      (habit) => habit.userId === userId
    );
  }
  async createHabit(userId, insertHabit) {
    const id = this.habitIdCounter++;
    const habit = {
      ...insertHabit,
      id,
      userId,
      streak: 0,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.habits.set(id, habit);
    return habit;
  }
  async updateHabit(id, insertHabit) {
    const habit = this.habits.get(id);
    if (!habit) {
      throw new Error(`Habit with ID ${id} not found`);
    }
    const updatedHabit = {
      ...habit,
      ...insertHabit
    };
    this.habits.set(id, updatedHabit);
    return updatedHabit;
  }
  async updateHabitStreak(id, streak) {
    const habit = this.habits.get(id);
    if (!habit) {
      throw new Error(`Habit with ID ${id} not found`);
    }
    const updatedHabit = {
      ...habit,
      streak
    };
    this.habits.set(id, updatedHabit);
    return updatedHabit;
  }
  async deleteHabit(id) {
    this.habits.delete(id);
    const completionsToDelete = Array.from(this.completions.values()).filter((completion) => completion.habitId === id);
    for (const completion of completionsToDelete) {
      this.completions.delete(completion.id);
    }
  }
  // Completion methods
  async getCompletion(id) {
    return this.completions.get(id);
  }
  async getCompletionsByUserId(userId) {
    return Array.from(this.completions.values()).filter(
      (completion) => completion.userId === userId
    );
  }
  async getCompletionsByHabitId(habitId) {
    return Array.from(this.completions.values()).filter(
      (completion) => completion.habitId === habitId
    );
  }
  async createCompletion(userId, habitId) {
    const id = this.completionIdCounter++;
    const completion = {
      id,
      userId,
      habitId,
      completedAt: /* @__PURE__ */ new Date()
    };
    this.completions.set(id, completion);
    return completion;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var habits = pgTable("habits", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  tag: text("tag").notNull(),
  streak: integer("streak").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var completions = pgTable("completions", {
  id: serial("id").primaryKey(),
  habitId: integer("habit_id").references(() => habits.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  completedAt: timestamp("completed_at").defaultNow().notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var insertHabitSchema = createInsertSchema(habits).pick({
  name: true,
  icon: true,
  tag: true
});
var insertCompletionSchema = createInsertSchema(completions).pick({
  habitId: true
});

// server/routes.ts
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
async function registerRoutes(app2) {
  app2.post("/api/auth/register", async (req, res) => {
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
  app2.get("/api/habits", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const habits2 = await storage.getHabitsByUserId(userId);
      res.json(habits2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch habits" });
    }
  });
  app2.post("/api/habits", async (req, res) => {
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
  app2.put("/api/habits/:id", async (req, res) => {
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
  app2.delete("/api/habits/:id", async (req, res) => {
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
  app2.post("/api/completions", async (req, res) => {
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
      await storage.updateHabitStreak(completionData.habitId, habit.streak + 1);
      res.status(201).json(completion);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to create completion" });
    }
  });
  app2.get("/api/completions", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const completions2 = await storage.getCompletionsByUserId(userId);
      res.json(completions2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch completions" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  base: process.env.NODE_ENV === "production" ? "/habits/" : "/",
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
    assetsDir: "assets",
    rollupOptions: {
      input: {
        main: path.resolve(import.meta.dirname, "client", "index.html")
      }
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
