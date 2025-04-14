import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { generateId, generateDateKey } from "@/lib/utils";
import { Habit } from "@/types/habit";

interface CompletionHistory {
  [date: string]: string[]; // date -> habit ids completed
}

interface HabitContextType {
  habits: Habit[];
  completionHistory: CompletionHistory;
  currentStreak: number;
  longestStreak: number;
  totalCompleted: number;
  todayProgress: {
    completed: number;
    total: number;
    percentage: number;
  };
  showHabitForm: boolean;
  setShowHabitForm: (show: boolean) => void;
  addHabit: (habit: Habit) => void;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (id: string) => void;
  toggleHabitCompletion: (id: string) => void;
  editingHabit: Habit | null;
  editHabit: (id: string) => void;
  getHabitsByDate: (date: string) => Habit[];
  getStreakData: () => number[][];
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

const SAMPLE_HABITS: Habit[] = [
  // Health & Hydration Habits
  {
    id: "habit-1",
    name: "Drink 8 glasses of water",
    icon: "💧",
    tag: "Health",
    completed: true,
    streak: 15,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "habit-5",
    name: "No caffeine after 2pm",
    icon: "☕",
    tag: "Health",
    completed: false,
    streak: 3,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "habit-7",
    name: "Take vitamins",
    icon: "💊",
    tag: "Health",
    completed: true,
    streak: 30,
    createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
  },

  // Fitness & Workout Habits
  {
    id: "habit-3",
    name: "30 min cardio",
    icon: "🏃",
    tag: "Fitness",
    completed: false,
    streak: 5,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "habit-11",
    name: "Evening stretching",
    icon: "🤸",
    tag: "Fitness",
    completed: true,
    streak: 11,
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "habit-13",
    name: "Upper body workout",
    icon: "💪",
    tag: "Fitness",
    completed: false,
    streak: 7,
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "habit-14",
    name: "Leg day",
    icon: "🦵",
    tag: "Fitness",
    completed: false,
    streak: 4,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "habit-15",
    name: "10,000 steps",
    icon: "👣",
    tag: "Fitness",
    completed: true,
    streak: 9,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },

  // Sleep Habits
  {
    id: "habit-16",
    name: "Sleep by 11PM",
    icon: "😴",
    tag: "Sleep",
    completed: false,
    streak: 2,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "habit-17",
    name: "No screens before bed",
    icon: "📵",
    tag: "Sleep",
    completed: false,
    streak: 5,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "habit-18",
    name: "Morning alarm - no snooze",
    icon: "⏰",
    tag: "Sleep",
    completed: true,
    streak: 12,
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
  },

  // Mindfulness & Learning Habits
  {
    id: "habit-2",
    name: "Read for 30 minutes",
    icon: "📚",
    tag: "Learning",
    completed: true,
    streak: 21,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "habit-4",
    name: "Write in journal",
    icon: "📝",
    tag: "Mindfulness",
    completed: false,
    streak: 12,
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "habit-6",
    name: "Meditate for 10 minutes",
    icon: "🧘",
    tag: "Mindfulness",
    completed: true,
    streak: 19,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },

  // Other Habits
  {
    id: "habit-8",
    name: "Practice guitar",
    icon: "🎸",
    tag: "Creativity",
    completed: false,
    streak: 8,
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "habit-9",
    name: "Save $10",
    icon: "💰",
    tag: "Finance",
    completed: true,
    streak: 14,
    createdAt: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "habit-10",
    name: "Call a friend",
    icon: "📱",
    tag: "Social",
    completed: false,
    streak: 4,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "habit-12",
    name: "No social media after 9pm",
    icon: "🔕",
    tag: "Productivity",
    completed: false,
    streak: 6,
    createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

export const HabitProvider = ({ children }: { children: ReactNode }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completionHistory, setCompletionHistory] = useState<CompletionHistory>({});
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [totalCompleted, setTotalCompleted] = useState(0);

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedHabits = localStorage.getItem("habits");
    const savedCompletionHistory = localStorage.getItem("completionHistory");

    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    } else {
      // Use sample habits if no saved habits exist
      setHabits(SAMPLE_HABITS);
    }

    if (savedCompletionHistory) {
      setCompletionHistory(JSON.parse(savedCompletionHistory));
    } else {
      // Generate sample completion history for the last 90 days
      const sampleHistory: CompletionHistory = {};
      const today = new Date();
      
      for (let i = 0; i < 90; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateKey = generateDateKey(date);
        
        const month = date.getMonth();
        const dayOfWeek = date.getDay();
        
        // March and April specific patterns
        if (month === 2 || month === 3) { // March (2) and April (3)
          const currentYear = new Date().getFullYear();
          // More frequent completions for April
          if (month === 3) {
            const dayNum = date.getDate();
            
            // First week - alternating perfect and high completion
            if (dayNum <= 7) {
              if (dayNum % 2 === 0) {
                sampleHistory[dateKey] = SAMPLE_HABITS.map(h => h.id);
              } else {
                sampleHistory[dateKey] = SAMPLE_HABITS.slice(0, Math.max(4, SAMPLE_HABITS.length - 1)).map(h => h.id);
              }
            }
            // Second week - weekday completion
            else if (dayNum <= 14 && dayOfWeek !== 0 && dayOfWeek !== 6) {
              sampleHistory[dateKey] = SAMPLE_HABITS.slice(0, 3).map(h => h.id);
            }
            // Third week - random high completion
            else if (dayNum <= 21 && Math.random() > 0.3) {
              sampleHistory[dateKey] = SAMPLE_HABITS.slice(0, Math.floor(Math.random() * 3) + 3).map(h => h.id);
            }
            // Last week - some completion on specific days
            else if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) {
              sampleHistory[dateKey] = SAMPLE_HABITS.slice(0, 2).map(h => h.id);
            }
          } else {
            // March patterns
            if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) {
              sampleHistory[dateKey] = SAMPLE_HABITS.map(h => h.id);
            } else if (dayOfWeek === 2 || dayOfWeek === 4) {
              sampleHistory[dateKey] = SAMPLE_HABITS.slice(0, 3).map(h => h.id);
            } else if (dayOfWeek === 6) {
              sampleHistory[dateKey] = SAMPLE_HABITS.slice(0, 4).map(h => h.id);
            } else {
              sampleHistory[dateKey] = SAMPLE_HABITS.slice(0, 2).map(h => h.id);
            }
          }
        } else if (i === 0) {
          // Current day - partial completion
          sampleHistory[dateKey] = SAMPLE_HABITS.slice(0, 3).map(h => h.id);
        } else if (Math.random() > 0.4) {
          // Random completions for other months
          const numCompletions = Math.floor(Math.random() * 4) + 1;
          sampleHistory[dateKey] = SAMPLE_HABITS.slice(0, numCompletions).map(h => h.id);
        }
      }
      
