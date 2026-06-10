'use client';

import { motion } from 'framer-motion';
import { Wedding, ThemeColors } from '@/types/wedding';

interface HeroProps {
  wedding: Wedding;
  colors: ThemeColors;
  heroStyle?: 'centered' | 'split' | 'cinematic' | 'frame';
  ornamentStyle?: 'gold' | 'subtle' | 'none' | 'bold';
  cornerOrnaments?: boolean;
  showPattern?: boolean;
  patternType?: 'geometric' | 'floral' | 'arabesque' | 'dots' | 'lines';
  fontScale?: number;
  couplePhoto?: string;
}

// Circular photo with ornamental gold border

// Helper: render cover image as either <img> (for URL paths) or gradient div
function CoverImageLayer({ coverImage, className }: { coverImage: string; className?: string }) {
  const isImageUrl = coverImage.startsWith('/') || coverImage.startsWith('http');
  if (isImageUrl) {
    return <img src={coverImage} alt="" className={`absolute inset-0 w-full h-full object-cover ${className || ''}`} />;
  }
  return <div className={`absolute inset-0 ${className || ''}`} style={{ background: coverImage }} />;
}
function CircularPhoto({ src, size = 'lg', borderColor }: { src: string; size?: 'sm' | 'lg' | 'xl'; borderColor: string }) {
  const sizeClasses = size === 'xl' ? 'w-36 h-36 sm:w-44 sm:h-44' : size === 'lg' ? 'w-28 h-28 sm:w-36 sm:h-36' : 'w-20 h-20 sm:w-24 sm:h-24';
  const borderW = size === 'xl' ? 3 : size === 'lg' ? 2.5 : 2;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 1, ease: 'easeOut' }}
      className="relative inline-flex items-center justify-center"
    >
      <div
        className={`absolute ${sizeClasses} rounded-full`}
        style={{
          border: `${borderW + 2}px solid ${borderColor}20`,
          boxShadow: `0 0 30px ${borderColor}15`,
        }}
      />
      <div
        className={`absolute ${sizeClasses} rounded-full`}
        style={{
          border: `${borderW}px solid ${borderColor}60`,
          boxShadow: `inset 0 0 15px ${borderColor}10`,
        }}
      />
      <div
        className={`${sizeClasses} rounded-full overflow-hidden`}
        style={{
          border: `${borderW}px solid ${borderColor}`,
          padding: '3px',
        }}
      >
        <img
          src={src}
          alt="صورة الزوجين"
          className="w-full h-full rounded-full object-cover"
        />
      </div>
    </motion.div>
  );
}

// Pattern SVG component based on patternType
function PatternOverlay({ patternType, color }: { patternType: string; color: string }) {
  const patternId = `hero-pattern-${patternType}`;

  switch (patternType) {
    case 'floral':
      return (
        <div className="absolute inset-0 opacity-[0.07]" style={{ color }}>
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id={patternId} x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.4" />
                <circle cx="50" cy="50" r="8" fill="none" stroke="currentColor" strokeWidth="0.3" />
                <path d="M50 30 Q55 40 50 50 Q45 40 50 30Z" fill="none" stroke="currentColor" strokeWidth="0.3" />
                <path d="M50 70 Q55 60 50 50 Q45 60 50 70Z" fill="none" stroke="currentColor" strokeWidth="0.3" />
                <path d="M30 50 Q40 55 50 50 Q40 45 30 50Z" fill="none" stroke="currentColor" strokeWidth="0.3" />
                <path d="M70 50 Q60 55 50 50 Q60 45 70 50Z" fill="none" stroke="currentColor" strokeWidth="0.3" />
                <circle cx="20" cy="20" r="3" fill="none" stroke="currentColor" strokeWidth="0.2" />
                <circle cx="80" cy="80" r="3" fill="none" stroke="currentColor" strokeWidth="0.2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${patternId})`} />
          </svg>
        </div>
      );

    case 'arabesque':
      return (
        <div className="absolute inset-0 opacity-[0.07]" style={{ color }}>
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id={patternId} x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                <path d="M60 10 Q90 30 90 60 Q90 90 60 110 Q30 90 30 60 Q30 30 60 10Z" fill="none" stroke="currentColor" strokeWidth="0.4" />
                <path d="M60 30 Q75 45 75 60 Q75 75 60 90 Q45 75 45 60 Q45 45 60 30Z" fill="none" stroke="currentColor" strokeWidth="0.3" />
                <circle cx="60" cy="60" r="6" fill="none" stroke="currentColor" strokeWidth="0.3" />
                <path d="M10 60 Q30 40 60 10" fill="none" stroke="currentColor" strokeWidth="0.2" />
                <path d="M110 60 Q90 80 60 110" fill="none" stroke="currentColor" strokeWidth="0.2" />
                <path d="M60 10 Q80 40 110 60" fill="none" stroke="currentColor" strokeWidth="0.2" />
                <path d="M60 110 Q40 80 10 60" fill="none" stroke="currentColor" strokeWidth="0.2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${patternId})`} />
          </svg>
        </div>
      );

    case 'dots':
      return (
        <div className="absolute inset-0 opacity-[0.07]" style={{ color }}>
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id={patternId} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2" fill="currentColor" />
                <circle cx="0" cy="0" r="1" fill="currentColor" />
                <circle cx="40" cy="40" r="1" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${patternId})`} />
          </svg>
        </div>
      );

    case 'lines':
      return (
        <div className="absolute inset-0 opacity-[0.05]" style={{ color }}>
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id={patternId} x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                <line x1="0" y1="30" x2="30" y2="0" stroke="currentColor" strokeWidth="0.4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${patternId})`} />
          </svg>
        </div>
      );

    case 'geometric':
    default:
      return (
        <div className="absolute inset-0 opacity-[0.06]" style={{ color }}>
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id={patternId} x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M40 0L80 40L40 80L0 40Z" fill="none" stroke="currentColor" strokeWidth="0.4" />
                <path d="M40 15L65 40L40 65L15 40Z" fill="none" stroke="currentColor" strokeWidth="0.3" />
                <circle cx="40" cy="40" r="10" fill="none" stroke="currentColor" strokeWidth="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${patternId})`} />
          </svg>
        </div>
      );
  }
}

