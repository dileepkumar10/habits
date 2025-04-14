import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isToday, isYesterday, addDays, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(dateObj)) {
    return `Today, ${format(dateObj, "MMMM d, yyyy")}`;
  } else if (isYesterday(dateObj)) {
    return `Yesterday, ${format(dateObj, "MMMM d, yyyy")}`;
  } else {
    return format(dateObj, "EEEE, MMMM d, yyyy");
  }
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export const quotes = [
  { quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
  { quote: "Habits are first cobwebs, then cables.", author: "Spanish Proverb" },
  { quote: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
  { quote: "You'll never change your life until you change something you do daily. The secret of your success is found in your daily routine.", author: "John C. Maxwell" },
  { quote: "Habits are the compound interest of self-improvement.", author: "James Clear" },
  { quote: "Good habits formed at youth make all the difference.", author: "Aristotle" },
  { quote: "Your net worth to the world is usually determined by what remains after your bad habits are subtracted from your good ones.", author: "Benjamin Franklin" },
  { quote: "We become what we repeatedly do.", author: "Sean Covey" },
  { quote: "First forget inspiration. Habit is more dependable. Habit will sustain you whether you're inspired or not.", author: "Octavia Butler" },
  { quote: "The chains of habit are too weak to be felt until they are too strong to be broken.", author: "Samuel Johnson" },
];

export function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

export function getStreakColor(streak: number): string {
  if (streak <= 0) {
    return "bg-slate-200 dark:bg-slate-900 border border-slate-300/40 dark:border-slate-800/40";
  }
  // Use green gradients for all active streaks
  return "bg-gradient-to-br from-green-300 to-green-400 dark:from-green-600 dark:to-green-700 border border-green-200 dark:border-green-800/50 shadow-sm";
}

export function generateDateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function parseFormattedDate(dateKey: string): Date {
  return parseISO(dateKey);
}
