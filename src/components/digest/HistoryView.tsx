
import React from 'react';
import SummaryCard from '@/components/SummaryCard';
import { DigestResult } from '@/services/youtubeDigestService';

interface HistoryViewProps {
  history: DigestResult[];
  onClearHistory: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onClearHistory }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Previous Digests</h2>
        {history.length > 0 && (
          <button 
            onClick={onClearHistory}
            className="text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            Clear History
          </button>
        )}
      </div>
      
      {history.length > 0 ? (
        history.map((item, index) => (
          <SummaryCard key={index} {...item} />
        ))
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400 p-12">
          No digest history found. Create one to see results here.
        </div>
      )}
    </div>
  );
};

export default HistoryView;
