import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import PricingCard from './PricingCard';
import { useAuth } from '@/contexts/AuthContext';
import { 
  initializePayment, 
  convertToSmallestUnit,
  SUBSCRIPTION_PLANS 
} from '@/services/paystackService';
import { 
  detectRegion, 
  getRegionPricing, 
  formatPrice, 
  type Region, 
  type RegionPricing 
} from '@/services/pricingService';
import { supabase } from '@/integrations/supabase/client';
import { Database, Tables } from '@/integrations/supabase/types';
import SignupModal from '../auth/SignupModal';
import { useNavigate } from 'react-router-dom';

interface ApiPricingPlan {
  id: string;
  plan_name: string;
  amount: number;
  credits: number;
  currency: string;
  region: string;
  recommended: boolean;
  features: string;
  subunit_multiplier: number | null;
}

interface PricingPlan {
  id: string;
  planName: string;
  amount: number;
  credits: number;
  currency: string;
  region: string;
  isPopular: boolean;
  features: string[];
  subunitMultiplier: number | null;
}

const PricingSection = () => {
  const navigate = useNavigate();
  const { user, updateCredits } = useAuth();
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [region, setRegion] = useState<Region>('INTL');
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [regionPricing, setRegionPricing] = useState<RegionPricing | null>(null);

  useEffect(() => {
    const detectedRegion = detectRegion();
    setRegion(detectedRegion);
    fetchPricingPlans(detectedRegion);
  }, []);

  const fetchPricingPlans = async (userRegion: Region) => {
    try {
      setIsLoading(true);
      
      // Try to fetch from API first
      const { data, error } = await supabase
        .from('pricing_plans')
        .select('*')
        .eq('region', userRegion)
        .order('amount', { ascending: true });

      if (error) {
        console.error('Error fetching pricing plans:', error);
        // Fall back to local pricing service
        const fallbackPricing = getRegionPricing(userRegion);
        setRegionPricing(fallbackPricing);
        return;
      }

      if (data && data.length > 0) {
        const transformedPlans: PricingPlan[] = data.map((plan) => ({
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
      } else {
        // No data from API, use fallback
        const fallbackPricing = getRegionPricing(userRegion);
        setRegionPricing(fallbackPricing);
      }
    } catch (error) {
      console.error('Error fetching pricing plans:', error);
      // Use fallback pricing service
      const fallbackPricing = getRegionPricing(userRegion);
      setRegionPricing(fallbackPricing);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubscribe = (planName: string) => {
    if (!user?.email) {
      // If user is not logged in, show signup modal
      setShowSignupModal(true);
      return;
    }
    
    if (planName === 'Basic' && !regionPricing) {
      return; // Free plan from API
    }
    
    setProcessingPlan(planName);
    
    try {
      let amount: number;
      let currency: string;
      let credits: number;

      if (pricingPlans.length > 0) {
        // Using API data
        const plan = pricingPlans.find(p => p.planName === planName);
        if (!plan) {
          toast.error("Plan not found");
          setProcessingPlan(null);
          return;
        }
        
        const multiplier = plan.subunitMultiplier || 100;
        amount = convertToSmallestUnit(plan.amount, plan.currency, multiplier);
        currency = plan.currency;
        credits = plan.credits;
      } else if (regionPricing) {
        // Using fallback data
        const plan = regionPricing.plans[planName as keyof typeof regionPricing.plans];
        if (!plan) {
          toast.error("Plan not found");
          setProcessingPlan(null);
          return;
        }
        
        amount = convertToSmallestUnit(plan.price);
        currency = regionPricing.currency;
        credits = plan.credits;
      } else {
        toast.error("Pricing data not available");
        setProcessingPlan(null);
        return;
      }

      initializePayment({
        email: user.email,
        amount: amount,
        currency: currency,
        metadata: {
          userId: user.id,
          planType: planName,
          credits: credits
        },
        callback: (response) => {
          console.log('Payment response:', response);
          if (response.status === "success") {
            toast.success("Payment successful! Your credits will be updated shortly.");
          }
        },
        onClose: () => {
          console.log('Payment window closed');
          setProcessingPlan(null);
        }
      });
    } catch (error) {
      console.error('Payment initialization error:', error);
      setProcessingPlan(null);
      toast.error("Failed to initialize payment. Please try again.");
    }
  };

  // Helper function to get plan data
  const getPlanData = (planName: string) => {
    if (pricingPlans.length > 0) {
      // Using API data
      const plan = pricingPlans.find(p => p.planName === planName);
      if (plan) {
        const currencySymbol = region === 'NG' ? '₦' : '$';
        return {
          price: plan.amount === 0 ? 'Free' : `${currencySymbol}${plan.amount.toLocaleString()}`,
          credits: plan.credits,
          features: plan.features,
          isPopular: plan.isPopular
        };
      }
    }
    
    // Using fallback data from pricingService
    if (regionPricing) {
      const plan = regionPricing.plans[planName as keyof typeof regionPricing.plans];
      if (plan) {
        return {
          price: plan.price === 0 ? 'Free' : formatPrice(plan.price, regionPricing.currencySymbol),
          credits: plan.credits,
          features: plan.features,
          isPopular: plan.isPopular || false
        };
      }
    }
    
    // Default fallback
    return {
      price: 'Free',
      credits: 5,
      features: ['Basic features'],
      isPopular: false
    };
  };

  if (isLoading) {
    return (
      <section className="py-20 px-4" id="pricing">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-300">Loading pricing...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4" id="pricing">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-4 max-w-3xl mx-auto">
          Choose the plan that works for your needs, with flexible options for individuals and teams.
        </p>
        
        {/* Enhanced explanation badges with tooltips */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full text-sm text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <span className="font-medium">💡 1 credit = 1 summary</span>
            <span className="mx-2">•</span>
            <span>Buy more anytime after free limits</span>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-full text-sm text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800">
            <span className="font-medium">🔄 No subscriptions</span>
            <span className="mx-2">•</span>
            <span>Pay only for what you use!</span>
          </div>
        </div>

        {/* Additional clarity text */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-16 max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-amber-600 dark:text-amber-400 text-lg">💰</span>
            <h3 className="font-semibold text-amber-800 dark:text-amber-200">Flexible Pay-Per-Use Model</h3>
          </div>
          <p className="text-amber-700 dark:text-amber-300 text-sm">
            Start with free credits, then purchase additional credits only when you need them. 
            No monthly fees, no waste!
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <PricingCard
            title="Basic"
            price={getPlanData("Basic").price}
            credits={getPlanData("Basic").credits}
            features={getPlanData("Basic").features.length > 0 ? getPlanData("Basic").features : [
              "Free credits to get started",
              "All digest types",
              "Email support",
              "Export to PDF/Markdown",
              "✨ Perfect for trying out"
            ]}
            buttonText="Sign Up Free"
            ctaAction={() => handleSubscribe("Basic")}
            isLoading={processingPlan === "Basic"}
          />
          
          <PricingCard
            title="Pro"
            price={getPlanData("Pro").price}
            credits={getPlanData("Pro").credits}
            features={getPlanData("Pro").features.length > 0 ? getPlanData("Pro").features : [
              "More credits per month",
              "All digest types",
              "Priority support",
              "Advanced AI models",
              "Credit rollover",
              "⚡ Most popular choice"
            ]}
            isPopular={getPlanData("Pro").isPopular}
            buttonText="Get Pro"
            ctaAction={() => handleSubscribe("Pro")}
            isLoading={processingPlan === "Pro"}
          />
          
          <PricingCard
            title="Team"
            price={getPlanData("Team").price}
            credits={getPlanData("Team").credits}
            features={getPlanData("Team").features.length > 0 ? getPlanData("Team").features : [
              "Maximum credits per month",
              "Team members included",
              "Advanced AI models",
              "API access",
              "Shared workspace",
              "Dedicated support",
              "🚀 Scale with confidence"
            ]}
            buttonText="Get Team"
            ctaAction={() => handleSubscribe("Team")}
            isLoading={processingPlan === "Team"}
          />
        </div>        
      </div>
      
      {/* Signup Modal */}
      <SignupModal 
        isOpen={showSignupModal} 
        onClose={() => setShowSignupModal(false)} 
        onSignupSuccess={() => {
          setShowSignupModal(false);
          // After signup success, we can redirect or continue with subscription
          toast.info("Please select a plan again to complete your subscription");
        }}
      />
    </section>
  );
};

export default PricingSection;
