import { Link, useLocation } from "wouter";
import { LayoutDashboard, Calendar, BarChart2, Settings, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHabits } from "@/hooks/use-habits";

export function MobileNav() {
  const [location] = useLocation();
  const { setShowHabitForm } = useHabits();
  
  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Calendar", href: "/calendar", icon: Calendar },
    { name: "Add", href: "#", icon: Plus, action: () => setShowHabitForm(true) },
    { name: "Analytics", href: "/analytics", icon: BarChart2 },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 z-20 bg-opacity-25 backdrop-blur-[10px] dark:bg-opacity-75">
      <div className="flex justify-between items-center">
        {navigation.map((item) => {
          const isActive = location === item.href && item.name !== "Add";
          const isAddButton = item.name === "Add";
          
          if (isAddButton) {
            return (
              <button 
                key={item.name}
                onClick={item.action}
                className="flex-1 flex flex-col items-center p-3 relative"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-full flex items-center justify-center -mt-6 shadow-lg shadow-primary-500/30">
                  <item.icon className="h-6 w-6 text-white" />
                </div>
              </button>
            );
          }
          
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href}>
              <div className={cn(
                "flex-1 flex flex-col items-center p-3 cursor-pointer",
                isActive 
                  ? "text-primary-600 dark:text-primary-400" 
                  : "text-slate-500 dark:text-slate-400"
              )}>
                <Icon className="h-6 w-6" />
                <span className="text-xs mt-1">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
