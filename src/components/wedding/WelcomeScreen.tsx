'use client';

import { motion } from 'framer-motion';
import { ThemeColors } from '@/types/wedding';
import { useState } from 'react';

interface WelcomeScreenProps {
  guestName: string;
  groomName: string;
  brideName: string;
  colors: ThemeColors;
  onOpen: () => void;
}

export default function WelcomeScreen({ guestName, groomName, brideName, colors, onOpen }: WelcomeScreenProps) {
  const [isExiting, setIsExiting] = useState(false);

  const handleOpen = () => {
    setIsExiting(true);
    // Wait for animation before calling onOpen
    setTimeout(() => {
      onOpen();
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={isExiting ? { opacity: 0, scale: 1.02 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backgroundColor: colors.background }}
      dir="rtl"
    >
      {/* Subtle pattern background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ color: colors.primary }}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="welcome-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M30 0L60 30L30 60L0 30Z" fill="none" stroke="currentColor" strokeWidth="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#welcome-pattern)" />
        </svg>
      </div>

      {/* Corner ornaments */}
      {/* Top-right */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 opacity-15">
        <svg viewBox="0 0 200 200" className="w-full h-full" style={{ color: colors.primary }}>
          <path d="M0 0 Q100 0 100 100 Q0 100 0 0Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M0 0 Q60 0 60 60 Q0 60 0 0Z" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
      {/* Top-left */}
      <div className="absolute top-0 left-0 w-32 h-32 sm:w-48 sm:h-48 opacity-15" style={{ transform: 'scaleX(-1)' }}>
        <svg viewBox="0 0 200 200" className="w-full h-full" style={{ color: colors.primary }}>
          <path d="M0 0 Q100 0 100 100 Q0 100 0 0Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M0 0 Q60 0 60 60 Q0 60 0 0Z" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
      {/* Bottom-right */}
      <div className="absolute bottom-0 right-0 w-32 h-32 sm:w-48 sm:h-48 opacity-15" style={{ transform: 'scaleY(-1)' }}>
        <svg viewBox="0 0 200 200" className="w-full h-full" style={{ color: colors.primary }}>
          <path d="M0 0 Q100 0 100 100 Q0 100 0 0Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>
      {/* Bottom-left */}
      <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 opacity-15" style={{ transform: 'scale(-1)' }}>
        <svg viewBox="0 0 200 200" className="w-full h-full" style={{ color: colors.primary }}>
          <path d="M0 0 Q100 0 100 100 Q0 100 0 0Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-8 max-w-lg mx-auto">
        {/* Bismallah */}
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-xl sm:text-2xl font-serif tracking-[0.15em] mb-8"
          style={{ color: colors.primary + 'AA' }}
        >
          بسم الله الرحمن الرحيم
        </motion.p>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex items-center justify-center gap-3 mb-10"
        >
          <div className="h-px w-16 sm:w-24" style={{ background: `linear-gradient(to left, ${colors.primary}50, transparent)` }} />
          <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary + '60' }} />
          <div className="h-px w-16 sm:w-24" style={{ background: `linear-gradient(to right, ${colors.primary}50, transparent)` }} />
        </motion.div>

        {/* Guest name */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4" style={{ color: colors.primary }}>
            أهلاً {guestName} 🌷
          </h1>
        </motion.div>

        {/* Personal message */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="text-xl sm:text-2xl mb-3 font-serif"
          style={{ color: colors.text + 'CC' }}
        >
          تم تجهيز هذه الدعوة خصيصاً لك
        </motion.p>

        {/* Wedding couple message */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="text-lg sm:text-xl mb-10 font-serif"
          style={{ color: colors.text + '99' }}
        >
          {groomName} و {brideName} يتشرفان بدعوتك لحضور أجمل ليلة في العمر
        </motion.p>

        {/* Open button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          <button
            onClick={handleOpen}
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-xl font-bold transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
              color: colors.background,
              boxShadow: `0 8px 32px ${colors.primary}40`,
            }}
          >
            فتح الدعوة
            <svg viewBox="0 0 20 10" className="w-5 h-3 rotate-180">
              <path d="M0 5 L10 0 L20 5" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
