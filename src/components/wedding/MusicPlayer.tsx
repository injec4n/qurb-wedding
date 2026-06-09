'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { ThemeColors } from '@/types/wedding';

interface MusicPlayerProps {
  musicUrl: string;
  colors: ThemeColors;
}

export default function MusicPlayer({ musicUrl, colors }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!musicUrl) return;

    const audio = new Audio(musicUrl);
    audio.loop = true;
    audio.preload = 'none';
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [musicUrl]);

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

  if (!musicUrl) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50" dir="rtl">
      <motion.button
        onClick={togglePlay}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors duration-300"
        style={{
          backgroundColor: colors.button,
          color: colors.background,
        }}
        aria-label={isPlaying ? 'إيقاف الموسيقى' : 'تشغيل الموسيقى'}
      >
        {/* Pulse animation when playing */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.8, opacity: 0 }}
              exit={{ scale: 1, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: colors.button + '40' }}
            />
          )}
        </AnimatePresence>

        {/* Second pulse ring */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              initial={{ scale: 1, opacity: 0.3 }}
              animate={{ scale: 2.2, opacity: 0 }}
              exit={{ scale: 1, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: colors.button + '30' }}
            />
          )}
        </AnimatePresence>

        {isPlaying ? (
          <Volume2 className="w-6 h-6 relative z-10" />
        ) : (
          <VolumeX className="w-6 h-6 relative z-10" />
        )}
      </motion.button>

      {/* Tooltip */}
      <div
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          backgroundColor: colors.background,
          color: colors.text,
          border: `1px solid ${colors.primary}30`,
        }}
      >
        {isPlaying ? 'إيقاف الموسيقى' : 'تشغيل الموسيقى'}
      </div>
    </div>
  );
}
