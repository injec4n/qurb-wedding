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
  groomPhoto?: string;
  bridePhoto?: string;
}

// Circular photo with ornamental gold border
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
      {/* Outer ornamental ring */}
      <div
        className={`absolute ${sizeClasses} rounded-full`}
        style={{
          border: `${borderW + 2}px solid ${borderColor}20`,
          boxShadow: `0 0 30px ${borderColor}15`,
        }}
      />
      {/* Main border ring */}
      <div
        className={`absolute ${sizeClasses} rounded-full`}
        style={{
          border: `${borderW}px solid ${borderColor}60`,
          boxShadow: `inset 0 0 15px ${borderColor}10`,
        }}
      />
      {/* Photo */}
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
  const dimInner = size === 'lg' ? 'w-8 h-8' : 'w-5 h-5';

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

// Bismallah component - elegant standalone design with decorative lines
function Bismallah({ color, ornamentStyle }: { color: string; ornamentStyle: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 0.3 }}
      className="mb-8 flex flex-col items-center gap-3"
    >
      {/* Top decorative line */}
      <div className="flex items-center gap-3">
        <div className="h-px w-12 sm:w-20" style={{ background: `linear-gradient(to left, ${color}50, transparent)` }} />
        <div className="w-2 h-2 rotate-45" style={{ backgroundColor: color + '60' }} />
        <div className="h-px w-12 sm:w-20" style={{ background: `linear-gradient(to right, ${color}50, transparent)` }} />
      </div>

      {/* Bismallah text */}
      <p
        className="text-2xl sm:text-3xl font-serif tracking-[0.15em]"
        style={{ color: color + 'CC' }}
      >
        بسم الله الرحمن الرحيم
      </p>

      {/* Bottom decorative line */}
      <div className="flex items-center gap-3">
        <div className="h-px w-8 sm:w-14" style={{ background: `linear-gradient(to left, ${color}35, transparent)` }} />
        <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: color + '40' }} />
        <div className="h-px w-8 sm:w-14" style={{ background: `linear-gradient(to right, ${color}35, transparent)` }} />
      </div>
    </motion.div>
  );
}

// Ornament between names
function NameOrnament({ color, accentColor, ornamentStyle }: { color: string; accentColor: string; ornamentStyle: string }) {
  const isBold = ornamentStyle === 'bold' || ornamentStyle === 'gold';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 1.1, ease: 'easeOut' }}
      className="my-4 sm:my-6 flex items-center justify-center"
    >
      <div className={`h-px ${isBold ? 'w-12 sm:w-20' : 'w-10 sm:w-16'}`} style={{ backgroundColor: color + '40' }} />
      <svg
        viewBox="0 0 60 40"
        className={`w-14 h-10 sm:w-20 sm:h-14 mx-2`}
        style={{ color: accentColor }}
      >
        <path
          d="M30 5 C20 5, 10 12, 10 20 C10 28, 18 32, 25 28 L30 25 L35 28 C42 32, 50 28, 50 20 C50 12, 40 5, 30 5Z"
          fill="none"
          stroke="currentColor"
          strokeWidth={isBold ? '1.5' : '1'}
        />
        <path d="M30 12 L30 28" stroke="currentColor" strokeWidth={isBold ? '1.2' : '0.8'} />
        <circle cx="30" cy="8" r={isBold ? '3' : '2'} fill="currentColor" opacity="0.6" />
        <circle cx="15" cy="20" r="1.5" fill="currentColor" opacity="0.4" />
        <circle cx="45" cy="20" r="1.5" fill="currentColor" opacity="0.4" />
        <path d="M5 20 L12 20" stroke="currentColor" strokeWidth="0.6" />
        <path d="M48 20 L55 20" stroke="currentColor" strokeWidth="0.6" />
        <path d="M30 2 L32 5 L30 8 L28 5Z" fill="currentColor" opacity="0.5" />
        <path d="M30 32 L32 35 L30 38 L28 35Z" fill="currentColor" opacity="0.5" />
      </svg>
      <div className={`h-px ${isBold ? 'w-12 sm:w-20' : 'w-10 sm:w-16'}`} style={{ backgroundColor: color + '40' }} />
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

