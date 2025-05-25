import React from 'react';
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { toast } from "sonner";
import html2pdf from 'html2pdf.js';
import { marked } from "marked";

interface ExportPDFProps {
  content: string;
  title: string;
  videoUrl: string;
  timestamp: string;
  creator?: string;
}

const ExportPDF: React.FC<ExportPDFProps> = ({ content, title, videoUrl, timestamp, creator }) => {
  const exportToPDF = async () => {
    try {
      // Create a temporary div to hold the formatted content
      const element = document.createElement('div');
      element.innerHTML = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto;">
          <h1 style="color: #1E40AF; margin-bottom: 20px;">${title}</h1>
          <div style="margin-bottom: 20px; white-space: pre-wrap;">${marked(content)}</div>          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />
          <div style="color: #6B7280; font-size: 12px;">
            <p>Source: ${videoUrl}</p>
            ${creator ? `<p><strong>Creator: ${creator}</strong></p>` : ''}
            <p>Generated: ${timestamp}</p>
          </div>
        </div>
      `;

      // Configure PDF options
      const opt = {
        margin: [10, 10],
        filename: `${title.substring(0, 50)}_summary.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // Generate PDF
      toast.promise(html2pdf().set(opt).from(element).save(), {
        loading: 'Generating PDF...',
        success: 'PDF downloaded successfully!',
        error: 'Failed to generate PDF'
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  return (
    <Button
      variant="outline"
      onClick={exportToPDF}
      className="flex items-center justify-center gap-2 w-full sm:w-auto min-h-[44px] sm:min-h-0"
    >
      <FileDown className="h-4 w-4" />
      Export PDF
    </Button>
  );
};

export default ExportPDF;