// Corner Ornaments component
function CornerOrnaments({ color, size = 'lg' }: { color: string; size?: 'sm' | 'lg' }) {
  const dim = size === 'lg' ? 'w-40 h-40 sm:w-56 sm:h-56' : 'w-24 h-24 sm:w-36 sm:h-36';

  return (
    <>
      <div className={`absolute top-0 left-0 ${dim} opacity-25`}>
        <svg viewBox="0 0 200 200" className="w-full h-full" style={{ color }}>
          <path d="M0 0 Q100 0 100 100 Q0 100 0 0Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M0 0 Q70 0 70 70 Q0 70 0 0Z" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M0 0 Q40 0 40 40 Q0 40 0 0Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="15" cy="15" r="3" fill="currentColor" opacity="0.4" />
          <circle cx="35" cy="35" r="2" fill="currentColor" opacity="0.3" />
        </svg>
      </div>
      <div className={`absolute top-0 right-0 ${dim} opacity-25`} style={{ transform: 'scaleX(-1)' }}>
        <svg viewBox="0 0 200 200" className="w-full h-full" style={{ color }}>
          <path d="M0 0 Q100 0 100 100 Q0 100 0 0Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M0 0 Q70 0 70 70 Q0 70 0 0Z" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M0 0 Q40 0 40 40 Q0 40 0 0Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="15" cy="15" r="3" fill="currentColor" opacity="0.4" />
          <circle cx="35" cy="35" r="2" fill="currentColor" opacity="0.3" />
        </svg>
      </div>
      <div className={`absolute bottom-0 left-0 ${dim} opacity-25`} style={{ transform: 'scaleY(-1)' }}>
        <svg viewBox="0 0 200 200" className="w-full h-full" style={{ color }}>
          <path d="M0 0 Q100 0 100 100 Q0 100 0 0Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M0 0 Q70 0 70 70 Q0 70 0 0Z" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="15" cy="15" r="3" fill="currentColor" opacity="0.4" />
        </svg>
      </div>
      <div className={`absolute bottom-0 right-0 ${dim} opacity-25`} style={{ transform: 'scale(-1)' }}>
        <svg viewBox="0 0 200 200" className="w-full h-full" style={{ color }}>
          <path d="M0 0 Q100 0 100 100 Q0 100 0 0Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M0 0 Q70 0 70 70 Q0 70 0 0Z" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="15" cy="15" r="3" fill="currentColor" opacity="0.4" />
        </svg>
      </div>
    </>
  );
}

// Ornamental divider line
function OrnamentalLine({ color, className = '' }: { color: string; className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      <div className="h-px w-16 sm:w-24" style={{ backgroundColor: color + '50' }} />
      <div className="w-3 h-3 rotate-45" style={{ backgroundColor: color + '80' }} />
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      <div className="w-3 h-3 rotate-45" style={{ backgroundColor: color + '80' }} />
      <div className="h-px w-16 sm:w-24" style={{ backgroundColor: color + '50' }} />
    </div>
  );
}

// Thin minimal divider line (for modern-dark)
function ThinLine({ color, className = '' }: { color: string; className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="h-px w-32 sm:w-48" style={{ backgroundColor: color + '30' }} />
    </div>
  );
}

// Bismallah component
function Bismallah({ color, ornamentStyle, text }: { color: string; ornamentStyle: string; text?: string }) {
  const isNone = ornamentStyle === 'none';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 0.3 }}
      className="mb-8 flex flex-col items-center gap-3"
    >
      {!isNone && (
        <div className="flex items-center gap-3">
          <div className="h-px w-12 sm:w-20" style={{ background: `linear-gradient(to left, ${color}50, transparent)` }} />
          <div className="w-2 h-2 rotate-45" style={{ backgroundColor: color + '60' }} />
          <div className="h-px w-12 sm:w-20" style={{ background: `linear-gradient(to right, ${color}50, transparent)` }} />
        </div>
      )}

      <p
        className="text-2xl sm:text-3xl font-serif tracking-[0.15em]"
        style={{ color: color + 'CC' }}
      >
        {text || 'بسم الله الرحمن الرحيم'}
      </p>

      {!isNone && (
        <div className="flex items-center gap-3">
          <div className="h-px w-8 sm:w-14" style={{ background: `linear-gradient(to left, ${color}35, transparent)` }} />
          <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: color + '40' }} />
          <div className="h-px w-8 sm:w-14" style={{ background: `linear-gradient(to right, ${color}35, transparent)` }} />
        </div>
      )}
    </motion.div>
  );
}

