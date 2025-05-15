
import React from 'react';
import { CheckCircle2, Brain, FileText } from "lucide-react";
import FeatureCard from './FeatureCard';

const FeaturesSection = () => {
  return (
    <section className="py-20 px-4" id="features">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Powerful Features, Smarter Watching</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 max-w-3xl mx-auto">
            Our AI-powered tools help you extract exactly what matters—so you can spend less time watching, and more time doing.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            title="TL;DR Summaries" 
            description="Condensed overviews with only the most important points."
            icon={<CheckCircle2 className="h-6 w-6 text-youtube" />}
          />
          <FeatureCard 
            title="Key Insights" 
            description="Pulls out critical data, lessons, and takeaways—perfect for studying or quick learning."
            icon={<Brain className="h-6 w-6 text-youtube" />}
          />
          <FeatureCard 
            title="Comprehensive Notes" 
            description="Well-structured, sectioned notes ideal for lectures, tutorials, and deep-dives."
            icon={<FileText className="h-6 w-6 text-youtube" />}
          />
        </div>
        
        <div className="mt-16 bg-gray-50 dark:bg-gray-800 p-8 rounded-xl">
          <h3 className="text-2xl font-bold mb-4">Why Waste Time Watching the Whole Video?</h3>
          <p className="text-lg mb-4">
            We've all been there—scrubbing through hours of content to find that <em>one</em> useful point. 
            Whether you're studying, researching, or catching up on a talk, your time is valuable.
          </p>
          <p className="text-xl font-semibold">
            <strong>YouTube Digest</strong> makes sure you get the value <strong>without the time sink</strong>.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
