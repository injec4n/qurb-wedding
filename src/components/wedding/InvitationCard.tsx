'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Loader2, Share2, MessageCircle, Copy, Send } from 'lucide-react';
import { Wedding, ThemeColors } from '@/types/wedding';
import { formatDateArabic, formatTimeArabic } from '@/lib/wedding-utils';
import { toast } from 'sonner';
import { toPng } from 'html-to-image';

interface InvitationCardProps {
  wedding: Wedding;
  colors: ThemeColors;
  slug: string;
  couplePhoto?: string;
}

export default function InvitationCard({ wedding, colors, slug, couplePhoto }: InvitationCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [downloadFailed, setDownloadFailed] = useState(false);
  const [downloadHovered, setDownloadHovered] = useState(false);
  const [shareHovered, setShareHovered] = useState(false);
  const [whatsappHovered, setWhatsappHovered] = useState(false);
  const [telegramHovered, setTelegramHovered] = useState(false);
  const [copyHovered, setCopyHovered] = useState(false);

  const invitationUrl = typeof window !== 'undefined' ? `${window.location.origin}/w/${slug}` : '';
  const shareText = `يدعوكم ${wedding.groomName} و ${wedding.brideName} لحضور حفل زفافهما - ${wedding.weddingDate}`;

  const handleDownloadCard = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    setDownloadFailed(false);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 3,
        cacheBust: true,
      });
      const link = document.createElement('a');
      link.download = `دعوة-${wedding.groomName}-${wedding.brideName}.png`;
      link.href = dataUrl;
      link.click();
      toast.success('تم تحميل البطاقة بنجاح ✨');
    } catch (err) {
      console.error('Card download error:', err);
      setDownloadFailed(true);
      toast.error('فشل في تحميل البطاقة — استخدم أزرار المشاركة بدلاً من ذلك');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(invitationUrl);
      toast.success('تم نسخ رابط الدعوة ✨');
    } catch {
      toast.error('فشل في نسخ الرابط');
    }
  };

  const handleWhatsAppShare = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + '\n' + invitationUrl)}`, '_blank');
  };

  const handleTelegramShare = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(invitationUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
  };

  return (
    <div className="py-6 px-4" dir="rtl">
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
          className="text-2xl sm:text-3xl font-bold mb-4 font-serif"
          style={{ color: colors.text }}
        >
          بطاقة الدعوة
        </motion.h2>

        {/* The card preview */}
        <div className="flex justify-center mb-5">
          <div
            ref={cardRef}
            className="w-[360px] h-[480px] sm:w-[440px] sm:h-[560px] relative overflow-hidden flex flex-col items-center justify-center"
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

            {/* Decorative borders */}
            <div
              className="absolute inset-4 sm:inset-5 rounded-2xl"
              style={{ border: `2px solid ${colors.primary}28` }}
            />
            <div
              className="absolute inset-6 sm:inset-7 rounded-xl"
              style={{ border: `1px solid ${colors.primary}15` }}
            />

            {/* Corner decorations */}
            {[
              { pos: 'top-5 right-5 sm:top-7 sm:right-7', transform: '' },
              { pos: 'top-5 left-5 sm:top-7 sm:left-7', transform: 'scaleX(-1)' },
              { pos: 'bottom-5 right-5 sm:bottom-7 sm:right-7', transform: 'scaleY(-1)' },
              { pos: 'bottom-5 left-5 sm:bottom-7 sm:left-7', transform: 'scale(-1)' },
            ].map((corner, i) => (
              <div
                key={i}
                className={`absolute ${corner.pos} w-6 h-6`}
                style={{ color: colors.primary, transform: corner.transform }}
              >
                <svg viewBox="0 0 24 24" className="w-full h-full">
                  <path d="M0 0 Q24 0 24 24 Q0 24 0 0Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="4" cy="4" r="1.5" fill="currentColor" opacity="0.5" />
                </svg>
              </div>
            ))}

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

              {/* Couple photo or ornamental divider */}
              {couplePhoto ? (
                <div className="flex justify-center my-3">
                  <div
                    className="w-24 h-24 rounded-full overflow-hidden"
                    style={{ border: `3px solid ${colors.primary}60`, padding: '3px', boxShadow: `0 0 20px ${colors.primary}20` }}
                  >
                    <img src={couplePhoto} alt="الزوجين" className="w-full h-full rounded-full object-cover" crossOrigin="anonymous" />
                  </div>
                </div>
              ) : (
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
              )}

              <h3 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: colors.primary }}>
                {wedding.brideName}
              </h3>

              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="h-px w-8" style={{ backgroundColor: colors.primary + '50' }} />
                <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: colors.primary }} />
                <div className="h-px w-8" style={{ backgroundColor: colors.primary + '50' }} />
              </div>

              <p className="text-xs sm:text-sm mb-3 font-serif" style={{ color: colors.text + 'BB' }}>
                {wedding.cardInvitationText || 'بيتشرفوا بدعوتكم لحضور حفل زفافهم'}
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

            {/* Brand watermark at bottom */}
            <div className="absolute bottom-3 left-0 right-0 text-center">
              <p className="text-[9px] tracking-wider" style={{ color: colors.primary + '30' }}>قُرب</p>
            </div>
          </div>
        </div>

        {/* Download & Share buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-center gap-3"
        >
          {/* Download button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownloadCard}
            disabled={isDownloading}
            onMouseEnter={() => setDownloadHovered(true)}
            onMouseLeave={() => setDownloadHovered(false)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}${downloadHovered ? '40' : '20'}, ${colors.accent}${downloadHovered ? '40' : '20'})`,
              color: colors.primary,
              border: `1px solid ${colors.primary}${downloadHovered ? '55' : '30'}`,
              boxShadow: downloadHovered ? `0 0 20px ${colors.primary}20` : 'none',
            }}
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            تحميل البطاقة
          </motion.button>

          {/* Share toggle button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowShareOptions(!showShareOptions)}
            onMouseEnter={() => setShareHovered(true)}
            onMouseLeave={() => setShareHovered(false)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300"
            style={{
              backgroundColor: shareHovered ? colors.primary + '15' : 'transparent',
              color: shareHovered ? colors.primary : colors.text + '88',
              border: `1px solid ${colors.primary}${shareHovered ? '35' : '15'}`,
              boxShadow: shareHovered ? `0 0 16px ${colors.primary}15` : 'none',
            }}
          >
            <Share2 className="w-3.5 h-3.5" />
            مشاركة الدعوة
          </motion.button>

          {/* Share options (shown when toggled or when download fails) */}
          <AnimatePresence>
            {(showShareOptions || downloadFailed) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleWhatsAppShare}
                  onMouseEnter={() => setWhatsappHovered(true)}
                  onMouseLeave={() => setWhatsappHovered(false)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
                  style={{
                    backgroundColor: whatsappHovered ? '#25D36630' : '#25D36618',
                    border: `1px solid ${whatsappHovered ? '#25D36650' : '#25D36625'}`,
                    boxShadow: whatsappHovered ? '0 0 16px #25D36620' : 'none',
                  }}
                  title="مشاركة عبر واتساب"
                >
                  <MessageCircle className="w-4.5 h-4.5" style={{ color: '#25D366' }} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleTelegramShare}
                  onMouseEnter={() => setTelegramHovered(true)}
                  onMouseLeave={() => setTelegramHovered(false)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
                  style={{
                    backgroundColor: telegramHovered ? '#0088cc30' : '#0088cc18',
                    border: `1px solid ${telegramHovered ? '#0088cc50' : '#0088cc25'}`,
                    boxShadow: telegramHovered ? '0 0 16px #0088cc20' : 'none',
                  }}
                  title="مشاركة عبر تيليغرام"
                >
                  <Send className="w-4.5 h-4.5" style={{ color: '#0088cc' }} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCopyLink}
                  onMouseEnter={() => setCopyHovered(true)}
                  onMouseLeave={() => setCopyHovered(false)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
                  style={{
                    backgroundColor: copyHovered ? colors.primary + '25' : colors.primary + '10',
                    border: `1px solid ${copyHovered ? colors.primary + '40' : colors.primary + '20'}`,
                    boxShadow: copyHovered ? `0 0 16px ${colors.primary}20` : 'none',
                  }}
                  title="نسخ الرابط"
                >
                  <Copy className="w-4.5 h-4.5" style={{ color: colors.primary }} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}
