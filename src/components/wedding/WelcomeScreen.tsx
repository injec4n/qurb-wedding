'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ThemeColors } from '@/types/wedding';
import { useState, useMemo, useCallback } from 'react';

interface WelcomeScreenProps {
  guestName: string;
  groomName: string;
  brideName: string;
  colors: ThemeColors;
  onOpen: () => void;
}

// Floating gold particles
function FloatingParticles({ color, count = 25 }: { color: string; count?: number }) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      duration: 4 + Math.random() * 6,
      delay: Math.random() * 5,
    })),
    [count]
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: color,
            opacity: 0,
          }}
          animate={{
            y: [0, -30 - Math.random() * 40, 0],
            x: [0, (Math.random() - 0.5) * 20, 0],
            opacity: [0, 0.6, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// Sparkle burst effect
function SparkleBurst({ color, active }: { color: string; active: boolean }) {
  const sparkles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      angle: (i / 20) * 360,
      distance: 60 + Math.random() * 80,
      size: 3 + Math.random() * 5,
      delay: Math.random() * 0.3,
    })),
    []
  );

  return (
    <AnimatePresence>
      {active && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {sparkles.map((s) => {
            const rad = (s.angle * Math.PI) / 180;
            const tx = Math.cos(rad) * s.distance;
            const ty = Math.sin(rad) * s.distance;
            return (
              <motion.div
                key={s.id}
                className="absolute"
                style={{
                  width: s.size,
                  height: s.size,
                  backgroundColor: color,
                  borderRadius: '50%',
                }}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                animate={{
                  x: tx,
                  y: ty,
                  opacity: [0, 1, 0],
                  scale: [0, 1.2, 0],
                }}
                transition={{
                  duration: 1.2,
                  delay: s.delay,
                  ease: 'easeOut',
                }}
              />
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
}

// Islamic geometric pattern for envelope
function GeometricPattern({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{ color }}>
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="envelope-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M20 0L40 20L20 40L0 20Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="20" cy="20" r="5" fill="none" stroke="currentColor" strokeWidth="0.3" />
            <circle cx="0" cy="0" r="2" fill="currentColor" opacity="0.3" />
            <circle cx="40" cy="40" r="2" fill="currentColor" opacity="0.3" />
            <path d="M20 8L28 20L20 32L12 20Z" fill="none" stroke="currentColor" strokeWidth="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#envelope-pattern)" />
      </svg>
    </div>
  );
}

// Ornamental corner for envelope
function EnvelopeCorner({ position, color }: { position: 'tr' | 'tl' | 'br' | 'bl'; color: string }) {
  const transforms: Record<string, string> = {
    tr: '',
    tl: 'scaleX(-1)',
    br: 'scaleY(-1)',
    bl: 'scale(-1)',
  };
  const positions: Record<string, string> = {
    tr: 'top-2 right-2 sm:top-3 sm:right-3',
    tl: 'top-2 left-2 sm:top-3 sm:left-3',
    br: 'bottom-2 right-2 sm:bottom-3 sm:right-3',
    bl: 'bottom-2 left-2 sm:bottom-3 sm:left-3',
  };

  return (
    <div className={`absolute ${positions[position]}`} style={{ transform: transforms[position] }}>
      <svg viewBox="0 0 60 60" className="w-8 h-8 sm:w-10 sm:h-10" style={{ color }}>
        <path d="M0 0 L60 0 L60 12 L12 12 L12 60 L0 60Z" fill="currentColor" opacity="0.6" />
        <path d="M0 0 L40 0 L40 6 L6 6 L6 40 L0 40Z" fill="currentColor" opacity="0.4" />
        <circle cx="18" cy="18" r="3" fill="currentColor" opacity="0.5" />
      </svg>
    </div>
  );
}

// Wax seal ornament
function WaxSeal({ color }: { color: string }) {
  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, delay: 1.2, type: 'spring', stiffness: 200 }}
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center relative"
        style={{
          background: `radial-gradient(circle, ${color}35 0%, ${color}20 70%, transparent 100%)`,
          border: `2px solid ${color}50`,
          boxShadow: `0 0 20px ${color}20, inset 0 0 15px ${color}15`,
        }}
      >
        <svg viewBox="0 0 50 50" className="w-8 h-8 sm:w-9 sm:h-9" style={{ color }}>
          <path d="M25 5 L30 18 L45 18 L33 27 L37 42 L25 33 L13 42 L17 27 L5 18 L20 18Z"
            fill="none" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="25" cy="25" r="6" fill="none" stroke="currentColor" strokeWidth="0.8" />
          <circle cx="25" cy="25" r="2" fill="currentColor" opacity="0.6" />
        </svg>
      </motion.div>
    </div>
  );
}

export default function WelcomeScreen({ guestName, groomName, brideName, colors, onOpen }: WelcomeScreenProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const [cardRevealed, setCardRevealed] = useState(false);

  const handleOpen = useCallback(() => {
    if (isOpen) return;
    setIsOpen(true);

    // Phase 1: Sparkles burst
    setTimeout(() => setShowSparkles(true), 300);

    // Phase 2: Card slides out
    setTimeout(() => setCardRevealed(true), 800);

    // Phase 3: Start exit
    setTimeout(() => setIsExiting(true), 2000);

    // Phase 4: Call onOpen
    setTimeout(() => {
      onOpen();
    }, 2800);
  }, [isOpen, onOpen]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={isExiting ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: colors.background }}
      dir="rtl"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ color: colors.primary }}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="ws-bg-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M40 0L80 40L40 80L0 40Z" fill="none" stroke="currentColor" strokeWidth="0.3" />
              <circle cx="40" cy="40" r="10" fill="none" stroke="currentColor" strokeWidth="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ws-bg-pattern)" />
        </svg>
      </div>

      {/* Floating gold particles */}
      <FloatingParticles color={colors.primary + '80'} count={20} />

      {/* Sparkle burst */}
      <SparkleBurst color={colors.accent} active={showSparkles} />

      {/* Bismallah at top */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        className="absolute top-8 sm:top-12 left-0 right-0 text-center z-10"
      >
        <p
          className="text-xl sm:text-2xl font-serif tracking-[0.15em]"
          style={{ color: colors.primary + 'BB' }}
        >
          بسم الله الرحمن الرحيم
        </p>
        <div className="flex items-center justify-center gap-3 mt-3">
          <div className="h-px w-10 sm:w-16" style={{ background: `linear-gradient(to left, ${colors.primary}40, transparent)` }} />
          <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: colors.primary + '50' }} />
          <div className="h-px w-10 sm:w-16" style={{ background: `linear-gradient(to right, ${colors.primary}40, transparent)` }} />
        </div>
      </motion.div>

      {/* Main envelope area */}
      <div className="relative z-10 flex flex-col items-center px-4">
        {/* The Envelope */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, type: 'spring', stiffness: 120 }}
          className="relative"
          style={{ perspective: '1200px' }}
        >
          {/* Envelope body */}
          <div
            className="relative w-72 sm:w-80 md:w-96 rounded-2xl overflow-hidden"
            style={{
              background: `linear-gradient(145deg, ${colors.background} 0%, ${colors.secondary}25 50%, ${colors.background} 100%)`,
              border: `2px solid ${colors.primary}40`,
              boxShadow: `
                0 20px 60px ${colors.primary}15,
                0 8px 24px ${colors.primary}10,
                inset 0 1px 0 ${colors.primary}15
              `,
            }}
          >
            {/* Geometric pattern on envelope */}
            <GeometricPattern color={colors.primary} />

            {/* Corner ornaments */}
            <EnvelopeCorner position="tr" color={colors.primary} />
            <EnvelopeCorner position="tl" color={colors.primary} />
            <EnvelopeCorner position="br" color={colors.primary} />
            <EnvelopeCorner position="bl" color={colors.primary} />

            {/* Inner decorative border */}
            <div
              className="absolute inset-4 sm:inset-5 rounded-xl pointer-events-none"
              style={{ border: `1px solid ${colors.primary}20` }}
            />

            {/* Envelope content */}
            <div className="relative z-10 p-6 sm:p-8 text-center">
              {/* "Special Invitation" text */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                className="text-sm sm:text-base font-serif tracking-wider mb-2"
                style={{ color: colors.primary + '99' }}
              >
                دعوة خاصة إلى
              </motion.p>

              {/* Guest name */}
              <motion.h2
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1.2, type: 'spring' }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3"
                style={{ color: colors.primary }}
              >
                {guestName}
              </motion.h2>

              {/* Ornamental divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                className="flex items-center justify-center gap-3 mb-3"
              >
                <div className="h-px w-10 sm:w-14" style={{ backgroundColor: colors.primary + '35' }} />
                <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary + '60' }} />
                <div className="h-px w-10 sm:w-14" style={{ backgroundColor: colors.primary + '35' }} />
              </motion.div>

              {/* Couple names */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.5 }}
                className="text-base sm:text-lg font-serif"
                style={{ color: colors.text + 'AA' }}
              >
                {groomName} & {brideName}
              </motion.p>

              {/* Wax seal */}
              <div className="mt-4">
                <WaxSeal color={colors.primary} />
              </div>
            </div>

            {/* Envelope lid (3D flap) */}
            <motion.div
              initial={{ rotateX: 0 }}
              animate={isOpen ? { rotateX: -180 } : { rotateX: 0 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              className="absolute top-0 left-0 right-0 origin-top"
              style={{
                transformStyle: 'preserve-3d',
                zIndex: 20,
              }}
            >
              {/* Front of flap (visible when closed) */}
              <div
                className="relative"
                style={{
                  background: `linear-gradient(180deg, ${colors.primary}18 0%, ${colors.background} 100%)`,
                  borderBottom: `2px solid ${colors.primary}30`,
                  backfaceVisibility: 'hidden',
                }}
              >
                <svg viewBox="0 0 400 80" className="w-full" style={{ color: colors.primary + '20' }}>
                  <path d="M0 0 L200 60 L400 0Z" fill="none" stroke="currentColor" strokeWidth="1" />
                  <path d="M0 0 L200 40 L400 0Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </svg>
              </div>
              {/* Back of flap (visible when open) */}
              <div
                className="absolute inset-0"
                style={{
                  background: colors.secondary + '15',
                  transform: 'rotateX(180deg)',
                  backfaceVisibility: 'hidden',
                }}
              />
            </motion.div>

            {/* Card that slides out */}
            <AnimatePresence>
              {cardRevealed && (
                <motion.div
                  initial={{ y: 0, opacity: 0 }}
                  animate={{ y: -20, opacity: 1 }}
                  exit={{ y: -40, opacity: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="absolute inset-x-4 sm:inset-x-5 top-6 sm:top-8 bottom-4 rounded-xl z-30 flex flex-col items-center justify-center text-center"
                  style={{
                    background: `linear-gradient(145deg, ${colors.background}F5 0%, ${colors.secondary}15 50%, ${colors.background}F5 100%)`,
                    border: `1.5px solid ${colors.primary}30`,
                    boxShadow: `0 4px 20px ${colors.primary}10`,
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <p className="text-base sm:text-lg font-serif mb-2" style={{ color: colors.primary + 'CC' }}>
                    بسم الله الرحمن الرحيم
                  </p>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="h-px w-8" style={{ backgroundColor: colors.primary + '40' }} />
                    <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: colors.primary + '60' }} />
                    <div className="h-px w-8" style={{ backgroundColor: colors.primary + '40' }} />
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: colors.primary }}>
                    {groomName} و {brideName}
                  </p>
                  <p className="text-sm sm:text-base font-serif" style={{ color: colors.text + 'AA' }}>
                    يتشرفان بدعوتكم لحضور حفل زفافهما
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Open button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="mt-8 sm:mt-10"
        >
          {!isOpen && (
            <motion.button
              onClick={handleOpen}
              whileHover={{ scale: 1.05, boxShadow: `0 12px 40px ${colors.primary}50` }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 px-10 py-4 sm:py-5 rounded-2xl text-lg sm:text-xl font-bold transition-all duration-500 cursor-pointer relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                color: colors.background,
                boxShadow: `0 8px 32px ${colors.primary}30`,
              }}
            >
              {/* Pulsing glow ring */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{
                  boxShadow: `0 0 30px ${colors.primary}40, 0 0 60px ${colors.primary}20`,
                }}
                animate={{
                  opacity: [0.3, 0.7, 0.3],
                  scale: [1, 1.02, 1],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              {/* Shimmer sweep */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)`,
                  backgroundSize: '200% 100%',
                }}
                animate={{ backgroundPosition: ['-200% 0', '200% 0'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
              <span className="relative z-10">فتح الدعوة</span>
              <motion.svg
                viewBox="0 0 20 10"
                className="w-5 h-3 rotate-180 relative z-10"
                animate={{ x: [0, -4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <path d="M0 5 L10 0 L20 5" fill="none" stroke="currentColor" strokeWidth="2" />
              </motion.svg>
            </motion.button>
          )}

          {isOpen && !isExiting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-2"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors.primary + '60' }}
              />
              <p className="text-sm font-serif" style={{ color: colors.text + '88' }}>
                يُفتح لك باب الفرحة...
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Bottom ornamental line */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-6 sm:bottom-10 left-0 right-0 flex items-center justify-center gap-3"
      >
        <div className="h-px w-8" style={{ backgroundColor: colors.primary + '15' }} />
        <div className="w-1 h-1 rotate-45" style={{ backgroundColor: colors.primary + '30' }} />
        <div className="h-px w-8" style={{ backgroundColor: colors.primary + '15' }} />
      </motion.div>
    </motion.div>
  );
}
