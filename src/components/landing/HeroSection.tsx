
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
        <h1 className="text-5xl md:text-6xl mb-6 text-white dark:text-white font-bold ignore-theme">
          Transform YouTube Videos into Digestible Summaries
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white font-medium font-pacifico">
          Extract key insights, comprehensive notes, and concise summaries from any YouTube video in seconds.
        </p>
        
        {/* Buttons with curly arrow connector */}
        <div className="relative flex flex-col sm:flex-row gap-8 justify-center items-center">
          <div className="relative">
            <Link to={user ? "/digest" : "/register"}>
              <Button className="bg-white text-red-600 hover:bg-gray-100 font-semibold text-lg px-8 py-6 transition-all duration-200 hover:scale-105 hover:-translate-y-1 shadow-[0_8px_0_0_#dc2626] hover:shadow-[0_12px_0_0_#dc2626] active:translate-y-1 active:shadow-[0_4px_0_0_#dc2626]">
                {user ? "Go to Digest" : "Get 2 Free Summaries Now!"}
              </Button>
            </Link>
          </div>
          
          {/* Curly Arrow SVG */}
          <div className="hidden sm:block relative">
            <svg 
              width="120" 
              height="80" 
              viewBox="0 0 120 80" 
              className="text-yellow-400 animate-pulse"
              style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))' }}
            >
              <path
                d="M10 40 Q30 10, 60 25 T110 40"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="5,3"
                className="animate-[draw_2s_ease-in-out_infinite]"
              />
              {/* Arrow head */}
              <path
                d="M105 35 L110 40 L105 45 L110 40"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Decorative curl at start */}
              <circle
                cx="10"
                cy="40"
                r="3"
                fill="currentColor"
                className="animate-pulse"
              />
            </svg>
          </div>
          
          <div className="relative">
            <Link to="/" onClick={(e) => {
              e.preventDefault();
              document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 font-semibold text-lg px-8 py-6 transition-all duration-200 hover:scale-105 hover:-translate-y-1 shadow-[0_8px_0_0_rgba(255,255,255,0.2)] hover:shadow-[0_12px_0_0_rgba(255,255,255,0.3)] active:translate-y-1 active:shadow-[0_4px_0_0_rgba(255,255,255,0.2)]">
                Try Demo
              </Button>
            </Link>
          </div>
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