import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/theme-provider";
import { useHabits } from "@/hooks/use-habits";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { habits } = useHabits();
  const { toast } = useToast();

  const [notifications, setNotifications] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [reminderTime, setReminderTime] = useState("20:00");
  const [weeklyReport, setWeeklyReport] = useState(true);

  const handleSavePreferences = () => {
    toast({
      title: "Preferences saved",
      description: "Your settings have been updated successfully.",
    });
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(habits));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "habitflow_data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();

    toast({
      title: "Data exported",
      description: "Your habit data has been exported successfully.",
    });
  };

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear all your habit data? This action cannot be undone.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-slate-50 to-primary-50 text-slate-800 dark:from-slate-900 dark:to-slate-950 dark:text-slate-200 transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 pt-20 md:pt-4 px-4 md:px-8 pb-16 overflow-y-auto">
        {/* Header */}
        <div className="mb-8 mt-4">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Manage your preferences and account settings
          </p>
        </div>

        {/* Appearance Settings */}
        <div className="mb-8">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 bg-opacity-25 backdrop-blur-[10px] dark:bg-opacity-75">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how HabitFlow looks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="theme-mode">Dark Mode</Label>
                  <Switch 
                    id="theme-mode" 
                    checked={theme === 'dark'}
                    onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-primary-600 data-[state=checked]:to-secondary-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notification Settings */}
        <div className="mb-8">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 bg-opacity-25 backdrop-blur-[10px] dark:bg-opacity-75">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Manage how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enable-notifications">Enable Notifications</Label>
                  <Switch 
                    id="enable-notifications" 
                    checked={notifications}
                    onCheckedChange={setNotifications}
                    className="data-[state=checked]:bg-primary-600"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="daily-reminder">Daily Reminder</Label>
                  <Switch 
                    id="daily-reminder" 
                    checked={dailyReminder}
                    onCheckedChange={setDailyReminder}
                    disabled={!notifications}
                    className="data-[state=checked]:bg-primary-600"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="reminder-time">Reminder Time</Label>
                  <input
                    type="time"
                    id="reminder-time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    disabled={!notifications || !dailyReminder}
                    className="bg-transparent border rounded px-2 py-1"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="weekly-report">Weekly Progress Report</Label>
                  <Switch 
                    id="weekly-report" 
                    checked={weeklyReport}
                    onCheckedChange={setWeeklyReport}
                    disabled={!notifications}
                    className="data-[state=checked]:bg-primary-600"
                  />
                </div>
              </div>

              <Button 
                className="mt-6"
                onClick={handleSavePreferences}
              >
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Data Management */}
        <div className="mb-8">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 bg-opacity-25 backdrop-blur-[10px] dark:bg-opacity-75">
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Export or reset your habit data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Button 
                    variant="outline"
                    onClick={handleExportData}
                    className="w-full md:w-auto"
                  >
                    Export Habit Data
                  </Button>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Download your habit history as a JSON file
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Button 
                    variant="destructive"
                    onClick={handleClearData}
                    className="w-full md:w-auto"
                  >
                    Clear All Data
                  </Button>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    This will permanently delete all your habits and history
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* About */}
        <div className="mb-8">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 bg-opacity-25 backdrop-blur-[10px] dark:bg-opacity-75">
            <CardHeader>
              <CardTitle>About HabitFlow</CardTitle>
              <CardDescription>Application information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>Version: 1.0.0</p>
                <p>Created with React, Tailwind CSS, and Shadcn UI</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
                  HabitFlow helps you build better habits through visual streaks, daily progress tracking, and smooth reminders.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}