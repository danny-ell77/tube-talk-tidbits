import React, { useEffect, useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, AlertCircle } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';

interface PaymentVerifyingModalProps {
  isOpen: boolean;
  onClose: (success?: boolean) => void;
  expectedCredits: number;
}

const PaymentVerifyingModal: React.FC<PaymentVerifyingModalProps> = ({
  isOpen,
  onClose,
  expectedCredits,
}) => {
  const { user, updateCredits } = useAuth();
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const isMountedRef = useRef(true);
  const subscriptionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const finalTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup function
  const cleanup = () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    if (finalTimeoutRef.current) {
      clearTimeout(finalTimeoutRef.current);
      finalTimeoutRef.current = null;
    }
  };

  // Function to check payment status via API
  const checkPaymentStatus = async () => {
    if (!user || !isMountedRef.current) return false;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('credits')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error checking payment status:', error);
        return false;
      }

      const currentCredits = data?.credits || 0;
      const previousCredits = user?.credits || 0;
      
      // Check if credits increased by expected amount (or close to it)
      if (currentCredits >= previousCredits + expectedCredits) {
        if (isMountedRef.current) {
          updateCredits(currentCredits);
          onClose(true);
        }
        return true;
      }
    } catch (error) {
      console.error('Error in checkPaymentStatus:', error);
    }
    
    return false;
  };

  // Start polling fallback
  const startPolling = () => {
    if (!isMountedRef.current) return;
    
    setIsPolling(true);
    
    // Poll every 5 seconds for 1 minute
    pollingIntervalRef.current = setInterval(async () => {
      const success = await checkPaymentStatus();
      if (success) {
        cleanup();
      }
    }, 5000);

    // Final timeout after 1 more minute
    finalTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setHasTimedOut(true);
        cleanup();
      }
    }, 60 * 1000); // 1 minute
  };

  useEffect(() => {
    isMountedRef.current = true;
    
    if (!isOpen || !user) {
      cleanup();
      return;
    }

    // Reset states
    setHasTimedOut(false);
    setIsPolling(false);

    // Set initial timeout for 2 minutes before falling back to polling
    timeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        console.log('Real-time verification timed out, starting polling...');
        startPolling();
      }
    }, 2000);

    // Subscribe to profile changes
    subscriptionRef.current = supabase
      .channel(`profile-${user.id}`)
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Realtime payload:', payload);
          if (payload.eventType === 'UPDATE') {
            const newCredits = +(payload.new.credits || 0);
            const oldCredits = user?.credits || 0;
            
            // Verify the credit increase matches expectations
            // if (newCredits >= oldCredits + expectedCredits) {
              updateCredits(newCredits);
              cleanup();
              onClose(true);
            // }
          }
        }
      )
      .subscribe();

    // Cleanup function
    return () => {
      isMountedRef.current = false;
      cleanup();
    };
  }, [isOpen, user?.id, expectedCredits, onClose, updateCredits]);

  const handleClose = () => {
    cleanup();
    onClose(false);
  };

  const getDialogTitle = () => {
    if (hasTimedOut) return "Payment Verification Failed";
    if (isPolling) return "Still Verifying Payment...";
    return "Verifying Payment";
  };

  const getDialogDescription = () => {
    if (hasTimedOut) {
      return (
        <div className="space-y-4">
          <p>We couldn't verify your payment within the expected time.</p>
          <p className="text-sm text-muted-foreground">
            Please contact our support team for assistance, or check your account later.
          </p>
          <Button 
            variant="outline" 
            onClick={handleClose}
            className="mt-2"
          >
            Close
          </Button>
        </div>
      );
    }
    
    if (isPolling) {
      return "Payment processing is taking longer than expected. We're checking your account status...";
    }
    
    return "Please wait while we verify your payment and update your account.";
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            {hasTimedOut ? (
              <AlertCircle className="h-8 w-8 text-destructive" />
            ) : (
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            )}
          </div>
          <DialogTitle className="text-center">
            {getDialogTitle()}
          </DialogTitle>
          <DialogDescription className="text-center">
            {getDialogDescription()}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentVerifyingModal;