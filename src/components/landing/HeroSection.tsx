
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative pt-20 pb-32 px-4 bg-gradient-to-br from-youtube to-red-700 text-white hero-curve">
      <div className="max-w-6xl mx-auto text-center pt-16 pb-12">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-white">
          Transform YouTube Videos into Digestible Summaries
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
          Extract key insights, comprehensive notes, and concise summaries from any YouTube video in seconds.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register">
            <Button className="bg-white text-youtube hover:bg-gray-100 font-semibold text-lg px-8 py-6">
              Get Started for Free
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 font-semibold text-lg px-8 py-6">
              Try Demo
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
