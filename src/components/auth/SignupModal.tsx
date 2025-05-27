import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Cookie } from "lucide-react";

interface SignupModalProps {
  isOpen: boolean;
    onClose: () => void;
    onSignupSuccess?: () => void; // Optional callback for signup success
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose, onSignupSuccess }) => {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Cookie className="h-8 w-8 text-youtube" />
          </div>
          <DialogTitle className="text-center text-xl">Sign up to continue using Digestly</DialogTitle>
          <DialogDescription className="text-center">
            Get 5 more monthly free credits and save your digests.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex flex-col gap-2">
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md text-sm">
              <p className="font-medium mb-2">By creating an account, you'll get:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>5 free digests every month</li>
                <li>Save your favorite summaries</li>
                <li>Access to all digest types</li>
                <li>Export options (PDF, Markdown)</li>
              </ul>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleLogin} className="sm:w-1/2">
            Log In
          </Button>
          <Button onClick={handleRegister} className="sm:w-1/2">
            Sign Up
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignupModal;
