import React from 'react';
import SummaryCard from '@/components/SummaryCard';
import { DigestResult } from '@/services/youtubeDigestService';
import { ArrowLeft } from 'lucide-react';

interface HistoryViewProps {
  history: DigestResult[];
  onClearHistory: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onClearHistory }) => {
  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4 space-y-3" style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', position: 'sticky', top: 73, zIndex: 10 }}>
        <h2 className="text-base font-semibold">Previous Digests</h2>
        <div className="flex justify-between items-center">
          <button 
            onClick={() => window.history.back()} 
            className="border border-gray-300 dark:border-gray-600 px-3 py-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-sm inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          {history.length > 0 && <button 
            onClick={onClearHistory} 
            className="border border-red-500 text-red-500 px-3 py-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900 text-sm"
          >
            Clear Digests
          </button>}
        </div>
      </div>
      
      {history.length > 0 ? (
        history.map((item, index) => (
          <SummaryCard key={index} {...item} />
        ))
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400 p-12 text-sm">
          No digest history found. Create one to see results here.
        </div>
      )}
    </div>
  );
};

export default HistoryView;
