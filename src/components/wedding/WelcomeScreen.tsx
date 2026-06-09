'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ThemeColors } from '@/types/wedding';
import { useState, useCallback, useMemo } from 'react';

interface WelcomeScreenProps {
  guestName: string;
  groomName: string;
  brideName: string;
  colors: ThemeColors;
  couplePhoto?: string;
  onOpen: () => void;
}

// Seeded random for consistent SSR/CSR values
function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

// Floating gold particles - deterministic to avoid hydration mismatch
function FloatingParticles({ color, count = 25 }: { color: string; count?: number }) {
  // Generate deterministic particles using seeded random (no Math.random())
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: seededRandom(i * 7 + 1) * 100,
      y: seededRandom(i * 13 + 3) * 100,
      size: 2 + seededRandom(i * 17 + 5) * 4,
      duration: 4 + seededRandom(i * 23 + 7) * 6,
      delay: seededRandom(i * 31 + 11) * 5,
      drift: (seededRandom(i * 37 + 13) - 0.5) * 20,
      floatY: 30 + seededRandom(i * 41 + 17) * 40,
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
            y: [0, -p.floatY, 0],
            x: [0, p.drift, 0],
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

// Sparkle burst effect - deterministic
function SparkleBurst({ color, active }: { color: string; active: boolean }) {
  const sparkles = useMemo(() =>
    Array.from({ length: 32 }, (_, i) => ({
      id: i,
      angle: (i / 32) * 360,
      distance: 100 + seededRandom(i * 43 + 19) * 140,
      size: 3 + seededRandom(i * 47 + 23) * 6,
      delay: seededRandom(i * 53 + 29) * 0.3,
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
  const [sealBroken, setSealBroken] = useState(false);

  const handleOpen = useCallback(() => {
    if (isOpen) return;
    setIsOpen(true);
    setSealBroken(true);

    // Phase 1: Seal breaks & sparkles
    setTimeout(() => setShowSparkles(true), 400);

    // Phase 2: Reveal invitation content
    setTimeout(() => setInvitationRevealed(true), 800);

    // Phase 3: Start exit
    setTimeout(() => setIsExiting(true), 4000);

    // Phase 4: Call onOpen
    setTimeout(() => {
      onOpen();
    }, 4800);
  }, [isOpen, onOpen]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={isExiting ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#050510' }}
      dir="rtl"
    >
      {/* Deep cinematic background */}
      <div className="absolute inset-0" style={{
        background: `
          radial-gradient(ellipse at 50% 20%, ${colors.primary}12 0%, transparent 60%),
          radial-gradient(ellipse at 30% 80%, ${colors.accent}08 0%, transparent 50%),
          radial-gradient(ellipse at 70% 70%, ${colors.primary}06 0%, transparent 50%),
          linear-gradient(180deg, #050510 0%, #0a0a20 50%, #050510 100%)
        `,
      }} />

      {/* Vignette effect */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
      }} />

      {/* Floating gold particles */}
      <FloatingParticles color={colors.primary + '50'} count={30} />

      {/* Sparkle burst */}
      <SparkleBurst color={colors.accent} active={showSparkles} />

      {/* Bismallah at top */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        className="absolute top-6 sm:top-10 left-0 right-0 text-center z-10"
      >
        <p
          className="text-lg sm:text-2xl font-serif tracking-[0.2em]"
          style={{ color: colors.primary + 'AA' }}
        >
          بسم الله الرحمن الرحيم
        </p>
        <div className="flex items-center justify-center gap-3 mt-2">
          <div className="h-px w-8 sm:w-12" style={{ background: `linear-gradient(to left, ${colors.primary}40, transparent)` }} />
          <div className="w-1 h-1 rotate-45" style={{ backgroundColor: colors.primary + '40' }} />
          <div className="h-px w-8 sm:w-12" style={{ background: `linear-gradient(to right, ${colors.primary}40, transparent)` }} />
        </div>
      </motion.div>

      {/* Main content area */}
      <div className="relative z-10 flex flex-col items-center px-4 w-full max-w-md">

        {/* ===== CINEMATIC ENVELOPE ===== */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 40 }}
          animate={{
            opacity: isOpen ? 0 : 1,
            scale: isOpen ? 1.2 : 1,
            y: isOpen ? -60 : 0,
          }}
          transition={{
            duration: isOpen ? 0.8 : 1.2,
            delay: isOpen ? 0 : 0.4,
            ease: isOpen ? [0.4, 0, 0.2, 1] : [0.16, 1, 0.3, 1],
          }}
          className="relative w-full"
        >
          {/* Outer glow */}
          <div
            className="absolute -inset-4 rounded-3xl blur-xl"
            style={{
              background: `radial-gradient(ellipse at 50% 50%, ${colors.primary}15, transparent 70%)`,
            }}
          />

          {/* Envelope body */}
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: `linear-gradient(160deg, #12122a 0%, #1a1a3e 30%, #15153a 60%, #101030 100%)`,
              border: `1.5px solid ${colors.primary}35`,
              boxShadow: `
                0 30px 80px rgba(0,0,0,0.6),
                0 0 60px ${colors.primary}08,
                inset 0 1px 0 ${colors.primary}15,
                inset 0 -1px 0 rgba(0,0,0,0.3)
              `,
            }}
          >
            {/* Inner double border */}
            <div
              className="absolute inset-2.5 sm:inset-3.5 rounded-xl pointer-events-none"
              style={{ border: `1px solid ${colors.primary}15` }}
            />
            <div
              className="absolute inset-4 sm:inset-5 rounded-lg pointer-events-none"
              style={{ border: `0.5px solid ${colors.primary}08` }}
            />

            {/* Geometric watermark pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ color: colors.primary }}>
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="envelope-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M30 0L60 30L30 60L0 30Z" fill="none" stroke="currentColor" strokeWidth="0.4" />
                    <circle cx="30" cy="30" r="8" fill="none" stroke="currentColor" strokeWidth="0.25" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#envelope-pattern)" />
              </svg>
            </div>

            {/* Corner ornaments - elegant and refined */}
            {[
              { cls: 'top-2 right-2 sm:top-3 sm:right-3', transform: '' },
              { cls: 'top-2 left-2 sm:top-3 sm:left-3', transform: 'scaleX(-1)' },
              { cls: 'bottom-2 right-2 sm:bottom-3 sm:right-3', transform: 'scaleY(-1)' },
              { cls: 'bottom-2 left-2 sm:bottom-3 sm:left-3', transform: 'scale(-1)' },
            ].map((corner, idx) => (
              <div
                key={idx}
                className={`absolute ${corner.cls} w-7 h-7 sm:w-9 sm:h-9`}
                style={{ color: colors.primary + '35', transform: corner.transform }}
              >
                <svg viewBox="0 0 50 50" className="w-full h-full">
                  <path d="M0 0 L50 0 L50 10 L10 10 L10 50 L0 50Z" fill="currentColor" opacity="0.5" />
                  <circle cx="14" cy="14" r="2" fill="currentColor" opacity="0.4" />
                </svg>
              </div>
            ))}

            {/* Envelope content */}
            <div className="relative z-10 p-5 sm:p-7 text-center">

              {/* "Special Invitation" label */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="mb-3"
              >
                <span
                  className="inline-block text-[10px] sm:text-xs tracking-[0.3em] font-light px-4 py-1.5 rounded-full"
                  style={{
                    color: colors.primary + 'BB',
                    border: `1px solid ${colors.primary}20`,
                    background: `linear-gradient(135deg, ${colors.primary}08, transparent)`,
                  }}
                >
                  دعوة خاصة
                </span>
              </motion.div>

              {/* Couple photo - circular, elegant */}
              {couplePhoto && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 1.0, type: 'spring', stiffness: 120 }}
                  className="flex justify-center mb-4"
                >
                  <div className="relative">
                    {/* Outer soft glow */}
                    <div
                      className="absolute inset-0 rounded-full blur-md"
                      style={{
                        background: `radial-gradient(circle, ${colors.primary}20, transparent 70%)`,
                        transform: 'scale(1.5)',
                      }}
                    />
                    {/* Double border ring */}
                    <div
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden relative"
                      style={{
                        border: `2px solid ${colors.primary}50`,
                        boxShadow: `0 0 25px ${colors.primary}15, inset 0 0 15px ${colors.primary}08`,
                        padding: '2px',
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

              {/* Guest name - the hero text */}
              <motion.h2
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1.2, type: 'spring', stiffness: 100 }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2"
                style={{
                  color: colors.primary,
                  textShadow: `0 0 30px ${colors.primary}20`,
                }}
              >
                {guestName}
              </motion.h2>

              {/* Ornamental divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                className="flex items-center justify-center gap-2.5 mb-3"
              >
                <div className="h-px w-8 sm:w-12" style={{ backgroundColor: colors.primary + '25' }} />
                <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: colors.primary + '45' }} />
                <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary + '60' }} />
                <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: colors.primary + '45' }} />
                <div className="h-px w-8 sm:w-12" style={{ backgroundColor: colors.primary + '25' }} />
              </motion.div>

              {/* Couple names */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.5 }}
                className="text-sm sm:text-base font-serif"
                style={{ color: '#ffffffAA' }}
              >
                حفل زفاف {groomName} و {brideName}
              </motion.p>

              {/* Wax seal */}
              <motion.div
                initial={{ scale: 0, rotate: -200 }}
                animate={{
                  scale: sealBroken ? [1, 1.3, 0] : 1,
                  rotate: sealBroken ? [0, 30, 60] : 0,
                }}
                transition={{
                  duration: sealBroken ? 0.6 : 0.8,
                  delay: sealBroken ? 0 : 1.7,
                  type: sealBroken ? 'tween' : 'spring',
                  stiffness: 180,
                }}
                className="mt-4 flex justify-center"
              >
                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center relative"
                  style={{
                    background: `radial-gradient(circle at 40% 40%, ${colors.primary}35 0%, ${colors.primary}18 60%, transparent 100%)`,
                    border: `2px solid ${colors.primary}45`,
                    boxShadow: `0 4px 20px ${colors.primary}12, inset 0 2px 8px ${colors.primary}10`,
                  }}
                >
                  <svg viewBox="0 0 50 50" className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: colors.primary + 'CC' }}>
                    <path d="M25 5 L30 18 L45 18 L33 27 L37 42 L25 33 L13 42 L17 27 L5 18 L20 18Z"
                      fill="none" stroke="currentColor" strokeWidth="1" />
                    <circle cx="25" cy="25" r="5" fill="none" stroke="currentColor" strokeWidth="0.7" />
                    <circle cx="25" cy="25" r="1.5" fill="currentColor" opacity="0.5" />
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
          transition={{ duration: 0.8, delay: 2.2 }}
          className="mt-6 sm:mt-8"
        >
          {!isOpen && (
            <motion.button
              onClick={handleOpen}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group relative inline-flex items-center gap-3 px-8 py-3.5 sm:py-4 rounded-2xl text-base sm:text-lg font-bold transition-all duration-500 cursor-pointer overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}E0, ${colors.accent}D0)`,
                color: '#050510',
                boxShadow: `0 8px 40px ${colors.primary}30, 0 0 80px ${colors.primary}10`,
              }}
            >
              {/* Pulsing glow */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{
                  boxShadow: `0 0 40px ${colors.primary}30, 0 0 80px ${colors.primary}15`,
                }}
                animate={{
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              />
              {/* Shimmer sweep */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)`,
                  backgroundSize: '200% 100%',
                }}
                animate={{ backgroundPosition: ['-200% 0', '200% 0'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
              <span className="relative z-10">افتح الدعوة</span>
              <motion.svg
                viewBox="0 0 20 10"
                className="w-4 h-2.5 rotate-180 relative z-10"
                animate={{ x: [0, -3, 0] }}
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
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: colors.primary + '50' }}
              />
              <p className="text-xs font-serif" style={{ color: '#ffffff55' }}>
                بيتفتحلك باب الفرحة...
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Revealed invitation content */}
        <AnimatePresence>
          {invitationRevealed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex items-center justify-center px-4"
            >
              <div
                className="relative w-full max-w-md rounded-3xl p-6 sm:p-10 text-center"
                style={{
                  background: `
                    linear-gradient(160deg, #12122aF5 0%, #1a1a3eF5 40%, #12122aF5 100%)
                  `,
                  border: `1.5px solid ${colors.primary}30`,
                  boxShadow: `
                    0 30px 80px rgba(0,0,0,0.5),
                    0 0 60px ${colors.primary}10,
                    inset 0 1px 0 ${colors.primary}10
                  `,
                  backdropFilter: 'blur(20px)',
                }}
              >
                {/* Inner decorative border */}
                <div
                  className="absolute inset-3 sm:inset-4 rounded-2xl pointer-events-none"
                  style={{ border: `1px solid ${colors.primary}12` }}
                />

                {/* Corner ornaments */}
                {[
                  { cls: 'top-3 right-3', transform: '' },
                  { cls: 'top-3 left-3', transform: 'scaleX(-1)' },
                  { cls: 'bottom-3 right-3', transform: 'scaleY(-1)' },
                  { cls: 'bottom-3 left-3', transform: 'scale(-1)' },
                ].map((c, idx) => (
                  <div key={idx} className={`absolute ${c.cls} w-5 h-5`} style={{ color: colors.primary + '35', transform: c.transform }}>
                    <svg viewBox="0 0 30 30" className="w-full h-full"><path d="M0 0 L30 0 L30 6 L6 6 L6 30 L0 30Z" fill="currentColor" /></svg>
                  </div>
                ))}

                {/* Bismallah */}
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-base sm:text-lg font-serif tracking-wider mb-3"
                  style={{ color: colors.primary + 'BB' }}
                >
                  بسم الله الرحمن الرحيم
                </motion.p>

                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex items-center justify-center gap-2 mb-5"
                >
                  <div className="h-px w-8" style={{ backgroundColor: colors.primary + '25' }} />
                  <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: colors.primary + '40' }} />
                  <div className="h-px w-8" style={{ backgroundColor: colors.primary + '25' }} />
                </motion.div>

                {/* Couple photo */}
                {couplePhoto && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.4, type: 'spring', stiffness: 120 }}
                    className="flex justify-center mb-5"
                  >
                    <div className="relative">
                      <div
                        className="absolute inset-0 rounded-full blur-lg"
                        style={{
                          background: `radial-gradient(circle, ${colors.primary}20, transparent 70%)`,
                          transform: 'scale(1.8)',
                        }}
                      />
                      <div
                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden relative"
                        style={{
                          border: `2.5px solid ${colors.primary}60`,
                          boxShadow: `0 0 30px ${colors.primary}15, inset 0 0 10px ${colors.primary}08`,
                          padding: '2.5px',
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

                {/* Guest name */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2"
                  style={{
                    color: colors.primary,
                    textShadow: `0 0 25px ${colors.primary}18`,
                  }}
                >
                  أهلاً بيك {guestName}
                </motion.h2>

                {/* Divider */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="flex items-center justify-center gap-2 mb-3"
                >
                  <div className="h-px w-6" style={{ backgroundColor: colors.primary + '20' }} />
                  <div className="w-1 h-1 rotate-45" style={{ backgroundColor: colors.primary + '35' }} />
                  <div className="h-px w-6" style={{ backgroundColor: colors.primary + '20' }} />
                </motion.div>

                {/* Couple names */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  className="text-lg sm:text-xl font-serif mb-2"
                  style={{ color: '#ffffffCC' }}
                >
                  {groomName} و {brideName}
                </motion.p>

                {/* Welcome message */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="text-sm sm:text-base font-serif"
                  style={{ color: '#ffffff88' }}
                >
                  بيتشرفوا بدعوتكم لحضور حفل زفافهم
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                  className="text-xs sm:text-sm font-serif mt-1.5"
                  style={{ color: colors.accent + 'BB' }}
                >
                  بوجودكم تكتمل فرحتنا وتزدان ليلتنا
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom subtle ornament */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-5 sm:bottom-8 left-0 right-0 flex items-center justify-center gap-2"
      >
        <div className="h-px w-6" style={{ backgroundColor: colors.primary + '10' }} />
        <div className="w-0.5 h-0.5 rotate-45" style={{ backgroundColor: colors.primary + '20' }} />
        <div className="h-px w-6" style={{ backgroundColor: colors.primary + '10' }} />
      </motion.div>
    </motion.div>
  );
}
