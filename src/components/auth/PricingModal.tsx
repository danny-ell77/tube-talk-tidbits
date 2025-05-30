import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useAuth } from '@/contexts/AuthContext';
import {
  convertToSmallestUnit,
  initializePayment
} from '@/services/paystackService';
import { detectRegion, getRegionPricing, Region } from '@/services/pricingService';
import { Cookie } from "lucide-react";
import React, { useEffect, useState } from 'react';
import { toast } from "sonner";
import PricingCard from '../landing/PricingCard';
import PaymentSuccessModal from './PaymentSuccessModal';
import PaymentVerifyingModal from './PaymentVerifyingModal';

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
  const { user, updateCredits } = useAuth();
  const [processing, setProcessing] = useState<string | null>(null);
  const [showVerifyingModal, setShowVerifyingModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<{
    planName: string;
    amount: number;
    reference: string;
    expectedCredits: number;
  } | null>(null);
  const [region, setRegion] = useState<Region>('INTL');

  useEffect(() => {
    setRegion(detectRegion());
  }, []);

  const pricing = getRegionPricing(region);
  
  const handleSubscribe = async (planName: string) => {
    if (!user?.email) {
      toast.error("Please sign in to subscribe to a plan");
      return;
    }
    
    setProcessing(planName);
    
    const plan = pricing.plans[planName as keyof typeof pricing.plans];
    const amount = convertToSmallestUnit(plan.price, pricing.currency);
    
    try {
      onClose();
      
      const { reference } = initializePayment({
        email: user.email,
        amount: amount,
        currency: pricing.currency,
        metadata: {
          userId: user.id,
          planType: planName,
          credits: plan.credits
        },
        callback: async (response) => {
          if (response.status === "success") {
            setPaymentDetails({
              planName,
              amount: plan.price,
              reference: response.reference,
              expectedCredits: (user.credits || 0) + plan.credits
            });
            setShowVerifyingModal(true);
          }
        },
        onClose: () => {
          console.log('Payment window closed');
          setProcessing(null);
        }
      });
    } catch (error) {
      console.error('Payment initialization error:', error);
      toast.error("Failed to initialize payment. Please try again.");
      setProcessing(null);
    }
  };

  const handleVerificationComplete = (success: boolean) => {
    setShowVerifyingModal(false);
    if (success) {
      setShowSuccessModal(true);
    } else {
      toast.error("Payment verification failed. Please try again.");
    } 
    setProcessing(null);
  };

  const pricingPlans = Object.entries(pricing.plans).map(([key, plan]) => ({
    title: plan.title,
    price: `${pricing.currencySymbol}${plan.price.toLocaleString()}`,
    credits: plan.credits,
    features: plan.features,
    isPopular: plan.isPopular,
    buttonText: processing === key ? "Processing..." : "Subscribe",
    ctaAction: () => handleSubscribe(key)
  }));

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[900px] w-[98%] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="px-2 sm:px-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Cookie className="h-8 w-8 text-youtube" />
            </div>
            <DialogTitle className="text-center text-xl">Upgrade Your Account</DialogTitle>
            <DialogDescription className="text-center text-sm sm:text-base px-1">
              You're out of credits! Choose a plan to continue generating digests.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 px-2 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
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
                  isLoading={processing === plan.title}
                />
              ))}
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 rounded-md text-xs sm:text-sm mt-4">
              <p className="text-center text-muted-foreground">
                All plans come with a 7-day money-back guarantee. Cancel anytime.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {paymentDetails && (
        <>
          <PaymentVerifyingModal
            isOpen={showVerifyingModal}
            onClose={handleVerificationComplete}
            expectedCredits={paymentDetails.expectedCredits}
          />
          <PaymentSuccessModal
            isOpen={showSuccessModal}
            onClose={() => {
              setShowSuccessModal(false);
              onClose();
            }}
            planName={paymentDetails.planName}
            amount={paymentDetails.amount}
            reference={paymentDetails.reference}
          />
        </>
      )}
    </>
  );
};

export default PricingModal;
