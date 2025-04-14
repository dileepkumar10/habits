import { Link, useLocation } from "wouter";
import { useTheme } from "@/components/ui/theme-provider";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Moon, Sun, LayoutDashboard, Calendar, BarChart2, Settings, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHabits } from "@/hooks/use-habits";

export function Sidebar() {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const { currentStreak } = useHabits();
  
  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Calendar", href: "/calendar", icon: Calendar },
    { name: "Analytics", href: "/analytics", icon: BarChart2 },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="md:w-64 md:flex-shrink-0 border-r border-slate-200 dark:border-slate-700 md:h-screen hidden md:block md:sticky top-0 z-10 bg-white dark:bg-slate-800 bg-opacity-25 backdrop-blur-[10px] dark:bg-opacity-75">
      <div className="p-4 flex flex-col h-full">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center relative overflow-hidden group">
              <Activity className="h-5 w-5 text-white animate-run transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <Activity className="h-5 w-5 text-white absolute animate-run transform translate-x-0 group-hover:-translate-x-full transition-transform duration-1000" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text shadow-sm">HabitFlow</h1>
          </div>
          <button 
            className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Moon className="h-5 w-5 text-slate-600 dark:text-slate-200 dark:hidden" />
            <Sun className="h-5 w-5 text-slate-200 hidden dark:block" />
          </button>
        </div>
        
        <nav className="mb-auto">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link href={item.href}>
                    <div className={cn(
                      "flex items-center p-3 rounded-lg transition-colors cursor-pointer",
                      isActive 
                        ? "bg-primary-50 dark:bg-primary-800/30 text-primary-700 dark:text-primary-200 font-medium" 
                        : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200"
                    )}>
                      <Icon className="mr-3 h-5 w-5" />
                      <span>{item.name}</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* Streak Display */}
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-800/50 dark:to-secondary-700/30 border border-primary-200 dark:border-primary-700 animate-[pulse_2s_infinite]">
          <h3 className="text-sm text-primary-800 dark:text-primary-200 uppercase font-semibold tracking-wide">Current Streak</h3>
          <div className="flex items-center mt-1 space-x-2">
            <span className="text-amber-400 h-6 w-6">🔥</span>
            <span className="text-2xl font-bold text-primary-800 dark:text-primary-200">{currentStreak} days</span>
          </div>
          <p className="text-xs text-primary-600 dark:text-primary-300 mt-1">Keep it up! You're doing great!</p>
        </div>
        
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <UserAvatar 
              name="R S Dileepkumar"
              image="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces"
              className="w-10 h-10"
            />
            <div className="ml-3">
              <p className="text-sm font-medium">R S Dileepkumar</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Premium User</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