// Ornament between names — shows couple photo or default image
function NameOrnament({ color, accentColor, ornamentStyle, couplePhoto }: { color: string; accentColor: string; ornamentStyle: string; couplePhoto?: string }) {
  const isBold = ornamentStyle === 'bold' || ornamentStyle === 'gold';
  const isNone = ornamentStyle === 'none';
  const photoSrc = couplePhoto || '/images/demo-couple.png';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 1.1, ease: 'easeOut' }}
      className="my-4 sm:my-6 flex items-center justify-center"
    >
      <div className={`h-px ${isBold ? 'w-12 sm:w-20' : isNone ? 'w-8 sm:w-14' : 'w-10 sm:w-16'}`} style={{ backgroundColor: color + '30' }} />
      <div
        className={`mx-3 rounded-full overflow-hidden ${isBold ? 'w-16 h-16 sm:w-20 sm:h-20' : isNone ? 'w-12 h-12 sm:w-16 sm:h-16' : 'w-14 h-14 sm:w-18 sm:h-18'}`}
        style={{ border: `2px solid ${color}50`, padding: '2px', boxShadow: `0 0 20px ${color}15` }}
      >
        <img
          src={photoSrc}
          alt="صورة الزوجين"
          className="w-full h-full rounded-full object-cover"
        />
      </div>
      <div className={`h-px ${isBold ? 'w-12 sm:w-20' : isNone ? 'w-8 sm:w-14' : 'w-10 sm:w-16'}`} style={{ backgroundColor: color + '30' }} />
    </motion.div>
  );
}

