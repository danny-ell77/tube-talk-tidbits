import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, Download } from "lucide-react";
import confetti from 'canvas-confetti';
import { getRegionPricing, detectRegion } from '@/services/pricingService';

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  amount: number;
  reference: string;
}

const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({
  isOpen,
  onClose,
  planName,
  amount,
  reference,
}) => {
  const pricing = getRegionPricing(detectRegion());

  useEffect(() => {
    if (isOpen) {
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 5 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);
    }
  }, [isOpen]);

  const handleDownloadReceipt = () => {
    const receiptContent = `
      Digestly Payment Receipt
      ------------------------
      Plan: ${planName}
      Amount: ${pricing.currencySymbol}${amount.toLocaleString()}
      Currency: ${pricing.currency}
      Reference: ${reference}
      Date: ${new Date().toLocaleDateString()}
      Status: Paid
    `;

    // Create blob and download
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `digestly-receipt-${reference}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-green-400 opacity-75"></div>
              <CheckCircle2 className="relative h-16 w-16 text-green-500" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">Payment Successful!</DialogTitle>
          <DialogDescription className="text-center">
            Thank you for subscribing to the {planName} plan.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Your subscription has been activated successfully.
            </p>
            <p className="text-sm text-muted-foreground">
              Amount: {pricing.currencySymbol}{amount.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              Reference: {reference}
            </p>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col gap-2">
          <Button onClick={handleDownloadReceipt} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Download Receipt
          </Button>
          <Button variant="outline" onClick={onClose} className="w-full">
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentSuccessModal; 