// ==============================
// HERO STYLES
// ==============================

/** Centered hero: large names centered with decorative elements */
function HeroCentered({ wedding, colors, ornamentStyle, cornerOrnaments, showPattern, patternType, fontScale, couplePhoto, groomPhoto, bridePhoto }: HeroProps & Required<Omit<HeroProps, 'heroStyle' | 'couplePhoto' | 'groomPhoto' | 'bridePhoto'>>) {
  const hasCoverImage = !!wedding.coverImage;
  const nameSize = fontScale >= 1.1 ? 'text-6xl sm:text-7xl md:text-9xl' : 'text-5xl sm:text-6xl md:text-8xl';
  const nameStyle = hasCoverImage ? { color: colors.primary, textShadow: '0 2px 20px rgba(0,0,0,0.5)' } : { color: colors.primary };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden" dir="rtl">
      {/* Background */}
      {hasCoverImage ? (
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${wedding.coverImage})` }}>
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${colors.background}E6 0%, ${colors.background}66 35%, ${colors.background}66 65%, ${colors.background}E6 100%)` }} />
        </div>
      ) : (
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.secondary} 50%, ${colors.background} 100%)` }} />
      )}

      {/* Pattern */}
      {showPattern && <PatternOverlay patternType={patternType} color={colors.primary} />}

      {/* Corner Ornaments */}
      {cornerOrnaments && <CornerOrnaments color={colors.primary} />}

      {/* Content */}
      <div className="relative z-10 text-center px-8 sm:px-6 max-w-4xl mx-auto pb-8">
        <Bismallah color={colors.primary} ornamentStyle={ornamentStyle} />

        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 0.6 }}>
          <OrnamentalLine color={colors.primary} className="mb-6" />
        </motion.div>

        {/* Groom name */}
        <motion.div initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.2, delay: 0.8 }}>
          <h1 className={`${nameSize} font-bold leading-tight shimmer-text`} style={nameStyle}>
            {wedding.groomName}
          </h1>
        </motion.div>

        <NameOrnament color={colors.primary} accentColor={colors.accent} ornamentStyle={ornamentStyle} />

        {/* Bride name */}
        <motion.div initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.2, delay: 0.8 }}>
          <h1 className={`${nameSize} font-bold leading-tight shimmer-text`} style={nameStyle}>
            {wedding.brideName}
          </h1>
        </motion.div>

        {/* Couple Photo or Individual Photos */}
        {couplePhoto ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1.2, ease: 'easeOut' }}
            className="flex justify-center mt-8 mb-4"
          >
            <CircularPhoto src={couplePhoto} size="xl" borderColor={colors.primary} />
          </motion.div>
        ) : groomPhoto && bridePhoto ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex items-center justify-center gap-6 mt-6"
          >
            <CircularPhoto src={groomPhoto} size="sm" borderColor={colors.primary} />
            <CircularPhoto src={bridePhoto} size="sm" borderColor={colors.primary} />
          </motion.div>
        ) : null}

        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 1.4 }}>
          <OrnamentalLine color={colors.primary} className="mt-5 mb-5" />
        </motion.div>

        {/* Subtitle */}
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.6 }}
          className="text-xl sm:text-2xl md:text-3xl font-serif mb-3" style={{ color: colors.text + 'DD' }}>
          بقلوب يملؤها الشوق، نتشرف بدعوتكم لمشاركتنا أجمل ليلة في العمر
        </motion.p>
        <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.8 }}
          className="text-base sm:text-lg font-serif" style={{ color: colors.text + 'AA' }}>
          ليلة نلتقي فيها على مائدة الحب، ويجمعنا الله على خير وبركة
        </motion.p>

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

/** Split hero: names on one side, decorative pattern on the other */
function HeroSplit({ wedding, colors, ornamentStyle, showPattern, patternType, fontScale, couplePhoto, groomPhoto, bridePhoto }: HeroProps & Required<Omit<HeroProps, 'heroStyle' | 'cornerOrnaments' | 'couplePhoto' | 'groomPhoto' | 'bridePhoto'>>) {
  const hasCoverImage = !!wedding.coverImage;
  const nameSize = fontScale >= 1.1 ? 'text-5xl sm:text-6xl md:text-7xl' : 'text-4xl sm:text-5xl md:text-6xl';
  const nameStyle = hasCoverImage ? { color: colors.primary, textShadow: '0 2px 20px rgba(0,0,0,0.5)' } : { color: colors.primary };

  return (
    <div className="relative min-h-screen flex overflow-hidden" dir="rtl">
      {/* Background - full width */}
      {hasCoverImage ? (
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${wedding.coverImage})` }}>
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${colors.background}E6 0%, ${colors.background}66 35%, ${colors.background}66 65%, ${colors.background}E6 100%)` }} />
        </div>
      ) : (
        <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${colors.background} 0%, ${colors.secondary} 50%, ${colors.background} 100%)` }} />
      )}

      {/* Left decorative panel (visible on desktop) */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center">
        {showPattern && <PatternOverlay patternType={patternType} color={colors.primary} />}
        <div className="relative z-10 flex flex-col items-center">
          {/* Large decorative geometric element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="relative"
          >
            <svg viewBox="0 0 300 300" className="w-64 h-64 xl:w-80 xl:h-80" style={{ color: colors.primary + '30' }}>
              {/* Outer ring */}
              <circle cx="150" cy="150" r="140" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="150" cy="150" r="120" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="150" cy="150" r="100" fill="none" stroke="currentColor" strokeWidth="0.3" />
              {/* Cross lines */}
              <line x1="150" y1="10" x2="150" y2="290" stroke="currentColor" strokeWidth="0.3" />
              <line x1="10" y1="150" x2="290" y2="150" stroke="currentColor" strokeWidth="0.3" />
              {/* Diamond */}
              <path d="M150 20 L280 150 L150 280 L20 150Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
              {/* Center ornament */}
              <circle cx="150" cy="150" r="20" fill="none" stroke={colors.primary} strokeWidth="0.8" />
              <circle cx="150" cy="150" r="8" fill="none" stroke={colors.primary} strokeWidth="0.5" />
            </svg>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="text-lg font-serif mt-4 tracking-widest"
            style={{ color: colors.primary + '50' }}
          >
            بسم الله الرحمن الرحيم
          </motion.p>
        </div>
      </div>

      {/* Right side - content */}
      <div className="w-full lg:w-1/2 relative z-10 flex items-center justify-center px-8 sm:px-10">
        {/* Mobile Bismallah */}
        <div className="lg:hidden absolute top-8 left-0 right-0 text-center">
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-2xl sm:text-3xl font-serif tracking-[0.15em]"
            style={{ color: colors.primary + 'CC' }}
          >
            بسم الله الرحمن الرحيم
          </motion.p>
        </div>

        <div className="max-w-lg">
          {/* Decorative line top */}
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 0.6 }}>
            <OrnamentalLine color={colors.primary} className="mb-5" />
          </motion.div>

          {/* Groom name */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.8 }}
          >
            <h1 className={`${nameSize} font-bold leading-tight shimmer-text text-right`} style={nameStyle}>
              {wedding.groomName}
            </h1>
          </motion.div>

          <NameOrnament color={colors.primary} accentColor={colors.accent} ornamentStyle={ornamentStyle} />

          {/* Bride name */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 1 }}
          >
            <h1 className={`${nameSize} font-bold leading-tight shimmer-text text-right`} style={nameStyle}>
              {wedding.brideName}
            </h1>
          </motion.div>

          {/* Photo in split hero */}
          {couplePhoto ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1.2, ease: 'easeOut' }}
              className="flex justify-center mt-6"
            >
              <CircularPhoto src={couplePhoto} size="lg" borderColor={colors.primary} />
            </motion.div>
          ) : groomPhoto && bridePhoto ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="flex items-center justify-center gap-4 mt-6"
            >
              <CircularPhoto src={groomPhoto} size="sm" borderColor={colors.primary} />
              <CircularPhoto src={bridePhoto} size="sm" borderColor={colors.primary} />
            </motion.div>
          ) : null}

          {/* Decorative line bottom */}
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 1.4 }}>
            <OrnamentalLine color={colors.primary} className="mt-5 mb-4" />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.6 }}
            className="text-lg sm:text-xl md:text-2xl font-serif text-right mb-2"
            style={{ color: colors.text + 'DD' }}
          >
            بقلوب يملؤها الشوق، نتشرف بدعوتكم لمشاركتنا أجمل ليلة في العمر
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="text-sm sm:text-base font-serif text-right"
            style={{ color: colors.text + 'AA' }}
          >
            ليلة نلتقي فيها على مائدة الحب، ويجمعنا الله على خير وبركة
          </motion.p>
        </div>

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