// Scroll indicator
function ScrollIndicator({ color }: { color: string }) {
  return (
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
          style={{ borderColor: color + '50' }}
        >
          <motion.div
            animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-1.5 rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>
        <svg viewBox="0 0 20 10" className="w-4 h-2" style={{ color: color + '60' }}>
          <path d="M0 0 L10 8 L20 0" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

// Simple corner ornaments for frame hero
function CornerOrnantsSimple({ color }: { color: string }) {
  return (
    <>
      <div className="absolute top-4 right-4 w-8 h-8 opacity-20" style={{ color }}>
        <svg viewBox="0 0 40 40" className="w-full h-full">
          <path d="M0 0 L40 0 L40 4 L4 4 L4 40 L0 40Z" fill="currentColor" />
        </svg>
      </div>
      <div className="absolute top-4 left-4 w-8 h-8 opacity-20" style={{ color, transform: 'scaleX(-1)' }}>
        <svg viewBox="0 0 40 40" className="w-full h-full">
          <path d="M0 0 L40 0 L40 4 L4 4 L4 40 L0 40Z" fill="currentColor" />
        </svg>
      </div>
      <div className="absolute bottom-4 right-4 w-8 h-8 opacity-20" style={{ color, transform: 'scaleY(-1)' }}>
        <svg viewBox="0 0 40 40" className="w-full h-full">
          <path d="M0 0 L40 0 L40 4 L4 4 L4 40 L0 40Z" fill="currentColor" />
        </svg>
      </div>
      <div className="absolute bottom-4 left-4 w-8 h-8 opacity-20" style={{ color, transform: 'scale(-1)' }}>
        <svg viewBox="0 0 40 40" className="w-full h-full">
          <path d="M0 0 L40 0 L40 4 L4 4 L4 40 L0 40Z" fill="currentColor" />
        </svg>
      </div>
    </>
  );
}

// ==============================
// HERO STYLES — Each truly distinct
// ==============================

/**
 * CINEMATIC HERO (Royal Gold) — Luxury hotel style
 * Dramatic with multiple light beams, parallax background, large serif fonts
 * Couple photo as large background with overlay
 * Grand, majestic feeling
 */
function HeroCinematic({ wedding, colors, ornamentStyle, cornerOrnaments, showPattern, patternType, fontScale, couplePhoto }: HeroProps & Required<Omit<HeroProps, 'heroStyle' | 'couplePhoto'>>) {
  const hasCoverImage = !!wedding.coverImage;
  const nameSize = fontScale >= 1.1 ? 'text-7xl sm:text-8xl md:text-9xl' : 'text-6xl sm:text-7xl md:text-8xl';
  const nameStyle = hasCoverImage ? { color: colors.primary, textShadow: '0 4px 30px rgba(0,0,0,0.7)' } : { color: colors.primary };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden" dir="rtl">
      {/* Dramatic Background with parallax effect — use cover image (full-bleed) or fall back to couple photo */}
      {hasCoverImage ? (
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${wedding.coverImage})` }}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 20, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }}
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${colors.background}DD 0%, ${colors.background}88 30%, ${colors.background}88 70%, ${colors.background}DD 100%)` }} />
        </div>
      ) : couplePhoto ? (
        <motion.div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${couplePhoto})` }}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 20, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }}
        >
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${colors.background}DD 0%, ${colors.background}88 30%, ${colors.background}88 70%, ${colors.background}DD 100%)` }} />
        </motion.div>
      ) : (
        <div className="absolute inset-0" style={{
          background: `radial-gradient(ellipse at 50% 30%, ${colors.secondary}90 0%, ${colors.background} 70%)`,
        }} />
      )}

      {/* Cinematic vignette overlay */}
      <div className="absolute inset-0" style={{
        background: `radial-gradient(ellipse at center, transparent 40%, ${colors.background}80 100%)`,
      }} />

      {/* Cinematic top/bottom gradient */}
      <div className="absolute inset-0" style={{
        background: `linear-gradient(180deg, ${colors.background}60 0%, transparent 20%, transparent 80%, ${colors.background} 100%)`,
      }} />

      {/* Pattern */}
      {showPattern && <PatternOverlay patternType={patternType} color={colors.primary} />}

      {/* Corner Ornaments */}
      {cornerOrnaments && <CornerOrnaments color={colors.primary} />}

      {/* DRAMATIC light beams — 5 beams radiating from center */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-[15%] w-px h-full" style={{ background: `linear-gradient(180deg, transparent 10%, ${colors.primary}30, transparent 90%)`, opacity: 0.15 }} />
        <div className="absolute top-0 left-[35%] w-px h-full" style={{ background: `linear-gradient(180deg, transparent 5%, ${colors.primary}50, transparent 95%)`, opacity: 0.12 }} />
        <div className="absolute top-0 left-[50%] w-0.5 h-full -translate-x-1/2" style={{ background: `linear-gradient(180deg, transparent, ${colors.primary}60, transparent)`, opacity: 0.18 }} />
        <div className="absolute top-0 left-[65%] w-px h-full" style={{ background: `linear-gradient(180deg, transparent 5%, ${colors.primary}50, transparent 95%)`, opacity: 0.12 }} />
        <div className="absolute top-0 left-[85%] w-px h-full" style={{ background: `linear-gradient(180deg, transparent 10%, ${colors.primary}30, transparent 90%)`, opacity: 0.15 }} />
      </div>

      {/* Floating gold particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 2 + (i % 3),
              height: 2 + (i % 3),
              backgroundColor: colors.primary,
              left: `${10 + (i * 7) % 80}%`,
              opacity: 0.15 + (i % 4) * 0.05,
            }}
            animate={{
              y: [0, -30 - (i % 3) * 20, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 4 + (i % 3) * 2,
              delay: i * 0.4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-8 sm:px-6 max-w-5xl mx-auto pb-8">
        <Bismallah color={colors.primary} ornamentStyle={ornamentStyle} text={wedding.bismallahText} />

        {/* Grand ornamental divider */}
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, delay: 0.6 }}>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-20 sm:w-36" style={{ background: `linear-gradient(to left, ${colors.primary}60, transparent)` }} />
            <div className="w-5 h-5 rotate-45" style={{ backgroundColor: colors.primary + '40' }} />
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-5 h-5 rotate-45" style={{ backgroundColor: colors.primary + '40' }} />
            <div className="h-px w-20 sm:w-36" style={{ background: `linear-gradient(to right, ${colors.primary}60, transparent)` }} />
          </div>
        </motion.div>

        {/* Groom name - DRAMATIC scale */}
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.6, delay: 0.8 }}>
          <h1 className={`${nameSize} font-bold leading-tight shimmer-text`} style={nameStyle}>
            {wedding.groomName}
          </h1>
        </motion.div>

        <NameOrnament color={colors.primary} accentColor={colors.accent} ornamentStyle={ornamentStyle} couplePhoto={couplePhoto} />

        {/* Bride name - DRAMATIC scale */}
        <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.6, delay: 0.8 }}>
          <h1 className={`${nameSize} font-bold leading-tight shimmer-text`} style={nameStyle}>
            {wedding.brideName}
          </h1>
        </motion.div>

        {/* Grand lower ornament */}
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, delay: 1.4 }}>
          <div className="flex items-center justify-center gap-4 mt-8 mb-6">
            <div className="h-px w-20 sm:w-36" style={{ background: `linear-gradient(to left, ${colors.primary}60, transparent)` }} />
            <div className="w-4 h-4 rotate-45" style={{ backgroundColor: colors.primary + '40' }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-4 h-4 rotate-45" style={{ backgroundColor: colors.primary + '40' }} />
            <div className="h-px w-20 sm:w-36" style={{ background: `linear-gradient(to right, ${colors.primary}60, transparent)` }} />
          </div>
        </motion.div>

        {/* Subtitle - large and majestic */}
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.6 }}
          className="text-2xl sm:text-3xl md:text-4xl font-serif mb-4" style={{ color: colors.text + 'DD' }}>
          {wedding.heroSubtitle || 'بقلوب يملؤها الشوق، بيتشرفوا بدعوتكم لمشاركتنا أجمل ليلة في العمر'}
        </motion.p>
        <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.8 }}
          className="text-lg sm:text-xl font-serif" style={{ color: colors.text + 'AA' }}>
          {wedding.heroSubSubtitle || 'ليلة هنلتقي فيها على مائدة الحب، والله يجمعنا على خير وبركة'}
        </motion.p>

        <ScrollIndicator color={colors.primary} />
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .shimmer-text {
          background: linear-gradient(90deg, ${colors.primary} 0%, ${colors.accent} 20%, ${colors.primary} 40%, ${colors.accent} 60%, ${colors.primary} 80%, ${colors.accent} 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 5s linear infinite;
        }
      `}</style>
    </div>
  );
}

/**
 * SPLIT HERO (Luxury Dark) — Cinematic black and gold
 * Desktop: Left decorative panel with gradient/lines + right content panel
 * Mobile: Stacked with decorative header band
 * Image on the left panel; sans-serif, clean
 */
function HeroSplit({ wedding, colors, ornamentStyle, showPattern, patternType, fontScale, couplePhoto }: HeroProps & Required<Omit<HeroProps, 'heroStyle' | 'cornerOrnaments' | 'couplePhoto'>>) {
  const hasCoverImage = !!wedding.coverImage;
  const nameSize = 'text-4xl sm:text-5xl md:text-6xl';
  const nameStyle = hasCoverImage ? { color: colors.primary, textShadow: '0 2px 20px rgba(0,0,0,0.5)' } : { color: colors.primary };

  return (
    <div className="relative min-h-screen flex overflow-hidden" dir="rtl">
      {/* ===== LEFT DECORATIVE PANEL (Desktop) ===== */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center" style={{ background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.secondary} 100%)` }}>
        {/* Diagonal lines pattern */}
        {showPattern && <PatternOverlay patternType={patternType} color={colors.primary} />}

        {/* Vertical gold accent line at the edge */}
        <div className="absolute top-0 left-0 w-px h-full" style={{ background: `linear-gradient(180deg, transparent 10%, ${colors.primary}40 30%, ${colors.primary}60 50%, ${colors.primary}40 70%, transparent 90%)` }} />

        <div className="relative z-10 flex flex-col items-center">
          {/* Couple photo or geometric element */}
          {couplePhoto ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="relative"
            >
              <div className="w-64 h-80 xl:w-72 xl:h-96 overflow-hidden" style={{ border: `1px solid ${colors.primary}30` }}>
                <img
                  src={couplePhoto}
                  alt="صورة الزوجين"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Thin frame overlay */}
              <div className="absolute inset-3 pointer-events-none" style={{ border: `1px solid ${colors.primary}20` }} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="relative"
            >
              <svg viewBox="0 0 300 300" className="w-64 h-64 xl:w-80 xl:h-80" style={{ color: colors.primary + '25' }}>
                <circle cx="150" cy="150" r="140" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="150" cy="150" r="120" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="150" cy="150" r="100" fill="none" stroke="currentColor" strokeWidth="0.3" />
                <line x1="150" y1="10" x2="150" y2="290" stroke="currentColor" strokeWidth="0.3" />
                <line x1="10" y1="150" x2="290" y2="150" stroke="currentColor" strokeWidth="0.3" />
                <path d="M150 20 L280 150 L150 280 L20 150Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="150" cy="150" r="20" fill="none" stroke={colors.primary} strokeWidth="0.8" />
                <circle cx="150" cy="150" r="8" fill="none" stroke={colors.primary} strokeWidth="0.5" />
              </svg>
            </motion.div>
          )}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="text-lg font-serif mt-6 tracking-[0.2em]"
            style={{ color: colors.primary + '40' }}
          >
            {wedding.bismallahText || 'بسم الله الرحمن الرحيم'}
          </motion.p>
        </div>
      </div>

      {/* ===== RIGHT CONTENT PANEL ===== */}
      <div className="w-full lg:w-1/2 relative z-10 flex items-center" style={{ background: colors.background }}>
        {/* Mobile decorative header */}
        <div className="lg:hidden absolute top-0 left-0 right-0 h-48" style={{ background: `linear-gradient(180deg, ${colors.secondary}40 0%, transparent 100%)` }}>
          {/* Mobile Bismallah */}
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-2xl sm:text-3xl font-serif tracking-[0.15em] text-center pt-8"
            style={{ color: colors.primary + 'CC' }}
          >
            {wedding.bismallahText || 'بسم الله الرحمن الرحيم'}
          </motion.p>
          {/* Mobile photo */}
          {couplePhoto && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="flex justify-center mt-4"
            >
              <CircularPhoto src={couplePhoto} size="lg" borderColor={colors.primary} />
            </motion.div>
          )}
        </div>

        <div className="max-w-lg mx-auto px-8 sm:px-10 pt-56 lg:pt-0">
          {/* Thin line top */}
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 0.6 }}>
            <ThinLine color={colors.primary} className="mb-8" />
          </motion.div>

          {/* Groom name */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.8 }}
          >
            <h1 className={`${nameSize} font-bold leading-tight text-right`} style={nameStyle}>
              {wedding.groomName}
            </h1>
          </motion.div>

          <NameOrnament color={colors.primary} accentColor={colors.accent} ornamentStyle={ornamentStyle} couplePhoto={couplePhoto} />

          {/* Bride name */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 1 }}
          >
            <h1 className={`${nameSize} font-bold leading-tight text-right`} style={nameStyle}>
              {wedding.brideName}
            </h1>
          </motion.div>

          {/* Thin line bottom */}
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 1.4 }}>
            <ThinLine color={colors.primary} className="mt-8 mb-6" />
          </motion.div>

          {/* Subtitle — clean sans-serif */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.6 }}
            className="text-lg sm:text-xl md:text-2xl text-right mb-2"
            style={{ color: colors.text + 'DD' }}
          >
            {wedding.heroSubtitle || 'بقلوب يملؤها الشوق، بيتشرفوا بدعوتكم لمشاركتنا أجمل ليلة في العمر'}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="text-sm sm:text-base text-right"
            style={{ color: colors.text + 'AA' }}
          >
            {wedding.heroSubSubtitle || 'ليلة هنلتقي فيها على مائدة الحب، والله يجمعنا على خير وبركة'}
          </motion.p>

          <ScrollIndicator color={colors.primary} />
        </div>
      </div>
    </div>
  );
}

