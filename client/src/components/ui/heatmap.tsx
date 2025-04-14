import { cn, getStreakColor } from "@/lib/utils";
import { useState } from "react";

interface HeatmapProps {
  data: number[][];
  className?: string;
}

// Days of the week abbreviations
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Get month name from week index (approximate)
const getMonthFromWeek = (weekIndex: number): string => {
  const today = new Date();
  const date = new Date(today);
  date.setDate(date.getDate() - weekIndex * 7);
  return date.toLocaleString('default', { month: 'short' });
};

export function Heatmap({ data, className }: HeatmapProps) {
  const [tooltipInfo, setTooltipInfo] = useState<{
    show: boolean;
    x: number;
    y: number;
    count: number;
    day: string;
  }>({
    show: false,
    x: 0,
    y: 0,
    count: 0,
    day: ""
  });

  // Find unique months to display as labels
  const months = new Set<string>();
  data.forEach((_, weekIndex) => {
    if (weekIndex % 4 === 0) { // Every ~4 weeks
      months.add(getMonthFromWeek(weekIndex));
    }
  });

  return (
    <div className={cn("relative", className)}>
      {/* Month labels */}
      <div className="flex mb-1 text-xs text-slate-500 dark:text-slate-400 mt-1 pl-6">
        {Array.from(months).map((month, i) => (
          <div key={i} className="flex-1 text-center font-medium">{month}</div>
        ))}
      </div>
      
      <div className="flex">
        {/* Day of week labels */}
        <div className="flex flex-col justify-between pr-2 text-xs text-slate-500 dark:text-slate-400">
          {DAYS.map((day, i) => (
            <div key={i} className="h-4 flex items-center font-medium">
              {day}
            </div>
          ))}
        </div>
        
        {/* Heatmap cells */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="grid grid-flow-col gap-1 min-w-max">
            {data.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-flow-row gap-1">
                {week.map((day, dayIndex) => {
                  const today = new Date();
                  const date = new Date(today);
                  date.setDate(date.getDate() - (weekIndex * 7 + (6 - dayIndex)));
                  const formattedDate = date.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  });
                  
                  return (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={cn(
                        "w-4 h-4 rounded-sm transition-all duration-200",
                        getStreakColor(day),
                        weekIndex === 0 && dayIndex === 6 ? "ring-2 ring-offset-2 ring-primary-200 dark:ring-primary-800" : "",
                        "transform hover:scale-125 hover:z-10",
                        day > 0 ? "shadow-sm" : ""
                      )}
                      title={`${formattedDate}: ${day} activities`}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltipInfo({
                          show: true,
                          x: rect.left + window.scrollX,
                          y: rect.top + window.scrollY,
                          count: day,
                          day: formattedDate
                        });
                      }}
                      onMouseLeave={() => {
                        setTooltipInfo(prev => ({ ...prev, show: false }));
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Animated tooltip */}
      {tooltipInfo.show && (
        <div 
          className="absolute z-10 bg-white dark:bg-slate-800 shadow-lg rounded-md border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm transition-all duration-200 animate-fadeIn"
          style={{
            left: `${tooltipInfo.x}px`,
            top: `${tooltipInfo.y - 45}px`,
          }}
        >
          <div className="font-medium">{tooltipInfo.day}</div>
          <div className="text-sm">
            {tooltipInfo.count} {tooltipInfo.count === 1 ? 'activity' : 'activities'}
          </div>
          <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white dark:bg-slate-800 border-r border-b border-slate-200 dark:border-slate-700 rotate-45"></div>
        </div>
      )}
    </div>
  );
}
