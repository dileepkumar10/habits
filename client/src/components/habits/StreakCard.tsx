import { Card, CardContent } from "@/components/ui/card";
import { Flame, Award, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakCardProps {
  title: string;
  count: number;
  unit: string;
  description: string;
}

export function StreakCard({ title, count, unit, description }: StreakCardProps) {
  // Define icon and color based on title
  const getIconAndColor = () => {
    switch (title) {
      case "Current Streak":
        return {
          icon: <Flame className="h-6 w-6" />,
          color: "from-amber-500 to-orange-500",
          bgColor: "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/20",
          textColor: "text-amber-600 dark:text-amber-300",
          borderColor: "border-amber-100 dark:border-amber-800/30",
          shadowColor: "shadow-amber-200/40 dark:shadow-amber-900/30"
        };
      case "Longest Streak":
        return {
          icon: <Award className="h-6 w-6" />,
          color: "from-purple-500 to-pink-500",
          bgColor: "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/20",
          textColor: "text-purple-600 dark:text-purple-300",
          borderColor: "border-purple-100 dark:border-purple-800/30",
          shadowColor: "shadow-purple-200/40 dark:shadow-purple-900/30"
        };
      case "Total Completed":
        return {
          icon: <CheckCircle className="h-6 w-6" />,
          color: "from-teal-500 to-emerald-500",
          bgColor: "bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/30 dark:to-emerald-900/20",
          textColor: "text-emerald-600 dark:text-emerald-300",
          borderColor: "border-emerald-100 dark:border-emerald-800/30",
          shadowColor: "shadow-emerald-200/40 dark:shadow-emerald-900/30"
        };
      default:
        return {
          icon: <CheckCircle className="h-6 w-6" />,
          color: "from-primary-500 to-secondary-500",
          bgColor: "bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/30 dark:to-secondary-900/20",
          textColor: "text-primary-600 dark:text-primary-300",
          borderColor: "border-primary-100 dark:border-primary-800/30",
          shadowColor: "shadow-primary-200/40 dark:shadow-primary-900/30"
        };
    }
  };

  const { icon, color, bgColor, textColor, borderColor, shadowColor } = getIconAndColor();

  return (
    <Card className={cn(
      "card-premium relative overflow-visible group",
      borderColor,
      shadowColor,
      "transform transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02]"
    )}>
      {/* Top accent color */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-2 bg-gradient-to-r rounded-t-xl",
        color
      )}></div>
      
      {/* Background particles for visual interest */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div className="absolute top-1/4 right-1/4 w-16 h-16 rounded-full bg-current blur-xl"></div>
        <div className="absolute bottom-1/3 left-1/3 w-12 h-12 rounded-full bg-current blur-xl"></div>
      </div>

      <CardContent className="pt-7 pb-5 relative z-10">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-lg">{title}</h3>
          <div className={cn(
            "p-3 rounded-full shadow-md transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12", 
            bgColor,
            textColor
          )}>
            {icon}
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-baseline">
            <div className={cn(
              "text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r transition-all duration-500",
              color,
              "group-hover:scale-110 origin-left animate-pulse-soft"
            )}>
              {count}
            </div>
            <div className="text-xl ml-2 text-slate-600 dark:text-slate-400 font-medium">{unit}</div>
          </div>
          <p className={cn(
            "text-sm mt-3 font-medium",
            textColor
          )}>
            {description}
          </p>
        </div>
        
        {/* Bottom decorative bar */}
        <div className={cn(
          "absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 w-1/4 rounded-t-full opacity-50 transition-all duration-500 group-hover:w-1/3",
          "bg-gradient-to-r",
          color
        )}></div>
      </CardContent>
    </Card>
  );
}
