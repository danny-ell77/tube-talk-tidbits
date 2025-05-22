
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FileText, Download, File, Cookie } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { toast } from "sonner";
import { jsPDF } from 'jspdf';
import { marked } from "marked";

interface ExportButtonProps {
  content: string;
  title: string;
  videoUrl: string;
  timestamp: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ content, title, videoUrl, timestamp }) => {
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
    try {
      const doc = new jsPDF({
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      });

      // Set up the document
      doc.setFontSize(24);
      doc.setTextColor(30, 64, 175); // Digest blue color
      const titleLines = doc.splitTextToSize(title, 180);
      doc.text(titleLines, 15, 20);
      
      // Add content
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      const textLines = doc.splitTextToSize(content, 180);
      doc.text(textLines, 15, 40);

      // Add metadata
      doc.setFontSize(10);
      doc.setTextColor(107, 114, 128); // Gray color
      doc.text(`Source: ${videoUrl}`, 15, doc.internal.pageSize.height - 20);
      doc.text(`Generated: ${timestamp}`, 15, doc.internal.pageSize.height - 15);

      // Save the PDF
      const filename = `${title.substring(0, 50)}_summary.pdf`;
      doc.save(filename);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
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
