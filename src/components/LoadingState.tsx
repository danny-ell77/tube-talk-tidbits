
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Cookie } from "lucide-react";

const LoadingState: React.FC = () => {
  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg">
      <div className="p-6 flex flex-col items-center justify-center space-y-4">
        <div className="flex items-center space-x-3">
          <Cookie className="h-8 w-8 text-red-600 animate-pulse" />
          <div className="text-xl font-semibold animate-pulse-slow">Processing your video...</div>
        </div>
        
        <Separator />
        
        <div className="space-y-4 w-full">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
        </div>
        
        <p className="text-sm text-muted-foreground">
          This might take a minute or two depending on the length of the video.
        </p>
      </div>
    </Card>
  );
};

export default LoadingState;
