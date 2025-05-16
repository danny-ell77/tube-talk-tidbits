
import React, { useEffect, useRef, useState } from 'react';
import { X, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer';

interface ZenModeProps {
  isActive: boolean;
  onClose: () => void;
}

const ZenMode: React.FC<ZenModeProps> = ({ isActive, onClose }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(30);

  useEffect(() => {
    // Create audio element for white noise
    if (!audioRef.current) {
      audioRef.current = new Audio('https://cdn.freesound.org/previews/364/364660_1185592-lq.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = volume / 100; // Start at 30% volume
    }

    if (isActive) {
      if (!isMuted) {
        audioRef.current.play().catch(e => console.error('Error playing audio:', e));
      }
      
      // Apply focus mode styles to body
      document.body.classList.add('zen-mode-active');
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      document.body.classList.remove('zen-mode-active');
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      document.body.classList.remove('zen-mode-active');
    };
  }, [isActive, isMuted, volume]);

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

  if (!isActive) return null;

  return (
    <>
      {/* Overlay effect */}
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-30" onClick={onClose} />

      {/* Zen mode controls drawer */}
      <Drawer open={isActive} onOpenChange={onClose}>
        <DrawerContent className="bg-white dark:bg-gray-800 rounded-t-xl max-w-sm mx-auto">
          <DrawerHeader>
            <DrawerTitle className="text-center">Focus Mode</DrawerTitle>
            <DrawerClose className="absolute right-4 top-4">
              <X size={18} />
            </DrawerClose>
          </DrawerHeader>
          <div className="p-4">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="volume" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    White Noise Volume
                  </label>
                  <button 
                    onClick={toggleMute} 
                    className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                  >
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                </div>
                <input
                  id="volume"
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                  disabled={isMuted}
                  className={cn(
                    "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700",
                    isMuted && "opacity-50"
                  )}
                />
              </div>
              
              <div className="pt-4 flex justify-center">
                <Button onClick={onClose} variant="outline">
                  Exit Focus Mode
                </Button>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ZenMode;
