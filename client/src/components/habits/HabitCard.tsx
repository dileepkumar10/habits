import { Switch } from "@/components/ui/switch";
import { MoreVertical, Flame } from "lucide-react";
import { Habit } from "@/types/habit";
import { cn } from "@/lib/utils";
import { useHabits } from "@/hooks/use-habits";

interface HabitCardProps {
  habit: Habit;
}

const TAG_COLORS = {
  Health: "bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800",
  Fitness: "bg-gradient-to-r from-green-100 to-green-50 dark:from-green-900 dark:to-green-800 text-green-600 dark:text-green-300 border border-green-200 dark:border-green-800",
  Learning: "bg-gradient-to-r from-violet-100 to-violet-50 dark:from-violet-900 dark:to-violet-800 text-violet-600 dark:text-violet-300 border border-violet-200 dark:border-violet-800",
  Mindfulness: "bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-900 dark:to-amber-800 text-amber-600 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
  Productivity: "bg-gradient-to-r from-orange-100 to-orange-50 dark:from-orange-900 dark:to-orange-800 text-orange-600 dark:text-orange-300 border border-orange-200 dark:border-orange-800",
  Nutrition: "bg-gradient-to-r from-emerald-100 to-emerald-50 dark:from-emerald-900 dark:to-emerald-800 text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
  Sleep: "bg-gradient-to-r from-indigo-100 to-indigo-50 dark:from-indigo-900 dark:to-indigo-800 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800",
  Creativity: "bg-gradient-to-r from-pink-100 to-pink-50 dark:from-pink-900 dark:to-pink-800 text-pink-600 dark:text-pink-300 border border-pink-200 dark:border-pink-800",
  Social: "bg-gradient-to-r from-purple-100 to-purple-50 dark:from-purple-900 dark:to-purple-800 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800",
  Finance: "bg-gradient-to-r from-cyan-100 to-cyan-50 dark:from-cyan-900 dark:to-cyan-800 text-cyan-600 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800",
};

const ICON_BG_COLORS = {
  Health: "bg-gradient-to-br from-blue-200 to-blue-100 dark:from-blue-700 dark:to-blue-800 text-blue-600 dark:text-blue-200 border border-blue-200 dark:border-blue-700",
  Fitness: "bg-gradient-to-br from-green-200 to-green-100 dark:from-green-700 dark:to-green-800 text-green-600 dark:text-green-200 border border-green-200 dark:border-green-700",
  Learning: "bg-gradient-to-br from-violet-200 to-violet-100 dark:from-violet-700 dark:to-violet-800 text-violet-600 dark:text-violet-200 border border-violet-200 dark:border-violet-700",
  Mindfulness: "bg-gradient-to-br from-amber-200 to-amber-100 dark:from-amber-700 dark:to-amber-800 text-amber-600 dark:text-amber-200 border border-amber-200 dark:border-amber-700",
  Productivity: "bg-gradient-to-br from-orange-200 to-orange-100 dark:from-orange-700 dark:to-orange-800 text-orange-600 dark:text-orange-200 border border-orange-200 dark:border-orange-700",
  Nutrition: "bg-gradient-to-br from-emerald-200 to-emerald-100 dark:from-emerald-700 dark:to-emerald-800 text-emerald-600 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-700",
  Sleep: "bg-gradient-to-br from-indigo-200 to-indigo-100 dark:from-indigo-700 dark:to-indigo-800 text-indigo-600 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-700",
  Creativity: "bg-gradient-to-br from-pink-200 to-pink-100 dark:from-pink-700 dark:to-pink-800 text-pink-600 dark:text-pink-200 border border-pink-200 dark:border-pink-700",
  Social: "bg-gradient-to-br from-purple-200 to-purple-100 dark:from-purple-700 dark:to-purple-800 text-purple-600 dark:text-purple-200 border border-purple-200 dark:border-purple-700",
  Finance: "bg-gradient-to-br from-cyan-200 to-cyan-100 dark:from-cyan-700 dark:to-cyan-800 text-cyan-600 dark:text-cyan-200 border border-cyan-200 dark:border-cyan-700",
  default: "bg-gradient-to-br from-primary-200 to-primary-100 dark:from-primary-700 dark:to-primary-800 text-primary-600 dark:text-primary-200 border border-primary-200 dark:border-primary-700",
};

