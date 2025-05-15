
import React from 'react';
import PricingCard from './PricingCard';

const PricingSection = () => {
  return (
    <section className="py-20 px-4" id="pricing">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Plans That Fit Your Needs</h2>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
          No hidden fees. Just transparent pricing with features that scale as you grow.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          <PricingCard
            title="Basic"
            price="Free"
            description="Perfect for casual users"
            credits={5}
            features={[
              "5 digests per month",
              "TL;DR summaries",
              "Key insights extraction",
              "Export to Markdown"
            ]}
            buttonText="Sign Up Free"
          />
          
          <PricingCard
            title="Pro"
            price="$9.99"
            description="For regular learners & professionals"
            credits={50}
            features={[
              "50 digests per month",
              "All digest types",
              "Custom prompts",
              "Export to PDF & Markdown",
              "Priority processing"
            ]}
            isPopular={true}
            buttonText="Get Pro"
          />
          
          <PricingCard
            title="Team"
            price="$29.99"
            description="Built for groups & organizations"
            credits={200}
            features={[
              "200 digests per month",
              "Up to 5 team members",
              "Advanced AI models",
              "API access",
              "Shared workspace",
              "Dedicated support"
            ]}
            buttonText="Contact Sales"
          />
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
