import React, { useState, useRef, useEffect } from 'react';
import { Plus, Clock, History, GripHorizontal, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  disabled: {
    current: boolean;
    history: boolean;
  };
  onZenModeToggle?: () => void;
  isZenMode?: boolean;
}

const FloatingNav: React.FC<FloatingNavProps> = ({ 
  activeTab, 
  onTabChange, 
  disabled, 
  onZenModeToggle = () => {},
  isZenMode = false
}) => {
  const [expanded, setExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 6, y: 20 });
  const navRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const lastMousePos = useRef({ x: 0, y: 0 });
  
  // Movement dampening factor (lower = less sensitive)
  const SENSITIVITY = 0.7;
  // Minimum movement threshold in pixels to trigger an update
  const MOVEMENT_THRESHOLD = 2;

  const navItems = [
    { id: 'new', icon: Plus, label: 'New Digest', disabled: false },
    { id: 'current', icon: Clock, label: 'Current', disabled: disabled.current },
    { id: 'history', icon: History, label: 'History', disabled: disabled.history },
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current && navRef.current) {
        // Calculate movement delta since last position
        const deltaX = e.clientX - lastMousePos.current.x;
        const deltaY = e.clientY - lastMousePos.current.y;
        
        // Update last mouse position
        lastMousePos.current = { x: e.clientX, y: e.clientY };
        
        // Check if movement exceeds threshold
        if (Math.abs(deltaX) < MOVEMENT_THRESHOLD && Math.abs(deltaY) < MOVEMENT_THRESHOLD) {
          return; // Skip small movements
        }
        
        // Apply sensitivity factor to make movement less responsive
        const dampedDeltaX = deltaX * SENSITIVITY;
        const dampedDeltaY = deltaY * SENSITIVITY;
        
        // Update position based on dampened movement
        const newX = position.x + dampedDeltaX / 16; // Convert pixels to rem (assuming 1rem = 16px)
        const newY = position.y + dampedDeltaY / 16;
        
        // Ensure nav stays within viewport
        const maxX = (window.innerWidth - (expanded ? 192 : 48)) / 16; // Width in rem
        const maxY = (window.innerHeight - 200) / 16; // Approximate height in rem
        
        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        });
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [expanded, position]);

  const handleDragStart = (e: React.MouseEvent) => {
    if (navRef.current) {
      isDragging.current = true;
      // Set initial mouse position for delta calculations
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
      e.preventDefault(); // Prevent text selection during drag
    }
  };

  return (
    <div 
      ref={navRef}
      className={cn(
        "fixed z-40 bg-white dark:bg-gray-800 shadow-lg rounded-lg transition-all duration-300 overflow-visible",
        expanded ? "w-48" : "w-12"
      )}
      style={{ 
        top: `${position.y}rem`, 
        left: `${position.x}rem`,
      }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="py-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => !item.disabled && onTabChange(item.id)}
            disabled={item.disabled}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 text-left",
              activeTab === item.id ? "text-purple-600 dark:text-purple-400" : "text-gray-600 dark:text-gray-300",
              item.disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
              "focus:outline-none"
            )}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <span className={cn(
              "whitespace-nowrap transition-opacity duration-300",
              expanded ? "opacity-100" : "opacity-0"
            )}>
              {item.label}
            </span>
          </button>
        ))}
        
        {/* Zen Mode Button - Updated with Headphones icon */}
        <button
          onClick={onZenModeToggle}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 text-left",
            isZenMode ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-300",
            "hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none"
          )}
        >
          <Headphones className="h-5 w-5 flex-shrink-0" />
          <span className={cn(
            "whitespace-nowrap transition-opacity duration-300",
            expanded ? "opacity-100" : "opacity-0"
          )}>
            Zen Mode
          </span>
        </button>
      </div>

      {/* Semi-circular drag handle */}
      <div 
        className={cn(
          "absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-gray-200 dark:bg-gray-700 rounded-b-full flex items-center justify-center cursor-grab active:cursor-grabbing transition-opacity duration-200",
          expanded ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
        onMouseDown={handleDragStart}
      >
        <GripHorizontal className="h-3 w-3 text-gray-500 dark:text-gray-400" />
      </div>
    </div>
  );
};

export default FloatingNav;
