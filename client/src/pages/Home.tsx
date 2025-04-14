import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { HabitCard } from "@/components/habits/HabitCard";
import { HabitForm } from "@/components/habits/HabitForm";
import { Button } from "@/components/ui/button";
import { CalendarView } from "@/components/calendar/CalendarView";
import { StreakCard } from "@/components/habits/StreakCard";
import { Heatmap } from "@/components/ui/heatmap";
import { NotificationCard } from "@/components/notification/NotificationCard";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Plus, Activity, Moon, Sun } from "lucide-react";
import { formatDate, getGreeting, getRandomQuote } from "@/lib/utils";
import { useHabits } from "@/hooks/use-habits";
import { useNotification } from "@/hooks/use-notification";
import { useTheme } from "@/components/ui/theme-provider";

export default function Home() {
  const { 
    habits, 
    todayProgress, 
    setShowHabitForm, 
    currentStreak, 
    longestStreak, 
    totalCompleted,
    getStreakData
  } = useHabits();

  const { 
    notifications, 
    dismissNotification, 
    completeHabitFromNotification 
  } = useNotification();

  const { theme, setTheme } = useTheme();
  const [quote, setQuote] = useState(getRandomQuote());
  const [currentDate] = useState(new Date());

  // Change quote every 24 hours
  useEffect(() => {
    const interval = setInterval(() => {
      setQuote(getRandomQuote());
    }, 24 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-slate-50 to-primary-50 text-slate-800 dark:from-slate-900 dark:to-slate-950 dark:text-slate-200 transition-colors duration-300">
      <Sidebar />

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-gradient-to-r from-white to-primary-50 dark:from-slate-800 dark:to-slate-700 backdrop-blur-md border-b border-primary-100 dark:border-slate-600/50 py-3 px-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-9 w-9 bg-gradient-primary rounded-lg flex items-center justify-center shadow-md">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gradient glow-text">HabitFlow</h1>
          </div>

          <div className="flex items-center space-x-3">
            {/* Current Streak Badge */}
            <div className="flex items-center badge-highlight px-2.5 py-1.5 rounded-full animate-pulse-soft">
              <span className="text-amber-500 mr-1.5">🔥</span>
              <span className="text-sm font-bold text-amber-800 dark:text-amber-300">{currentStreak}</span>
            </div>

            <button 
              className="rounded-full p-2 bg-white/90 dark:bg-slate-700/90 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Moon className="h-5 w-5 text-slate-600 dark:text-slate-200 dark:hidden" />
              <Sun className="h-5 w-5 text-amber-400 hidden dark:block" />
            </button>
            <UserAvatar 
              name="Alex Morgan"
              image="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces"
              className="w-9 h-9 ring-2 ring-primary-200 dark:ring-primary-700 shadow-md"
            />
          </div>
        </div>
      </div>

      <main className="flex-1 pt-20 md:pt-4 px-4 md:px-8 pb-24 md:pb-16 overflow-y-auto bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800 dark:from-slate-900 dark:to-slate-950 dark:text-slate-200 transition-colors duration-300">
        {/* Welcome Section */}
        <div className="mb-8 mt-4 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="animate-fadeIn">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 shadow-sm">
              {getGreeting()}, R S Dileepkumar 👋
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {formatDate(currentDate)}
            </p>
          </div>

          <Button 
            className="mt-4 md:mt-0 shadow-lg shadow-primary-500/30 dark:shadow-primary-900/30 transition-all duration-300 hover:scale-105"
            onClick={() => setShowHabitForm(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            <span>Add New Habit</span>
          </Button>
        </div>

        {/* Inspirational Quote */}
        <div className="mb-8 p-6 rounded-xl card-premium glow-card transform transition-all duration-500 hover:-translate-y-1 bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800 dark:from-slate-900 dark:to-slate-950 dark:text-slate-200 transition-colors duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center shadow-md flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>
            </div>
            <h3 className="font-semibold text-lg text-gradient">Daily Inspiration</h3>
          </div>

          <blockquote className="border-l-4 border-primary-400 pl-4 italic text-slate-600 dark:text-slate-300 text-lg mb-3">
            "{quote.quote}"
          </blockquote>
          <p className="text-right text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">- {quote.author}</p>
        </div>

        {/* Today's Progress */}
        <div className="mb-10 bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800 dark:from-slate-900 dark:to-slate-950 dark:text-slate-200 transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gradient">Today's Progress</h2>
            <span className="text-sm badge-highlight px-3 py-1.5 rounded-full">
              <span className="font-bold">{todayProgress.completed}</span>
              <span className="mx-1 opacity-70">/</span>
              <span>{todayProgress.total}</span>
              <span className="ml-1 font-medium">completed</span>
            </span>
          </div>

          {/* More Colorful Enhanced Progress Bar */}
          <div className="h-7 bg-gradient-to-r from-slate-200/80 to-slate-100/80 dark:from-slate-800/80 dark:to-slate-700/80 rounded-full overflow-hidden mb-8 shadow-inner p-1 backdrop-blur-sm border border-slate-300/30 dark:border-slate-600/30">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-lg transition-all duration-500 ease-in-out progress-bar-shine"
              style={{ width: `${Math.max(5, todayProgress.percentage)}%` }}
            >
              {/* Progress markers */}
              <div className="w-full h-full relative">
                <div className="absolute top-0 bottom-0 left-1/4 w-px bg-white/30"></div>
                <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/40"></div>
                <div className="absolute top-0 bottom-0 left-3/4 w-px bg-white/30"></div>

                {/* Colorful marker dots */}
                {todayProgress.percentage > 25 && (
                  <div className="absolute top-1/2 left-1/4 -translate-y-1/2 ml-0.5 z-10">
                    <div className="w-3 h-3 bg-yellow-400 dark:bg-yellow-500 rounded-full shadow-md border border-white/50 transform scale-110"></div>
                  </div>
                )}
                {todayProgress.percentage > 50 && (
                  <div className="absolute top-1/2 left-1/2 -translate-y-1/2 ml-0.5 z-10">
                    <div className="w-3 h-3 bg-green-400 dark:bg-green-500 rounded-full shadow-md border border-white/50 transform scale-110"></div>
                  </div>
                )}
                {todayProgress.percentage > 75 && (
                  <div className="absolute top-1/2 left-3/4 -translate-y-1/2 ml-0.5 z-10">
                    <div className="w-3 h-3 bg-blue-400 dark:bg-blue-500 rounded-full shadow-md border border-white/50 transform scale-110"></div>
                  </div>
                )}

                {/* Completion badge with glow */}
                {todayProgress.percentage >= 100 && (
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 animate-pulse-soft z-10">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-800">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <div className="absolute inset-0 bg-green-400/40 rounded-full blur-md -z-10 scale-125"></div>
                  </div>
                )}

                {/* Current percentage indicator */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 -right-8 bg-white dark:bg-slate-800 rounded-full px-2 py-0.5 text-xs font-bold shadow-md border border-slate-200 dark:border-slate-700 transition-all duration-500"
                >
                  {Math.round(todayProgress.percentage)}%
                </div>
              </div>
            </div>
          </div>

          {/* Colorful Percentage Indicators */}
          <div className="flex justify-between text-xs font-medium px-1 -mt-6 mb-8">
            <span className="text-slate-500 dark:text-slate-400">0%</span>
            <span className="text-yellow-600 dark:text-yellow-400">25%</span>
            <span className="text-green-600 dark:text-green-400">50%</span>
            <span className="text-blue-600 dark:text-blue-400">75%</span>
            <span className="text-pink-600 dark:text-pink-400">100%</span>
          </div>

          {/* Habits List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-fadeIn bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800 dark:from-slate-900 dark:to-slate-950 dark:text-slate-200 transition-colors duration-300">
            {habits.map((habit, index) => (
              <div
                key={habit.id}
                className="transform transition-all duration-300"
                style={{ 
                  animationDelay: `${index * 50}ms`,
                  opacity: 0,
                  animation: 'fadeSlideIn 0.5s forwards'
                }}
              >
                <HabitCard habit={habit} />
              </div>
            ))}
          </div>
        </div>

        {/* Calendar Section */}
        <div className="mb-10 animate-fadeIn" style={{ animationDelay: '300ms' }}>
          <h2 className="text-2xl font-bold mb-4">Calendar View</h2>
          <div className="p-1 bg-gradient-to-r from-primary-200 to-secondary-200 dark:from-primary-900 dark:to-secondary-900 rounded-xl shadow-lg bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800 dark:from-slate-900 dark:to-slate-950 dark:text-slate-200 transition-colors duration-300">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
              <CalendarView />
            </div>
          </div>
        </div>

        {/* Streak Stats */}
        <div className="mb-8 animate-fadeIn" style={{ animationDelay: '400ms' }}>
          <h2 className="text-2xl font-bold mb-4">Habit Streaks</h2>

          <div className="card-premium p-6 glow-card transform transition-all duration-500 hover:-translate-y-1 hover:scale-[1.01] overflow-visible bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800 dark:from-slate-900 dark:to-slate-950 dark:text-slate-200 transition-colors duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-lg text-gradient">Activity Heatmap</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Last 3 months of habit tracking</p>
              </div>
              <div className="flex items-center space-x-2 mt-2 sm:mt-0 bg-slate-100/80 dark:bg-slate-800/80 p-2 rounded-lg shadow-sm backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Less</span>
                <div className="w-3 h-3 rounded-sm bg-primary-100 dark:bg-primary-900/70"></div>
                <div className="w-3 h-3 rounded-sm bg-primary-200 dark:bg-primary-800/70"></div>
                <div className="w-3 h-3 rounded-sm bg-primary-300 dark:bg-primary-700/70"></div>
                <div className="w-3 h-3 rounded-sm bg-primary-400 dark:bg-primary-600/70"></div>
                <div className="w-3 h-3 rounded-sm bg-gradient-to-br from-primary-500 to-secondary-500 shadow-sm"></div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">More</span>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-3 right-3 w-24 h-24 bg-gradient-to-br from-primary-100/20 to-transparent dark:from-primary-900/10 rounded-full blur-2xl -z-10"></div>
            <div className="absolute bottom-5 left-10 w-16 h-16 bg-gradient-to-br from-secondary-100/20 to-transparent dark:from-secondary-900/10 rounded-full blur-xl -z-10"></div>

            {/* Highlight today's date */}
            <div className="mb-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800/30 inline-flex items-center shadow-sm">
              <span className="text-xs text-amber-700 dark:text-amber-300 font-medium mr-1">Today</span>
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
            </div>

            <div className="mt-4 relative">
              <Heatmap data={getStreakData()} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-5">
            <StreakCard
              title="Current Streak"
              count={currentStreak}
              unit="days"
              description="Keep going strong!"
            />
            <StreakCard
              title="Longest Streak"
              count={longestStreak}
              unit="days"
              description="Your personal best!"
            />
            <StreakCard
              title="Total Completed"
              count={totalCompleted}
              unit="tasks"
              description="Since you started"
            />
          </div>
        </div>
      </main>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed bottom-4 right-4 z-30 flex flex-col space-y-3 max-w-sm bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800 dark:from-slate-900 dark:to-slate-950 dark:text-slate-200 transition-colors duration-300">
          {notifications.map(notification => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onDismiss={dismissNotification}
              onComplete={completeHabitFromNotification}
            />
          ))}
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Forms */}
      <HabitForm />
    </div>
  );
}