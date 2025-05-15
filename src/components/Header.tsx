
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import UserAvatar from './auth/UserAvatar';
import { Youtube } from "lucide-react";
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  transparent?: boolean;
  user?: any;
}

const Header = ({ transparent = false, user }: HeaderProps) => {
  const isLoggedIn = !!user;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 py-4 px-6 ${transparent ? 'bg-transparent' : 'bg-white dark:bg-gray-800 shadow-sm border-b'}`}>
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Youtube className={`h-6 w-6 ${transparent ? 'text-white' : 'text-youtube'}`} />
          <span className={`font-bold text-lg ${transparent ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
            YouTube Digest
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <ThemeToggle variant="ghost" />
          
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <div className={`text-sm ${transparent ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                {user.credits} credits
              </div>
              <UserAvatar user={user} />
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login">
                <Button 
                  variant={transparent ? "outline" : "ghost"} 
                  className={transparent ? "text-white border-white hover:bg-white/20" : ""}
                >
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button>Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