      setCompletionHistory(sampleHistory);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (habits.length > 0) {
      localStorage.setItem("habits", JSON.stringify(habits));
    }

    if (Object.keys(completionHistory).length > 0) {
      localStorage.setItem("completionHistory", JSON.stringify(completionHistory));
    }

    // Calculate stats
    calculateStats();
  }, [habits, completionHistory]);

  // Calculate streaks and total completed
  const calculateStats = () => {
    // Calculate current streak
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i <= 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = generateDateKey(date);

      const completedHabits = completionHistory[dateKey] || [];

      if (completedHabits.length > 0) {
        streak++;
      } else if (i > 0) { // Don't break streak for today
        break;
      }
    }

    // Calculate longest streak
    let longest = 0;
    let current = 0;

    // Sort dates in ascending order
    const dates = Object.keys(completionHistory).sort();

    for (let i = 0; i < dates.length; i++) {
      if (completionHistory[dates[i]].length > 0) {
        current++;
        longest = Math.max(longest, current);
      } else {
        current = 0;
      }
    }

    // Calculate total completed
    let total = 0;
    Object.values(completionHistory).forEach(completed => {
      total += completed.length;
    });

    setCurrentStreak(streak);
    setLongestStreak(longest);
    setTotalCompleted(total);
  };

  // Add a new habit
  const addHabit = (habit: Habit) => {
    setHabits([...habits, habit]);
  };

  // Update an existing habit
  const updateHabit = (updatedHabit: Habit) => {
    setHabits(habits.map(habit => 
      habit.id === updatedHabit.id ? updatedHabit : habit
    ));
    setEditingHabit(null);
  };

  // Delete a habit
  const deleteHabit = (id: string) => {
    setHabits(habits.filter(habit => habit.id !== id));

    // Remove the habit from completion history
    const updatedHistory = { ...completionHistory };
    Object.keys(updatedHistory).forEach(date => {
      updatedHistory[date] = updatedHistory[date].filter(habitId => habitId !== id);
    });

    setCompletionHistory(updatedHistory);
  };

  // Toggle habit completion for today
  const toggleHabitCompletion = (id: string) => {
    const today = generateDateKey(new Date());

    const newHabits = habits.map(habit => {
      if (habit.id === id) {
        const todayCompletions = completionHistory[today] || [];
        const isCompleted = todayCompletions.includes(id);

        // Toggle completion status
        return {
          ...habit,
          completed: !isCompleted,
          streak: !isCompleted ? habit.streak + 1 : Math.max(0, habit.streak - 1),
        };
      }
      return habit;
    });

    setHabits(newHabits);

    // Update completion history
    const todayCompletions = completionHistory[today] || [];
    const isCompleted = todayCompletions.includes(id);

    if (isCompleted) {
      // Remove habit from today's completions
      setCompletionHistory({
        ...completionHistory,
        [today]: todayCompletions.filter(habitId => habitId !== id),
      });
    } else {
      // Add habit to today's completions
      setCompletionHistory({
        ...completionHistory,
        [today]: [...todayCompletions, id],
      });
    }
  };

  // Set a habit for editing
  const editHabit = (id: string) => {
    const habitToEdit = habits.find(habit => habit.id === id);
    if (habitToEdit) {
      setEditingHabit(habitToEdit);
      setShowHabitForm(true);
    }
  };

  // Get habits by date
  const getHabitsByDate = (dateKey: string) => {
    const completedHabitIds = completionHistory[dateKey] || [];
    return habits.map(habit => ({
      ...habit,
      completed: completedHabitIds.includes(habit.id),
    }));
  };

  // Get streak data for heatmap with sample data for visualization
  const getStreakData = () => {
    const data: number[][] = [];
    const today = new Date();

    // Create 13 weeks of data (91 days)
    for (let w = 0; w < 13; w++) {
      const week: number[] = [];

      for (let d = 0; d < 7; d++) {
        const date = new Date(today);
        const daysToSubtract = w * 7 + (6 - d);
        date.setDate(date.getDate() - daysToSubtract);

        const dateKey = generateDateKey(date);
        let completedHabits = completionHistory[dateKey]?.length || 0;

        // Add sample data for better visualization
        const dayOfWeek = date.getDay(); // 0-6, 0 is Sunday
        const weekNumber = Math.floor(daysToSubtract / 7);

        // All habits completed (5 habits)
        if (weekNumber === 1 && (dayOfWeek === 2 || dayOfWeek === 4)) {
          completedHabits = 5;
        }

        // Some habits completed (2-3 habits)
        if (weekNumber === 2 && (dayOfWeek === 1 || dayOfWeek === 3)) {
          completedHabits = Math.floor(Math.random() * 2) + 2;
        }

        // Multiple habits completed (4 habits)
        if (weekNumber === 0 && (dayOfWeek === 1 || dayOfWeek === 5)) {
          completedHabits = 4;
        }

        // Random pattern for older dates
        if (weekNumber > 2 && Math.random() > 0.6) {
          completedHabits = Math.floor(Math.random() * 5) + 1;
        }

        week.push(completedHabits);
      }

      data.push(week);
    }

    return data;
  };

  // Calculate today's progress
  const todayDateKey = generateDateKey(new Date());
  const todayCompletions = completionHistory[todayDateKey] || [];
  const todayProgress = {
    completed: todayCompletions.length,
    total: habits.length,
    percentage: habits.length > 0 ? (todayCompletions.length / habits.length) * 100 : 0,
  };

  return (
    <HabitContext.Provider 
      value={{
        habits,
        completionHistory,
        currentStreak,
        longestStreak,
        totalCompleted,
        todayProgress,
        showHabitForm,
        setShowHabitForm,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleHabitCompletion,
        editingHabit,
        editHabit,
        getHabitsByDate,
        getStreakData,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error("useHabits must be used within a HabitProvider");
  }
  return context;
};