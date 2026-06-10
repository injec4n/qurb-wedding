'use client';

import { useState, useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Volume1 } from 'lucide-react';
import { ThemeColors } from '@/types/wedding';

interface MusicPlayerProps {
  musicUrl: string;
  colors: ThemeColors;
}

export interface MusicPlayerHandle {
  play: () => void;
}

const MusicPlayer = forwardRef<MusicPlayerHandle, MusicPlayerProps>(({ musicUrl, colors }, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!musicUrl) return;

    const audio = new Audio(musicUrl);
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = volume;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [musicUrl]);

  // Sync volume to audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const startPlayback = useCallback(async () => {
    if (!audioRef.current || isPlaying) return;
    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }, [isPlaying]);

  const togglePlay = useCallback(async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch {
      setIsPlaying(false);
    }
  }, [isPlaying]);

  // Expose play method to parent via ref
  useImperativeHandle(ref, () => ({
    play: startPlayback,
  }), [startPlayback]);

  if (!musicUrl) return null;

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className="fixed bottom-6 left-6 z-40" dir="rtl">
      {/* Expanded controls panel */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-0 mb-3 p-4 rounded-2xl min-w-[200px]"
            style={{
              backgroundColor: colors.background,
              border: `1px solid ${colors.primary}25`,
              boxShadow: `0 8px 32px ${colors.primary}15`,
            }}
          >
            {/* Play/Pause */}
            <div className="flex items-center justify-center gap-4 mb-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={togglePlay}
                className="w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300"
                style={{
                  backgroundColor: isPlaying ? colors.button : colors.primary + '20',
                  color: isPlaying ? colors.background : colors.primary,
                }}
              >
                {isPlaying ? (
                  <Volume2 className="w-5 h-5" />
                ) : (
                  <VolumeX className="w-5 h-5" />
                )}
              </motion.button>
              <span className="text-sm font-medium" style={{ color: colors.text + 'BB' }}>
                {isPlaying ? 'يعمل الآن' : 'إيقاف مؤقت'}
              </span>
            </div>

            {/* Volume slider */}
            <div className="flex items-center gap-3">
              <VolumeX
                className="w-4 h-4 shrink-0 cursor-pointer"
                style={{ color: colors.text + '66' }}
                onClick={() => setVolume(0)}
              />
              <div className="relative flex-1 h-2 rounded-full cursor-pointer group" style={{ backgroundColor: colors.primary + '20' }}>
                <div
                  className="absolute right-0 top-0 h-full rounded-full transition-all duration-150"
                  style={{
                    width: `${volume * 100}%`,
                    backgroundColor: colors.button,
                  }}
                />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  dir="ltr"
                />
                {/* Thumb indicator */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full shadow-md transition-all duration-150"
                  style={{
                    right: `calc(${volume * 100}% - 8px)`,
                    backgroundColor: colors.button,
                    boxShadow: `0 2px 8px ${colors.button}40`,
                  }}
                />
              </div>
              <Volume2
                className="w-4 h-4 shrink-0 cursor-pointer"
                style={{ color: colors.text + '66' }}
                onClick={() => setVolume(1)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main floating button */}
      <motion.button
        onClick={() => setShowControls(!showControls)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-colors duration-300"
        style={{
          backgroundColor: colors.button,
          color: colors.background,
          boxShadow: `0 4px 24px ${colors.button}40`,
        }}
        aria-label={isPlaying ? 'إيقاف الموسيقى' : 'تشغيل الموسيقى'}
      >
        {/* Pulse animation when playing */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              initial={{ scale: 1, opacity: 0.4 }}
              animate={{ scale: 1.8, opacity: 0 }}
              exit={{ scale: 1, opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: colors.button + '35' }}
            />
          )}
        </AnimatePresence>

        <VolumeIcon className="w-6 h-6 relative z-10" />
      </motion.button>
    </div>
  );
});

MusicPlayer.displayName = 'MusicPlayer';

export default MusicPlayer;
