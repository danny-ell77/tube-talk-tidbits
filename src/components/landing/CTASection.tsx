
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-youtube to-red-800 text-white text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform how you consume video content?</h2>
        <p className="text-xl mb-8 opacity-90">
          Join our growing community of students, professionals, and lifelong learners.
        </p>
        <Link to="/register">
          <Button size="lg" className="bg-white text-youtube hover:bg-gray-100">
            Get Started for Free
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
