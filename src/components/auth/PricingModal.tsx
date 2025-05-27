import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Cookie, Check } from "lucide-react";
import PricingCard from '../landing/PricingCard';

interface PricingPlan {
  title: string;
  price: string;
  credits: number;
  features: string[];
  isPopular?: boolean;
  buttonText: string;
  ctaAction?: () => void;
}

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  // Placeholder function for subscription handling
  const handleSubscribe = (planName: string) => {
    console.log(`User selected ${planName} plan`);
    // Implement subscription logic here or redirect to checkout
    onClose();
  };

  const pricingPlans: PricingPlan[] = [
    {
      title: "Basic",
      price: "$5",
      credits: 20,
      features: [
        "20 credits per month",
        "All digest types",
        "Email support",
        "Export to PDF/Markdown"
      ],
      buttonText: "Subscribe",
      ctaAction: () => handleSubscribe("Basic")
    },
    {
      title: "Pro",
      price: "$12",
      credits: 60,
      features: [
        "60 credits per month",
        "All digest types",
        "Priority support",
        "Advanced AI models",
        "Credit rollover (up to 30)"
      ],
      isPopular: true,
      buttonText: "Subscribe",
      ctaAction: () => handleSubscribe("Pro")
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Cookie className="h-8 w-8 text-youtube" />
          </div>
          <DialogTitle className="text-center text-xl">Upgrade Your Account</DialogTitle>
          <DialogDescription className="text-center">
            You're out of credits! Choose a plan to continue generating digests.
          </DialogDescription>
        </DialogHeader>
          <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pricingPlans.map((plan, index) => (
              <PricingCard
                key={index}
                title={plan.title}
                price={plan.price}
                credits={plan.credits}
                features={plan.features}
                isPopular={plan.isPopular}
                buttonText={plan.buttonText}
                ctaAction={plan.ctaAction}
              />
            ))}
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md text-sm mt-4">
            <p className="text-center text-muted-foreground">
              All plans come with a 7-day money-back guarantee. Cancel anytime.
            </p>
          </div>
        </div>
        
        <DialogFooter className="flex justify-center">
          <Button variant="ghost" onClick={onClose}>
            Maybe Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PricingModal;
