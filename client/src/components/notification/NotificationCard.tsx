import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHabits } from "@/hooks/use-habits";
import { cn } from "@/lib/utils";
import { Notification } from "@/types/notification";

interface NotificationCardProps {
  notification: Notification;
  onDismiss: (id: string) => void;
  onComplete: (id: string) => void;
}

export function NotificationCard({ notification, onDismiss, onComplete }: NotificationCardProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  
  useEffect(() => {
    // Auto-dismiss after 8 seconds
    const timeout = setTimeout(() => {
      handleDismiss();
    }, 8000);
    
    return () => clearTimeout(timeout);
  }, []);
  
  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onDismiss(notification.id);
    }, 300);
  };
  
  const handleComplete = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onComplete(notification.id);
    }, 300);
  };
  
  if (!isVisible) return null;
  
  return (
    <div className={cn(
      "bg-white dark:bg-slate-800 rounded-lg p-4 shadow-lg border border-slate-200 dark:border-slate-700 flex items-start bg-opacity-25 backdrop-blur-[10px] dark:bg-opacity-75 transition-all duration-300",
      isExiting ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
    )}>
      <div className="flex-shrink-0 mr-3">
        <div className="bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 rounded-full p-2">
          <Bell className="h-5 w-5" />
        </div>
      </div>
      <div className="flex-1">
        <h4 className="font-medium">{notification.title}</h4>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{notification.message}</p>
        <div className="flex justify-end mt-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleDismiss}
            className="text-xs text-primary-600 dark:text-primary-400 font-medium"
          >
            Dismiss
          </Button>
          {notification.habitId && (
            <Button 
              size="sm" 
              onClick={handleComplete}
              className="text-xs ml-2"
            >
              Complete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
