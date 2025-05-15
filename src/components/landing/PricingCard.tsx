
import React from 'react';
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  <div className={`bg-white rounded-xl shadow-sm border overflow-hidden ${isPopular ? 'ring-2 ring-red-500' : ''}`}>
    {isPopular && (
      <div className="bg-red-500 text-white text-center py-1 text-sm font-medium">
        Most Popular
      </div>
    )}
    <div className="p-6">
      <h3 className="text-xl font-bold">{title}</h3>
      <div className="mt-4 flex items-baseline">
        <span className="text-3xl font-extrabold">{price}</span>
        {price !== "Free" && <span className="text-gray-500 ml-1">/mo</span>}
      </div>
      <p className="mt-1 text-sm text-gray-500">
        {credits} credits per month
      </p>
      <ul className="mt-6 space-y-3">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
            <span className="text-gray-600 text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <Button className="w-full">{buttonText}</Button>
      </div>
    </div>
  </div>
);

export default PricingCard;
