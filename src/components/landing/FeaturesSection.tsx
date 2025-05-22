
import React from 'react';
import { FileText, Brain, ScrollText } from "lucide-react";
import FeatureCard from './FeatureCard';

const FeaturesSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Powerful Features for Video Analysis</h2>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
          Our AI-powered tools help you extract the most valuable information from any video content.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            title="TL;DR Summaries" 
            description="Get the key points from any video in a concise, easy-to-read format."
            icon={<FileText className="h-6 w-6 text-digest-blue transition-transform group-hover:scale-110" />}
          />
          <FeatureCard 
            title="Key Insights" 
            description="Extract the most important insights and data points from educational content."
            icon={<Brain className="h-6 w-6 text-digest-blue transition-transform group-hover:scale-110" />}
          />
          <FeatureCard 
            title="Comprehensive Notes" 
            description="Generate detailed, structured notes from lectures and long-form content."
            icon={<ScrollText className="h-6 w-6 text-digest-blue transition-transform group-hover:scale-110" />}
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
