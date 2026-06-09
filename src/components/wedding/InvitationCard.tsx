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
    <div className="py-16 px-4" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8 }}
        className="max-w-lg mx-auto text-center"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-xl sm:text-2xl font-bold mb-8"
          style={{ color: colors.text }}
        >
          بطاقة الدعوة
        </motion.h2>

        {/* The card to be captured */}
        <div className="flex justify-center mb-6">
          <div
            ref={cardRef}
            className="w-[360px] h-[360px] sm:w-[420px] sm:h-[420px] relative overflow-hidden flex flex-col items-center justify-center"
            style={{
              backgroundColor: colors.background,
              direction: 'rtl',
            }}
          >
            {/* Background gradient */}
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at 50% 30%, ${colors.secondary}60 0%, ${colors.background} 70%)`,
              }}
            />

            {/* Islamic pattern overlay */}
            <div className="absolute inset-0 opacity-[0.07]" style={{ color: colors.primary }}>
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

            {/* Decorative border */}
            <div
              className="absolute inset-3 sm:inset-4 rounded-2xl"
              style={{ border: `1px solid ${colors.primary}30` }}
            />
            <div
              className="absolute inset-5 sm:inset-6 rounded-xl"
              style={{ border: `1px solid ${colors.primary}15` }}
            />

            {/* Corner decorations */}
            <div className="absolute top-5 right-5 sm:top-7 sm:right-7 w-4 h-4" style={{ color: colors.primary }}>
              <svg viewBox="0 0 20 20" className="w-full h-full">
                <path d="M0 0 Q20 0 20 20 Q0 20 0 0Z" fill="none" stroke="currentColor" strokeWidth="1" />
              </svg>
            </div>
            <div className="absolute top-5 left-5 sm:top-7 sm:left-7 w-4 h-4" style={{ color: colors.primary, transform: 'scaleX(-1)' }}>
              <svg viewBox="0 0 20 20" className="w-full h-full">
                <path d="M0 0 Q20 0 20 20 Q0 20 0 0Z" fill="none" stroke="currentColor" strokeWidth="1" />
              </svg>
            </div>
            <div className="absolute bottom-5 right-5 sm:bottom-7 sm:right-7 w-4 h-4" style={{ color: colors.primary, transform: 'scaleY(-1)' }}>
              <svg viewBox="0 0 20 20" className="w-full h-full">
                <path d="M0 0 Q20 0 20 20 Q0 20 0 0Z" fill="none" stroke="currentColor" strokeWidth="1" />
              </svg>
            </div>
            <div className="absolute bottom-5 left-5 sm:bottom-7 sm:left-7 w-4 h-4" style={{ color: colors.primary, transform: 'scale(-1)' }}>
              <svg viewBox="0 0 20 20" className="w-full h-full">
                <path d="M0 0 Q20 0 20 20 Q0 20 0 0Z" fill="none" stroke="currentColor" strokeWidth="1" />
              </svg>
            </div>

            {/* Card content */}
            <div className="relative z-10 text-center px-8">
              <p className="text-sm sm:text-base mb-3 font-serif" style={{ color: colors.primary + 'CC' }}>
                بسم الله الرحمن الرحيم
              </p>

              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="h-px w-6" style={{ backgroundColor: colors.primary + '50' }} />
                <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: colors.primary }} />
                <div className="h-px w-6" style={{ backgroundColor: colors.primary + '50' }} />
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: colors.primary }}>
                {wedding.groomName}
              </h3>
              <p className="text-lg sm:text-xl mb-1" style={{ color: colors.accent }}>
                &amp;
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: colors.primary }}>
                {wedding.brideName}
              </h3>

              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="h-px w-6" style={{ backgroundColor: colors.primary + '50' }} />
                <div className="w-1 h-1 rounded-full" style={{ backgroundColor: colors.primary }} />
                <div className="h-px w-6" style={{ backgroundColor: colors.primary + '50' }} />
              </div>

              <p className="text-xs sm:text-sm mb-2" style={{ color: colors.text + 'BB' }}>
                يتشرفان بدعوتكم لحضور حفل زفافهما
              </p>

              <p className="text-xs sm:text-sm font-semibold mb-1" style={{ color: colors.primary + 'DD' }}>
                {formatDateArabic(wedding.weddingDate)}
              </p>
              <p className="text-xs sm:text-sm font-semibold mb-2" style={{ color: colors.primary + 'DD' }}>
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
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownload}
          disabled={downloading}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-base font-semibold transition-all duration-300 disabled:opacity-50"
          style={{
            backgroundColor: colors.button,
            color: colors.background,
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