/** Cinematic hero: full-width dramatic overlay with larger text */
function HeroCinematic({ wedding, colors, ornamentStyle, cornerOrnaments, showPattern, patternType, fontScale, couplePhoto, groomPhoto, bridePhoto }: HeroProps & Required<Omit<HeroProps, 'heroStyle' | 'couplePhoto' | 'groomPhoto' | 'bridePhoto'>>) {
  const hasCoverImage = !!wedding.coverImage;
  const nameSize = fontScale >= 1.1 ? 'text-7xl sm:text-8xl md:text-9xl' : 'text-6xl sm:text-7xl md:text-8xl';
  const nameStyle = hasCoverImage ? { color: colors.primary, textShadow: '0 2px 20px rgba(0,0,0,0.5)' } : { color: colors.primary };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden" dir="rtl">
      {/* Dramatic Background */}
      {hasCoverImage ? (
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${wedding.coverImage})` }}>
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${colors.background}E6 0%, ${colors.background}66 35%, ${colors.background}66 65%, ${colors.background}E6 100%)` }} />
        </div>
      ) : (
        <div className="absolute inset-0" style={{
          background: `radial-gradient(ellipse at 50% 30%, ${colors.secondary}90 0%, ${colors.background} 70%)`,
        }} />
      )}

      {/* Cinematic top gradient overlay */}
      <div className="absolute inset-0" style={{
        background: `linear-gradient(180deg, ${colors.background}40 0%, transparent 30%, transparent 70%, ${colors.background} 100%)`,
      }} />

      {/* Pattern */}
      {showPattern && <PatternOverlay patternType={patternType} color={colors.primary} />}

      {/* Corner Ornaments */}
      {cornerOrnaments && <CornerOrnaments color={colors.primary} />}

      {/* Cinematic light beams */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-full opacity-10" style={{ background: `linear-gradient(180deg, transparent, ${colors.primary}, transparent)` }} />
        <div className="absolute top-0 right-1/4 w-px h-full opacity-10" style={{ background: `linear-gradient(180deg, transparent, ${colors.primary}, transparent)` }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-8 sm:px-6 max-w-5xl mx-auto pb-8">
        <Bismallah color={colors.primary} ornamentStyle={ornamentStyle} />

        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, delay: 0.6 }}>
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="h-px w-24 sm:w-40" style={{ backgroundColor: colors.primary + '40' }} />
            <div className="w-4 h-4 rotate-45" style={{ backgroundColor: colors.primary + '60' }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-4 h-4 rotate-45" style={{ backgroundColor: colors.primary + '60' }} />
            <div className="h-px w-24 sm:w-40" style={{ backgroundColor: colors.primary + '40' }} />
          </div>
        </motion.div>

        {/* Groom name - dramatic */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.4, delay: 0.8 }}>
          <h1 className={`${nameSize} font-bold leading-tight shimmer-text`} style={nameStyle}>
            {wedding.groomName}
          </h1>
        </motion.div>

        <NameOrnament color={colors.primary} accentColor={colors.accent} ornamentStyle={ornamentStyle} />

        {/* Bride name - dramatic */}
        <motion.div initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.4, delay: 0.8 }}>
          <h1 className={`${nameSize} font-bold leading-tight shimmer-text`} style={nameStyle}>
            {wedding.brideName}
          </h1>
        </motion.div>

        {/* Photo in cinematic hero */}
        {couplePhoto ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1.2, ease: 'easeOut' }}
            className="flex justify-center mt-8 mb-4"
          >
            <CircularPhoto src={couplePhoto} size="xl" borderColor={colors.primary} />
          </motion.div>
        ) : groomPhoto && bridePhoto ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex items-center justify-center gap-6 mt-6"
          >
            <CircularPhoto src={groomPhoto} size="sm" borderColor={colors.primary} />
            <CircularPhoto src={bridePhoto} size="sm" borderColor={colors.primary} />
          </motion.div>
        ) : null}

        {/* Dramatic lower ornament */}
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, delay: 1.4 }}>
          <div className="flex items-center justify-center gap-6 mt-6 mb-6">
            <div className="h-px w-24 sm:w-40" style={{ backgroundColor: colors.primary + '40' }} />
            <div className="w-4 h-4 rotate-45" style={{ backgroundColor: colors.primary + '60' }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-4 h-4 rotate-45" style={{ backgroundColor: colors.primary + '60' }} />
            <div className="h-px w-24 sm:w-40" style={{ backgroundColor: colors.primary + '40' }} />
          </div>
        </motion.div>

        {/* Subtitle - larger and more dramatic */}
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.6 }}
          className="text-2xl sm:text-3xl md:text-4xl font-serif mb-4" style={{ color: colors.text + 'DD' }}>
          بقلوب يملؤها الشوق، نتشرف بدعوتكم لمشاركتنا أجمل ليلة في العمر
        </motion.p>
        <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.8 }}
          className="text-lg sm:text-xl font-serif" style={{ color: colors.text + 'AA' }}>
          ليلة نلتقي فيها على مائدة الحب، ويجمعنا الله على خير وبركة
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