/**
 * CENTERED HERO (Floral Romance & Minimal Modern) — Clean centered layout
 * Names centered with subtle shimmer, circular photo centered between names
 * Works for both romantic (with ornaments) and minimal (without) vibes
 */
function HeroCentered({ wedding, colors, ornamentStyle, cornerOrnaments, showPattern, patternType, fontScale, couplePhoto }: HeroProps & Required<Omit<HeroProps, 'heroStyle' | 'couplePhoto'>>) {
  const hasCoverImage = !!wedding.coverImage;
  const nameSize = fontScale >= 1.1 ? 'text-6xl sm:text-7xl md:text-9xl' : 'text-5xl sm:text-6xl md:text-8xl';
  const isNone = ornamentStyle === 'none';
  const nameStyle = hasCoverImage ? { color: colors.primary, textShadow: '0 2px 20px rgba(0,0,0,0.5)' } : { color: colors.primary };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden" dir="rtl">
      {/* Background */}
      {hasCoverImage ? (
        <div className="absolute inset-0">
          <CoverImageLayer coverImage={wedding.coverImage} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${colors.background}E6 0%, ${colors.background}88 35%, ${colors.background}88 65%, ${colors.background}E6 100%)` }} />
        </div>
      ) : (
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.secondary} 50%, ${colors.background} 100%)` }} />
      )}

      {/* Subtle radial glow for romantic feel */}
      {!isNone && (
        <div className="absolute inset-0" style={{
          background: `radial-gradient(ellipse at 50% 40%, ${colors.primary}08 0%, transparent 60%)`,
        }} />
      )}

      {/* Pattern */}
      {showPattern && <PatternOverlay patternType={patternType} color={colors.primary} />}

      {/* Corner Ornaments */}
      {cornerOrnaments && <CornerOrnaments color={colors.primary} />}

      {/* Content */}
      <div className="relative z-10 text-center px-8 sm:px-6 max-w-4xl mx-auto pb-8">
        <Bismallah color={colors.primary} ornamentStyle={ornamentStyle} text={wedding.bismallahText} />

        {isNone ? (
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 0.6 }}>
            <ThinLine color={colors.primary} className="mb-8" />
          </motion.div>
        ) : (
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 0.6 }}>
            <OrnamentalLine color={colors.primary} className="mb-6" />
          </motion.div>
        )}

        {/* Groom name */}
        <motion.div initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.2, delay: 0.8 }}>
          <h1 className={`${nameSize} font-bold leading-tight ${isNone ? '' : 'shimmer-text-romantic'}`} style={nameStyle}>
            {wedding.groomName}
          </h1>
        </motion.div>

        {/* Ornament between names */}
        <NameOrnament color={colors.primary} accentColor={colors.accent} ornamentStyle={ornamentStyle} couplePhoto={couplePhoto} />

        {/* Bride name */}
        <motion.div initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.2, delay: 0.8 }}>
          <h1 className={`${nameSize} font-bold leading-tight ${isNone ? '' : 'shimmer-text-romantic'}`} style={nameStyle}>
            {wedding.brideName}
          </h1>
        </motion.div>

        {isNone ? (
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 1.4 }}>
            <ThinLine color={colors.primary} className="mt-8 mb-6" />
          </motion.div>
        ) : (
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 1.4 }}>
            <OrnamentalLine color={colors.primary} className="mt-5 mb-5" />
          </motion.div>
        )}

        {/* Subtitle */}
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.6 }}
          className={`text-xl sm:text-2xl md:text-3xl ${isNone ? '' : 'font-serif'} mb-3`} style={{ color: colors.text + 'DD' }}>
          {wedding.heroSubtitle || 'بقلوب يملؤها الشوق، بيتشرفوا بدعوتكم لمشاركتنا أجمل ليلة في العمر'}
        </motion.p>
        <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.8 }}
          className={`text-base sm:text-lg ${isNone ? '' : 'font-serif'}`} style={{ color: colors.text + 'AA' }}>
          {wedding.heroSubSubtitle || 'ليلة هنلتقي فيها على مائدة الحب، والله يجمعنا على خير وبركة'}
        </motion.p>

        <ScrollIndicator color={colors.primary} />
      </div>

      {!isNone && (
        <style jsx>{`
          @keyframes shimmer-romantic {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          .shimmer-text-romantic {
            background: linear-gradient(90deg, ${colors.primary} 0%, ${colors.accent} 25%, ${colors.primary} 50%, ${colors.accent} 75%, ${colors.primary} 100%);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: shimmer-romantic 8s linear infinite;
          }
        `}</style>
      )}
    </div>
  );
}

