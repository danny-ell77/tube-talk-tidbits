
import React from 'react';
import { Check, Eye, ThumbsUp, Calendar } from 'lucide-react';
import { abbreviateNumber } from '@/utils/textUtils';

interface YouTubePreviewCardProps {
  videoId: string;
  videoInfo?: {
    title: string;
    duration?: string;
    channelName: string;
    views?: string;
    likes?: string;
    date?: string;
  };
}

const YouTubePreviewCard: React.FC<YouTubePreviewCardProps> = ({ videoId, videoInfo }) => {
  const defaultInfo = {
    title: "YouTube Video",
    channelName: "YouTube Channel",
    views: "0 views",
    likes: "0 likes",
    date: new Date().toLocaleDateString(),
    ...(videoInfo || {})
  };

  return (
    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 my-4">
      <div className="flex items-start gap-4">
        <Check className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" size={20} />
        <div className="flex-1">
          <h3 className="font-medium text-green-800 dark:text-green-300">{defaultInfo.title}</h3>
          <div className="flex items-center gap-4 mt-2">
            <div className="relative rounded-md overflow-hidden w-32 h-24 bg-black flex-shrink-0">
              <img 
                src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`} 
                alt="Video thumbnail"
                className="object-cover w-full h-full"
              />
              <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                {defaultInfo.duration}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <span className="inline-block w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded-full mr-1"></span>
                  {defaultInfo.channelName}
                </span>
              </div>
              <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Eye size={14} />
                  {abbreviateNumber(+defaultInfo.views)}
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsUp size={14} />
                  {abbreviateNumber(+defaultInfo.likes)}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(defaultInfo.date).toDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouTubePreviewCard;
