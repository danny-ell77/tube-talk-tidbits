import React from 'react';
import ResetPassword from '@/components/auth/ResetPassword';
import { Metadata } from "@/components/ui/metadata";

const ResetPasswordPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4">
      <Metadata 
        title="Reset Password - Digestly" 
        description="Set a new password for your Digestly account" 
      />
        <ResetPassword />
      </div>
  );
};

export default ResetPasswordPage;
