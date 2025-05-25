import React from 'react';
import ForgotPassword from '@/components/auth/ForgotPassword';
import { Metadata } from "@/components/ui/metadata";

const ForgotPasswordPage = () => {
    document.title = "Forgot Password - Digestly";
    // document.description = "Reset your password to access your Digestly account";
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4">

      <Metadata 
        title="Forgot Password - Digestly" 
        description="Reset your password to access your Digestly account" 
      />
      
        <ForgotPassword />
      </div>
  );
};

export default ForgotPasswordPage;
