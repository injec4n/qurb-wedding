'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { formatDateArabic, formatTimeArabic } from '@/lib/wedding-utils';

interface LivePreviewProps {
  formData: {
    groomName: string;
    brideName: string;
    weddingDate: string;
    weddingTime: string;
    venueName: string;
    venueAddress: string;
    welcomeMessage: string;
    coverImage: string;
    couplePhoto: string;
    theme: string;
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    buttonColor: string;
    accentColor: string;
    enableRsvp: boolean;
    enableCountdown: boolean;
    enableGallery: boolean;
  };
  isOpen?: boolean;
  onToggle?: () => void;
}

export default function LivePreview({ formData, isOpen = true, onToggle }: LivePreviewProps) {
  const isMobile = useIsMobile();

  const colors = useMemo(
    () => ({
      primary: formData.primaryColor || '#D4A853',
      secondary: formData.secondaryColor || '#1A1A2E',
      background: formData.backgroundColor || '#0D0D1A',
      text: formData.textColor || '#FFFFFF',
      button: formData.buttonColor || '#D4A853',
      accent: formData.accentColor || '#E8C874',
    }),
    [formData.primaryColor, formData.secondaryColor, formData.backgroundColor, formData.textColor, formData.buttonColor, formData.accentColor]
  );

  const formattedDate = useMemo(() => {
    if (!formData.weddingDate) return '';
    return formatDateArabic(formData.weddingDate);
  }, [formData.weddingDate]);

  const formattedTime = useMemo(() => {
    if (!formData.weddingTime) return '';
    return formatTimeArabic(formData.weddingTime);
  }, [formData.weddingTime]);

  const previewContent = (
    <div
      className="w-[320px] h-[500px] relative overflow-hidden flex flex-col items-center justify-center"
      style={{ backgroundColor: colors.background, direction: 'rtl' }}
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
            <pattern id="preview-islamic-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M30 0L60 30L30 60L0 30Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="30" cy="30" r="8" fill="none" stroke="currentColor" strokeWidth="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#preview-islamic-pattern)" />
        </svg>
      </div>

      {/* Decorative borders */}
      <div
        className="absolute inset-3 rounded-2xl"
        style={{ border: `1.5px solid ${colors.primary}25` }}
      />
      <div
        className="absolute inset-5 rounded-xl"
        style={{ border: `1px solid ${colors.primary}12` }}
      />

      {/* Corner decorations */}
      <div className="absolute top-4 right-4 w-4 h-4" style={{ color: colors.primary + '60' }}>
        <svg viewBox="0 0 16 16"><path d="M0 0 Q16 0 16 16 Q0 16 0 0Z" fill="none" stroke="currentColor" strokeWidth="1" /></svg>
      </div>
      <div className="absolute top-4 left-4 w-4 h-4" style={{ color: colors.primary + '60', transform: 'scaleX(-1)' }}>
        <svg viewBox="0 0 16 16"><path d="M0 0 Q16 0 16 16 Q0 16 0 0Z" fill="none" stroke="currentColor" strokeWidth="1" /></svg>
      </div>
      <div className="absolute bottom-4 right-4 w-4 h-4" style={{ color: colors.primary + '60', transform: 'scaleY(-1)' }}>
        <svg viewBox="0 0 16 16"><path d="M0 0 Q16 0 16 16 Q0 16 0 0Z" fill="none" stroke="currentColor" strokeWidth="1" /></svg>
      </div>
      <div className="absolute bottom-4 left-4 w-4 h-4" style={{ color: colors.primary + '60', transform: 'scale(-1)' }}>
        <svg viewBox="0 0 16 16"><path d="M0 0 Q16 0 16 16 Q0 16 0 0Z" fill="none" stroke="currentColor" strokeWidth="1" /></svg>
      </div>

      {/* Cover Image (if provided) */}
      {formData.coverImage && (
        <div className="absolute inset-0">
          {formData.coverImage.startsWith('/') || formData.coverImage.startsWith('http') ? (
            <img
              src={formData.coverImage}
              alt="غلاف"
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{ background: formData.coverImage }}
            />
          )}
          <div className="absolute inset-0" style={{ backgroundColor: colors.background + 'AA' }} />
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 text-center px-8">
        {/* Bismallah */}
        <p className="text-xs mb-3 font-serif tracking-wider" style={{ color: colors.primary + 'CC' }}>
          بسم الله الرحمن الرحيم
        </p>

        {/* Decorative line */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="h-px w-6" style={{ backgroundColor: colors.primary + '50' }} />
          <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: colors.primary + '70' }} />
          <div className="h-px w-6" style={{ backgroundColor: colors.primary + '50' }} />
        </div>

        {/* Welcome message or default */}
        {formData.welcomeMessage && (
          <p className="text-[10px] mb-2 font-serif" style={{ color: colors.text + 'AA' }}>
            {formData.welcomeMessage}
          </p>
        )}

        <p className="text-[10px] mb-2 font-serif" style={{ color: colors.text + '99' }}>
          يتشرفان بدعوتكم لحضور حفل زفافهما
        </p>

        {/* Groom Name */}
        <h3
          className="text-2xl font-bold mb-1 truncate"
          style={{ color: colors.primary }}
        >
          {formData.groomName || 'اسم العريس'}
        </h3>

        {/* Couple Photo or Decorative ornament between names */}
        {formData.couplePhoto ? (
          <div className="flex justify-center my-2">
            <div
              className="w-14 h-14 rounded-full overflow-hidden"
              style={{ border: `2px solid ${colors.primary}50`, padding: '2px' }}
            >
              <img
                src={formData.couplePhoto}
                alt="الزوجين"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-1.5 my-1">
            <div className="h-px w-4" style={{ backgroundColor: colors.primary + '40' }} />
            <svg viewBox="0 0 40 24" className="w-5 h-3" style={{ color: colors.accent }}>
              <path d="M20 2 L24 12 L20 22 L16 12Z" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="20" cy="12" r="2.5" fill="currentColor" opacity="0.4" />
              <path d="M4 12 L14 12" stroke="currentColor" strokeWidth="0.8" />
              <path d="M26 12 L36 12" stroke="currentColor" strokeWidth="0.8" />
            </svg>
            <div className="h-px w-4" style={{ backgroundColor: colors.primary + '40' }} />
          </div>
        )}

        {/* Bride Name */}
        <h3
          className="text-2xl font-bold mb-3 truncate"
          style={{ color: colors.primary }}
        >
          {formData.brideName || 'اسم العريسة'}
        </h3>

        {/* Decorative line */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="h-px w-6" style={{ backgroundColor: colors.primary + '50' }} />
          <div className="w-1 h-1 rotate-45" style={{ backgroundColor: colors.primary }} />
          <div className="h-px w-6" style={{ backgroundColor: colors.primary + '50' }} />
        </div>

        {/* Date & Time */}
        {formattedDate && (
          <p className="text-xs font-semibold mb-1" style={{ color: colors.primary + 'DD' }}>
            {formattedDate}
          </p>
        )}
        {formattedTime && (
          <p className="text-xs font-semibold mb-2" style={{ color: colors.primary + 'DD' }}>
            {formattedTime}
          </p>
        )}

        {/* Venue */}
        {formData.venueName && (
          <p className="text-[10px] mb-1" style={{ color: colors.text + '99' }}>
            📍 {formData.venueName}
          </p>
        )}
        {formData.venueAddress && (
          <p className="text-[9px]" style={{ color: colors.text + '77' }}>
            {formData.venueAddress}
          </p>
        )}
      </div>

      {/* RSVP Placeholder */}
      {formData.enableRsvp && (
        <div className="relative z-10 mt-4">
          <div
            className="px-6 py-2 rounded-lg text-[10px] font-semibold"
            style={{
              backgroundColor: colors.button + '20',
              color: colors.button,
              border: `1px solid ${colors.button}30`,
            }}
          >
            تأكيد الحضور
          </div>
        </div>
      )}

      {/* Countdown Placeholder */}
      {formData.enableCountdown && (
        <div className="relative z-10 mt-3 flex items-center gap-2">
          {['يوم', 'ساعة', 'دقيقة'].map((unit) => (
            <div key={unit} className="text-center">
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: colors.primary + '15', color: colors.primary }}
              >
                --
              </div>
              <p className="text-[7px] mt-0.5" style={{ color: colors.text + '66' }}>
                {unit}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Gallery Placeholder */}
      {formData.enableGallery && (
        <div className="relative z-10 mt-3 flex items-center gap-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-10 h-8 rounded-md"
              style={{ backgroundColor: colors.primary + '10', border: `1px solid ${colors.primary}15` }}
            />
          ))}
        </div>
      )}
    </div>
  );

  // Mobile: Floating toggle button + slide-up panel
  if (isMobile) {
    return (
      <>
        {/* Floating toggle button */}
        <button
          onClick={onToggle}
          className="fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-all duration-300"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
            color: colors.background,
            boxShadow: `0 8px 32px ${colors.primary}40`,
          }}
        >
          <Eye className="h-6 w-6" />
        </button>

        {/* Slide-up preview panel */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-50 flex flex-col items-center justify-end"
              style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
            >
              {/* Header */}
              <div
                className="w-full flex items-center justify-between px-4 py-3 rounded-t-2xl"
                style={{ backgroundColor: 'var(--admin-surface-raised)' }}
              >
                <span className="text-sm font-semibold" style={{ color: 'var(--admin-text-primary)' }}>
                  معاينة مباشرة
                </span>
                <button
                  onClick={onToggle}
                  className="flex h-8 w-8 items-center justify-center rounded-full transition-colors"
                  style={{ color: 'var(--admin-text-secondary)', background: 'var(--admin-surface-overlay)' }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Preview content */}
              <div
                className="w-full flex items-center justify-center py-6 overflow-auto"
                style={{ backgroundColor: 'var(--admin-surface)' }}
              >
                {/* Phone frame */}
                <div
                  className="relative rounded-[2.5rem] p-2"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}30, ${colors.accent}20)`,
                    border: `2px solid ${colors.primary}40`,
                    boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${colors.primary}10`,
                  }}
                >
                  {/* Notch */}
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 rounded-b-2xl z-20"
                    style={{ backgroundColor: colors.background }}
                  />
                  <div className="rounded-[2rem] overflow-hidden">
                    {previewContent}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Desktop: Sticky sidebar
  return (
    <div className="sticky top-24">
      {/* Label */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <Eye className="h-4 w-4" style={{ color: 'var(--wedding-gold)' }} />
        <span
          className="text-sm font-semibold"
          style={{ color: 'var(--admin-text-primary)' }}
        >
          معاينة مباشرة
        </span>
      </div>

      {/* Phone frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative rounded-[2.5rem] p-3 mx-auto"
        style={{
          background: `linear-gradient(135deg, ${colors.primary}30, ${colors.accent}20)`,
          border: `2px solid ${colors.primary}40`,
          boxShadow: `0 20px 60px rgba(0,0,0,0.3), 0 0 40px ${colors.primary}10`,
          width: 'fit-content',
        }}
      >
        {/* Notch */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 rounded-b-2xl z-20"
          style={{ backgroundColor: colors.background }}
        >
          {/* Camera dot */}
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
            style={{ backgroundColor: colors.primary + '30' }}
          />
        </div>

        {/* Home indicator */}
        <div
          className="absolute bottom-1 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full z-20"
          style={{ backgroundColor: colors.primary + '40' }}
        />

        <div className="rounded-[2rem] overflow-hidden">
          {previewContent}
        </div>
      </motion.div>

      {/* Color swatches preview */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {[
          { color: colors.primary, label: 'أساسي' },
          { color: colors.accent, label: 'تمييز' },
          { color: colors.secondary, label: 'ثانوي' },
          { color: colors.button, label: 'زر' },
        ].map((swatch) => (
          <div key={swatch.label} className="flex flex-col items-center gap-1">
            <div
              className="w-6 h-6 rounded-full border-2"
              style={{
                backgroundColor: swatch.color,
                borderColor: 'rgba(255,255,255,0.15)',
                boxShadow: `0 2px 8px ${swatch.color}40`,
              }}
            />
            <span className="text-[8px]" style={{ color: 'var(--admin-text-muted)' }}>
              {swatch.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
