
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
      </div>

      <style jsx>{`
        .spinning-border {
          animation: spin-border 2s linear infinite;
        }
        
        @keyframes spin-border {
          0% { border-image: repeating-linear-gradient(0deg, #D97706 0, #D97706 10px, transparent 10px, transparent 20px) 4; }
          25% { border-image: repeating-linear-gradient(90deg, #D97706 0, #D97706 10px, transparent 10px, transparent 20px) 4; }
          50% { border-image: repeating-linear-gradient(180deg, #D97706 0, #D97706 10px, transparent 10px, transparent 20px) 4; }
          75% { border-image: repeating-linear-gradient(270deg, #D97706 0, #D97706 10px, transparent 10px, transparent 20px) 4; }
          100% { border-image: repeating-linear-gradient(360deg, #D97706 0, #D97706 10px, transparent 10px, transparent 20px) 4; }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;