import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { generateId } from "@/lib/utils";
import { useHabits } from "@/hooks/use-habits";
import { Notification } from "@/types/notification";

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => void;
  dismissNotification: (id: string) => void;
  completeHabitFromNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { habits, toggleHabitCompletion } = useHabits();
  
  // Create water reminder after 2 hours
  useEffect(() => {
    const waterHabit = habits.find(habit => 
      habit.name.toLowerCase().includes("water") || 
      habit.name.toLowerCase().includes("drink")
    );
    
    if (waterHabit) {
      const timeout = setTimeout(() => {
        addNotification({
          title: "Habit Reminder",
          message: "Don't forget to drink water! It's been 2 hours since your last glass.",
          habitId: waterHabit.id,
        });
      }, 3000); // Show after 3 seconds for demo purposes
      
      return () => clearTimeout(timeout);
    }
  }, [habits]);
  
  const addNotification = (notification: Omit<Notification, "id">) => {
    const newNotification: Notification = {
      ...notification,
      id: generateId(),
    };
    
    setNotifications(prev => [...prev, newNotification]);
  };
  
  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  const completeHabitFromNotification = (id: string) => {
    const notification = notifications.find(n => n.id === id);
    
    if (notification && notification.habitId) {
      toggleHabitCompletion(notification.habitId);
    }
    
    dismissNotification(id);
  };
  
  return (
    <NotificationContext.Provider 
      value={{
        notifications,
        addNotification,
        dismissNotification,
        completeHabitFromNotification,
      }}
    >
      {children}
      
      {/* Notification Stack */}
      {notifications.length > 0 && (
        <div className="fixed bottom-4 right-4 z-30 flex flex-col space-y-3 max-w-sm">
          {notifications.map(notification => (
            <div key={notification.id} className="notification-card">
              {/* This is just a placeholder - the actual component is imported in pages */}
              {notification.title}
            </div>
          ))}
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};
