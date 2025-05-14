
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FileText, Download, File } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { toast } from "sonner";

interface ExportButtonProps {
  content: string;
  title: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ content, title }) => {
  const exportToMarkdown = () => {
    const markdownContent = content;
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Exported to Markdown successfully!");
  };

  const exportToPDF = () => {
    // In a real app, we would use a library like jsPDF
    // For now, we'll just show a toast
    toast.info("PDF export is coming soon!");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0">
        <div className="flex flex-col">
          <button 
            onClick={exportToMarkdown}
            className="flex items-center gap-2 p-3 hover:bg-gray-100 transition-colors w-full text-left"
          >
            <FileText className="h-4 w-4" />
            Markdown (.md)
          </button>
          <button 
            onClick={exportToPDF}
            className="flex items-center gap-2 p-3 hover:bg-gray-100 transition-colors w-full text-left"
          >
            <File className="h-4 w-4" />
            PDF (.pdf)
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ExportButton;
