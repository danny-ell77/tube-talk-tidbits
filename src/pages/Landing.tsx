
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Check, Youtube } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from '@/components/Header';
import YoutubeInput from '@/components/YoutubeInput';
import SummaryCard from '@/components/SummaryCard';
import LoadingState from '@/components/LoadingState';
import { generateDigest, DigestResult } from '@/services/youtubeDigestService';
import { toast } from 'sonner';

const FeatureCard = ({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border flex flex-col items-center text-center">
    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const PricingCard = ({ 
  title,
  price,
  credits,
  features,
  isPopular = false,
  buttonText = "Get Started"
}: { 
  title: string;
  price: string;
  credits: number;
  features: string[];
  isPopular?: boolean;
  buttonText?: string;
}) => (
  <div className={`bg-white rounded-xl shadow-sm border overflow-hidden ${isPopular ? 'ring-2 ring-primary' : ''}`}>
    {isPopular && (
      <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
        Most Popular
      </div>
    )}
    <div className="p-6">
      <h3 className="text-xl font-bold">{title}</h3>
      <div className="mt-4 flex items-baseline">
        <span className="text-3xl font-extrabold">{price}</span>
        {price !== "Free" && <span className="text-gray-500 ml-1">/mo</span>}
      </div>
      <p className="mt-1 text-sm text-gray-500">
        {credits} credits per month
      </p>
      <ul className="mt-6 space-y-3">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
            <span className="text-gray-600 text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <Button className="w-full">{buttonText}</Button>
      </div>
    </div>
  </div>
);

const Landing = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<DigestResult | null>(null);
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(false);
  
  // Toggle premium status (for demo purposes)
  const togglePremiumStatus = () => {
    const newStatus = !isPremiumUser;
    setIsPremiumUser(newStatus);
    toast.success(newStatus ? "Premium features activated!" : "Premium features deactivated");
  };
  
  // Handle the submission of YouTube URL for digest
  const handleSubmit = async (url: string, type: string, customPrompt?: string, model: string = "standard") => {
    setIsLoading(true);
    try {
      const result = await generateDigest(url, type, customPrompt, model);
      setCurrentResult(result);
      
      // Switch to the result tab
      document.querySelector('[data-state="inactive"][value="result"]')?.click();
      
      toast.success("Digest generated successfully!");
    } catch (error) {
      console.error('Error generating digest:', error);
      toast.error("Failed to generate digest. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header transparent />
      
      {/* Hero Section */}
      <section className="pt-20 pb-24 px-4 bg-gradient-to-br from-primary/90 to-primary text-white">
        <div className="max-w-6xl mx-auto text-center pt-16">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            Transform YouTube Videos into Digestible Summaries
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Extract key insights, comprehensive notes, and concise summaries from any YouTube video in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button className="bg-white text-primary hover:bg-gray-100 font-semibold text-lg px-8 py-6">
                Get Started for Free
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 font-semibold text-lg px-8 py-6">
                Try Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Powerful Features for Video Analysis</h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Our AI-powered tools help you extract the most valuable information from any video content.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              title="TL;DR Summaries" 
              description="Get the key points from any video in a concise, easy-to-read format."
              icon={<Youtube className="h-6 w-6 text-primary" />}
            />
            <FeatureCard 
              title="Key Insights" 
              description="Extract the most important insights and data points from educational content."
              icon={<Youtube className="h-6 w-6 text-primary" />}
            />
            <FeatureCard 
              title="Comprehensive Notes" 
              description="Generate detailed, structured notes from lectures and long-form content."
              icon={<Youtube className="h-6 w-6 text-primary" />}
            />
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Transform any YouTube video into valuable content in just a few simple steps.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="text-lg font-semibold mb-2">Paste YouTube URL</h3>
              <p className="text-gray-600">Simply paste the link to any YouTube video you want to analyze.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="text-lg font-semibold mb-2">Choose Digest Type</h3>
              <p className="text-gray-600">Select whether you want a brief summary, key insights, or comprehensive notes.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="text-lg font-semibold mb-2">Get Your Digest</h3>
              <p className="text-gray-600">Our AI processes the video and delivers your customized content in seconds.</p>
            </div>
          </div>
          
          <div className="mt-12">
            <Button size="lg" onClick={() => {
              // Scroll to the demo section
              document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' });
            }}>Try It Now</Button>
          </div>
        </div>
      </section>
      
      {/* Demo Section with Tabs */}
      <section className="py-20 px-4 bg-white" id="demo-section">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center">See It In Action</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto text-center">
            Try the YouTube Digest tool with your own video or use one of our examples.
          </p>
          
          {/* Premium status toggle (for demo purposes) */}
          <div className="flex justify-center mb-6">
            <button 
              onClick={togglePremiumStatus}
              className={`text-sm px-4 py-1 rounded-full ${
                isPremiumUser 
                  ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {isPremiumUser ? '✨ Premium Active' : 'Activate Premium Features'}
            </button>
          </div>
          
          <div className="bg-gray-50 p-8 rounded-xl shadow-lg">
            <Tabs defaultValue="input" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger 
                  value="input"
                  disabled={isLoading}
                >
                  Create New Digest
                </TabsTrigger>
                <TabsTrigger 
                  value="result"
                  disabled={!currentResult}
                >
                  View Digest
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="input" className="space-y-4">
                <YoutubeInput 
                  onSubmit={handleSubmit} 
                  isLoading={isLoading} 
                  isPremium={isPremiumUser}
                />
                {isLoading && <LoadingState />}
              </TabsContent>
              
              <TabsContent value="result">
                {currentResult ? (
                  <SummaryCard {...currentResult} />
                ) : (
                  <div className="text-center text-gray-500 p-12">
                    No digest generated yet. Create one to see results here.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="py-20 px-4" id="pricing">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Choose the plan that works for your needs, with flexible options for individuals and teams.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <PricingCard
              title="Basic"
              price="Free"
              credits={5}
              features={[
                "5 digests per month",
                "TL;DR summaries",
                "Key insights extraction",
                "Export to Markdown"
              ]}
              buttonText="Sign Up Free"
            />
            
            <PricingCard
              title="Pro"
              price="$9.99"
              credits={50}
              features={[
                "50 digests per month",
                "All digest types",
                "Custom prompts",
                "Export to PDF & Markdown",
                "Priority processing"
              ]}
              isPopular={true}
              buttonText="Get Pro"
            />
            
            <PricingCard
              title="Team"
              price="$29.99"
              credits={200}
              features={[
                "200 digests per month",
                "5 team members",
                "Advanced AI models",
                "API access",
                "Shared workspace",
                "Dedicated support"
              ]}
              buttonText="Contact Sales"
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform how you consume video content?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students, professionals, and lifelong learners who use YouTube Digest to save time and extract valuable information.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center gap-2 mb-4">
                <Youtube className="h-6 w-6 text-white" />
                <h3 className="text-xl font-bold text-white">YouTube Digest</h3>
              </div>
              <p className="max-w-xs text-gray-400">
                Transforming video content into actionable knowledge since 2023.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
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
                  <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">© {new Date().getFullYear()} YouTube Digest. All rights reserved.</p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
