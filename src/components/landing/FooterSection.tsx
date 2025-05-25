import React, { useState } from 'react';
import { Youtube, MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TypeformEmbedProps {
  typeformId: string;
  onClose: () => void;
}

const TypeformEmbed: React.FC<TypeformEmbedProps> = ({ typeformId, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl h-[80vh] relative flex flex-col">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            Get in Touch
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-hidden">
          <iframe
            src='https://docs.google.com/forms/d/e/1FAIpQLSfHu9kYOyCzFld2AsZbCADcJyNqAcgc8JSyfxErMqevQyBpOQ/viewform?usp=header'
            className="w-full h-full rounded-b-lg"
            style={{ width: '100%', height: '100%'}}
            frameBorder="0"
            allow="camera; microphone; autoplay; encrypted-media;"
            title="Contact Form"
          />
        </CardContent>
      </Card>
    </div>
  );
};

const FooterSection = () => {
  const [showContactForm, setShowContactForm] = useState(false);
  
  // Replace with your actual Typeform ID
  const TYPEFORM_ID = "fABhd9Se"; // e.g., "abc123def"
  
  console.log(import.meta.env);
  const isDetailedFooterActive = Boolean(parseInt(import.meta.env.VITE_FF__DETAILED_FOOTER_SECTION_ACTIVE, 10));
  
  const openContactForm = () => {
    setShowContactForm(true);
  };
  
  const closeContactForm = () => {
    setShowContactForm(false);
  };

  return (
    <>
      <footer className="bg-gradient-to-b from-red-800 to-red-900 text-gray-300 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {isDetailedFooterActive && (
            <div className="flex flex-col md:flex-row justify-between">
              <div className="mb-8 md:mb-0">
                <div className="flex items-center gap-2 mb-4">
                  <Youtube className="h-6 w-6 text-white" />
                  <h3 className="text-xl font-bold text-white">Digestly</h3>
                </div>
                <p className="text-gray-400 max-w-md">
                  Transform lengthy videos into concise summaries, key insights, 
                  and comprehensive notes with the power of AI.
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <h4 className="text-white font-semibold mb-4">Product</h4>
                  <ul className="space-y-2">
                    <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                    <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-white font-semibold mb-4">Resources</h4>
                  <ul className="space-y-2">
                    <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-white font-semibold mb-4">Company</h4>
                  <ul className="space-y-2">
                    <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                    <li>
                      <button
                        onClick={openContactForm}
                        className="hover:text-white transition-colors text-left"
                      >
                        Contact
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Contact Us Section */}
                <div>
                  <h4 className="text-white font-semibold mb-4">Get in Touch</h4>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-400">
                      Have questions or feedback? We'd love to hear from you.
                    </p>
                    <Button
                      onClick={openContactForm}
                      className="bg-white text-red-800 hover:bg-gray-100 w-full justify-center gap-2 font-medium"
                      size="sm"
                    >
                      <Send className="h-4 w-4" />
                      Contact Us
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Simple Contact Section for when detailed footer is disabled */}
          {!isDetailedFooterActive && (
            <div className="text-center mb-8">
              <h4 className="text-white font-semibold mb-4">Help us improve</h4>
              <Button
                onClick={openContactForm}
                className="bg-white text-red-800 hover:bg-gray-100 gap-2 font-medium"
              >
                <MessageCircle className="h-4 w-4" />
                Contact Support
              </Button>
            </div>
          )}
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">© {new Date().getFullYear()} Digestly. All rights reserved.</p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              {!isDetailedFooterActive && (
                <button
                  onClick={openContactForm}
                  className="hover:text-white transition-colors"
                >
                  Contact
                </button>
              )}
            </div>
          </div>
        </div>
      </footer>

      {/* Typeform Modal */}
      {showContactForm && (
        <TypeformEmbed
          typeformId={TYPEFORM_ID}
          onClose={closeContactForm}
        />
      )}
    </>
  );
};

export default FooterSection;