import React from 'react';
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  title: string;
  price: string;
  credits: number;
  features: string[];
  isPopular?: boolean;
  buttonText?: string;
  ctaAction?: () => void;
  isLoading?: boolean;
}

// PopularCardWrapper: adds red boundary and tag
const PopularCardWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="border-2 border-red-500/70 rounded-xl relative">
     <div className="bg-youtube text-white text-center py-1 text-sm font-medium w-full absolute -top-6 left-0 right-0 border-2 border-red-500/70 rounded-t-xl">
      Most Popular
      </div>  
      {children}
  </div>
  
);

const CardContent = ({
  title,
  price,
  credits,
  features,
  buttonText = "Get Started",
  ctaAction,
  isLoading = false,
}: Omit<PricingCardProps, 'isPopular'>) => (
  <div className={cn(
    "bg-card rounded-xl shadow-sm border overflow-hidden flex flex-col h-full relative"
  )}>
    <div className={cn(
      "p-4 sm:p-6 flex flex-col flex-grow"
    )}>
      <div className="flex flex-wrap items-center justify-between">
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
        <div className="flex items-baseline mt-2 sm:mt-0">
          {price.match(/^(\D+)/) && (
            <span className="text-xl sm:text-2xl font-normal mr-1 align-top italic">{price.match(/^(\D+)/)[1]}</span>
          )}
          <span className="text-2xl sm:text-3xl font-extrabold text-foreground">{price.replace(/^(\D+)/, '')}</span>
        </div>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        {credits} credits
      </p>
      <ul className="mt-4 sm:mt-6 space-y-2 sm:space-y-3 flex-grow">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start">
            <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-foreground/80 text-xs sm:text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <Button 
          variant="default" 
          className="w-full text-sm sm:text-base py-2"
          onClick={ctaAction}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </span>
          ) : (
            buttonText
          )}
        </Button>
      </div>
    </div>
  </div>
);

const PricingCard = ({ 
  isPopular = false,
  ...props
}: PricingCardProps) => (
  isPopular ? (
    <PopularCardWrapper>
      <CardContent {...props} />
    </PopularCardWrapper>
  ) : (
    <CardContent {...props} />
  )
);

export default PricingCard;
