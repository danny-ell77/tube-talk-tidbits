
import React from 'react';
import { Link } from 'react-router-dom';
import { Youtube } from "lucide-react";
import { Button } from "./ui/button";
import UserAvatar from './auth/UserAvatar';

interface HeaderProps {
  user?: any;
  transparent?: boolean;
}

const Header = ({ user, transparent = false }: HeaderProps) => {
  return (
    <header className={`w-full py-4 px-6 ${transparent ? 'absolute top-0 left-0 z-10' : 'bg-white shadow-sm'}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Youtube className="h-6 w-6 text-youtube" />
          <Link to="/" className="text-xl font-bold">
            YouTube Digest
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <UserAvatar />
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
