
import React from 'react';
import { Separator } from "@/components/ui/separator";
import { Cookie } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-16 py-8 px-4">
      <Separator className="mb-8" />
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Cookie className="h-5 w-5 text-red-600" />
          <h3 className="text-lg font-pacifico">Digestly</h3>
        </div>
        <p className="text-sm text-gray-500">
          Simplify your YouTube experience by transforming videos into easy-to-read summaries.
        </p>
        <p className="text-xs text-gray-400 mt-4">
          © {new Date().getFullYear()} Digestly. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
