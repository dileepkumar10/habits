import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { HabitForm } from "@/components/habits/HabitForm";
import { Card, CardContent } from "@/components/ui/card";
import { StreakCard } from "@/components/habits/StreakCard";
import { Heatmap } from "@/components/ui/heatmap";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useHabits } from "@/hooks/use-habits";
import { useTheme } from "@/components/ui/theme-provider";
import { BarChart2, Moon, Sun } from "lucide-react";

export default function Analytics() {
  const { habits, currentStreak, longestStreak, totalCompleted, getStreakData } = useHabits();
  const { theme, setTheme } = useTheme();
  
  // Sort habits by streak (highest first)
  const sortedHabits = [...habits].sort((a, b) => b.streak - a.streak);
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-slate-50 to-primary-50 text-slate-800 dark:from-slate-900 dark:to-slate-950 dark:text-slate-200 transition-colors duration-300">
      <Sidebar />
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-gradient-to-r from-white to-primary-50 dark:from-slate-800 dark:to-slate-800 bg-opacity-95 dark:bg-opacity-95 backdrop-blur-md border-b border-primary-100 dark:border-slate-700 py-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <BarChart2 className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 text-transparent bg-clip-text">Analytics</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Current Streak Badge */}
            <div className="flex items-center bg-gradient-to-r from-amber-100 to-primary-100 dark:from-amber-900/60 dark:to-primary-900/60 px-2 py-1 rounded-full border border-amber-200 dark:border-amber-800">
              <span className="text-amber-500 mr-1">🔥</span>
              <span className="text-sm font-semibold text-amber-800 dark:text-amber-300">{currentStreak}</span>
            </div>
            
            <button 
              className="rounded-full p-2 bg-white/80 dark:bg-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors shadow-sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Moon className="h-5 w-5 text-slate-600 dark:text-slate-200 dark:hidden" />
              <Sun className="h-5 w-5 text-amber-400 hidden dark:block" />
            </button>
            <UserAvatar 
              name="R S Dileepkumar"
              image="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces"
              className="w-8 h-8 ring-2 ring-white dark:ring-slate-700"
            />
          </div>
        </div>
      </div>
      
      <main className="flex-1 pt-20 md:pt-4 px-4 md:px-8 pb-24 md:pb-16 overflow-y-auto">
        {/* Header */}
        <div className="mb-8 mt-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text shadow-sm">Analytics Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-300">
            View detailed insights and progress on your habits
          </p>
        </div>
        
        {/* Streak Overview */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 transform-gpu">
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
        
        {/* Activity Heatmap */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300">Activity Heatmap</h2>
            <button 
              onClick={() => window.print()} 
              className="px-4 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-lg transition-colors duration-200 flex items-center gap-2 transform-gpu"
            >
              <svg className="w-4 h-4" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              Download PDF
            </button>
          </div>
          <div className="p-1 bg-gradient-to-r from-primary-200 to-secondary-200 dark:from-primary-900 dark:to-secondary-900 rounded-xl shadow-lg">
            <Card className="bg-white dark:bg-slate-800 border-none bg-opacity-95 dark:bg-opacity-95 backdrop-blur-[10px] rounded-lg">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium text-blue-800 dark:text-blue-300">Your Activity Over Time</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Last 3 months of activity</p>
                  </div>
                  <div className="flex items-center space-x-2 mt-2 sm:mt-0 bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Less</span>
                    <div className="w-3 h-3 rounded-sm bg-primary-100 dark:bg-primary-900"></div>
                    <div className="w-3 h-3 rounded-sm bg-primary-200 dark:bg-primary-800"></div>
                    <div className="w-3 h-3 rounded-sm bg-primary-300 dark:bg-primary-700"></div>
                    <div className="w-3 h-3 rounded-sm bg-primary-400 dark:bg-primary-600"></div>
                    <div className="w-3 h-3 rounded-sm bg-primary-500"></div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">More</span>
                  </div>
                </div>
                
                <Heatmap data={getStreakData()} />
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Top Habits */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary-700 dark:text-primary-300">Your Top Habits</h2>
          <div className="p-1 bg-gradient-to-r from-primary-200 to-secondary-200 dark:from-primary-900 dark:to-secondary-900 rounded-xl shadow-lg">
            <Card className="bg-white dark:bg-slate-800 border-none bg-opacity-95 dark:bg-opacity-95 backdrop-blur-[10px] rounded-lg">
              <CardContent className="p-5">
                <div className="space-y-4">
                  {sortedHabits.slice(0, 5).map((habit, index) => (
                    <div 
                      key={habit.id} 
                      className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3 last:border-0 hover:bg-primary-50/50 dark:hover:bg-primary-900/20 p-2 rounded-lg transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 text-primary-800 dark:text-primary-200 font-semibold shadow-sm">
                          {index + 1}
                        </div>
                        <div className="ml-3">
                          <div className="flex items-center">
                            <span className="text-xl mr-2">{habit.icon}</span>
                            <h3 className="font-medium text-primary-800 dark:text-primary-200">{habit.name}</h3>
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{habit.tag}</p>
                        </div>
                      </div>
                      <div className="flex items-center bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-amber-800/20 text-amber-800 dark:text-amber-200 px-3 py-1.5 rounded-full shadow-sm border border-amber-200 dark:border-amber-800/50">
                        <span className="text-amber-500 mr-1">🔥</span>
                        <span className="font-semibold">{habit.streak} day streak</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Categories Distribution */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary-700 dark:text-primary-300">Categories Distribution</h2>
          <div className="p-1 bg-gradient-to-r from-primary-200 to-secondary-200 dark:from-primary-900 dark:to-secondary-900 rounded-xl shadow-lg">
            <Card className="bg-white dark:bg-slate-800 border-none bg-opacity-95 dark:bg-opacity-95 backdrop-blur-[10px] rounded-lg">
              <CardContent className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from(new Set(habits.map(h => h.tag))).map(tag => {
                    const count = habits.filter(h => h.tag === tag).length;
                    const percentage = Math.round((count / habits.length) * 100);
                    
                    return (
                      <div key={tag} className="flex flex-col p-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 rounded-lg transition-colors">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-green-500 dark:bg-green-600 mr-2"></div>
                            <span className="font-medium text-slate-800 dark:text-slate-200">{tag}</span>
                          </div>
                          <span className="text-sm font-semibold px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200">{percentage}%</span>
                        </div>
                        <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                          <div
                            className="h-full bg-green-500 dark:bg-green-600 rounded-full shadow-lg"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      {/* Mobile Bottom Navigation */}
      <MobileNav />
      
      {/* Forms */}
      <HabitForm />
    </div>
  );
}
