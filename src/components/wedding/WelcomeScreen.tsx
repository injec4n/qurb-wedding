'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ThemeColors } from '@/types/wedding';
import { useState, useMemo, useCallback } from 'react';

interface WelcomeScreenProps {
  guestName: string;
  groomName: string;
  brideName: string;
  colors: ThemeColors;
  couplePhoto?: string;
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

export default function WelcomeScreen({ guestName, groomName, brideName, colors, couplePhoto, onOpen }: WelcomeScreenProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const [invitationRevealed, setInvitationRevealed] = useState(false);

  const handleOpen = useCallback(() => {
    if (isOpen) return;
    setIsOpen(true);

    // Phase 1: Sparkles burst
    setTimeout(() => setShowSparkles(true), 300);

    // Phase 2: Reveal invitation content
    setTimeout(() => setInvitationRevealed(true), 600);

    // Phase 3: Start exit
    setTimeout(() => setIsExiting(true), 3000);

    // Phase 4: Call onOpen
    setTimeout(() => {
      onOpen();
    }, 3800);
  }, [isOpen, onOpen]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={isExiting ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#1a1a2e' }}
      dir="rtl"
    >
      {/* Dark background with subtle gradient */}
      <div className="absolute inset-0" style={{
        background: `radial-gradient(ellipse at 50% 30%, ${colors.primary}12 0%, #1a1a2e 70%)`,
      }} />

      {/* Geometric pattern overlay */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ color: colors.primary }}>
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
      <FloatingParticles color={colors.primary + '60'} count={20} />

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
          style={{ color: colors.primary + 'CC' }}
        >
          بسم الله الرحمن الرحيم
        </p>
        <div className="flex items-center justify-center gap-3 mt-3">
          <div className="h-px w-10 sm:w-16" style={{ background: `linear-gradient(to left, ${colors.primary}40, transparent)` }} />
          <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: colors.primary + '50' }} />
          <div className="h-px w-10 sm:w-16" style={{ background: `linear-gradient(to right, ${colors.primary}40, transparent)` }} />
        </div>
      </motion.div>

