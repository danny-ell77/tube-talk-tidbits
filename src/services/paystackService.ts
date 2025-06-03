import PaystackPop from "@paystack/inline-js";
import { toast } from "sonner";

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_APP_PAYSTACK_PUBLIC_KEY;

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

    if (!config.reference) {
      config.reference = `DIGESTLY_${Date.now()}_${Math.floor(
        Math.random() * 1000000
      )}`;
    }

    if (!config.currency) {
      config.currency = "USD";
    }

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
        if (response.status === "success") {
          if (config.callback && typeof config.callback === "function") {
            config.callback(response);
          }
          toast.success("Payment successful! Processing your subscription...");
        } else {
          toast.error("Payment verification failed. Please contact support.");
        }
      },
      onClose: () => {
        if (config.onClose && typeof config.onClose === "function") {
          config.onClose();
        } else {
          toast.info("Payment window closed");
        }
      },
    });

    handler.openIframe();

    return { reference: config.reference };
  } catch (error) {
    console.error("Error initializing Paystack payment:", error);
    toast.error(
      error instanceof Error
        ? error.message
        : "Payment initialization failed. Please try again."
    );
    throw error;
  }
};

export const convertToSmallestUnit = (
  amount: number,
  multiplier = 100
) => {
  return Math.round(amount * multiplier);
};

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
