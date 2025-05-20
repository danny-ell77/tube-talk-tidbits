
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import UserAvatar from './auth/UserAvatar';
import { Cookie } from "lucide-react";
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  transparent?: boolean;
  user?: any; // For backward compatibility
  hideUserInfo?: boolean;
}

const Header = ({ transparent = false, hideUserInfo = false }: HeaderProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isLoggedIn = !!user && !hideUserInfo;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 30;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Apply header styling based on scroll position and transparent prop
  const headerBg = scrolled 
    ? 'bg-white dark:bg-gray-800 shadow-sm border-b' 
    : transparent 
      ? 'bg-transparent' 
      : 'bg-white dark:bg-gray-800 shadow-sm border-b';

  const textColor = scrolled 
    ? 'text-gray-900 dark:text-white' 
    : transparent 
      ? 'text-white' 
      : 'text-gray-900 dark:text-white';

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleLoginClick = (e: React.MouseEvent) => {
    if (user) {
      e.preventDefault();
      navigate('/digest');
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 py-4 px-6 transition-all duration-300 ${headerBg}`}>
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Cookie className={`h-6 w-6 ${scrolled ? 'text-red-600' : transparent ? 'text-white' : 'text-red-600'}`} />
          <span className={`font-pacifico text-xl font-semibold ${textColor}`}>
            Digestly
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <ThemeToggle variant="ghost" />
          
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <div className={textColor}>
                {user.credits} credits
              </div>
              <UserAvatar user={user} onLogout={handleLogout} />
            </div>
          ) : hideUserInfo ? (
            <div className="flex gap-2">
              <Link to="/login" onClick={handleLoginClick}>
                <Button 
                  variant={transparent && !scrolled ? "outline" : "ghost"} 
                  className={transparent && !scrolled ? "text-secondary-forground border-white hover:bg-white/20" : ""}
                >
                  Log in
                </Button>
              </Link>
              <Link to={user ? "/digest" : "/register"}>
                <Button>{user ? "Go to Digest" : "Sign up"}</Button>
              </Link>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" onClick={handleLoginClick}>
                <Button 
                  variant={transparent && !scrolled ? "outline" : "ghost"} 
                  className={transparent && !scrolled ? "text-secondary-forground border-white hover:bg-white/20" : ""}
                >
                  Log in
                </Button>
              </Link>
              <Link to={user ? "/digest" : "/register"}>
                <Button>{user ? "Go to Digest" : "Sign up"}</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
