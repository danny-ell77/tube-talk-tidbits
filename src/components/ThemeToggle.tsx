
import React, { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  variant = "outline", 
  size = "icon" 
}) => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (!target.closest(".theme-toggle")) {
      setIsOpen(false);
    }
  });
  
  // Icon based on current theme
  const ThemeIcon = theme === "dark" 
    ? Moon 
    : theme === "system" 
      ? Laptop 
      : Sun;

  return (
    <div className="relative theme-toggle">
      <Button
        variant={variant}
        size={size}
        aria-label="Select a theme"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ThemeIcon className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
      
      {/* Popup that appears on hover */}
      <div className={cn(
        "absolute right-0 mt-2 min-w-[8rem] rounded-md border bg-popover p-1 shadow-md",
        "origin-top-right transition-all duration-200 z-50",
        isOpen 
          ? "opacity-100 translate-y-0 visible" 
          : "opacity-0 translate-y-1 invisible"
      )}>
        <button 
          onClick={() => setTheme("light")}
          className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
        >
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </button>
        
        <button 
          onClick={() => setTheme("dark")}
          className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
        >
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </button>
        
        <button 
          onClick={() => setTheme("system")}
          className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
        >
          <Laptop className="mr-2 h-4 w-4" />
          <span>System</span>
        </button>
      </div>
    </div>
  );
};

export default ThemeToggle;
