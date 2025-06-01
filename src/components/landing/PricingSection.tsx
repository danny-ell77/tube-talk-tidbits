import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import PricingCard from './PricingCard';
import { useAuth } from '@/contexts/AuthContext';
import { 
  initializePayment, 
  convertToSmallestUnit
} from '@/services/paystackService';
import SignupModal from '../auth/SignupModal';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { detectRegion, Region } from '@/services/pricingService';
import { Cookie } from 'lucide-react';
import PaymentModals from '../payments/PaymentModals';
import { PaymentDetails } from '../payments/types';

interface PricingPlan {
  id: string;
  planName: string;
  amount: number;
  credits: number;
  currency: string;
  region: string;
  features: string[];
  isPopular?: boolean;
  subunitMultiplier: number | null;
}

const PricingSection = () => {
  const navigate = useNavigate();
  const { user, updateCredits } = useAuth();
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showVerifyingModal, setShowVerifyingModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
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
      toast.error('Failed to load pricing plans');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubscribe = async (plan: PricingPlan) => {
    if (!user?.email) {
      setShowSignupModal(true);
      return;
    }
    
    setProcessingPlan(plan.id);
    const multiplier = plan.subunitMultiplier || 100;
    const amount = convertToSmallestUnit(plan.amount, plan.currency, multiplier);
    
    try {
      initializePayment({
        email: user.email,
        amount: amount,
        currency: plan.currency,
        metadata: {
          userId: user.id,
          planType: plan.planName,
          credits: plan.credits
        },
        callback: (response) => {
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
          setProcessingPlan(null);
        }
      });
    } catch (error) {
      console.error('Payment initialization error:', error);
      setProcessingPlan(null);
      toast.error("Failed to initialize payment. Please try again.");
    }
  };

  const handleVerificationComplete = (success: boolean) => {
    setShowVerifyingModal(false);
    if (success) {
      setShowSuccessModal(true);
    } else {
      toast.error("Payment verification failed. Please try again.");
    } 
    setProcessingPlan(null);
  };

  if (isLoading) {
    return (
      <section className="py-20 px-4" id="pricing">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex flex-col items-center justify-center py-12">
            <Cookie className="h-12 w-12 text-youtube animate-spin mb-4" />
            <p className="text-muted-foreground">Loading pricing plans...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4" id="pricing">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
          Choose the plan that works for your needs, with flexible options for individuals and teams.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => (
            <PricingCard
              key={plan.id}
              title={plan.planName}
              price={`${currencySymbol}${plan.amount.toLocaleString()}`}
              credits={plan.credits}
              features={plan.features}
              isPopular={plan.isPopular}
              buttonText={processingPlan === plan.id ? "Processing..." : "Get Started"}
              ctaAction={() => handleSubscribe(plan)}
              isLoading={processingPlan === plan.id}
            />
          ))}
        </div>
      </div>
      
      <SignupModal 
        isOpen={showSignupModal} 
        onClose={() => setShowSignupModal(false)} 
        onSignupSuccess={() => {
          setShowSignupModal(false);
          toast.info("Please select a plan again to complete your subscription");
        }}
      />

      <PaymentModals
        paymentDetails={paymentDetails}
        showVerifyingModal={showVerifyingModal}
        showSuccessModal={showSuccessModal}
        onVerificationComplete={handleVerificationComplete}
        onSuccessClose={() => {
          setShowSuccessModal(false);
        }}
      />
    </section>
  );
};