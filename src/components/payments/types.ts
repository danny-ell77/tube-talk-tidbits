export interface PricingPlan {
  id: string;
  planName: string;
  amount: number;
  credits: number;
  currency: string;
  region: string;
  features: string[];
  isPopular: boolean;
  subunitMultiplier: number | null;
}

export interface PricingCardData {
  title: string;
  price: string;
  credits: number;
  features: string[];
  isPopular: boolean;
  buttonText: string;
  ctaAction: () => void;
  isLoading: boolean;
}

export interface PaymentDetails {
  planName: string;
  amount: number;
  reference: string;
  expectedCredits: number;
}

export interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}
