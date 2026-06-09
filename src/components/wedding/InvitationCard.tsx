'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Loader2 } from 'lucide-react';
import { Wedding, ThemeColors } from '@/types/wedding';
import { formatDateArabic, formatTimeArabic } from '@/lib/wedding-utils';

interface InvitationCardProps {
  wedding: Wedding;
  colors: ThemeColors;
}

export default function InvitationCard({ wedding, colors }: InvitationCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current || downloading) return;
    setDownloading(true);

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });

      const link = document.createElement('a');
      link.download = `دعوة-زفاف-${wedding.groomName}-${wedding.brideName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating card:', error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="py-20 px-4" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="max-w-lg mx-auto text-center"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-2xl sm:text-3xl font-bold mb-12 font-serif"
          style={{ color: colors.text }}
        >
          بطاقة الدعوة
        </motion.h2>

        {/* The card to be captured */}
        <div className="flex justify-center mb-8">
          <div
            ref={cardRef}
            className="w-[360px] h-[360px] sm:w-[440px] sm:h-[440px] relative overflow-hidden flex flex-col items-center justify-center"
            style={{
              backgroundColor: colors.background,
              direction: 'rtl',
            }}
          >
            {/* Background gradient */}
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at 50% 30%, ${colors.secondary}50 0%, ${colors.background} 70%)`,
              }}
            />

            {/* Islamic pattern overlay */}
            <div className="absolute inset-0 opacity-[0.05]" style={{ color: colors.primary }}>
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="card-pattern" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path d="M25 0L50 25L25 50L0 25Z" fill="none" stroke="currentColor" strokeWidth="0.8" />
                    <circle cx="25" cy="25" r="6" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#card-pattern)" />
              </svg>
            </div>

            {/* Decorative borders - more ornamental */}
            <div
              className="absolute inset-4 sm:inset-5 rounded-2xl"
              style={{ border: `2px solid ${colors.primary}28` }}
            />
            <div
              className="absolute inset-6 sm:inset-7 rounded-xl"
              style={{ border: `1px solid ${colors.primary}15` }}
            />
            <div
              className="absolute inset-8 sm:inset-9 rounded-lg"
              style={{ border: `1px solid ${colors.primary}08` }}
            />

            {/* Larger corner decorations */}
            <div className="absolute top-5 right-5 sm:top-7 sm:right-7 w-6 h-6" style={{ color: colors.primary }}>
              <svg viewBox="0 0 24 24" className="w-full h-full">
                <path d="M0 0 Q24 0 24 24 Q0 24 0 0Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="4" cy="4" r="1.5" fill="currentColor" opacity="0.5" />
              </svg>
            </div>
            <div className="absolute top-5 left-5 sm:top-7 sm:left-7 w-6 h-6" style={{ color: colors.primary, transform: 'scaleX(-1)' }}>
              <svg viewBox="0 0 24 24" className="w-full h-full">
                <path d="M0 0 Q24 0 24 24 Q0 24 0 0Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="4" cy="4" r="1.5" fill="currentColor" opacity="0.5" />
              </svg>
            </div>
            <div className="absolute bottom-5 right-5 sm:bottom-7 sm:right-7 w-6 h-6" style={{ color: colors.primary, transform: 'scaleY(-1)' }}>
              <svg viewBox="0 0 24 24" className="w-full h-full">
                <path d="M0 0 Q24 0 24 24 Q0 24 0 0Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="4" cy="4" r="1.5" fill="currentColor" opacity="0.5" />
              </svg>
            </div>
            <div className="absolute bottom-5 left-5 sm:bottom-7 sm:left-7 w-6 h-6" style={{ color: colors.primary, transform: 'scale(-1)' }}>
              <svg viewBox="0 0 24 24" className="w-full h-full">
                <path d="M0 0 Q24 0 24 24 Q0 24 0 0Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="4" cy="4" r="1.5" fill="currentColor" opacity="0.5" />
              </svg>
            </div>

            {/* Card content */}
            <div className="relative z-10 text-center px-10">
              <p className="text-sm sm:text-base mb-4 font-serif tracking-wider" style={{ color: colors.primary + 'CC' }}>
                بسم الله الرحمن الرحيم
              </p>

              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="h-px w-8" style={{ backgroundColor: colors.primary + '50' }} />
                <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary + '70' }} />
                <div className="h-px w-8" style={{ backgroundColor: colors.primary + '50' }} />
              </div>

              <h3 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: colors.primary }}>
                {wedding.groomName}
              </h3>

              {/* Decorative monogram/ornament between names */}
              <div className="flex items-center justify-center gap-2 my-2">
                <div className="h-px w-6" style={{ backgroundColor: colors.primary + '40' }} />
                <svg viewBox="0 0 40 24" className="w-8 h-5" style={{ color: colors.accent }}>
                  <path d="M20 2 L24 12 L20 22 L16 12Z" fill="none" stroke="currentColor" strokeWidth="1" />
                  <circle cx="20" cy="12" r="2.5" fill="currentColor" opacity="0.4" />
                  <path d="M4 12 L14 12" stroke="currentColor" strokeWidth="0.8" />
                  <path d="M26 12 L36 12" stroke="currentColor" strokeWidth="0.8" />
                  <circle cx="4" cy="12" r="1.5" fill="currentColor" opacity="0.3" />
                  <circle cx="36" cy="12" r="1.5" fill="currentColor" opacity="0.3" />
                </svg>
                <div className="h-px w-6" style={{ backgroundColor: colors.primary + '40' }} />
              </div>

              <h3 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: colors.primary }}>
                {wedding.brideName}
              </h3>

              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="h-px w-8" style={{ backgroundColor: colors.primary + '50' }} />
                <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: colors.primary }} />
                <div className="h-px w-8" style={{ backgroundColor: colors.primary + '50' }} />
              </div>

              <p className="text-xs sm:text-sm mb-3 font-serif" style={{ color: colors.text + 'BB' }}>
                يتشرفان بدعوتكم لحضور حفل زفافهما
              </p>

              <p className="text-sm sm:text-base font-semibold mb-1" style={{ color: colors.primary + 'DD' }}>
                {formatDateArabic(wedding.weddingDate)}
              </p>
              <p className="text-sm sm:text-base font-semibold mb-3" style={{ color: colors.primary + 'DD' }}>
                {formatTimeArabic(wedding.weddingTime)}
              </p>

              {wedding.venueName && (
                <p className="text-xs" style={{ color: colors.text + '99' }}>
                  📍 {wedding.venueName}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Download button */}
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownload}
          disabled={downloading}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 disabled:opacity-50"
          style={{
            backgroundColor: colors.button,
            color: colors.background,
            boxShadow: `0 4px 16px ${colors.button}25`,
          }}
        >
          {downloading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Download className="w-5 h-5" />
          )}
          {downloading ? 'جاري التحميل...' : 'تحميل البطاقة'}
        </motion.button>
      </motion.div>
    </div>
  );
}
