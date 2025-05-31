import React from 'react';
import { Cookie } from "lucide-react";

interface PricingLoadingStateProps {
  loadingText?: string;
}

const PricingLoadingState: React.FC<PricingLoadingStateProps> = ({
  loadingText = "Loading pricing plans..."
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Cookie className="h-12 w-12 text-youtube animate-spin mb-4" />
      <p className="text-muted-foreground">{loadingText}</p>
    </div>
  );
};

export default PricingLoadingState;
