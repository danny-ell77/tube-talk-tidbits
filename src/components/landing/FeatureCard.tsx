
import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FeatureCard = ({ title, description, icon }: FeatureCardProps) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border flex flex-col items-center text-center">
    <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default FeatureCard;
