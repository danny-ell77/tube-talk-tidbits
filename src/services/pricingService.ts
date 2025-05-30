import { SUBSCRIPTION_PLANS } from './paystackService';

export type Region = 'NG' | 'INTL';

export interface PricingPlan {
    title: string;
    price: number;
    credits: number;
    features: string[];
    isPopular?: boolean;
}

export interface RegionPricing {
    currency: string;
    currencySymbol: string;
    plans: {
        Basic: PricingPlan;
        Pro: PricingPlan;
        Team: PricingPlan;
    };
}

const NIGERIA_PRICING: RegionPricing = {
    currency: 'NGN',
    currencySymbol: '₦',
    plans: {
        Basic: {
            title: "Basic",
            price: 2000,
            credits: 20,
            features: [
                "20 credits",
                "All digest types",
                "Email support",
                "Export to PDF/Markdown"
            ]
        },
        Pro: {
            title: "Pro",
            price: 5000, // ₦5,000
            credits: 60,
            features: [
                "60 credits",
                "All digest types",
                "Priority support",
                "Advanced AI models",
                "Credit rollover (up to 30)"
            ],
            isPopular: true
        },
        Team: {
            title: "Team",
            price: 15000, // ₦15,000
            credits: 200,
            features: [
                "200 credits",
                "5 team members",
                "Advanced AI models",
                "API access",
                "Shared workspace",
                "Dedicated support"
            ]
        }
    }
};

// International pricing in USD
const INTERNATIONAL_PRICING: RegionPricing = {
    currency: 'USD',
    currencySymbol: '$', // Dollar symbol
    plans: {
        Basic: {
            title: "Basic",
            price: 5,
            credits: 20,
            features: [
                "20 credits per month",
                "All digest types",
                "Email support",
                "Export to PDF/Markdown"
            ]
        },
        Pro: {
            title: "Pro",
            price: 12,
            credits: 60,
            features: [
                "60 credits per month",
                "All digest types",
                "Priority support",
                "Advanced AI models",
                "Credit rollover (up to 30)"
            ],
            isPopular: true
        },
        Team: {
            title: "Team",
            price: 29.99,
            credits: 200,
            features: [
                "200 credits per month",
                "5 team members",
                "Advanced AI models",
                "API access",
                "Shared workspace",
                "Dedicated support"
            ]
        }
    }
};

export const detectRegion = (): Region => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return timezone.includes('Africa/Lagos') || timezone.includes('Africa/Abuja') ? 'NG' : 'INTL';
};

export const getRegionPricing = (region?: Region): RegionPricing => {
    const detectedRegion = region || detectRegion();
    return detectedRegion === 'NG' ? NIGERIA_PRICING : INTERNATIONAL_PRICING;
};

export const formatPrice = (price: number, currencySymbol: string): string => {
    return `${currencySymbol}${price.toLocaleString()}`;
};
