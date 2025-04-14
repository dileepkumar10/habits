import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn, getDaysInMonth, getFirstDayOfMonth, generateDateKey } from "@/lib/utils";
import { useHabits } from "@/hooks/use-habits";
import { format, getDate, getMonth, getYear, addMonths, subMonths } from "date-fns";

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { habits, completionHistory } = useHabits();
  
  const month = getMonth(currentDate);
  const year = getYear(currentDate);
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  
  const previousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };
  
  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };
  
  // Create calendar grid
  const calendarDays = [];
  const previousMonthDays = getDaysInMonth(month === 0 ? year - 1 : year, month === 0 ? 11 : month - 1);
  
  // Add previous month days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarDays.push({
      day: previousMonthDays - i,
      currentMonth: false,
      date: new Date(month === 0 ? year - 1 : year, month === 0 ? 11 : month - 1, previousMonthDays - i)
    });
  }
  
  // Add current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      day: i,
      currentMonth: true,
      date: new Date(year, month, i)
    });
  }
  
  // Add next month days
  const remainingDays = 42 - calendarDays.length; // 6 rows of 7 days
  for (let i = 1; i <= remainingDays; i++) {
    calendarDays.push({
      day: i,
      currentMonth: false,
      date: new Date(month === 11 ? year + 1 : year, month === 11 ? 0 : month + 1, i)
    });
  }
  
  // Function to check how many habits were completed on a specific date
  const getCompletedHabitsCount = (date: Date) => {
    const dateKey = generateDateKey(date);
    return completionHistory[dateKey]?.length || 0;
  };
  
  // Function to get day status
  const getDayStatus = (date: Date) => {
    const completedCount = getCompletedHabitsCount(date);
    const totalHabits = habits.length;
    
    if (completedCount === 0) return "none";
    if (completedCount < totalHabits / 2) return "partial";
    if (completedCount < totalHabits) return "good";
    return "perfect";
  };
  
  // Function to get day class
  const getDayClass = (date: Date, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return "text-slate-400 dark:text-slate-500";
    
    const today = new Date();
    const isToday = 
      getDate(today) === getDate(date) && 
      getMonth(today) === getMonth(date) && 
      getYear(today) === getYear(date);
    
    if (isToday) {
      return "ring-2 ring-primary-500 dark:ring-primary-400 bg-primary-50 dark:bg-primary-900/30 font-medium text-primary-800 dark:text-primary-200";
    }
    
    const status = getDayStatus(date);
    
    switch (status) {
      case "perfect":
        return "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300";
      case "good":
        return "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300";
      case "partial":
        return "bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300";
      default:
        return "";
    }
  };
  
  // Get habit dots for a specific date
  const getHabitDots = (date: Date) => {
    const dateKey = generateDateKey(date);
    const completedHabits = completionHistory[dateKey] || [];
    
    // Return a maximum of 3 dots
    return habits
      .filter(habit => completedHabits.includes(habit.id))
      .slice(0, 3)
      .map(habit => habit.id);
  };

  return (
    <Card className="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-slate-200 dark:border-slate-700 bg-opacity-30 backdrop-blur-[10px] dark:bg-opacity-80 overflow-hidden">
      <div className="bg-gradient-to-r from-primary-500/10 to-secondary-500/10 dark:from-primary-700/20 dark:to-secondary-700/20 px-5 py-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 via-indigo-500 to-purple-600 dark:from-violet-400 dark:via-indigo-300 dark:to-purple-400 text-transparent bg-clip-text animate-gradient">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="icon"
              onClick={previousMonth}
              className="h-8 w-8 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/30 border-slate-200 dark:border-slate-700"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline" 
              size="icon"
              onClick={nextMonth}
              className="h-8 w-8 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/30 border-slate-200 dark:border-slate-700"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="grid grid-cols-7 gap-1 text-center mb-3">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-sm font-medium text-slate-400 dark:text-slate-500 py-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1.5">
          {calendarDays.map((day, index) => {
            const habitDots = getHabitDots(day.date);
            const status = getDayStatus(day.date);
            const completedCount = getCompletedHabitsCount(day.date);
            
            // Determine the background gradient based on completion status
            let bgGradient = "";
            if (day.currentMonth) {
              if (status === "perfect") {
                bgGradient = "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20";
              } else if (status === "good") {
                bgGradient = "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10";
              } else if (status === "partial") {
                bgGradient = "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/10";
              }
            }
            
            return (
              <div 
                key={index} 
                className={cn(
                  "p-0.5 text-center group relative",
                  day.currentMonth ? "opacity-100" : "opacity-50"
                )}
              >
                <div className={cn(
                  "w-full h-12 sm:h-14 rounded-lg flex flex-col items-center justify-center",
                  getDayClass(day.date, day.currentMonth),
                  bgGradient,
                  day.currentMonth && "hover:shadow-sm transition-shadow"
                )}>
                  <span className={cn(
                    "text-sm",
                    !day.currentMonth && "text-slate-400 dark:text-slate-600"
                  )}>
                    {day.day}
                  </span>
                  
                  {/* Show completion details for current month days */}
                  {day.currentMonth && (
                    <div className="mt-1 flex flex-col items-center">
                      {completedCount > 0 ? (
                        <>
                          <span className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                            status === "perfect" ? "bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200" :
                            status === "good" ? "bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200" :
                            "bg-amber-200 text-amber-800 dark:bg-amber-800 dark:text-amber-200"
                          )}>
                            {completedCount}/{habits.length}
                          </span>
                          <span className="text-[8px] mt-0.5 text-slate-500 dark:text-slate-400">
                            {status === "perfect" ? "All Done!" :
                             status === "good" ? "Almost!" :
                             "Keep Going!"}
                          </span>
                        </>
                      ) : (
                        <span className="text-[8px] text-slate-400 dark:text-slate-500">
                          No habits
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                {habitDots.length > 0 && (
                  <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 flex space-x-0.5">
                    {habitDots.map(id => (
                      <div key={id} className="w-1 h-1 rounded-full bg-primary-500 dark:bg-primary-400"></div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
