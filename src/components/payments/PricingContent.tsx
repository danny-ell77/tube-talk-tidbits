import React from 'react';
import PricingLoadingState from './PricingLoadingState';
import PricingPlansGrid from './PricingPlansGrid';
import PricingDisclaimer from './PricingDisclaimer';
import { PricingCardData } from './types';

interface PricingContentProps {
  isLoading: boolean;
  plans: PricingCardData[];
  disclaimerText?: string;
}

const PricingContent: React.FC<PricingContentProps> = ({
  isLoading,
  plans,
  disclaimerText,
}) => {
  return (
    <div className="space-y-4 py-4 px-2 sm:px-0">
      {isLoading ? (
        <PricingLoadingState />
      ) : (
        <PricingPlansGrid plans={plans} />
      )}
      <PricingDisclaimer disclaimerText={disclaimerText} />
    </div>
  );
};

export default PricingContent;
