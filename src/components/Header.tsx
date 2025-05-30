import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import UserAvatar from './auth/UserAvatar';
import { Cookie, Menu, X } from "lucide-react";
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import CreditsDisplay from './CreditsDisplay';
import { UserData } from '@/contexts/AuthContext';

interface HeaderProps {
  transparent?: boolean;
  user?: UserData;
  hideUserInfo?: boolean;
}

const Header = ({ transparent = false, hideUserInfo = false }: HeaderProps) => {
  let basePath = "/"
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const isLoggedIn = !!user?.id && !hideUserInfo;
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  basePath = user ? "/digest" : "/";

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
    if (user?.id) {
      e.preventDefault();
      navigate('/digest');
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 py-4 px-4 md:px-6 transition-all duration-300 ${headerBg}`}>
      <div className="container mx-auto flex justify-between items-center">
        <Link to={basePath} className="flex items-center gap-2">
          <Cookie className={`h-6 w-6 ${scrolled ? 'text-youtube' : transparent ? 'text-white' : 'text-youtube'}`} />
          <span className={`font-pacifico text-xl font-semibold ${textColor}`}>
            Digestly
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle variant="ghost" />
          
          {loading ? (
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          ) : isLoggedIn ? (
            <div className="flex items-center gap-3">
              <CreditsDisplay />
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

        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle variant="ghost" size="sm" />
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-1" 
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className={`h-6 w-6 ${textColor}`} />
            ) : (
              <Menu className={`h-6 w-6 ${textColor}`} />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className={`md:hidden absolute top-full left-0 right-0 p-4 ${headerBg} shadow-md border-t border-gray-200 dark:border-gray-700`}>
          {loading ? (
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          ) : isLoggedIn ? (
            <div className="flex flex-col gap-3">
              <div className={`${textColor} flex items-center justify-between`}>
                <CreditsDisplay />
                <UserAvatar user={user} onLogout={handleLogout} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link to="/login" onClick={handleLoginClick} className="w-full">
                <Button 
                  variant="ghost" 
                  className="w-full justify-center"
                >
                  Log in
                </Button>
              </Link>
              <Link to={user ? "/digest" : "/register"} className="w-full">
                <Button className="w-full justify-center">
                  {user ? "Go to Digest" : "Sign up"}
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
