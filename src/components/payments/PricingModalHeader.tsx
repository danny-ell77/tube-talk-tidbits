import React from 'react';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Cookie } from "lucide-react";

interface PricingModalHeaderProps {
  title?: string;
  description?: string;
}

const PricingModalHeader: React.FC<PricingModalHeaderProps> = ({
  title = "Upgrade Your Account",
  description = "You're out of credits! Choose a plan to continue generating digests."
}) => {
  return (
    <DialogHeader className="px-2 sm:px-6">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Cookie className="h-8 w-8 text-youtube" />
      </div>
      <DialogTitle className="text-center text-xl">{title}</DialogTitle>
      <DialogDescription className="text-center text-sm sm:text-base px-1">
        {description}
      </DialogDescription>
    </DialogHeader>
  );
};

export default PricingModalHeader;
