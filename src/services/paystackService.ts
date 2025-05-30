// Paystack Payment Integration Service
import PaystackPop from "@paystack/inline-js";
import { toast } from "sonner";

// Get Paystack public key from environment variable
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_174dec6c4d2e6e2a725720eb9fd8f0ad33510bb4';

if (!PAYSTACK_PUBLIC_KEY) {
  console.error("Paystack public key is not defined in environment variables");
}

export type PaystackConfig = {
  email: string;
  amount: number; // Amount in kobo (Nigerian currency) or cents
  currency?: string;
  reference?: string;
  planCode?: string;
  metadata?: {
    /**
     * @property {string} userId - The user's ID
     * This is so CRUCIAL, becuase we won't be able to update the user's credits in Supabase if we don't have their ID
     */
    userId?: string;
    planType?: string;
    credits?: number;
    [key: string]: string | number | undefined;
  };
  callback?: (response: PaystackResponse) => void;
  onClose?: () => void;
};

export type PaystackResponse = {
  reference: string;
  trans: string;
  status: string;
  message: string;
  transaction: string;
  trxref: string;
  gateway_response?: string;
  channel?: string;
  paid_at?: string;
  paid_amount?: number;
  [key: string]: string | number | undefined;
};

export const initializePayment = (config: PaystackConfig) => {
  try {
    if (!PAYSTACK_PUBLIC_KEY) {
      throw new Error("Paystack public key is not configured");
    }

    // Generate a unique reference if not provided
    if (!config.reference) {
      config.reference = `DIGESTLY_${Date.now()}_${Math.floor(
        Math.random() * 1000000
      )}`;
    }

    // Default currency to USD if not specified
    if (!config.currency) {
      config.currency = "USD";
    }

    // Create an instance of the Paystack popup
    const handler = PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: config.email,
      amount: config.amount,
      currency: config.currency,
      ref: config.reference,
      // plan: config.planCode,
      metadata: {
        ...(config.metadata || {}),
        custom_fields: [
          {
            display_name: "Plan Type",
            variable_name: "plan_type",
            value: config.metadata?.planType || "Basic",
          },
        ],
      },
      callback: (response: PaystackResponse) => {
        // Verify the payment status
        if (response.status === "success") {
          // Call the provided callback if exists
          if (config.callback && typeof config.callback === "function") {
            config.callback(response);
          }
          toast.success("Payment successful! Processing your subscription...");
        } else {
          toast.error("Payment verification failed. Please contact support.");
        }
      },
      onClose: () => {
        // Call the provided onClose if exists
        if (config.onClose && typeof config.onClose === "function") {
          config.onClose();
        } else {
          toast.info("Payment window closed");
        }
      },
    });

    // Open the Paystack popup
    handler.openIframe();

    return { reference: config.reference };
  } catch (error) {
    console.error("Error initializing Paystack payment:", error);
    toast.error(error instanceof Error ? error.message : "Payment initialization failed. Please try again.");
    throw error;
  }
};

// Function to verify payment status on your server
export const verifyPayment = async (reference: string) => {
  try {
    const response = await fetch(`/api/verify-payment/${reference}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Payment verification failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error verifying payment:", error);
    toast.error("Failed to verify payment. Please contact support.");
    throw error;
  }
};

// Helper function to convert dollars to the smallest currency unit (kobo/cents)
export const convertToSmallestUnit = (amount: number, currency = "USD") => {
  // For USD, NGN, etc. multiply by 100 to convert dollars/naira to cents/kobo
  return Math.round(amount * 100);
};

// Plan types with their corresponding prices and Paystack plan codes
export const SUBSCRIPTION_PLANS = {
  Basic: {
    price: 0, // Free
    credits: 5,
  },
  Pro: {
    price: 9.99,
    credits: 50,
  },
  Team: {
    price: 29.99,
    credits: 200,
  },
};
