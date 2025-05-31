import React from 'react';

interface PricingDisclaimerProps {
  disclaimerText?: string;
}

const PricingDisclaimer: React.FC<PricingDisclaimerProps> = ({
  disclaimerText = "All plans come with a 7-day money-back guarantee. Cancel anytime."
}) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 rounded-md text-xs sm:text-sm mt-4">
      <p className="text-center text-muted-foreground">
        {disclaimerText}
      </p>
    </div>
  );
};

export default PricingDisclaimer;
