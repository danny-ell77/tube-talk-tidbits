
import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, CircleDollarSign } from "lucide-react";
import { UserData } from '@/contexts/AuthContext';
import PricingModal from '../payments/PricingModal';
interface UserAvatarProps {
  user: UserData;
  onLogout?: () => void;
}

const UserAvatar = ({ user, onLogout }: UserAvatarProps) => {
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  if (!user) return null;

  const initials = user.name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const handleBuyCredits = () => {
    setDropdownOpen(false);
    setShowPricingModal(true);
  };

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger className="focus:outline-none">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 border border-border">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium hidden md:inline-block">
              {user.name}
            </span>
            {user.isPremium && (
              <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full hidden md:inline-block">
                Premium
              </span>
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {/* <DropdownMenuItem asChild>
            <Link to="/profile" className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem> */}
          <DropdownMenuItem onClick={handleBuyCredits} className="flex items-center">
            <CircleDollarSign className="mr-2 h-4 w-4" />
            <span>Buy More Credits</span>
          </DropdownMenuItem>
          {/* <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem> */}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-500" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <PricingModal 
        isOpen={showPricingModal} 
        onClose={() => setShowPricingModal(false)} 
      />
    </>
  );
};

export default UserAvatar;
