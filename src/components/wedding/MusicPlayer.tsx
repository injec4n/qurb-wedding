'use client';

import { useState, useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
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
  const [showTooltip, setShowTooltip] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!musicUrl) return;

    const audio = new Audio(musicUrl);
    audio.loop = true;
    audio.preload = 'auto';
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [musicUrl]);

  const startPlayback = useCallback(async () => {
    if (!audioRef.current || isPlaying) return;
    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch {
      // Autoplay may be blocked
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
      // Autoplay may be blocked
      setIsPlaying(false);
    }
  }, [isPlaying]);

  // Expose play method to parent via ref
  useImperativeHandle(ref, () => ({
    play: startPlayback,
  }), [startPlayback]);

  if (!musicUrl) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40" dir="rtl">
      <motion.button
        onClick={togglePlay}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        className="relative w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-colors duration-300"
        style={{
          backgroundColor: colors.button,
          color: colors.background,
          boxShadow: `0 4px 24px ${colors.button}40`,
        }}
        aria-label={isPlaying ? 'إيقاف الموسيقى' : 'تشغيل الموسيقى'}
      >
        {/* Elegant pulse animation when playing */}
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

        {/* Second pulse ring */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              initial={{ scale: 1, opacity: 0.25 }}
              animate={{ scale: 2.2, opacity: 0 }}
              exit={{ scale: 1, opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.6, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: colors.button + '25' }}
            />
          )}
        </AnimatePresence>

        {isPlaying ? (
          <Volume2 className="w-7 h-7 relative z-10" />
        ) : (
          <VolumeX className="w-7 h-7 relative z-10" />
        )}
      </motion.button>

      {/* Tooltip - better hover behavior */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap pointer-events-none"
            style={{
              backgroundColor: colors.background,
              color: colors.text,
              border: `1px solid ${colors.primary}30`,
              boxShadow: `0 4px 12px ${colors.primary}15`,
            }}
          >
            {isPlaying ? 'إيقاف الموسيقى' : 'تشغيل الموسيقى'}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

MusicPlayer.displayName = 'MusicPlayer';

export default MusicPlayer;