      {/* Main content area */}
      <div className="relative z-10 flex flex-col items-center px-4 w-full max-w-md">
        {/* Envelope */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{
            opacity: isOpen ? 0 : 1,
            scale: isOpen ? 1.1 : 1,
            y: isOpen ? -20 : 0,
          }}
          transition={{ duration: isOpen ? 0.6 : 1, delay: isOpen ? 0 : 0.5, type: isOpen ? 'tween' : 'spring', stiffness: 120 }}
          className="relative w-full"
        >
          {/* Envelope body - dark with gold borders */}
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: `linear-gradient(145deg, #1e1e38 0%, #2a2a4a 50%, #1e1e38 100%)`,
              border: `2px solid ${colors.primary}50`,
              boxShadow: `
                0 20px 60px rgba(0,0,0,0.4),
                0 0 40px ${colors.primary}10,
                inset 0 1px 0 ${colors.primary}20
              `,
            }}
          >
            {/* Inner gold border line */}
            <div
              className="absolute inset-3 sm:inset-4 rounded-xl pointer-events-none"
              style={{ border: `1px solid ${colors.primary}25` }}
            />

            {/* Geometric pattern on envelope */}
            <div className="absolute inset-0 opacity-[0.06]" style={{ color: colors.primary }}>
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="envelope-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M20 0L40 20L20 40L0 20Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    <circle cx="20" cy="20" r="5" fill="none" stroke="currentColor" strokeWidth="0.3" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#envelope-pattern)" />
              </svg>
            </div>

            {/* Corner ornaments */}
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-8 h-8 sm:w-10 sm:h-10" style={{ color: colors.primary + '60' }}>
              <svg viewBox="0 0 60 60" className="w-full h-full">
                <path d="M0 0 L60 0 L60 12 L12 12 L12 60 L0 60Z" fill="currentColor" opacity="0.6" />
                <circle cx="18" cy="18" r="3" fill="currentColor" opacity="0.5" />
              </svg>
            </div>
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 w-8 h-8 sm:w-10 sm:h-10" style={{ color: colors.primary + '60', transform: 'scaleX(-1)' }}>
              <svg viewBox="0 0 60 60" className="w-full h-full">
                <path d="M0 0 L60 0 L60 12 L12 12 L12 60 L0 60Z" fill="currentColor" opacity="0.6" />
                <circle cx="18" cy="18" r="3" fill="currentColor" opacity="0.5" />
              </svg>
            </div>
            <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-8 h-8 sm:w-10 sm:h-10" style={{ color: colors.primary + '60', transform: 'scaleY(-1)' }}>
              <svg viewBox="0 0 60 60" className="w-full h-full">
                <path d="M0 0 L60 0 L60 12 L12 12 L12 60 L0 60Z" fill="currentColor" opacity="0.6" />
                <circle cx="18" cy="18" r="3" fill="currentColor" opacity="0.5" />
              </svg>
            </div>
            <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 w-8 h-8 sm:w-10 sm:h-10" style={{ color: colors.primary + '60', transform: 'scale(-1)' }}>
              <svg viewBox="0 0 60 60" className="w-full h-full">
                <path d="M0 0 L60 0 L60 12 L12 12 L12 60 L0 60Z" fill="currentColor" opacity="0.6" />
                <circle cx="18" cy="18" r="3" fill="currentColor" opacity="0.5" />
              </svg>
            </div>

            {/* Envelope content */}
            <div className="relative z-10 p-6 sm:p-8 text-center">
              {/* "Special Invitation" text */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                className="text-sm sm:text-base font-serif tracking-wider mb-4"
                style={{ color: colors.primary + '99' }}
              >
                دعوة خاصة إلى
              </motion.p>

              {/* Guest name */}
              <motion.h2
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1.2, type: 'spring' }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
                style={{ color: colors.primary }}
              >
                {guestName}
              </motion.h2>

              {/* Ornamental divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                className="flex items-center justify-center gap-3 mb-4"
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
                style={{ color: '#ffffffAA' }}
              >
                {groomName} & {brideName}
              </motion.p>

              {/* Wax seal */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 1.7, type: 'spring', stiffness: 200 }}
                className="mt-6 flex justify-center"
              >
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center relative"
                  style={{
                    background: `radial-gradient(circle, ${colors.primary}35 0%, ${colors.primary}20 70%, transparent 100%)`,
                    border: `2px solid ${colors.primary}50`,
                    boxShadow: `0 0 20px ${colors.primary}20, inset 0 0 15px ${colors.primary}15`,
                  }}
                >
                  <svg viewBox="0 0 50 50" className="w-8 h-8 sm:w-9 sm:h-9" style={{ color: colors.primary }}>
                    <path d="M25 5 L30 18 L45 18 L33 27 L37 42 L25 33 L13 42 L17 27 L5 18 L20 18Z"
                      fill="none" stroke="currentColor" strokeWidth="1.2" />
                    <circle cx="25" cy="25" r="6" fill="none" stroke="currentColor" strokeWidth="0.8" />
                    <circle cx="25" cy="25" r="2" fill="currentColor" opacity="0.6" />
                  </svg>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Open button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.0 }}
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
                color: '#1a1a2e',
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
              <p className="text-sm font-serif" style={{ color: '#ffffff88' }}>
                يُفتح لك باب الفرحة...
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Revealed invitation content - appears after envelope opens */}
        <AnimatePresence>
          {invitationRevealed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute inset-0 flex items-center justify-center px-4"
            >
              <div
                className="relative w-full max-w-md rounded-3xl p-6 sm:p-10 text-center"
                style={{
                  background: `linear-gradient(145deg, #1e1e38F0 0%, #2a2a4aF0 50%, #1e1e38F0 100%)`,
                  border: `2px solid ${colors.primary}40`,
                  boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${colors.primary}15`,
                  backdropFilter: 'blur(20px)',
                }}
              >
                {/* Inner decorative border */}
                <div
                  className="absolute inset-3 sm:inset-4 rounded-2xl pointer-events-none"
                  style={{ border: `1px solid ${colors.primary}20` }}
                />

                {/* Corner ornaments on invitation */}
                <div className="absolute top-3 right-3 w-6 h-6" style={{ color: colors.primary + '50' }}>
                  <svg viewBox="0 0 30 30" className="w-full h-full"><path d="M0 0 L30 0 L30 6 L6 6 L6 30 L0 30Z" fill="currentColor" /></svg>
                </div>
                <div className="absolute top-3 left-3 w-6 h-6" style={{ color: colors.primary + '50' }}>
                  <svg viewBox="0 0 30 30" className="w-full h-full"><path d="M30 0 L0 0 L0 6 L24 6 L24 30 L30 30Z" fill="currentColor" /></svg>
                </div>
                <div className="absolute bottom-3 right-3 w-6 h-6" style={{ color: colors.primary + '50' }}>
                  <svg viewBox="0 0 30 30" className="w-full h-full"><path d="M0 30 L30 30 L30 24 L6 24 L6 0 L0 0Z" fill="currentColor" /></svg>
                </div>
                <div className="absolute bottom-3 left-3 w-6 h-6" style={{ color: colors.primary + '50' }}>
                  <svg viewBox="0 0 30 30" className="w-full h-full"><path d="M30 30 L0 30 L0 24 L24 24 L24 0 L30 0Z" fill="currentColor" /></svg>
                </div>

                {/* Bismallah */}
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-lg sm:text-xl font-serif tracking-wider mb-4"
                  style={{ color: colors.primary + 'CC' }}
                >
                  بسم الله الرحمن الرحيم
                </motion.p>

                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex items-center justify-center gap-3 mb-6"
                >
                  <div className="h-px w-10 sm:w-14" style={{ backgroundColor: colors.primary + '35' }} />
                  <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary + '60' }} />
                  <div className="h-px w-10 sm:w-14" style={{ backgroundColor: colors.primary + '35' }} />
                </motion.div>

                {/* Couple photo - large and centered */}
                {couplePhoto && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.4, type: 'spring', stiffness: 150 }}
                    className="flex justify-center mb-6"
                  >
                    <div className="relative">
                      {/* Outer glow ring */}
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{
                          boxShadow: `0 0 40px ${colors.primary}30, 0 0 80px ${colors.primary}15`,
                        }}
                      />
                      {/* Photo container */}
                      <div
                        className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden relative"
                        style={{
                          border: `3px solid ${colors.primary}`,
                          boxShadow: `0 0 20px ${colors.primary}25, inset 0 0 10px ${colors.primary}10`,
                          padding: '3px',
                        }}
                      >
                        <img
                          src={couplePhoto}
                          alt="صورة الزوجين"
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Guest name in large gold text */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3"
                  style={{
                    color: colors.primary,
                    textShadow: `0 0 20px ${colors.primary}30`,
                  }}
                >
                  أهلاً وسهلاً {guestName}
                </motion.h2>

                {/* Ornamental divider */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="flex items-center justify-center gap-3 mb-4"
                >
                  <div className="h-px w-8" style={{ backgroundColor: colors.primary + '30' }} />
                  <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: colors.primary + '50' }} />
                  <div className="h-px w-8" style={{ backgroundColor: colors.primary + '30' }} />
                </motion.div>

                {/* Couple names */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  className="text-xl sm:text-2xl font-serif mb-3"
                  style={{ color: '#ffffffDD' }}
                >
                  {groomName} و {brideName}
                </motion.p>

                {/* Welcome message */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="text-base sm:text-lg font-serif"
                  style={{ color: '#ffffffAA' }}
                >
                  يتشرفان بدعوتكم لحضور حفل زفافهما
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                  className="text-sm sm:text-base font-serif mt-2"
                  style={{ color: colors.accent + 'CC' }}
                >
                  بحضوركم تزدان ليلتنا وتكتمل فرحتنا
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
