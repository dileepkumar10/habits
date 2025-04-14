import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name: string;
  image?: string;
  className?: string;
}

export function UserAvatar({ name, image, className }: UserAvatarProps) {
  // Get initials from name
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <Avatar className={cn("border border-slate-200 dark:border-slate-700", className)}>
      {image && <AvatarImage src={image} alt={name} />}
      <AvatarFallback className="bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
