import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useHabits } from "@/hooks/use-habits";
import { Habit } from "@/types/habit";
import { generateId } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const ICONS = [
  { value: "💧", label: "Water" },
  { value: "📚", label: "Book" },
  { value: "🏋️", label: "Exercise" },
  { value: "📝", label: "Journal" },
  { value: "☕", label: "Coffee" },
  { value: "🧘", label: "Meditation" },
  { value: "🚶", label: "Walking" },
  { value: "🍎", label: "Healthy Eating" },
  { value: "💊", label: "Medication" },
  { value: "🛌", label: "Sleep" },
  { value: "🧠", label: "Learning" },
  { value: "🎨", label: "Creative" },
  { value: "💰", label: "Saving" },
  { value: "📱", label: "Screen Time" },
  { value: "🚭", label: "No Smoking" },
  { value: "🧹", label: "Cleaning" },
  { value: "🌱", label: "Plant Care" },
  { value: "👨‍👩‍👧‍👦", label: "Family Time" },
  { value: "📞", label: "Call Friend" },
  { value: "✅", label: "Task" },
];

const TAGS = [
  "Health",
  "Fitness",
  "Learning",
  "Mindfulness",
  "Productivity",
  "Nutrition",
  "Sleep",
  "Creativity",
  "Social",
  "Finance",
];

export function HabitForm() {
  const { showHabitForm, setShowHabitForm, addHabit, updateHabit, editingHabit } = useHabits();
  
  const [formData, setFormData] = useState<Omit<Habit, 'id' | 'createdAt' | 'streak' | 'completed'>>({
    name: "",
    icon: "✅",
    tag: "Health",
  });

  useEffect(() => {
    if (editingHabit) {
      setFormData({
        name: editingHabit.name,
        icon: editingHabit.icon,
        tag: editingHabit.tag,
      });
    } else {
      setFormData({
        name: "",
        icon: "✅",
        tag: "Health",
      });
    }
  }, [editingHabit, showHabitForm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert("Please enter a habit name");
      return;
    }
    
    if (editingHabit) {
      updateHabit({
        ...editingHabit,
        ...formData,
      });
    } else {
      const newHabit: Habit = {
        id: generateId(),
        name: formData.name,
        icon: formData.icon,
        tag: formData.tag,
        completed: false,
        streak: 0,
        createdAt: new Date().toISOString(),
      };
      
      addHabit(newHabit);
    }
    
    setShowHabitForm(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Dialog open={showHabitForm} onOpenChange={setShowHabitForm}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{editingHabit ? "Edit Habit" : "Create a New Habit"}</DialogTitle>
            <DialogDescription>
              {editingHabit 
                ? "Update your habit details below." 
                : "Build a new habit by filling out the information below."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="icon" className="text-right">
                Icon
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.icon}
                  onValueChange={(value) => setFormData({ ...formData, icon: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an icon" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-[200px]">
                      {ICONS.map((icon) => (
                        <SelectItem key={icon.value} value={icon.value}>
                          <div className="flex items-center">
                            <span className="mr-2 text-lg">{icon.value}</span>
                            <span>{icon.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter habit name"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tag" className="text-right">
                Category
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.tag}
                  onValueChange={(value) => setFormData({ ...formData, tag: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {TAGS.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              {editingHabit ? "Save Changes" : "Create Habit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
