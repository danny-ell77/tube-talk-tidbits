
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
  const [isDragging, setIsDragging] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  
  const SENSITIVITY = 0.9;
  const MOVEMENT_THRESHOLD = 0.5;

  const navItems = [
    { id: 'new', icon: Plus, label: 'New Digest', disabled: false },
    { id: 'current', icon: Clock, label: 'Current', disabled: disabled.current },
    { id: 'history', icon: History, label: 'History', disabled: disabled.history },
  ];

  const isZenModeDisabled = activeTab !== 'current' || disabled.current;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragRef.current && navRef.current) {
        const deltaX = e.clientX - lastMousePos.current.x;
        const deltaY = e.clientY - lastMousePos.current.y;
        
        lastMousePos.current = { x: e.clientX, y: e.clientY };
        
        if (Math.abs(deltaX) < MOVEMENT_THRESHOLD && Math.abs(deltaY) < MOVEMENT_THRESHOLD) {
          return; // Skip small movements
        }
        
        const dampedDeltaX = deltaX * SENSITIVITY;
        const dampedDeltaY = deltaY * SENSITIVITY;
        
        const newX = position.x + dampedDeltaX / 16; 
        const newY = position.y + dampedDeltaY / 16;
        
        const maxX = (window.innerWidth - (expanded ? 192 : 48)) / 16; 
        const maxY = (window.innerHeight - 200) / 16; // Approximate height in rem
        
        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (dragRef.current && navRef.current && e.touches[0]) {
        e.preventDefault(); // Prevent page scrolling while dragging
        setIsDragging(true);
        
        const touch = e.touches[0];
        const deltaX = touch.clientX - lastMousePos.current.x;
        const deltaY = touch.clientY - lastMousePos.current.y;
        
        lastMousePos.current = { x: touch.clientX, y: touch.clientY };
        
        const dampedDeltaX = deltaX * SENSITIVITY;
        const dampedDeltaY = deltaY * SENSITIVITY;
        
        const newX = position.x + dampedDeltaX / 16;
        const newY = position.y + dampedDeltaY / 16;
        
        const maxX = (window.innerWidth - (expanded ? 192 : 48)) / 16;
        const maxY = (window.innerHeight - 200) / 16;
        
        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        });
      }
    };

    const handleMouseUp = () => {
      dragRef.current = false;
      setIsDragging(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    const handleTouchEnd = () => {
      dragRef.current = false;
      setIsDragging(false);
      document.body.style.userSelect = '';
      setTimeout(() => {
        setIsDragging(false);
      }, 100);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [expanded, position]);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (navRef.current) {
      dragRef.current = true;
      setIsDragging(true);
      
      if ('touches' in e) {
        const touch = e.touches[0];
        lastMousePos.current = { x: touch.clientX, y: touch.clientY };
      } else {
        lastMousePos.current = { x: e.clientX, y: e.clientY };
      }
      
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
        expanded ? "w-48 sm:w-48" : "w-14 sm:w-12", // Slightly larger on mobile
      )}
      style={{ 
        top: `${position.y}rem`, 
        left: `${position.x}rem`,
      }}
      onMouseEnter={() => !isDragging && setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="py-3 sm:py-2"> {/* Added more padding on mobile */}
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => !isDragging && !item.disabled && onTabChange(item.id)}
            disabled={item.disabled || isDragging}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 sm:py-2 text-left", // Larger touch targets on mobile
              activeTab === item.id ? "text-red-600 dark:text-red-400" : "text-gray-600 dark:text-gray-300",
              item.disabled || isDragging ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
              "focus:outline-none"
            )}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <span className={cn(
              "whitespace-nowrap transition-opacity duration-300 font-medium",
              expanded ? "opacity-100" : "opacity-0"
            )}>
              {item.label}
            </span>
          </button>
        ))}
        
        {/* Focus Mode Button */}
        <button
          onClick={() => !isDragging && !isZenModeDisabled && onZenModeToggle()}
          disabled={isZenModeDisabled || isDragging}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 sm:py-2 text-left", // Larger touch targets on mobile
            isZenMode ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-300",
            isZenModeDisabled || isDragging ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
            "focus:outline-none"
          )}
        >
          <Headphones className="h-5 w-5 flex-shrink-0" />
          <span className={cn(
            "whitespace-nowrap transition-opacity duration-300 font-medium",
            expanded ? "opacity-100" : "opacity-0"
          )}>
            Focus Mode
          </span>
        </button>
      </div>

      {/* Larger semi-circular drag handle for better touch targets */}
      <div 
        className={cn(
          "absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-7 bg-gray-200 dark:bg-gray-700 rounded-b-full flex items-center justify-center cursor-grab active:cursor-grabbing transition-opacity duration-200",
          isDragging ? "bg-red-200 dark:bg-red-800" : "",
          expanded ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        role="button"
        aria-label="Drag to move"
        tabIndex={0}
      >
        <GripHorizontal className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      </div>
    </div>
  );
};

export default FloatingNav;
