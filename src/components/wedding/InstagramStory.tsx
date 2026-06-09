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
          ستوري انستغرام
        </motion.h2>

        {/* The story card to be captured - 9:16 aspect ratio */}
        <div className="flex justify-center mb-6">
          <div
            ref={cardRef}
            className="w-[270px] h-[480px] sm:w-[300px] sm:h-[533px] relative overflow-hidden flex flex-col items-center justify-between"
            style={{
              backgroundColor: colors.background,
              direction: 'rtl',
            }}
          >
            {/* Background gradient */}
            <div
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(ellipse at 50% 20%, ${colors.secondary}50 0%, transparent 60%),
                  radial-gradient(ellipse at 50% 80%, ${colors.primary}15 0%, transparent 60%),
                  linear-gradient(180deg, ${colors.background} 0%, ${colors.secondary}30 50%, ${colors.background} 100%)
                `,
              }}
            />

            {/* Islamic pattern overlay */}
            <div className="absolute inset-0 opacity-[0.06]" style={{ color: colors.primary }}>
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

            {/* Decorative borders */}
            <div
              className="absolute inset-3 rounded-2xl"
              style={{ border: `1px solid ${colors.primary}25` }}
            />
            <div
              className="absolute inset-5 rounded-xl"
              style={{ border: `1px solid ${colors.primary}12` }}
            />

            {/* Top decorative ornament */}
            <div className="relative z-10 pt-10 flex flex-col items-center">
              <div className="w-8 h-8 mb-2" style={{ color: colors.primary + '80' }}>
                <svg viewBox="0 0 30 30" className="w-full h-full">
                  <path d="M15 0L30 15L15 30L0 15Z" fill="none" stroke="currentColor" strokeWidth="1" />
                  <path d="M15 7L23 15L15 23L7 15Z" fill="none" stroke="currentColor" strokeWidth="0.8" />
                  <circle cx="15" cy="15" r="3" fill="currentColor" opacity="0.5" />
                </svg>
              </div>
            </div>

            {/* Main content */}
            <div className="relative z-10 text-center px-8 flex-1 flex flex-col items-center justify-center">
              <p className="text-sm mb-4 font-serif" style={{ color: colors.primary + 'CC' }}>
                بسم الله الرحمن الرحيم
              </p>

              <div className="flex items-center justify-center gap-3 mb-5">
                <div className="h-px w-8" style={{ backgroundColor: colors.primary + '40' }} />
                <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary }} />
                <div className="h-px w-8" style={{ backgroundColor: colors.primary + '40' }} />
              </div>

              <p className="text-xs mb-4" style={{ color: colors.text + 'AA' }}>
                يتشرفان بدعوتكم لحضور حفل زفافهما
              </p>

              <h3 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: colors.primary }}>
                {wedding.groomName}
              </h3>
              <div className="flex items-center justify-center gap-3 my-2">
                <div className="h-px w-6" style={{ backgroundColor: colors.primary + '50' }} />
                <span className="text-xl" style={{ color: colors.accent }}>&amp;</span>
                <div className="h-px w-6" style={{ backgroundColor: colors.primary + '50' }} />
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold mb-5" style={{ color: colors.primary }}>
                {wedding.brideName}
              </h3>

              <div className="flex items-center justify-center gap-3 mb-5">
                <div className="h-px w-8" style={{ backgroundColor: colors.primary + '40' }} />
                <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary }} />
                <div className="h-px w-8" style={{ backgroundColor: colors.primary + '40' }} />
              </div>

              {/* Date & time */}
              <div className="space-y-2">
                <p className="text-sm font-semibold" style={{ color: colors.primary + 'DD' }}>
                  📅 {formatDateArabic(wedding.weddingDate)}
                </p>
                <p className="text-sm font-semibold" style={{ color: colors.primary + 'DD' }}>
                  🕐 {formatTimeArabic(wedding.weddingTime)}
                </p>
              </div>
            </div>

            {/* Bottom section */}
            <div className="relative z-10 pb-10 text-center w-full px-8">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="h-px w-6" style={{ backgroundColor: colors.primary + '30' }} />
                <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: colors.primary + '60' }} />
                <div className="h-px w-6" style={{ backgroundColor: colors.primary + '30' }} />
              </div>

              {wedding.venueName && (
                <p className="text-xs mb-1" style={{ color: colors.text + 'BB' }}>
                  📍 {wedding.venueName}
                </p>
              )}
              {wedding.venueAddress && (
                <p className="text-[10px]" style={{ color: colors.text + '88' }}>
                  {wedding.venueAddress}
                </p>
              )}

              {/* Bottom decorative ornament */}
              <div className="mt-4 w-6 h-6 mx-auto" style={{ color: colors.primary + '60' }}>
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
          {downloading ? 'جاري التحميل...' : 'تحميل الستوري'}
        </motion.button>
      </motion.div>
    </div>
  );
}
