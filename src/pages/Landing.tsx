
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import DemoSection from '@/components/landing/DemoSection';
import PricingSection from '@/components/landing/PricingSection';
import CTASection from '@/components/landing/CTASection';
import FooterSection from '@/components/landing/FooterSection';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-foreground">
      <Header transparent />
      
      <HeroSection />
      <FeaturesSection />
      <DemoSection />
      <PricingSection />
      <CTASection />
      <FooterSection />
    </div>
  );
};

export default Landing;
