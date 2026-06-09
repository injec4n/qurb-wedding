'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Copy,
  ExternalLink,
  Download,
  Loader2,
  Users,
  LayoutDashboard,
  Check,
  Heart,
  Sparkles,
  PartyPopper,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Link from 'next/link';

interface CreationSuccessProps {
  wedding: {
    id: string;
    slug: string;
    groomName: string;
    brideName: string;
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
    buttonColor: string;
    accentColor: string;
    secondaryColor: string;
    theme: string;
  };
}

/* ── Sparkle / confetti particle ── */
function SparkleParticle({ delay, x, y, size, color }: { delay: number; x: number; y: number; size: number; color: string }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0, rotate: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0, 1.2, 1, 0],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 2.5,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 3,
        ease: 'easeInOut',
      }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5Z" />
      </svg>
    </motion.div>
  );
}

/* ── Confetti piece ── */
function ConfettiPiece({ delay, x, color }: { delay: number; x: number; color: string }) {
  return (
    <motion.div
      className="absolute top-0 pointer-events-none"
      style={{ left: x }}
      initial={{ y: -20, rotate: 0, opacity: 1 }}
      animate={{
        y: ['0vh', '100vh'],
        rotate: [0, 360, 720],
        opacity: [1, 1, 0],
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 5 + 2,
        ease: 'easeIn',
      }}
    >
      <div
        className="w-2 h-3 rounded-sm"
        style={{ backgroundColor: color }}
      />
    </motion.div>
  );
}

