
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import DemoSection from '@/components/landing/DemoSection';
// import PricingSection from '@/components/landing/PricingSection';
import CTASection from '@/components/landing/CTASection';
import FooterSection from '@/components/landing/FooterSection';
import AlternativeCTASection from '@/components/landing/AlternativeCTASection';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-foreground">
      <Header transparent hideUserInfo />
      
      <HeroSection />
      <FeaturesSection />
      <DemoSection />
      {/* <PricingSection /> */}
      <AlternativeCTASection />
      <CTASection />
      <FooterSection />
    </div>
  );
};

export default Landing;