/**
 * FRAME HERO (Arabic Heritage) — Arabic patterns and traditional elegance
 * Ornate SVG frame around names with corner ornaments, Arabic calligraphy feel
 * Photo inside the ornamental frame
 */
function HeroFrame({ wedding, colors, ornamentStyle, cornerOrnaments, showPattern, patternType, fontScale, couplePhoto }: HeroProps & Required<Omit<HeroProps, 'heroStyle' | 'couplePhoto'>>) {
  const hasCoverImage = !!wedding.coverImage;
  const nameSize = fontScale >= 1.1 ? 'text-5xl sm:text-6xl md:text-8xl' : 'text-4xl sm:text-5xl md:text-7xl';
  const isBold = ornamentStyle === 'bold' || ornamentStyle === 'gold';
  const nameStyle = hasCoverImage ? { color: colors.primary, textShadow: '0 2px 20px rgba(0,0,0,0.5)' } : { color: colors.primary };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden" dir="rtl">
      {/* Background */}
      {hasCoverImage ? (
        <div className="absolute inset-0">
          <CoverImageLayer coverImage={wedding.coverImage} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${colors.background}E6 0%, ${colors.background}66 35%, ${colors.background}66 65%, ${colors.background}E6 100%)` }} />
        </div>
      ) : (
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.secondary} 50%, ${colors.background} 100%)` }} />
      )}

      {/* Pattern */}
      {showPattern && <PatternOverlay patternType={patternType} color={colors.primary} />}

      {/* Corner Ornaments */}
      {cornerOrnaments && <CornerOrnantsSimple color={colors.primary} />}

      {/* ===== ORNATE ARABIC FRAME ===== */}
      <div className="relative z-10 px-6 sm:px-8 max-w-4xl mx-auto w-full pb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="relative"
        >
          {/* Outer decorative border with Arabic pattern */}
          <div
            className="absolute -inset-8 sm:-inset-12"
            style={{
              border: `1px solid ${colors.primary}15`,
            }}
          >
            {/* Arabic corner pieces — more ornate than simple corners */}
            <div className="absolute -top-2 -right-2 w-20 h-20 sm:w-28 sm:h-28" style={{ color: colors.primary + '80' }}>
              <svg viewBox="0 0 120 120" className="w-full h-full">
                <path d="M0 0 L120 0 L120 6 L6 6 L6 120 L0 120Z" fill="currentColor" />
                <path d="M6 6 L30 6 L6 30Z" fill="currentColor" opacity="0.5" />
                <circle cx="20" cy="20" r="5" fill="currentColor" />
                <path d="M30 6 Q40 6 40 16 L40 30 Q40 40 30 40 L16 40 Q6 40 6 30" fill="none" stroke="currentColor" strokeWidth="1" />
              </svg>
            </div>
            <div className="absolute -top-2 -left-2 w-20 h-20 sm:w-28 sm:h-28" style={{ color: colors.primary + '80', transform: 'scaleX(-1)' }}>
              <svg viewBox="0 0 120 120" className="w-full h-full">
                <path d="M0 0 L120 0 L120 6 L6 6 L6 120 L0 120Z" fill="currentColor" />
                <path d="M6 6 L30 6 L6 30Z" fill="currentColor" opacity="0.5" />
                <circle cx="20" cy="20" r="5" fill="currentColor" />
                <path d="M30 6 Q40 6 40 16 L40 30 Q40 40 30 40 L16 40 Q6 40 6 30" fill="none" stroke="currentColor" strokeWidth="1" />
              </svg>
            </div>
            <div className="absolute -bottom-2 -right-2 w-20 h-20 sm:w-28 sm:h-28" style={{ color: colors.primary + '80', transform: 'scaleY(-1)' }}>
              <svg viewBox="0 0 120 120" className="w-full h-full">
                <path d="M0 0 L120 0 L120 6 L6 6 L6 120 L0 120Z" fill="currentColor" />
                <path d="M6 6 L30 6 L6 30Z" fill="currentColor" opacity="0.5" />
                <circle cx="20" cy="20" r="5" fill="currentColor" />
                <path d="M30 6 Q40 6 40 16 L40 30 Q40 40 30 40 L16 40 Q6 40 6 30" fill="none" stroke="currentColor" strokeWidth="1" />
              </svg>
            </div>
            <div className="absolute -bottom-2 -left-2 w-20 h-20 sm:w-28 sm:h-28" style={{ color: colors.primary + '80', transform: 'scale(-1)' }}>
              <svg viewBox="0 0 120 120" className="w-full h-full">
                <path d="M0 0 L120 0 L120 6 L6 6 L6 120 L0 120Z" fill="currentColor" />
                <path d="M6 6 L30 6 L6 30Z" fill="currentColor" opacity="0.5" />
                <circle cx="20" cy="20" r="5" fill="currentColor" />
                <path d="M30 6 Q40 6 40 16 L40 30 Q40 40 30 40 L16 40 Q6 40 6 30" fill="none" stroke="currentColor" strokeWidth="1" />
              </svg>
            </div>
          </div>

          {/* Main frame border — thicker for Arabic Heritage */}
          <div
            className="relative p-8 sm:p-12 md:p-16"
            style={{
              border: `2px solid ${colors.primary}50`,
              backgroundColor: colors.background + '50',
            }}
          >
            {/* Inner decorative border with Arabic arch pattern */}
            <div className="absolute inset-5 sm:inset-8 pointer-events-none" style={{ border: `1px solid ${colors.primary}20` }}>
              {/* Top center arch decoration */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2" style={{ color: colors.primary + '60' }}>
                <svg viewBox="0 0 80 40" className="w-20 h-10 sm:w-28 sm:h-14">
                  <path d="M0 40 Q0 0 40 0 Q80 0 80 40" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="40" cy="12" r="3" fill="currentColor" />
                  <path d="M0 40 L10 40 Q10 10 40 10 Q70 10 70 40 L80 40" fill="none" stroke="currentColor" strokeWidth="0.8" />
                </svg>
              </div>
              {/* Bottom center arch */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2" style={{ color: colors.primary + '60', transform: 'translateX(-50%) scaleY(-1)' }}>
                <svg viewBox="0 0 80 40" className="w-20 h-10 sm:w-28 sm:h-14">
                  <path d="M0 40 Q0 0 40 0 Q80 0 80 40" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="40" cy="12" r="3" fill="currentColor" />
                </svg>
              </div>
            </div>

            {/* Bismallah inside the frame */}
            <Bismallah color={colors.primary} ornamentStyle={ornamentStyle} text={wedding.bismallahText} />

            {/* Groom name */}
            <motion.div initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.2, delay: 0.8 }}>
              <h1 className={`${nameSize} font-bold leading-tight shimmer-text text-center`} style={nameStyle}>
                {wedding.groomName}
              </h1>
            </motion.div>

            <NameOrnament color={colors.primary} accentColor={colors.accent} ornamentStyle={ornamentStyle} couplePhoto={couplePhoto} />

            {/* Bride name */}
            <motion.div initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.2, delay: 0.8 }}>
              <h1 className={`${nameSize} font-bold leading-tight shimmer-text text-center`} style={nameStyle}>
                {wedding.brideName}
              </h1>
            </motion.div>

            {/* Photo INSIDE the ornamental frame */}
            {couplePhoto && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 1.2, ease: 'easeOut' }}
                className="flex justify-center mt-6 mb-2"
              >
                <div className="relative">
                  {/* Decorative frame around photo */}
                  <div className="absolute -inset-3" style={{ border: `1px solid ${colors.primary}30` }} />
                  <CircularPhoto src={couplePhoto} size="lg" borderColor={colors.primary} />
                </div>
              </motion.div>
            )}

            {/* Subtitle inside frame */}
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.6 }}
              className="text-xl sm:text-2xl md:text-3xl font-serif text-center mt-6 mb-3" style={{ color: colors.text + 'DD' }}>
              {wedding.heroSubtitle || 'بقلوب يملؤها الشوق، بيتشرفوا بدعوتكم لمشاركتنا أجمل ليلة في العمر'}
            </motion.p>
            <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.8 }}
              className="text-base sm:text-lg font-serif text-center" style={{ color: colors.text + 'AA' }}>
              {wedding.heroSubSubtitle || 'ليلة هنلتقي فيها على مائدة الحب، والله يجمعنا على خير وبركة'}
            </motion.p>
          </div>
        </motion.div>

        <ScrollIndicator color={colors.primary} />
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .shimmer-text {
          background: linear-gradient(90deg, ${colors.primary} 0%, ${colors.accent} 25%, ${colors.primary} 50%, ${colors.accent} 75%, ${colors.primary} 100%);
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

// ==============================
// MAIN HERO COMPONENT
// ==============================

export default function Hero({
  wedding,
  colors,
  heroStyle = 'centered',
  ornamentStyle = 'subtle',
  cornerOrnaments = false,
  showPattern = false,
  patternType = 'geometric',
  fontScale = 1.0,
  couplePhoto,
}: HeroProps) {
  const commonProps = {
    wedding,
    colors,
    ornamentStyle,
    cornerOrnaments,
    showPattern,
    patternType,
    fontScale,
    couplePhoto,
  };

  switch (heroStyle) {
    case 'split':
      return <HeroSplit {...commonProps} />;
    case 'cinematic':
      return <HeroCinematic {...commonProps} />;
    case 'frame':
      return <HeroFrame {...commonProps} />;
    case 'centered':
    default:
      return <HeroCentered {...commonProps} />;
  }
}
