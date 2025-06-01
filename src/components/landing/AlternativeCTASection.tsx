import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";

const AlternativeCTASection = () => {
  return (
    <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900" id="pricing">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Not Sure Yet? Try It Risk-Free!</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
          Start with 2 free summaries (no login) or sign up for 5 now with no credit card!
        </p>
        
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
          <div className="flex flex-col items-center space-y-6">
            <Cookie className="h-16 w-16 text-red-600" />
            <div className="space-y-4 text-center">
              <h3 className="text-2xl font-semibold">5 Free Digests</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Experience the full power of Digestly with 5 free video digests. Perfect for evaluating how our tool can help you save time and extract valuable information.
              </p>
              <ul className="text-left space-y-2 max-w-md mx-auto">
                <li className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-green-500 mr-2"></div>
                  <span>No credit card required</span>
                </li>
                <li className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-green-500 mr-2"></div>
                  <span>Full access to all digest types</span>
                </li>
                <li className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-green-500 mr-2"></div>
                  <span>Export to PDF for easy sharing</span>
                </li>
                <li className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-green-500 mr-2"></div>
                  <span>Pay-as-you-go after free digests</span>
                </li>
              </ul>
            </div>
            <Link to="/register">
              <Button size="lg" className="px-8 py-6 text-lg font-medium">
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AlternativeCTASection;