export default function CreationSuccess({ wedding }: CreationSuccessProps) {
  const [copied, setCopied] = useState(false);
  const [downloadingCard, setDownloadingCard] = useState(false);
  const [downloadingStory, setDownloadingStory] = useState(false);
  const [mounted, setMounted] = useState(false);
  const whatsappCardRef = useRef<HTMLDivElement>(null);
  const storyCardRef = useRef<HTMLDivElement>(null);

  const colors = {
    primary: wedding.primaryColor || '#D4A853',
    secondary: wedding.secondaryColor || '#1A1A2E',
    background: wedding.backgroundColor || '#0D0D1A',
    text: wedding.textColor || '#FFFFFF',
    button: wedding.buttonColor || '#D4A853',
    accent: wedding.accentColor || '#E8C874',
  };

  const invitationUrl = typeof window !== 'undefined' ? `${window.location.origin}/w/${wedding.slug}` : `/w/${wedding.slug}`;

  useEffect(() => {
    setMounted(true);
  }, []);

  /* ── Sparkle positions (deterministic) ── */
  const sparkles = [
    { delay: 0.2, x: '10%', y: '15%', size: 14, color: colors.primary },
    { delay: 0.8, x: '85%', y: '10%', size: 10, color: colors.accent },
    { delay: 1.2, x: '5%', y: '60%', size: 12, color: colors.primary },
    { delay: 0.5, x: '90%', y: '55%', size: 16, color: colors.accent },
    { delay: 1.5, x: '20%', y: '80%', size: 10, color: colors.primary },
    { delay: 0.3, x: '75%', y: '85%', size: 12, color: colors.accent },
    { delay: 2.0, x: '50%', y: '5%', size: 14, color: colors.primary },
    { delay: 1.0, x: '30%', y: '40%', size: 8, color: colors.accent },
  ];

  const confetti = [
    { delay: 0, x: '5%', color: colors.primary },
    { delay: 0.3, x: '15%', color: colors.accent },
    { delay: 0.6, x: '25%', color: colors.primary + 'AA' },
    { delay: 0.9, x: '35%', color: colors.accent + 'AA' },
    { delay: 1.2, x: '50%', color: colors.primary },
    { delay: 1.5, x: '60%', color: colors.accent },
    { delay: 1.8, x: '70%', color: colors.primary + 'AA' },
    { delay: 2.1, x: '80%', color: colors.accent + 'AA' },
    { delay: 2.4, x: '90%', color: colors.primary },
    { delay: 0.4, x: '40%', color: colors.accent },
    { delay: 1.0, x: '55%', color: colors.primary + 'CC' },
    { delay: 1.6, x: '45%', color: colors.accent + 'CC' },
  ];

  /* ── Copy link ── */
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(invitationUrl);
      setCopied(true);
      toast.success('تم نسخ الرابط بنجاح! 📋');
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error('فشل في نسخ الرابط');
    }
  }, [invitationUrl]);

  /* ── Download WhatsApp Card ── */
  const handleDownloadCard = useCallback(async () => {
    if (!whatsappCardRef.current || downloadingCard) return;
    setDownloadingCard(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(whatsappCardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });
      const link = document.createElement('a');
      link.download = `بطاقة-واتساب-${wedding.groomName}-${wedding.brideName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('تم تحميل بطاقة واتساب بنجاح! 📱');
    } catch (error) {
      console.error('Error generating card:', error);
      toast.error('فشل في تحميل البطاقة');
    } finally {
      setDownloadingCard(false);
    }
  }, [downloadingCard, wedding.groomName, wedding.brideName]);

  /* ── Download Instagram Story ── */
  const handleDownloadStory = useCallback(async () => {
    if (!storyCardRef.current || downloadingStory) return;
    setDownloadingStory(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(storyCardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });
      const link = document.createElement('a');
      link.download = `ستوري-انستغرام-${wedding.groomName}-${wedding.brideName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('تم تحميل ستوري انستغرام بنجاح! 📸');
    } catch (error) {
      console.error('Error generating story:', error);
      toast.error('فشل في تحميل الستوري');
    } finally {
      setDownloadingStory(false);
    }
  }, [downloadingStory, wedding.groomName, wedding.brideName]);

  return (
    <div dir="rtl" className="min-h-screen relative overflow-hidden" style={{ background: 'var(--admin-surface)', color: 'var(--admin-text-primary)' }}>
      {/* Background sparkles & confetti */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {mounted && sparkles.map((s, i) => (
          <SparkleParticle key={`sparkle-${i}`} {...s} />
        ))}
        {mounted && confetti.map((c, i) => (
          <ConfettiPiece key={`confetti-${i}`} {...c} />
        ))}
      </div>

      {/* Hidden download targets */}
      <div className="fixed -left-[9999px] -top-[9999px] opacity-0 pointer-events-none">
        {/* WhatsApp Card (square-ish) */}
        <div
          ref={whatsappCardRef}
          className="w-[400px] h-[400px] relative overflow-hidden flex flex-col items-center justify-center"
          style={{ backgroundColor: colors.background, direction: 'rtl' }}
        >
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 30%, ${colors.secondary}50 0%, ${colors.background} 70%)` }} />
          <div className="absolute inset-3 rounded-2xl" style={{ border: `2px solid ${colors.primary}25` }} />
          <div className="absolute inset-5 rounded-xl" style={{ border: `1px solid ${colors.primary}12` }} />
          {/* Corner ornaments */}
          <div className="absolute top-4 right-4 w-5 h-5" style={{ color: colors.primary + '60' }}><svg viewBox="0 0 20 20"><path d="M0 0 Q20 0 20 20 Q0 20 0 0Z" fill="none" stroke="currentColor" strokeWidth="1" /></svg></div>
          <div className="absolute top-4 left-4 w-5 h-5" style={{ color: colors.primary + '60', transform: 'scaleX(-1)' }}><svg viewBox="0 0 20 20"><path d="M0 0 Q20 0 20 20 Q0 20 0 0Z" fill="none" stroke="currentColor" strokeWidth="1" /></svg></div>
          <div className="absolute bottom-4 right-4 w-5 h-5" style={{ color: colors.primary + '60', transform: 'scaleY(-1)' }}><svg viewBox="0 0 20 20"><path d="M0 0 Q20 0 20 20 Q0 20 0 0Z" fill="none" stroke="currentColor" strokeWidth="1" /></svg></div>
          <div className="absolute bottom-4 left-4 w-5 h-5" style={{ color: colors.primary + '60', transform: 'scale(-1)' }}><svg viewBox="0 0 20 20"><path d="M0 0 Q20 0 20 20 Q0 20 0 0Z" fill="none" stroke="currentColor" strokeWidth="1" /></svg></div>
          <div className="relative z-10 text-center px-8">
            <p className="text-base mb-4 font-serif tracking-wider" style={{ color: colors.primary + 'CC' }}>بسم الله الرحمن الرحيم</p>
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="h-px w-8" style={{ backgroundColor: colors.primary + '50' }} />
              <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary + '70' }} />
              <div className="h-px w-8" style={{ backgroundColor: colors.primary + '50' }} />
            </div>
            <h3 className="text-3xl font-bold mb-2" style={{ color: colors.primary }}>{wedding.groomName}</h3>
            <div className="flex items-center justify-center gap-2 my-2">
              <div className="h-px w-6" style={{ backgroundColor: colors.primary + '40' }} />
              <svg viewBox="0 0 40 24" className="w-6 h-4" style={{ color: colors.accent }}><path d="M20 2 L24 12 L20 22 L16 12Z" fill="none" stroke="currentColor" strokeWidth="1" /><circle cx="20" cy="12" r="2.5" fill="currentColor" opacity="0.4" /></svg>
              <div className="h-px w-6" style={{ backgroundColor: colors.primary + '40' }} />
            </div>
            <h3 className="text-3xl font-bold mb-4" style={{ color: colors.primary }}>{wedding.brideName}</h3>
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="h-px w-8" style={{ backgroundColor: colors.primary + '50' }} />
              <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: colors.primary }} />
              <div className="h-px w-8" style={{ backgroundColor: colors.primary + '50' }} />
            </div>
            <p className="text-sm mb-2 font-serif" style={{ color: colors.text + 'BB' }}>يتشرفان بدعوتكم لحضور حفل زفافهما</p>
            <p className="text-base font-semibold" style={{ color: colors.primary + 'DD' }}>ادخلوا من الرابط</p>
            <p className="text-sm mt-1 font-mono" style={{ color: colors.accent }}>{invitationUrl}</p>
          </div>
        </div>

        {/* Instagram Story (9:16) */}
        <div
          ref={storyCardRef}
          className="w-[300px] h-[533px] relative overflow-hidden flex flex-col items-center justify-center"
          style={{ backgroundColor: colors.background, direction: 'rtl' }}
        >
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 20%, ${colors.secondary}45 0%, transparent 55%), radial-gradient(ellipse at 50% 80%, ${colors.primary}18 0%, transparent 55%)` }} />
          <div className="absolute inset-3 rounded-2xl" style={{ border: `1.5px solid ${colors.primary}22` }} />
          <div className="absolute inset-5 rounded-xl" style={{ border: `1px solid ${colors.primary}12` }} />
          {/* Corner ornaments */}
          <div className="absolute top-4 right-4 w-4 h-4" style={{ color: colors.primary + '50' }}><svg viewBox="0 0 16 16"><path d="M0 0 Q16 0 16 16 Q0 16 0 0Z" fill="none" stroke="currentColor" strokeWidth="0.8" /></svg></div>
          <div className="absolute top-4 left-4 w-4 h-4" style={{ color: colors.primary + '50', transform: 'scaleX(-1)' }}><svg viewBox="0 0 16 16"><path d="M0 0 Q16 0 16 16 Q0 16 0 0Z" fill="none" stroke="currentColor" strokeWidth="0.8" /></svg></div>
          <div className="absolute bottom-4 right-4 w-4 h-4" style={{ color: colors.primary + '50', transform: 'scaleY(-1)' }}><svg viewBox="0 0 16 16"><path d="M0 0 Q16 0 16 16 Q0 16 0 0Z" fill="none" stroke="currentColor" strokeWidth="0.8" /></svg></div>
          <div className="absolute bottom-4 left-4 w-4 h-4" style={{ color: colors.primary + '50', transform: 'scale(-1)' }}><svg viewBox="0 0 16 16"><path d="M0 0 Q16 0 16 16 Q0 16 0 0Z" fill="none" stroke="currentColor" strokeWidth="0.8" /></svg></div>

          {/* Top ornament */}
          <div className="relative z-10 pt-8 flex flex-col items-center">
            <div className="w-8 h-8" style={{ color: colors.primary + '70' }}>
              <svg viewBox="0 0 40 40" className="w-full h-full"><path d="M20 0L40 20L20 40L0 20Z" fill="none" stroke="currentColor" strokeWidth="1" /><path d="M20 10L30 20L20 30L10 20Z" fill="none" stroke="currentColor" strokeWidth="0.8" /><circle cx="20" cy="20" r="4" fill="currentColor" opacity="0.4" /></svg>
            </div>
          </div>

          <div className="relative z-10 text-center px-8 flex-1 flex flex-col items-center justify-center">
            <p className="text-sm mb-4 font-serif tracking-wider" style={{ color: colors.primary + 'CC' }}>بسم الله الرحمن الرحيم</p>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-px w-8" style={{ backgroundColor: colors.primary + '40' }} />
              <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary + '70' }} />
              <div className="h-px w-8" style={{ backgroundColor: colors.primary + '40' }} />
            </div>
            <p className="text-xs mb-4 font-serif" style={{ color: colors.text + 'AA' }}>يتشرفان بدعوتكم لحضور حفل زفافهما</p>
            <h3 className="text-3xl font-bold mb-2" style={{ color: colors.primary }}>{wedding.groomName}</h3>
            <div className="flex items-center justify-center gap-2 my-2">
              <div className="h-px w-5" style={{ backgroundColor: colors.primary + '40' }} />
              <svg viewBox="0 0 24 16" className="w-4 h-3" style={{ color: colors.accent }}><path d="M12 1 L16 8 L12 15 L8 8Z" fill="none" stroke="currentColor" strokeWidth="1" /><circle cx="12" cy="8" r="2" fill="currentColor" opacity="0.4" /></svg>
              <div className="h-px w-5" style={{ backgroundColor: colors.primary + '40' }} />
            </div>
            <h3 className="text-3xl font-bold mb-5" style={{ color: colors.primary }}>{wedding.brideName}</h3>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-px w-8" style={{ backgroundColor: colors.primary + '40' }} />
              <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary + '70' }} />
              <div className="h-px w-8" style={{ backgroundColor: colors.primary + '40' }} />
            </div>
          </div>

          <div className="relative z-10 pb-8 text-center w-full px-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="h-px w-6" style={{ backgroundColor: colors.primary + '25' }} />
              <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: colors.primary + '50' }} />
              <div className="h-px w-6" style={{ backgroundColor: colors.primary + '25' }} />
            </div>
            <p className="text-sm font-semibold mb-2" style={{ color: colors.text + 'CC' }}>ادخلوا من الرابط</p>
            <p className="text-xs font-mono" style={{ color: colors.accent }}>{invitationUrl}</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 mx-auto max-w-2xl px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center mb-10"
        >
          {/* Success icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
              boxShadow: `0 8px 32px ${colors.primary}30`,
            }}
          >
            <PartyPopper className="h-10 w-10" style={{ color: colors.background }} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold mb-3"
            style={{ color: 'var(--admin-text-primary)' }}
          >
            تم إنشاء دعوة زفافكم بنجاح! 🎉
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-lg font-serif"
            style={{ color: colors.primary }}
          >
            <Heart className="inline h-5 w-5 mx-1" style={{ color: colors.accent }} />
            دعوة زفاف {wedding.groomName} و {wedding.brideName}
            <Heart className="inline h-5 w-5 mx-1" style={{ color: colors.accent }} />
          </motion.p>
        </motion.div>

        {/* Invitation URL Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="admin-card p-6 mb-6"
          style={{ borderTop: `2px solid ${colors.primary}` }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ background: `${colors.primary}15` }}
            >
              <Share2 className="h-5 w-5" style={{ color: colors.primary }} />
            </div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--admin-text-primary)' }}>
              رابط الدعوة
            </h2>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Input
              readOnly
              value={invitationUrl}
              className="admin-input text-sm"
              dir="ltr"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <Button
              onClick={handleCopy}
              className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300"
              style={{
                background: copied ? `${colors.primary}20` : `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                color: copied ? colors.primary : colors.background,
                boxShadow: copied ? 'none' : `0 4px 16px ${colors.primary}25`,
              }}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'تم النسخ!' : 'نسخ الرابط'}
            </Button>
          </div>

          <Link
            href={`/w/${wedding.slug}`}
            target="_blank"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300"
            style={{
              background: `${colors.primary}10`,
              color: colors.primary,
              border: `1px solid ${colors.primary}25`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${colors.primary}18`;
              e.currentTarget.style.borderColor = `${colors.primary}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `${colors.primary}10`;
              e.currentTarget.style.borderColor = `${colors.primary}25`;
            }}
          >
            <ExternalLink className="h-4 w-4" />
            فتح الدعوة
          </Link>
        </motion.div>

        {/* Download Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="admin-card p-6 mb-6"
          style={{ borderTop: `2px solid ${colors.accent}` }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ background: `${colors.accent}15` }}
            >
              <Download className="h-5 w-5" style={{ color: colors.accent }} />
            </div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--admin-text-primary)' }}>
              تحميل بطاقات المشاركة
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleDownloadCard}
              disabled={downloadingCard}
              className="flex items-center justify-center gap-3 px-5 py-4 rounded-xl text-sm font-semibold transition-all duration-300 disabled:opacity-50"
              style={{
                background: `linear-gradient(135deg, ${colors.button}, ${colors.primary})`,
                color: colors.background,
                boxShadow: `0 4px 16px ${colors.button}25`,
              }}
            >
              {downloadingCard ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>
              )}
              {downloadingCard ? 'جاري التحميل...' : 'تحميل بطاقة واتساب'}
            </button>

            <button
              onClick={handleDownloadStory}
              disabled={downloadingStory}
              className="flex items-center justify-center gap-3 px-5 py-4 rounded-xl text-sm font-semibold transition-all duration-300 disabled:opacity-50"
              style={{
                background: `linear-gradient(135deg, ${colors.accent}, ${colors.primary})`,
                color: colors.background,
                boxShadow: `0 4px 16px ${colors.accent}25`,
              }}
            >
              {downloadingStory ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              )}
              {downloadingStory ? 'جاري التحميل...' : 'تحميل ستوري انستغرام'}
            </button>
          </div>
        </motion.div>

        {/* Next Steps Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="admin-card p-6 mb-8"
          style={{ borderTop: '2px solid var(--wedding-gold)' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ background: 'rgba(212,168,83,0.12)' }}
            >
              <Sparkles className="h-5 w-5" style={{ color: 'var(--wedding-gold)' }} />
            </div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--admin-text-primary)' }}>
              الخطوات التالية
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href={`/admin/${wedding.id}`}
              className="flex items-center gap-3 px-5 py-4 rounded-xl transition-all duration-300"
              style={{
                background: 'var(--admin-surface)',
                border: '1px solid var(--admin-border)',
                color: 'var(--admin-text-primary)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--admin-border-strong)';
                e.currentTarget.style.background = 'var(--admin-surface-overlay)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--admin-border)';
                e.currentTarget.style.background = 'var(--admin-surface)';
              }}
            >
              <Users className="h-5 w-5" style={{ color: 'var(--wedding-gold)' }} />
              <div>
                <p className="font-semibold text-sm">إدارة الضيوف</p>
                <p className="text-xs" style={{ color: 'var(--admin-text-muted)' }}>إضافة وإدارة قائمة الضيوف</p>
              </div>
            </Link>

            <Link
              href="/admin"
              className="flex items-center gap-3 px-5 py-4 rounded-xl transition-all duration-300"
              style={{
                background: 'var(--admin-surface)',
                border: '1px solid var(--admin-border)',
                color: 'var(--admin-text-primary)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--admin-border-strong)';
                e.currentTarget.style.background = 'var(--admin-surface-overlay)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--admin-border)';
                e.currentTarget.style.background = 'var(--admin-surface)';
              }}
            >
              <LayoutDashboard className="h-5 w-5" style={{ color: 'var(--wedding-gold)' }} />
              <div>
                <p className="font-semibold text-sm">العودة للوحة التحكم</p>
                <p className="text-xs" style={{ color: 'var(--admin-text-muted)' }}>عرض جميع الأعراس</p>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
