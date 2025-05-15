
import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ThemeToggleProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  variant = "outline", 
  size = "icon" 
}) => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;
