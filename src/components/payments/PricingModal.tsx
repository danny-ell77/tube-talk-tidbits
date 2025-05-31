import {
  Dialog,
  DialogContent
} from "@/components/ui/dialog";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import {
  convertToSmallestUnit,
  initializePayment
} from '@/services/paystackService';
import { detectRegion, Region } from '@/services/pricingService';
import React, { useEffect, useState } from 'react';
import { toast } from "sonner";
import PaymentModals from './PaymentModals';
import PricingContent from './PricingContent';
import PricingModalHeader from './PricingModalHeader';
import { PaymentDetails, PricingModalProps, PricingPlan } from './types';

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  const { user, updateCredits } = useAuth();
  const [processing, setProcessing] = useState<string | null>(null);
  const [showVerifyingModal, setShowVerifyingModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [region, setRegion] = useState<Region>('INTL');
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currencySymbol, setCurrencySymbol] = useState('$');
  useEffect(() => {
    const detectedRegion = detectRegion();
    setRegion(detectedRegion);
    setCurrencySymbol(detectedRegion === 'NG' ? '₦' : '$');
    fetchPricingPlans(detectedRegion);
  }, []);

  const fetchPricingPlans = async (userRegion: Region) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('pricing_plans')
        .select('*')
        .eq('region', userRegion)
        .order('amount', { ascending: true });

      if (error) {
        console.error('Error fetching pricing plans:', error);
        toast.error('Failed to load pricing plans');
        return;
      }
      if (data) {
        const transformedPlans: PricingPlan[] = data.map((plan: Tables<'pricing_plans'>) => ({
          id: plan.id,
          planName: plan.plan_name,
          amount: plan.amount,
          credits: plan.credits,
          currency: plan.currency,
          region: plan.region,
          isPopular: plan.recommended,
          features: plan.features ? (plan.features as string).split(',').map(f => f.trim()) : [],
          subunitMultiplier: plan.subunit_multiplier
        }));
        setPricingPlans(transformedPlans);
      }
    } catch (error) {
      console.error('Error fetching pricing plans:', error);
      // toast.error('Failed to load pricing plans');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubscribe = async (plan: PricingPlan) => {
    if (!user?.email) {
      toast.error("Please sign in to subscribe to a plan");
      return;
    }
    
    setProcessing(plan.id);
      const multiplier = plan.subunitMultiplier || 100;
      const amount = convertToSmallestUnit(plan.amount, plan.currency, multiplier);
      
      try {
        onClose();
        
        const { reference } = initializePayment({
          email: user.email,
          amount: amount,
          currency: plan.currency,
          metadata: {
              userId: user.id,
              planType: plan.planName,
              credits: plan.credits
            },
          callback: async (response) => {
            if (response.status === "success") {
              setPaymentDetails({
                planName: plan.planName,
                amount: plan.amount,
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
  const pricingCardData = pricingPlans.map((plan) => ({
    title: plan.planName,
    price: `${currencySymbol}${plan.amount.toLocaleString()}`,
    credits: plan.credits,
    features: plan.features,
    isPopular: plan.isPopular,
    buttonText: processing === plan.id ? "Processing..." : "Subscribe",
    ctaAction: () => handleSubscribe(plan),
    isLoading: processing === plan.id
  }));
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[900px] w-[98%] max-h-[90vh] overflow-y-auto">
          <PricingModalHeader />
          <PricingContent
            isLoading={isLoading}
            plans={pricingCardData}
          />
        </DialogContent>
      </Dialog>

      <PaymentModals
        paymentDetails={paymentDetails}
        showVerifyingModal={showVerifyingModal}
        showSuccessModal={showSuccessModal}
        onVerificationComplete={handleVerificationComplete}
        onSuccessClose={() => {
          setShowSuccessModal(false);
          onClose();
        }}
      />
    </>
  );
};

export default PricingModal;
