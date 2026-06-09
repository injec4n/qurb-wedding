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

      {/* Islamic geometric pattern overlay - more subtle */}
      <div className="absolute inset-0 opacity-[0.06]" style={{ color: colors.primary }}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="islamic-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M40 0L80 40L40 80L0 40Z" fill="none" stroke="currentColor" strokeWidth="0.4" />
              <path d="M40 15L65 40L40 65L15 40Z" fill="none" stroke="currentColor" strokeWidth="0.3" />
              <circle cx="40" cy="40" r="10" fill="none" stroke="currentColor" strokeWidth="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
        </svg>
      </div>

      {/* Decorative corner ornaments - larger and more visible */}
      <div className="absolute top-0 left-0 w-40 h-40 sm:w-56 sm:h-56 opacity-25">
        <svg viewBox="0 0 200 200" className="w-full h-full" style={{ color: colors.primary }}>
          <path d="M0 0 Q100 0 100 100 Q0 100 0 0Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M0 0 Q70 0 70 70 Q0 70 0 0Z" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M0 0 Q40 0 40 40 Q0 40 0 0Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="15" cy="15" r="3" fill="currentColor" opacity="0.4" />
          <circle cx="35" cy="35" r="2" fill="currentColor" opacity="0.3" />
        </svg>
      </div>
      <div className="absolute top-0 right-0 w-40 h-40 sm:w-56 sm:h-56 opacity-25" style={{ transform: 'scaleX(-1)' }}>
        <svg viewBox="0 0 200 200" className="w-full h-full" style={{ color: colors.primary }}>
          <path d="M0 0 Q100 0 100 100 Q0 100 0 0Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M0 0 Q70 0 70 70 Q0 70 0 0Z" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M0 0 Q40 0 40 40 Q0 40 0 0Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="15" cy="15" r="3" fill="currentColor" opacity="0.4" />
          <circle cx="35" cy="35" r="2" fill="currentColor" opacity="0.3" />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 w-40 h-40 sm:w-56 sm:h-56 opacity-25" style={{ transform: 'scaleY(-1)' }}>
        <svg viewBox="0 0 200 200" className="w-full h-full" style={{ color: colors.primary }}>
          <path d="M0 0 Q100 0 100 100 Q0 100 0 0Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M0 0 Q70 0 70 70 Q0 70 0 0Z" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="15" cy="15" r="3" fill="currentColor" opacity="0.4" />
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 w-40 h-40 sm:w-56 sm:h-56 opacity-25" style={{ transform: 'scale(-1)' }}>
        <svg viewBox="0 0 200 200" className="w-full h-full" style={{ color: colors.primary }}>
          <path d="M0 0 Q100 0 100 100 Q0 100 0 0Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M0 0 Q70 0 70 70 Q0 70 0 0Z" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="15" cy="15" r="3" fill="currentColor" opacity="0.4" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Bismallah with decorative frame */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="mb-8"
        >
          <div
            className="inline-block px-8 py-4 relative"
          >
            {/* Decorative frame around Bismallah */}
            <div
              className="absolute inset-0 rounded-lg"
              style={{
                border: `1px solid ${colors.primary}30`,
                backgroundColor: colors.primary + '08',
              }}
            />
            <div
              className="absolute inset-1 rounded-md"
              style={{ border: `1px solid ${colors.primary}15` }}
            />
            {/* Small corner ornaments on frame */}
            <div className="absolute top-1.5 right-1.5 w-2 h-2" style={{ color: colors.primary + '60' }}>
              <svg viewBox="0 0 10 10"><path d="M0 0 Q10 0 10 10" fill="none" stroke="currentColor" strokeWidth="1" /></svg>
            </div>
            <div className="absolute top-1.5 left-1.5 w-2 h-2" style={{ color: colors.primary + '60' }}>
              <svg viewBox="0 0 10 10"><path d="M10 0 Q0 0 0 10" fill="none" stroke="currentColor" strokeWidth="1" /></svg>
            </div>
            <div className="absolute bottom-1.5 right-1.5 w-2 h-2" style={{ color: colors.primary + '60' }}>
              <svg viewBox="0 0 10 10"><path d="M0 10 Q10 10 10 0" fill="none" stroke="currentColor" strokeWidth="1" /></svg>
            </div>
            <div className="absolute bottom-1.5 left-1.5 w-2 h-2" style={{ color: colors.primary + '60' }}>
              <svg viewBox="0 0 10 10"><path d="M10 10 Q0 10 0 0" fill="none" stroke="currentColor" strokeWidth="1" /></svg>
            </div>
            <p
              className="relative text-xl sm:text-2xl md:text-3xl font-serif tracking-widest"
              style={{ color: colors.primary + 'CC' }}
            >
              بسم الله الرحمن الرحيم
            </p>
          </div>
        </motion.div>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex items-center justify-center gap-4 mb-10"
        >
          <div className="h-px w-16 sm:w-24" style={{ backgroundColor: colors.primary + '50' }} />
          <div className="w-3 h-3 rotate-45" style={{ backgroundColor: colors.primary + '80' }} />
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
          <div className="w-3 h-3 rotate-45" style={{ backgroundColor: colors.primary + '80' }} />
          <div className="h-px w-16 sm:w-24" style={{ backgroundColor: colors.primary + '50' }} />
        </motion.div>

        {/* Groom name */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.8 }}
        >
          <h1
            className="text-5xl sm:text-6xl md:text-8xl font-bold leading-tight shimmer-text"
            style={{ color: colors.primary }}
          >
            {wedding.groomName}
          </h1>
        </motion.div>

        {/* Elegant SVG ornament between names */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.1, ease: 'easeOut' }}
          className="my-4 sm:my-6 flex items-center justify-center"
        >
          <div className="h-px w-10 sm:w-16" style={{ backgroundColor: colors.primary + '40' }} />
          <svg
            viewBox="0 0 60 40"
            className="w-14 h-10 sm:w-20 sm:h-14 mx-2"
            style={{ color: colors.accent }}
          >
            {/* Elegant ornamental ampersand design */}
            <path
              d="M30 5 C20 5, 10 12, 10 20 C10 28, 18 32, 25 28 L30 25 L35 28 C42 32, 50 28, 50 20 C50 12, 40 5, 30 5Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
            <path d="M30 12 L30 28" stroke="currentColor" strokeWidth="0.8" />
            <circle cx="30" cy="8" r="2" fill="currentColor" opacity="0.6" />
            <circle cx="15" cy="20" r="1.5" fill="currentColor" opacity="0.4" />
            <circle cx="45" cy="20" r="1.5" fill="currentColor" opacity="0.4" />
            <path d="M5 20 L12 20" stroke="currentColor" strokeWidth="0.6" />
            <path d="M48 20 L55 20" stroke="currentColor" strokeWidth="0.6" />
            {/* Diamond shapes */}
            <path d="M30 2 L32 5 L30 8 L28 5Z" fill="currentColor" opacity="0.5" />
            <path d="M30 32 L32 35 L30 38 L28 35Z" fill="currentColor" opacity="0.5" />
          </svg>
          <div className="h-px w-10 sm:w-16" style={{ backgroundColor: colors.primary + '40' }} />
        </motion.div>

        {/* Bride name */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.8 }}
        >
          <h1
            className="text-5xl sm:text-6xl md:text-8xl font-bold leading-tight shimmer-text"
            style={{ color: colors.primary }}
          >
            {wedding.brideName}
          </h1>
        </motion.div>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="flex items-center justify-center gap-4 mt-8 mb-8"
        >
          <div className="h-px w-16 sm:w-24" style={{ backgroundColor: colors.primary + '50' }} />
          <div className="w-2.5 h-2.5 rotate-45" style={{ backgroundColor: colors.primary + '70' }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.primary }} />
          <div className="w-2.5 h-2.5 rotate-45" style={{ backgroundColor: colors.primary + '70' }} />
          <div className="h-px w-16 sm:w-24" style={{ backgroundColor: colors.primary + '50' }} />
        </motion.div>

        {/* Romantic Arabic subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="text-xl sm:text-2xl md:text-3xl font-serif mb-3"
          style={{ color: colors.text + 'DD' }}
        >
          يتشرفان بدعوتكم لحضور أجمل ليالي العمر
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="text-base sm:text-lg font-serif"
          style={{ color: colors.text + 'AA' }}
        >
          حفل زفافهما
        </motion.p>

        {/* Scroll indicator - more elegant */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2"
          >
            <div
              className="w-5 h-8 rounded-full border flex items-start justify-center pt-1.5"
              style={{ borderColor: colors.primary + '50' }}
            >
              <motion.div
                animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1 h-1.5 rounded-full"
                style={{ backgroundColor: colors.primary }}
              />
            </div>
            <svg
              viewBox="0 0 20 10"
              className="w-4 h-2"
              style={{ color: colors.primary + '60' }}
            >
              <path d="M0 0 L10 8 L20 0" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* Shimmer animation keyframes */}
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .shimmer-text {
          background: linear-gradient(
            90deg,
            ${colors.primary} 0%,
            ${colors.accent} 25%,
            ${colors.primary} 50%,
            ${colors.accent} 75%,
            ${colors.primary} 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 6s linear infinite;
        }
      `}</style>
    </div>
  );
}