export function HabitCard({ habit }: HabitCardProps) {
  const { toggleHabitCompletion, editHabit, deleteHabit } = useHabits();

  const handleToggle = () => {
    toggleHabitCompletion(habit.id);
  };

  const handleEdit = () => {
    editHabit(habit.id);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${habit.name}"?`)) {
      deleteHabit(habit.id);
    }
  };

  const iconBgColor = ICON_BG_COLORS[habit.tag as keyof typeof ICON_BG_COLORS] || ICON_BG_COLORS.default;
  const tagColor = TAG_COLORS[habit.tag as keyof typeof TAG_COLORS] || "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300";

  // Determine card glow color based on tag
  const getGlowColor = () => {
    const tag = habit.tag as keyof typeof TAG_COLORS;
    switch(tag) {
      case 'Health': return 'hover:shadow-blue-200/50 dark:hover:shadow-blue-500/30';
      case 'Fitness': return 'hover:shadow-green-200/50 dark:hover:shadow-green-500/30';
      case 'Learning': return 'hover:shadow-violet-200/50 dark:hover:shadow-violet-500/30';
      case 'Mindfulness': return 'hover:shadow-amber-200/50 dark:hover:shadow-amber-500/30';
      case 'Productivity': return 'hover:shadow-orange-200/50 dark:hover:shadow-orange-500/30';
      case 'Nutrition': return 'hover:shadow-emerald-200/50 dark:hover:shadow-emerald-500/30';
      case 'Sleep': return 'hover:shadow-indigo-200/50 dark:hover:shadow-indigo-500/30';
      case 'Creativity': return 'hover:shadow-pink-200/50 dark:hover:shadow-pink-500/30';
      case 'Social': return 'hover:shadow-purple-200/50 dark:hover:shadow-purple-500/30';
      case 'Finance': return 'hover:shadow-cyan-200/50 dark:hover:shadow-cyan-500/30';
      default: return 'hover:shadow-primary-200/50 dark:hover:shadow-primary-500/30';
    }
  };
  
  // Add a completed class for the glow effect when habit is completed
  const completedClass = habit.completed ? 
    'border-primary-200 dark:border-primary-700 shadow-lg shadow-primary-100/40 dark:shadow-primary-900/40' : '';
  
  return (
    <div className={cn(
      "card-premium p-5 relative overflow-visible",
      habit.completed ? "glow-success" : "",
      completedClass,
      "transform hover:-translate-y-1"
    )}>
      {/* Add a subtle shine effect at the top of the card */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-50"></div>
      
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <div className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center", 
            iconBgColor,
            "shadow-md transform transition-all duration-300 hover:scale-105"
          )}>
            <span className="text-2xl">{habit.icon}</span>
          </div>
          <div className="ml-3">
            <h3 className="font-semibold text-lg">{habit.name}</h3>
            <div className="flex items-center mt-1">
              <span className={cn(
                "text-xs px-2.5 py-1 rounded-full font-medium", 
                tagColor,
                "shadow-sm"
              )}>
                {habit.tag}
              </span>
            </div>
          </div>
        </div>
        <div className="relative">
          <div 
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              const menu = e.currentTarget.querySelector('.dropdown-menu');
              if (menu) {
                menu.classList.toggle('hidden');
              }
            }}
            onBlur={(e) => {
              // Hide menu on blur unless the related target is inside the menu
              const menu = e.currentTarget.querySelector('.dropdown-menu');
              if (menu && !menu.contains(e.relatedTarget as Node)) {
                setTimeout(() => {
                  menu.classList.add('hidden');
                }, 100);
              }
            }}
          >
            <MoreVertical className="h-4 w-4" />
            <div 
              className="dropdown-menu absolute right-0 top-full mt-1 bg-white dark:bg-slate-800 shadow-lg rounded-md border border-slate-200 dark:border-slate-700 py-1 w-36 hidden z-10 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90"
            >
              <div 
                onClick={handleEdit}
                className="w-full text-left px-3 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
              >
                Edit
              </div>
              <div 
                onClick={handleDelete}
                className="w-full text-left px-3 py-1.5 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 cursor-pointer transition-colors"
              >
                Delete
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Divider with gradient */}
      <div className="my-4 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent"></div>
      
      <div className="flex items-center justify-between">
        <div className={cn(
          "flex items-center space-x-2 px-3 py-1.5 rounded-full transform transition-all duration-300 hover:translate-x-1",
          habit.streak > 0 ? "glow-streak" : "",
          "bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/20"
        )}>
          <Flame className={cn(
            "h-4 w-4", 
            habit.streak > 7 ? "text-orange-500 animate-pulse-soft" : "text-amber-500"
          )} />
          <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
            {habit.streak > 0 ? `${habit.streak} day streak` : "Start streak"}
          </span>
        </div>
        <Switch 
          checked={habit.completed} 
          onCheckedChange={handleToggle}
          className={cn(
            "data-[state=checked]:bg-gradient-primary h-6 w-11",
            "transition-all duration-300 transform data-[state=checked]:scale-105"
          )}
        />
      </div>
      
      {/* Completed badge (only shows when completed) */}
      {habit.completed && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg transform rotate-12">
          Done!
        </div>
      )}
    </div>
  );
}
