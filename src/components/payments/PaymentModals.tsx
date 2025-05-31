import React from 'react';
import PaymentSuccessModal from './PaymentSuccessModal';
import PaymentVerifyingModal from './PaymentVerifyingModal';
import { PaymentDetails } from './types';

interface PaymentModalsProps {
  paymentDetails: PaymentDetails | null;
  showVerifyingModal: boolean;
  showSuccessModal: boolean;
  onVerificationComplete: (success: boolean) => void;
  onSuccessClose: () => void;
}

const PaymentModals: React.FC<PaymentModalsProps> = ({
  paymentDetails,
  showVerifyingModal,
  showSuccessModal,
  onVerificationComplete,
  onSuccessClose,
}) => {
  if (!paymentDetails) return null;

  return (
    <>
      <PaymentVerifyingModal
        isOpen={showVerifyingModal}
        onClose={onVerificationComplete}
        expectedCredits={paymentDetails.expectedCredits}
      />
      <PaymentSuccessModal
        isOpen={showSuccessModal}
        onClose={onSuccessClose}
        planName={paymentDetails.planName}
        amount={paymentDetails.amount}
        reference={paymentDetails.reference}
      />
    </>
  );
};

export default PaymentModals;
