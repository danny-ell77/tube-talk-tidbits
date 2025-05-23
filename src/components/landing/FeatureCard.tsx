
import React from 'react';
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FeatureCard = ({ title, description, icon }: FeatureCardProps) => (
  <div className="group bg-card p-6 rounded-lg shadow-sm border flex flex-col items-center text-center transition-all duration-300 hover:shadow-md hover:scale-[1.02] hover:border-digest-blue/20" style={{ transition: "all 0.3s ease-in-out !important" }}>
    <div className="h-12 w-12 rounded-full bg-digest-red/10 flex items-center justify-center mb-4 transition-colors group-hover:bg-digest-red/20">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-2 text-foreground transition-colors group-hover:text-digest-red">{title}</h3>
    <p className="text-muted-foreground text-base">{description}</p>
  </div>
);

export default FeatureCard;
