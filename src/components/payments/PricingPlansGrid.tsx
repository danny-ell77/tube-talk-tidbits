import React from 'react';
import { PricingCardData } from './types';
import PricingCard from '../landing/PricingCard';

interface PricingPlansGridProps {
  plans: PricingCardData[];
}

const PricingPlansGrid: React.FC<PricingPlansGridProps> = ({ plans }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {plans.map((plan, index) => (
        <PricingCard
          key={index}
          title={plan.title}
          price={plan.price}
          credits={plan.credits}
          features={plan.features}
          isPopular={plan.isPopular}
          buttonText={plan.buttonText}
          ctaAction={plan.ctaAction}
          isLoading={plan.isLoading}
        />
      ))}
    </div>
  );
};

export default PricingPlansGrid;
