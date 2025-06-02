
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';

const HeroSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleLoginClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (user?.id) {
      e.preventDefault();
      navigate('/digest');
    }
  };

  return (
    <section className="relative pt-20 pb-32 px-4 bg-gradient-to-br from-red-600 to-red-700 dark:text-white text-red-900 hero-curve">
      <div className="max-w-6xl mx-auto text-center pt-16 pb-12">
        <h1 className="text-5xl md:text-6xl mb-6 text-white dark:text-white text-white font-bold ignore-theme">
          Transform YouTube Videos into Digestible Summaries
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white text-red-50 dark:text-white/90 font-medium font-pacifico">
          Extract key insights, comprehensive notes, and concise summaries from any YouTube video in seconds.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to={user ? "/digest" : "/register"}>
            <Button className="bg-white text-red-600 hover:bg-gray-100 font-semibold text-lg px-8 py-6">
              {user ? "Go to Digest" : "Get Started for Free"}
            </Button>
          </Link>
          <Link to="/" onClick={(e) => {
            e.preventDefault();
            document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' });
          }}>
            <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 font-semibold text-lg px-8 py-6">
              Try Demo
            </Button>
          </Link>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 m-8 max-w-2xl mx-auto relative" id="free-summaries-section">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Get 2 Free Summaries Now!
          </h2>
          <p className="text-lg text-white/90">
            Sign up to unlock 5 free summaries and more features
          </p>
          
          <div className="absolute -top-6 right-10 hidden lg:block -rotate-45">
            <img 
              src="/images/arrow.png" 
              alt="Arrow pointing to Try Demo" 
              className="w-24 h-20 opacity-90 animate-bounce" 
              style={{ 
                animationDuration: '2s', 
                animationIterationCount: 'infinite',
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
              }}
            />
          </div>
          
          <div className="absolute -top-8 right-4 lg:hidden">
            <div className="text-yellow-400 text-2xl animate-pulse">↗</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
