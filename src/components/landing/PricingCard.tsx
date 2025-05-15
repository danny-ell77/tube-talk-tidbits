import React from 'react';
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  title: string;
  price: string;
  credits: number;
  features: string[];
  isPopular?: boolean;
  buttonText?: string;
}

const PricingCard = ({ 
  title,
  price,
  credits,
  features,
  isPopular = false,
  buttonText = "Get Started"
}: PricingCardProps) => (
  <div className={cn(
    "bg-card rounded-xl shadow-sm border overflow-hidden",
    isPopular ? "ring-2 ring-youtube" : ""
  )}>
    {isPopular && (
      <div className="bg-youtube text-white text-center py-1 text-sm font-medium">
        Most Popular
      </div>
    )}
    <div className="p-6">
      <h3 className="text-xl font-bold text-foreground">{title}</h3>
      <div className="mt-4 flex items-baseline">
        <span className="text-3xl font-extrabold text-foreground">{price}</span>
        {price !== "Free" && <span className="text-muted-foreground ml-1">/mo</span>}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        {credits} credits per month
      </p>
      <ul className="mt-6 space-y-3">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
            <span className="text-foreground/80 text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <Button variant={isPopular ? "default" : "outline"} className="w-full">
          {buttonText}
        </Button>
      </div>
    </div>
  </div>
);

export default PricingCard;
