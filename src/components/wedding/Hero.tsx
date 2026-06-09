'use client';

import { motion } from 'framer-motion';
import { Wedding, ThemeColors } from '@/types/wedding';

interface HeroProps {
  wedding: Wedding;
  colors: ThemeColors;
}

export default function Hero({ wedding, colors }: HeroProps) {
  const hasCoverImage = !!wedding.coverImage;

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden" dir="rtl">
      {/* Background */}
      {hasCoverImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${wedding.coverImage})` }}
        >
          <div className="absolute inset-0" style={{ backgroundColor: colors.background + 'CC' }} />
        </div>
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.secondary} 50%, ${colors.background} 100%)`,
          }}
        />
      )}

      {/* Islamic geometric pattern overlay */}
      <div className="absolute inset-0 opacity-10" style={{ color: colors.primary }}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="islamic-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M30 0L60 30L30 60L0 30Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <path d="M30 10L50 30L30 50L10 30Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="30" cy="30" r="8" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="0" cy="0" r="4" fill="none" stroke="currentColor" strokeWidth="0.3" />
              <circle cx="60" cy="0" r="4" fill="none" stroke="currentColor" strokeWidth="0.3" />
              <circle cx="0" cy="60" r="4" fill="none" stroke="currentColor" strokeWidth="0.3" />
              <circle cx="60" cy="60" r="4" fill="none" stroke="currentColor" strokeWidth="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
        </svg>
      </div>

      {/* Decorative corner ornaments */}
      <div className="absolute top-0 left-0 w-32 h-32 sm:w-48 sm:h-48 opacity-20">
        <svg viewBox="0 0 200 200" className="w-full h-full" style={{ color: colors.primary }}>
          <path d="M0 0 Q100 0 100 100 Q0 100 0 0Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M0 0 Q70 0 70 70 Q0 70 0 0Z" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M0 0 Q40 0 40 40 Q0 40 0 0Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 opacity-20" style={{ transform: 'scaleX(-1)' }}>
        <svg viewBox="0 0 200 200" className="w-full h-full" style={{ color: colors.primary }}>
          <path d="M0 0 Q100 0 100 100 Q0 100 0 0Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M0 0 Q70 0 70 70 Q0 70 0 0Z" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M0 0 Q40 0 40 40 Q0 40 0 0Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 opacity-20" style={{ transform: 'scaleY(-1)' }}>
        <svg viewBox="0 0 200 200" className="w-full h-full" style={{ color: colors.primary }}>
          <path d="M0 0 Q100 0 100 100 Q0 100 0 0Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M0 0 Q70 0 70 70 Q0 70 0 0Z" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 w-32 h-32 sm:w-48 sm:h-48 opacity-20" style={{ transform: 'scale(-1)' }}>
        <svg viewBox="0 0 200 200" className="w-full h-full" style={{ color: colors.primary }}>
          <path d="M0 0 Q100 0 100 100 Q0 100 0 0Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M0 0 Q70 0 70 70 Q0 70 0 0Z" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        {/* Basmala */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <p
            className="text-lg sm:text-xl md:text-2xl mb-6 font-serif tracking-wide"
            style={{ color: colors.primary + 'DD' }}
          >
            بسم الله الرحمن الرحيم
          </p>
        </motion.div>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <div className="h-px w-12 sm:w-20" style={{ backgroundColor: colors.primary + '60' }} />
          <div className="w-3 h-3 rotate-45" style={{ backgroundColor: colors.primary }} />
          <div className="h-px w-12 sm:w-20" style={{ backgroundColor: colors.primary + '60' }} />
        </motion.div>

        {/* Groom & Bride names */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8, type: 'spring' }}
          className="mb-6"
        >
          <h1
            className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight"
            style={{ color: colors.primary }}
          >
            {wedding.groomName}
          </h1>
          <div className="my-3 flex items-center justify-center gap-4">
            <div className="h-px w-8" style={{ backgroundColor: colors.primary + '60' }} />
            <span className="text-2xl sm:text-3xl" style={{ color: colors.accent }}>
              &
            </span>
            <div className="h-px w-8" style={{ backgroundColor: colors.primary + '60' }} />
          </div>
          <h1
            className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight"
            style={{ color: colors.primary }}
          >
            {wedding.brideName}
          </h1>
        </motion.div>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <div className="h-px w-12 sm:w-20" style={{ backgroundColor: colors.primary + '60' }} />
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
          <div className="h-px w-12 sm:w-20" style={{ backgroundColor: colors.primary + '60' }} />
        </motion.div>

        {/* Invitation text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="text-lg sm:text-xl md:text-2xl font-serif"
          style={{ color: colors.text + 'DD' }}
        >
          يتشرفان بدعوتكم لحضور حفل زفافهما
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 flex items-start justify-center pt-2"
            style={{ borderColor: colors.primary + '60' }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: colors.primary }}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
