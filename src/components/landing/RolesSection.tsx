
import React from 'react';
import { GraduationCap, Microscope, Building } from "lucide-react";

const RoleOption = ({ icon, title, description, children }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg cursor-pointer role-option">
        {icon}
        <span className="font-semibold text-lg">{title}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">{description}</span>
      </div>
      <div className="role-content bg-white dark:bg-gray-800 p-4 rounded-lg mt-2 shadow-sm border">
        {children}
      </div>
    </div>
  );
};

const RolesSection = () => {
  return (
    <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900" id="roles-section">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-center">Still Not Sure?</h2>
        
        <div className="text-center mb-8">
          <p className="text-xl mb-4">
            <span className="highlight">You don't need another tab open.</span>
            <br />
            <span className="highlight">You need clarity.</span>
          </p>
        </div>
        
        <h3 className="text-2xl font-semibold mb-6 text-center">Are you a...</h3>
        
        <div className="mt-8">
          <RoleOption 
            icon={<GraduationCap className="h-6 w-6 text-youtube" />} 
            title="Student" 
            description="Save study time"
          >
            <p className="text-lg">
              Turn hour-long lectures into structured, skimmable notes. Focus on what matters—concepts, keywords, and summaries—all ready to study in minutes.
            </p>
          </RoleOption>
          
          <RoleOption 
            icon={<Microscope className="h-6 w-6 text-youtube" />} 
            title="Researcher" 
            description="Accelerate your work"
          >
            <p className="text-lg">
              Extract the key arguments, methods, and references from academic talks and technical walkthroughs. Save time and accelerate your literature reviews.
            </p>
          </RoleOption>
          
          <RoleOption 
            icon={<Building className="h-6 w-6 text-youtube" />} 
            title="Corporate Team" 
            description="Boost team efficiency"
          >
            <p className="text-lg">
              Summarize training videos, company updates, or webinars into actionable briefs your whole team can use—instantly shared, easily exported.
            </p>
          </RoleOption>
        </div>
      </div>
    </section>
  );
};

export default RolesSection;
