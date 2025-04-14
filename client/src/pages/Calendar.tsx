
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { CalendarView } from "@/components/calendar/CalendarView";
import { HabitForm } from "@/components/habits/HabitForm";
import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useHabits } from "@/hooks/use-habits";
import { useTheme } from "@/components/ui/theme-provider";
import { Calendar as CalendarIcon, Moon, Sun, Sparkles } from "lucide-react";

export default function Calendar() {
  const { theme, setTheme } = useTheme();
  const { currentStreak } = useHabits();
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-slate-50 to-primary-50 text-slate-800 dark:from-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-200 transition-all duration-500">
      <Sidebar />
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-primary-100 dark:border-slate-800 py-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center transform hover:rotate-12 transition-all duration-300">
              <CalendarIcon className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 text-transparent bg-clip-text">Calendar</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-gradient-to-r from-amber-100 to-primary-100 dark:from-amber-900/60 dark:to-primary-900/60 px-3 py-1.5 rounded-full border border-amber-200/50 dark:border-amber-800/50 shadow-inner">
              <Sparkles className="h-4 w-4 text-amber-500 mr-2" />
              <span className="text-base font-semibold text-amber-800 dark:text-amber-300">{currentStreak} days</span>
            </div>
            
            <button 
              className="rounded-full p-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Moon className="h-5 w-5 text-slate-600 dark:text-slate-200 dark:hidden" />
              <Sun className="h-5 w-5 text-amber-400 hidden dark:block" />
            </button>
            <UserAvatar 
              name="Alex Morgan"
              image="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces"
              className="w-9 h-9 ring-2 ring-white dark:ring-slate-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
            />
          </div>
        </div>
      </div>
      
      <main className="flex-1 pt-20 md:pt-8 px-4 md:px-8 pb-24 md:pb-16 overflow-y-auto">
        {/* Header */}
        <div className="mb-8 mt-4">
          <div className="flex items-center space-x-4 mb-3">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 via-indigo-500 to-purple-600 dark:from-violet-400 dark:via-indigo-300 dark:to-purple-400 text-transparent bg-clip-text animate-gradient">Calendar View</h1>
            <div className="h-px flex-1 bg-gradient-to-r from-violet-200 to-purple-200 dark:from-violet-800 dark:to-purple-800"></div>
          </div>
          <p className="text-lg bg-gradient-to-r from-violet-700 to-purple-700 dark:from-violet-300 dark:to-purple-300 text-transparent bg-clip-text font-semibold">
            Track your habit streaks and patterns over time
          </p>
        </div>
        
        {/* Calendar Section */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-primary-500/10 rounded-2xl blur-3xl"></div>
          <div className="relative p-1 bg-gradient-to-r from-primary-200 via-secondary-200 to-primary-200 dark:from-primary-900 dark:via-secondary-900 dark:to-primary-900 rounded-2xl shadow-2xl">
            <div className="bg-white/95 dark:bg-slate-900/95 rounded-xl p-6 backdrop-blur-xl">
              <CalendarView />
            </div>
          </div>
        </div>
        
        {/* Calendar Legend */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-violet-600 via-indigo-500 to-purple-600 dark:from-violet-400 dark:via-indigo-300 dark:to-purple-400 text-transparent bg-clip-text animate-gradient">Legend</h2>
          <Card className="bg-white/50 dark:bg-slate-800/50 border border-violet-100/50 dark:border-violet-700/50 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4 group hover:scale-105 transition-transform duration-300 ease-out">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 dark:from-green-500 dark:to-emerald-600 shadow-lg group-hover:shadow-green-500/40 transition-all duration-300 flex items-center justify-center">
                    <div className="text-white text-lg">✓</div>
                  </div>
                  <div>
                    <span className="text-base font-semibold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 text-transparent bg-clip-text">All habits completed</span>
                    <p className="text-sm text-slate-500 dark:text-slate-400">5/5 habits done</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 group hover:scale-105 transition-transform duration-300 ease-out">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 dark:from-amber-500 dark:to-orange-600 shadow-lg group-hover:shadow-amber-500/40 transition-all duration-300 flex items-center justify-center">
                    <div className="text-white text-lg">◐</div>
                  </div>
                  <div>
                    <span className="text-base font-semibold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 text-transparent bg-clip-text">Some habits completed</span>
                    <p className="text-sm text-slate-500 dark:text-slate-400">2-3 habits done</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 group hover:scale-105 transition-transform duration-300 ease-out">
                  <div className="w-12 h-12 rounded-xl ring-2 ring-blue-500 dark:ring-blue-400 bg-blue-100 dark:bg-blue-900/50 shadow-lg group-hover:shadow-blue-500/40 transition-all duration-300 flex items-center justify-center animate-pulse">
                    <div className="text-blue-600 dark:text-blue-400 text-lg">★</div>
                  </div>
                  <div>
                    <span className="text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-transparent bg-clip-text">Current day</span>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Today's progress</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 group hover:scale-105 transition-transform duration-300 ease-out">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 dark:from-violet-500 dark:to-purple-600 shadow-lg group-hover:shadow-purple-500/40 transition-all duration-300 flex items-center justify-center">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-white animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-white animate-bounce delay-100"></div>
                      <div className="w-2 h-2 rounded-full bg-white animate-bounce delay-200"></div>
                    </div>
                  </div>
                  <div>
                    <span className="text-base font-semibold bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 text-transparent bg-clip-text">Multiple habits completed</span>
                    <p className="text-sm text-slate-500 dark:text-slate-400">4+ habits done</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <MobileNav />
      <HabitForm />
    </div>
  );
}
