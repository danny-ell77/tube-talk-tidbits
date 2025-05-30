import React, { useState } from 'react';
import { toast } from 'sonner';
import PricingCard from './PricingCard';
import { useAuth } from '@/contexts/AuthContext';
import { 
  initializePayment, 
  convertToSmallestUnit,
  SUBSCRIPTION_PLANS 
} from '@/services/paystackService';
import SignupModal from '../auth/SignupModal';
import { useNavigate } from 'react-router-dom';

const PricingSection = () => {
  const navigate = useNavigate();
  const { user, updateCredits } = useAuth();
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [showSignupModal, setShowSignupModal] = useState(false);
  
  // Handle subscription with Paystack
  const handleSubscribe = (planName: string) => {
    if (!user?.email) {
      // If user is not logged in, show signup modal
      setShowSignupModal(true);
      return;
    }
    
    // For free plan, just navigate to app
    if (planName === 'Free') {
      return;
    }
    
    setProcessingPlan(planName);
    
    const plan = planName === 'Pro' ? SUBSCRIPTION_PLANS.Pro : 
                 SUBSCRIPTION_PLANS.Basic;
                 
    const amount = convertToSmallestUnit(plan.price);
    
    try {
      initializePayment({
        email: user.email,
        amount: amount,
        metadata: {
          userId: user.id,
          planType: planName,
          credits: plan.credits
        },
        callback: (response) => {
          console.log('Payment response:', response);
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

  return (
    <section className="py-20 px-4" id="pricing">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
          Choose the plan that works for your needs, with flexible options for individuals and teams.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          <PricingCard
            title="Basic"
            price="Free"
            credits={5}
            features={[
              "5 digests per month",
              "TL;DR summaries",
              "Key insights extraction",
              "Export to Markdown"
            ]}
            buttonText="Sign Up Free"
            ctaAction={() => handleSubscribe("Basic")}
            isLoading={processingPlan === "Basic"}
          />
          
          <PricingCard
            title="Pro"
            price="$9.99"
            credits={50}
            features={[
              "50 digests per month",
              "All digest types",
              "Custom prompts",
              "Export to PDF & Markdown",
              "Priority processing"
            ]}
            isPopular={true}
            buttonText="Get Pro"
            ctaAction={() => handleSubscribe("Pro")}
            isLoading={processingPlan === "Pro"}
          />
          
          <PricingCard
            title="Team"
            price="$29.99"
            credits={200}
            features={[
              "200 digests per month",
              "5 team members",
              "Advanced AI models",
              "API access",
              "Shared workspace",
              "Dedicated support"
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