/** Frame hero: names inside an ornate decorative frame/border */
function HeroFrame({ wedding, colors, ornamentStyle, cornerOrnaments, showPattern, patternType, fontScale, couplePhoto, groomPhoto, bridePhoto }: HeroProps & Required<Omit<HeroProps, 'heroStyle' | 'couplePhoto' | 'groomPhoto' | 'bridePhoto'>>) {
  const hasCoverImage = !!wedding.coverImage;
  const nameSize = fontScale >= 1.1 ? 'text-5xl sm:text-6xl md:text-8xl' : 'text-4xl sm:text-5xl md:text-7xl';
  const isBold = ornamentStyle === 'bold' || ornamentStyle === 'gold';
  const borderWidth = isBold ? '2px' : '1px';
  const borderOuterWidth = isBold ? '1.5px' : '1px';
  const nameStyle = hasCoverImage ? { color: colors.primary, textShadow: '0 2px 20px rgba(0,0,0,0.5)' } : { color: colors.primary };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden" dir="rtl">
      {/* Background */}
      {hasCoverImage ? (
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${wedding.coverImage})` }}>
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${colors.background}E6 0%, ${colors.background}66 35%, ${colors.background}66 65%, ${colors.background}E6 100%)` }} />
        </div>
      ) : (
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.secondary} 50%, ${colors.background} 100%)` }} />
      )}

      {/* Pattern */}
      {showPattern && <PatternOverlay patternType={patternType} color={colors.primary} />}

      {/* Corner Ornaments */}
      {cornerOrnaments && <CornerOrnantsSimple color={colors.primary} />}

      {/* Main ornate frame */}
      <div className="relative z-10 px-8 sm:px-10 max-w-4xl mx-auto w-full pb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="relative"
        >
          {/* Outer decorative border */}
          <div
            className="absolute -inset-6 sm:-inset-10 rounded-sm"
            style={{
              border: `${borderOuterWidth} solid ${colors.primary}25`,
            }}
          />

          {/* Main frame border */}
          <div
            className="relative p-8 sm:p-12 md:p-16"
            style={{
              border: `${borderWidth} solid ${colors.primary}40`,
              backgroundColor: colors.background + '40',
            }}
          >
            {/* Frame corner ornaments */}
            {isBold ? (
              <>
                {/* Top-right corner */}
                <div className="absolute -top-1 -right-1 w-16 h-16 sm:w-24 sm:h-24" style={{ color: colors.primary }}>
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path d="M0 0 L100 0 L100 8 L8 8 L8 100 L0 100Z" fill="currentColor" />
                    <circle cx="16" cy="16" r="4" fill="currentColor" />
                  </svg>
                </div>
                {/* Top-left corner */}
                <div className="absolute -top-1 -left-1 w-16 h-16 sm:w-24 sm:h-24" style={{ color: colors.primary, transform: 'scaleX(-1)' }}>
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path d="M0 0 L100 0 L100 8 L8 8 L8 100 L0 100Z" fill="currentColor" />
                    <circle cx="16" cy="16" r="4" fill="currentColor" />
                  </svg>
                </div>
                {/* Bottom-right corner */}
                <div className="absolute -bottom-1 -right-1 w-16 h-16 sm:w-24 sm:h-24" style={{ color: colors.primary, transform: 'scaleY(-1)' }}>
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path d="M0 0 L100 0 L100 8 L8 8 L8 100 L0 100Z" fill="currentColor" />
                    <circle cx="16" cy="16" r="4" fill="currentColor" />
                  </svg>
                </div>
                {/* Bottom-left corner */}
                <div className="absolute -bottom-1 -left-1 w-16 h-16 sm:w-24 sm:h-24" style={{ color: colors.primary, transform: 'scale(-1)' }}>
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path d="M0 0 L100 0 L100 8 L8 8 L8 100 L0 100Z" fill="currentColor" />
                    <circle cx="16" cy="16" r="4" fill="currentColor" />
                  </svg>
                </div>
              </>
            ) : (
              <>
                {/* Subtle corner accents */}
                <div className="absolute top-2 right-2 w-4 h-4" style={{ color: colors.primary + '60' }}>
                  <svg viewBox="0 0 20 20"><path d="M0 0 L20 0 L20 3 L3 3 L3 20 L0 20Z" fill="currentColor" /></svg>
                </div>
                <div className="absolute top-2 left-2 w-4 h-4" style={{ color: colors.primary + '60' }}>
                  <svg viewBox="0 0 20 20"><path d="M20 0 L0 0 L0 3 L17 3 L17 20 L20 20Z" fill="currentColor" /></svg>
                </div>
                <div className="absolute bottom-2 right-2 w-4 h-4" style={{ color: colors.primary + '60' }}>
                  <svg viewBox="0 0 20 20"><path d="M0 20 L20 20 L20 17 L3 17 L3 0 L0 0Z" fill="currentColor" /></svg>
                </div>
                <div className="absolute bottom-2 left-2 w-4 h-4" style={{ color: colors.primary + '60' }}>
                  <svg viewBox="0 0 20 20"><path d="M20 20 L0 20 L0 17 L17 17 L17 0 L20 0Z" fill="currentColor" /></svg>
                </div>
              </>
            )}

            {/* Inner border line */}
            <div className="absolute inset-4 sm:inset-6 pointer-events-none" style={{ border: `1px solid ${colors.primary}15` }} />

            {/* Bismallah */}
            <Bismallah color={colors.primary} ornamentStyle={ornamentStyle} />

            {/* Groom name */}
            <motion.div initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.2, delay: 0.8 }}>
              <h1 className={`${nameSize} font-bold leading-tight shimmer-text text-center`} style={nameStyle}>
                {wedding.groomName}
              </h1>
            </motion.div>

            <NameOrnament color={colors.primary} accentColor={colors.accent} ornamentStyle={ornamentStyle} />

            {/* Bride name */}
            <motion.div initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.2, delay: 0.8 }}>
              <h1 className={`${nameSize} font-bold leading-tight shimmer-text text-center`} style={nameStyle}>
                {wedding.brideName}
              </h1>
            </motion.div>

            {/* Photo in frame hero */}
            {couplePhoto ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 1.2, ease: 'easeOut' }}
                className="flex justify-center mt-6 mb-2"
              >
                <CircularPhoto src={couplePhoto} size="lg" borderColor={colors.primary} />
              </motion.div>
            ) : groomPhoto && bridePhoto ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="flex items-center justify-center gap-4 mt-6"
              >
                <CircularPhoto src={groomPhoto} size="sm" borderColor={colors.primary} />
                <CircularPhoto src={bridePhoto} size="sm" borderColor={colors.primary} />
              </motion.div>
            ) : null}

            {/* Ornamental line */}
            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 1.4 }}>
              <OrnamentalLine color={colors.primary} className="mt-5 mb-4" />
            </motion.div>

            {/* Subtitle */}
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.6 }}
              className="text-xl sm:text-2xl md:text-3xl font-serif mb-3 text-center" style={{ color: colors.text + 'DD' }}>
              بقلوب يملؤها الشوق، نتشرف بدعوتكم لمشاركتنا أجمل ليلة في العمر
            </motion.p>
            <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.8 }}
              className="text-base sm:text-lg font-serif text-center" style={{ color: colors.text + 'AA' }}>
              ليلة نلتقي فيها على مائدة الحب، ويجمعنا الله على خير وبركة
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

/** Simpler corner ornaments for the frame hero */
function CornerOrnantsSimple({ color }: { color: string }) {
  return (
    <>
      <div className="absolute top-0 left-0 w-24 h-24 sm:w-36 sm:h-36 opacity-15">
        <svg viewBox="0 0 200 200" className="w-full h-full" style={{ color }}>
          <path d="M0 0 Q100 0 100 100 Q0 100 0 0Z" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M0 0 Q50 0 50 50 Q0 50 0 0Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>
      <div className="absolute top-0 right-0 w-24 h-24 sm:w-36 sm:h-36 opacity-15" style={{ transform: 'scaleX(-1)' }}>
        <svg viewBox="0 0 200 200" className="w-full h-full" style={{ color }}>
          <path d="M0 0 Q100 0 100 100 Q0 100 0 0Z" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M0 0 Q50 0 50 50 Q0 50 0 0Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-36 sm:h-36 opacity-15" style={{ transform: 'scaleY(-1)' }}>
        <svg viewBox="0 0 200 200" className="w-full h-full" style={{ color }}>
          <path d="M0 0 Q100 0 100 100 Q0 100 0 0Z" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 w-24 h-24 sm:w-36 sm:h-36 opacity-15" style={{ transform: 'scale(-1)' }}>
        <svg viewBox="0 0 200 200" className="w-full h-full" style={{ color }}>
          <path d="M0 0 Q100 0 100 100 Q0 100 0 0Z" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
    </>
  );
}

// Main Hero component
export default function Hero({
  wedding,
  colors,
  heroStyle = 'centered',
  ornamentStyle = 'subtle',
  cornerOrnaments = true,
  showPattern = true,
  patternType = 'geometric',
  fontScale = 1,
  couplePhoto,
  groomPhoto,
  bridePhoto,
}: HeroProps) {
  const commonProps = {
    wedding,
    colors,
    heroStyle,
    ornamentStyle,
    cornerOrnaments,
    showPattern,
    patternType,
    fontScale,
    couplePhoto,
    groomPhoto,
    bridePhoto,
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
