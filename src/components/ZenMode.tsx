
import React, { useEffect, useRef, useState } from 'react';
import { X, Volume2, VolumeX, Moon, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import SummaryCard from './SummaryCard';
import { DigestResult } from '@/services/youtubeDigestService';

interface ZenModeProps {
  isActive: boolean;
  onClose: () => void;
  currentResult?: DigestResult | null;
}

const ZenMode: React.FC<ZenModeProps> = ({ isActive, onClose, currentResult }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(30);
  const [fontSize, setFontSize] = useState<number>(16);

  useEffect(() => {
    // Create audio element for white noise
    if (!audioRef.current) {
      audioRef.current = new Audio('https://cdn.freesound.org/previews/364/364660_1185592-lq.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = volume / 100;
    }

    if (isActive) {
      if (!isMuted) {
        audioRef.current.play().catch(e => console.error('Error playing audio:', e));
      }
      
      // Apply font size to content
      document.documentElement.style.setProperty('--zen-font-size', `${fontSize}px`);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      // Reset font size
      document.documentElement.style.removeProperty('--zen-font-size');
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      document.documentElement.style.removeProperty('--zen-font-size');
    };
  }, [isActive, isMuted, volume, fontSize]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      if (!isMuted) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error('Error playing audio:', e));
      }
    }
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = Number(e.target.value);
    setFontSize(newSize);
    document.documentElement.style.setProperty('--zen-font-size', `${newSize}px`);
  };

  if (!isActive || !currentResult) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl bg-[#F9F8FF] dark:bg-[#121620]">
        {/* Header with controls */}
        <div className="sticky top-0 z-10 px-6 py-4 bg-[#F9F8FF] dark:bg-[#121620] border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2 text-gray-600 dark:text-gray-300"
              onClick={onClose}
            >
              <ChevronLeft size={16} />
              Exit Focus Mode
            </Button>
            
            <div className="flex items-center space-x-4">
              {/* Font size control */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 dark:text-gray-300">Aa</span>
                <input
                  type="range"
                  min="14"
                  max="22"
                  value={fontSize}
                  onChange={handleFontSizeChange}
                  className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">{fontSize}px</span>
              </div>
              
              {/* Volume control */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                  disabled={isMuted}
                  className={cn(
                    "w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700",
                    isMuted && "opacity-50"
                  )}
                />
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose}
                className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                <X size={18} />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Content area with enhanced reading experience */}
        <div className="p-6 md:p-8 zen-content">
          <SummaryCard {...currentResult} />
        </div>
      </div>
    </div>
  );
};

export default ZenMode;
