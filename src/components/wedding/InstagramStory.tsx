'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Loader2 } from 'lucide-react';
import { Wedding, ThemeColors } from '@/types/wedding';
import { formatDateArabic, formatTimeArabic } from '@/lib/wedding-utils';

interface InstagramStoryProps {
  wedding: Wedding;
  colors: ThemeColors;
}

export default function InstagramStory({ wedding, colors }: InstagramStoryProps) {
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
      link.download = `ستوري-زفاف-${wedding.groomName}-${wedding.brideName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating story:', error);
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
          ستوري انستغرام
        </motion.h2>

        {/* The story card to be captured - 9:16 aspect ratio */}
        <div className="flex justify-center mb-8">
          <div
            ref={cardRef}
            className="w-[270px] h-[480px] sm:w-[300px] sm:h-[533px] relative overflow-hidden flex flex-col items-center justify-between"
            style={{
              backgroundColor: colors.background,
              direction: 'rtl',
            }}
          >
            {/* Background gradient - richer */}
            <div
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(ellipse at 50% 20%, ${colors.secondary}45 0%, transparent 55%),
                  radial-gradient(ellipse at 50% 80%, ${colors.primary}18 0%, transparent 55%),
                  linear-gradient(180deg, ${colors.background} 0%, ${colors.secondary}25 50%, ${colors.background} 100%)
                `,
              }}
            />

            {/* Islamic pattern overlay */}
            <div className="absolute inset-0 opacity-[0.04]" style={{ color: colors.primary }}>
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="story-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M20 0L40 20L20 40L0 20Z" fill="none" stroke="currentColor" strokeWidth="0.6" />
                    <circle cx="20" cy="20" r="5" fill="none" stroke="currentColor" strokeWidth="0.4" />
                    <circle cx="0" cy="0" r="2" fill="currentColor" opacity="0.3" />
                    <circle cx="40" cy="40" r="2" fill="currentColor" opacity="0.3" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#story-pattern)" />
              </svg>
            </div>

            {/* Decorative borders - triple frame */}
            <div
              className="absolute inset-3 rounded-2xl"
              style={{ border: `1.5px solid ${colors.primary}22` }}
            />
            <div
              className="absolute inset-5 rounded-xl"
              style={{ border: `1px solid ${colors.primary}12` }}
            />
            <div
              className="absolute inset-7 rounded-lg"
              style={{ border: `0.5px solid ${colors.primary}08` }}
            />

            {/* Corner decorations */}
            <div className="absolute top-4 right-4 w-4 h-4" style={{ color: colors.primary + '50' }}>
              <svg viewBox="0 0 16 16"><path d="M0 0 Q16 0 16 16 Q0 16 0 0Z" fill="none" stroke="currentColor" strokeWidth="0.8" /></svg>
            </div>
            <div className="absolute top-4 left-4 w-4 h-4" style={{ color: colors.primary + '50' }}>
              <svg viewBox="0 0 16 16"><path d="M16 0 Q0 0 0 16 Q16 16 16 0Z" fill="none" stroke="currentColor" strokeWidth="0.8" /></svg>
            </div>
            <div className="absolute bottom-4 right-4 w-4 h-4" style={{ color: colors.primary + '50' }}>
              <svg viewBox="0 0 16 16"><path d="M0 16 Q16 16 16 0 Q0 0 0 16Z" fill="none" stroke="currentColor" strokeWidth="0.8" /></svg>
            </div>
            <div className="absolute bottom-4 left-4 w-4 h-4" style={{ color: colors.primary + '50' }}>
              <svg viewBox="0 0 16 16"><path d="M16 16 Q0 16 0 0 Q16 0 16 16Z" fill="none" stroke="currentColor" strokeWidth="0.8" /></svg>
            </div>

            {/* Top decorative ornament */}
            <div className="relative z-10 pt-10 flex flex-col items-center">
              <div className="w-10 h-10 mb-3" style={{ color: colors.primary + '70' }}>
                <svg viewBox="0 0 40 40" className="w-full h-full">
                  <path d="M20 0L40 20L20 40L0 20Z" fill="none" stroke="currentColor" strokeWidth="1" />
                  <path d="M20 10L30 20L20 30L10 20Z" fill="none" stroke="currentColor" strokeWidth="0.8" />
                  <circle cx="20" cy="20" r="4" fill="currentColor" opacity="0.4" />
                </svg>
              </div>
            </div>

            {/* Main content */}
            <div className="relative z-10 text-center px-8 flex-1 flex flex-col items-center justify-center">
              <p className="text-sm mb-5 font-serif tracking-wider" style={{ color: colors.primary + 'CC' }}>
                بسم الله الرحمن الرحيم
              </p>

              <div className="flex items-center justify-center gap-3 mb-5">
                <div className="h-px w-10" style={{ backgroundColor: colors.primary + '40' }} />
                <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary + '70' }} />
                <div className="h-px w-10" style={{ backgroundColor: colors.primary + '40' }} />
              </div>

              <p className="text-xs mb-5 font-serif" style={{ color: colors.text + 'AA' }}>
                يتشرفان بدعوتكم لحضور حفل زفافهما
              </p>

              <h3 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: colors.primary }}>
                {wedding.groomName}
              </h3>
              {/* Decorative ornament between names */}
              <div className="flex items-center justify-center gap-2 my-2">
                <div className="h-px w-6" style={{ backgroundColor: colors.primary + '40' }} />
                <svg viewBox="0 0 24 16" className="w-5 h-3.5" style={{ color: colors.accent }}>
                  <path d="M12 1 L16 8 L12 15 L8 8Z" fill="none" stroke="currentColor" strokeWidth="1" />
                  <circle cx="12" cy="8" r="2" fill="currentColor" opacity="0.4" />
                </svg>
                <div className="h-px w-6" style={{ backgroundColor: colors.primary + '40' }} />
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold mb-6" style={{ color: colors.primary }}>
                {wedding.brideName}
              </h3>

              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-10" style={{ backgroundColor: colors.primary + '40' }} />
                <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary + '70' }} />
                <div className="h-px w-10" style={{ backgroundColor: colors.primary + '40' }} />
              </div>

              {/* Date & time */}
              <div className="space-y-2">
                <p className="text-sm font-semibold" style={{ color: colors.primary + 'DD' }}>
                  {formatDateArabic(wedding.weddingDate)}
                </p>
                <p className="text-sm font-semibold" style={{ color: colors.primary + 'DD' }}>
                  {formatTimeArabic(wedding.weddingTime)}
                </p>
              </div>
            </div>

            {/* Bottom section - venue address prominently */}
            <div className="relative z-10 pb-10 text-center w-full px-8">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="h-px w-8" style={{ backgroundColor: colors.primary + '25' }} />
                <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: colors.primary + '50' }} />
                <div className="h-px w-8" style={{ backgroundColor: colors.primary + '25' }} />
              </div>

              {wedding.venueName && (
                <p className="text-sm font-semibold mb-1" style={{ color: colors.text + 'CC' }}>
                  📍 {wedding.venueName}
                </p>
              )}
              {wedding.venueAddress && (
                <p className="text-[11px] mb-2" style={{ color: colors.text + '88' }}>
                  {wedding.venueAddress}
                </p>
              )}

              {/* Bottom decorative ornament */}
              <div className="mt-4 w-6 h-6 mx-auto" style={{ color: colors.primary + '50' }}>
                <svg viewBox="0 0 20 20" className="w-full h-full">
                  <path d="M10 0L20 10L10 20L0 10Z" fill="none" stroke="currentColor" strokeWidth="1" />
                  <circle cx="10" cy="10" r="2" fill="currentColor" opacity="0.4" />
                </svg>
              </div>
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
          {downloading ? 'جاري التحميل...' : 'تحميل الستوري'}
        </motion.button>
      </motion.div>
    </div>
  );
}
