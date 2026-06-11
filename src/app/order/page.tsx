'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Send,
  CheckCircle,
  Loader2,
  Calendar,
  User,
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  Music,
  Palette,
  Lock,
  KeyRound,
  XCircle
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { themeOptions, type ThemeName } from '@/lib/themes';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.1,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  })
};

export default function OrderPage() {
  return (
    <Suspense
      fallback={
        <div
          dir="rtl"
          className="min-h-screen flex items-center justify-center"
          style={{
            background:
              'linear-gradient(180deg, #0D0D1A 0%, #1A1A2E 50%, #0D0D1A 100%)'
          }}
        >
          <Loader2
            className="h-8 w-8 animate-spin"
            style={{ color: '#D4A853' }}
          />
        </div>
      }
    >
      <OrderPageContent />
    </Suspense>
  );
}

function OrderPageContent() {
  const searchParams = useSearchParams();
  const codeFromUrl = searchParams.get('code') || '';

  const [accessCode, setAccessCode] = useState(codeFromUrl);
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [codeError, setCodeError] = useState('');
  const [clientName, setClientName] = useState('');

  const [formData, setFormData] = useState({
    groomName: '',
    brideName: '',
    weddingDate: '',
    weddingTime: '',
    venueName: '',
    venueAddress: '',
    googleMapsLink: '',
    welcomeMessage: '',
    contactPhone: '',
    theme: 'royal-gold' as ThemeName,
    enableRsvp: true,
    enableCountdown: true,
    enableMusic: true,
    enableGallery: true,
    enableGuestPersonalization: true,
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  // Auto-validate code from URL
  useEffect(() => {
    if (codeFromUrl) {
      validateCode(codeFromUrl);
    }
  }, [codeFromUrl]);

  const validateCode = async (code?: string) => {
    const codeToValidate = code || accessCode;
    if (!codeToValidate.trim()) {
      setCodeError('من فضلك ادخل الكود');
      return;
    }

    setIsValidating(true);
    setCodeError('');

    try {
      const res = await fetch(
        `/api/validate-code?code=${encodeURIComponent(codeToValidate.trim())}`
      );
      const data = await res.json();

      if (data.valid) {
        setIsCodeValid(true);
        setClientName(data.name || '');
      } else {
        setIsCodeValid(false);
        setCodeError(data.error || 'الكود غير صالح أو متوقف');
      }
    } catch {
      setCodeError('حصل خطأ في الاتصال، حاول تاني');
    } finally {
      setIsValidating(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleToggle = (field: string, value: boolean) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, accessCode })
      });
      const data = await res.json();

      if (data.success) {
        setIsSuccess(true);
      } else {
        setError(data.error || 'حصل خطأ، حاول تاني');
      }
    } catch {
      setError('حصل خطأ في الاتصال، حاول تاني');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Success Screen ───
  if (isSuccess) {
    return (
      <div
        dir="rtl"
        className="min-h-screen flex items-center justify-center px-4"
        style={{
          background:
            'linear-gradient(180deg, #0D0D1A 0%, #1A1A2E 50%, #0D0D1A 100%)'
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md mx-auto"
        >
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full mx-auto mb-6"
            style={{ background: 'rgba(34,197,94,0.12)' }}
          >
            <CheckCircle className="h-10 w-10" style={{ color: '#22C55E' }} />
          </div>
          <h2
            className="text-2xl sm:text-3xl font-bold mb-3"
            style={{ color: '#F5F5F5' }}
          >
            تم إرسال طلبكم بنجاح! ✨
          </h2>
          <p className="text-base mb-2" style={{ color: '#D4A853' }}>
            هنتواصل معاكم في أقرب وقت إن شاء الله
          </p>
          <p
            className="text-sm mb-8"
            style={{ color: 'rgba(245,245,245,0.5)' }}
          >
            هنجهز الدعوة بالمواصفات اللي طلبتوها وهنبعتلكم اللينك
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #D4A853, #B8902F)',
              color: '#0D0D1A'
            }}
          >
            <Heart className="h-4 w-4" />
            ارجع للرئيسية
          </Link>
        </motion.div>
      </div>
    );
  }

  // ─── Code Entry Screen ───
  if (!isCodeValid) {
    return (
      <div
        dir="rtl"
        className="min-h-screen flex items-center justify-center px-4"
        style={{
          background:
            'linear-gradient(180deg, #0D0D1A 0%, #1A1A2E 50%, #0D0D1A 100%)'
        }}
      >
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-[0.03]"
            style={{
              background: 'radial-gradient(circle, #D4A853, transparent 70%)'
            }}
          />
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="relative z-10 w-full max-w-md mx-auto"
        >
          <div className="text-center mb-8">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full mx-auto mb-4"
              style={{ background: 'rgba(212,168,83,0.1)' }}
            >
              <Lock className="h-8 w-8" style={{ color: '#D4A853' }} />
            </div>
            <h1
              className="text-2xl sm:text-3xl font-bold mb-2"
              style={{ color: '#F5F5F5' }}
            >
              اطلب دعوتك
            </h1>
            <p className="text-sm" style={{ color: 'rgba(245,245,245,0.5)' }}>
              ادخل كود الدخول اللي وصلك علشان تبدأ
            </p>
          </div>

          <div
            className="rounded-2xl p-6"
            style={{
              background: 'rgba(13,13,26,0.8)',
              border: '1px solid rgba(212,168,83,0.15)'
            }}
          >
            <div className="mb-4">
              <label
                className="flex items-center gap-2 text-sm font-medium mb-3"
                style={{ color: 'rgba(245,245,245,0.7)' }}
              >
                <KeyRound className="h-4 w-4" style={{ color: '#D4A853' }} />
                كود الدخول
              </label>
              <input
                type="text"
                value={accessCode}
                onChange={e => {
                  setAccessCode(e.target.value);
                  setCodeError('');
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') validateCode();
                }}
                placeholder="مثال: QURB-XXXX"
                className="w-full rounded-xl px-4 py-3.5 text-base text-center tracking-wider font-mono bg-[#0D0D1A]/60 border border-[#D4A853]/20 text-white placeholder:text-white/25 outline-none transition-all duration-300 focus:border-[#D4A853]/50 focus:ring-2 focus:ring-[#D4A853]/10"
                dir="ltr"
                autoFocus
              />
            </div>

            {codeError && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-sm text-red-400 bg-red-400/10 rounded-lg p-3 mb-4"
              >
                <XCircle className="h-4 w-4 shrink-0" />
                {codeError}
              </motion.div>
            )}

            <button
              onClick={() => validateCode()}
              disabled={isValidating || !accessCode.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 disabled:opacity-40"
              style={{
                background: 'linear-gradient(135deg, #D4A853, #B8902F)',
                color: '#0D0D1A'
              }}
            >
              {isValidating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  جاري التحقق...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  دخول
                </>
              )}
            </button>
          </div>

          <div className="text-center mt-6">
            <p
              className="text-xs mb-3"
              style={{ color: 'rgba(245,245,245,0.4)' }}
            >
              لو معاكش كود، تابعنا واطلب كودك
            </p>
            <div className="flex items-center justify-center gap-4">
              <a
                href="https://facebook.com/qurb.site"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-all duration-300 hover:scale-110"
                style={{ color: 'rgba(245,245,245,0.5)' }}
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://instagram.com/qurb.site"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-all duration-300 hover:scale-110"
                style={{ color: 'rgba(245,245,245,0.5)' }}
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="https://tiktok.com/@qurb.site"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-all duration-300 hover:scale-110"
                style={{ color: 'rgba(245,245,245,0.5)' }}
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="text-center mt-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-16 bg-gradient-to-l from-[#D4A853]/60 to-transparent" />
              <div className="w-2 h-2 rotate-45 bg-[#D4A853]/60" />
              <div className="h-px w-16 bg-gradient-to-r from-[#D4A853]/60 to-transparent" />
            </div>
            <p className="text-xs" style={{ color: 'rgba(245,245,245,0.35)' }}>
              قُرب © {new Date().getFullYear()} — منصة دعوات الزفاف
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── Order Form Screen ───
  const toggles = [
    { key: 'enableRsvp', label: 'تأكيد الحضور (RSVP)', icon: '📋' },
    { key: 'enableCountdown', label: 'عداد تنازلي', icon: '⏳' },
    { key: 'enableMusic', label: 'مزيكا خلفية', icon: '🎵' },
    { key: 'enableGallery', label: 'معرض صور', icon: '📸' },
    { key: 'enableGuestPersonalization', label: 'ظرف باسم الضيف', icon: '✉️' }
  ] as const;

  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col"
      style={{
        background:
          'linear-gradient(180deg, #0D0D1A 0%, #1A1A2E 50%, #0D0D1A 100%)'
      }}
    >
      {/* Decorative */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-[0.03]"
          style={{
            background: 'radial-gradient(circle, #D4A853, transparent 70%)'
          }}
        />
      </div>

      <div className="relative z-10 flex-1 w-full max-w-2xl mx-auto px-4 py-10 sm:py-16">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="h-6 w-6" style={{ color: '#D4A853' }} />
            <h1
              className="text-3xl sm:text-4xl font-bold"
              style={{ color: '#F5F5F5' }}
            >
              اطلب دعوتك
            </h1>
            <Heart className="h-6 w-6" style={{ color: '#D4A853' }} />
          </div>
          {clientName && (
            <p className="text-sm mb-2" style={{ color: '#D4A853' }}>
              أهلاً {clientName}! 👋
            </p>
          )}
          <p className="text-base" style={{ color: 'rgba(245,245,245,0.6)' }}>
            عبّي البيانات وهنجهز الدعوة بالظبط زي ما عايزين
          </p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-16 bg-gradient-to-l from-[#D4A853]/60 to-transparent" />
            <div className="w-2 h-2 rotate-45 bg-[#D4A853]/60" />
            <div className="h-px w-16 bg-gradient-to-r from-[#D4A853]/60 to-transparent" />
          </div>
        </motion.div>

        {/* Form */}
        <motion.form
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* ─── Section: المعلومات الأساسية ─── */}
          <motion.div variants={fadeUp}>
            <h2
              className="flex items-center gap-2 text-lg font-bold mb-4"
              style={{ color: '#D4A853' }}
            >
              <User className="h-5 w-5" />
              المعلومات الأساسية
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'rgba(245,245,245,0.7)' }}
                >
                  اسم العريس *
                </label>
                <input
                  type="text"
                  name="groomName"
                  value={formData.groomName}
                  onChange={handleChange}
                  required
                  placeholder="مثال: أحمد"
                  className="w-full rounded-xl px-4 py-3 text-base bg-[#0D0D1A]/60 border border-[#D4A853]/20 text-white placeholder:text-white/25 outline-none transition-all duration-300 focus:border-[#D4A853]/50 focus:ring-2 focus:ring-[#D4A853]/10"
                  dir="rtl"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'rgba(245,245,245,0.7)' }}
                >
                  اسم العروسة *
                </label>
                <input
                  type="text"
                  name="brideName"
                  value={formData.brideName}
                  onChange={handleChange}
                  required
                  placeholder="مثال: سارة"
                  className="w-full rounded-xl px-4 py-3 text-base bg-[#0D0D1A]/60 border border-[#D4A853]/20 text-white placeholder:text-white/25 outline-none transition-all duration-300 focus:border-[#D4A853]/50 focus:ring-2 focus:ring-[#D4A853]/10"
                  dir="rtl"
                />
              </div>
            </div>
          </motion.div>

          {/* ─── Section: تفاصيل الزفاف ─── */}
          <motion.div variants={fadeUp}>
            <h2
              className="flex items-center gap-2 text-lg font-bold mb-4"
              style={{ color: '#D4A853' }}
            >
              <Calendar className="h-5 w-5" />
              تفاصيل الزفاف
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'rgba(245,245,245,0.7)' }}
                >
                  تاريخ الزفاف *
                </label>
                <input
                  type="date"
                  name="weddingDate"
                  value={formData.weddingDate}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl px-4 py-3 text-base bg-[#0D0D1A]/60 border border-[#D4A853]/20 text-white outline-none transition-all duration-300 focus:border-[#D4A853]/50 focus:ring-2 focus:ring-[#D4A853]/10"
                  dir="ltr"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'rgba(245,245,245,0.7)' }}
                >
                  <Clock
                    className="inline h-4 w-4 ml-1"
                    style={{ color: '#D4A853' }}
                  />
                  وقت الزفاف *
                </label>
                <input
                  type="time"
                  name="weddingTime"
                  value={formData.weddingTime}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl px-4 py-3 text-base bg-[#0D0D1A]/60 border border-[#D4A853]/20 text-white outline-none transition-all duration-300 focus:border-[#D4A853]/50 focus:ring-2 focus:ring-[#D4A853]/10"
                  dir="ltr"
                />
              </div>
            </div>
          </motion.div>

          {/* ─── Section: مكان الحفل ─── */}
          <motion.div variants={fadeUp}>
            <h2
              className="flex items-center gap-2 text-lg font-bold mb-4"
              style={{ color: '#D4A853' }}
            >
              <MapPin className="h-5 w-5" />
              مكان الحفل
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'rgba(245,245,245,0.7)' }}
                >
                  اسم القاعة / المكان *
                </label>
                <input
                  type="text"
                  name="venueName"
                  value={formData.venueName}
                  onChange={handleChange}
                  required
                  placeholder="مثال: فندق هيلتون - قاعة اللوتس"
                  className="w-full rounded-xl px-4 py-3 text-base bg-[#0D0D1A]/60 border border-[#D4A853]/20 text-white placeholder:text-white/25 outline-none transition-all duration-300 focus:border-[#D4A853]/50 focus:ring-2 focus:ring-[#D4A853]/10"
                  dir="rtl"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'rgba(245,245,245,0.7)' }}
                >
                  العنوان بالتفصيل
                </label>
                <input
                  type="text"
                  name="venueAddress"
                  value={formData.venueAddress}
                  onChange={handleChange}
                  placeholder="مثال: 15 شارع النيل، الدقي، الجيزة"
                  className="w-full rounded-xl px-4 py-3 text-base bg-[#0D0D1A]/60 border border-[#D4A853]/20 text-white placeholder:text-white/25 outline-none transition-all duration-300 focus:border-[#D4A853]/50 focus:ring-2 focus:ring-[#D4A853]/10"
                  dir="rtl"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'rgba(245,245,245,0.7)' }}
                >
                  لينك الموقع على الخريطة
                </label>
                <input
                  type="url"
                  name="googleMapsLink"
                  value={formData.googleMapsLink}
                  onChange={handleChange}
                  placeholder="https://maps.google.com/..."
                  className="w-full rounded-xl px-4 py-3 text-base bg-[#0D0D1A]/60 border border-[#D4A853]/20 text-white placeholder:text-white/25 outline-none transition-all duration-300 focus:border-[#D4A853]/50 focus:ring-2 focus:ring-[#D4A853]/10"
                  dir="ltr"
                />
              </div>
            </div>
          </motion.div>

          {/* ─── Section: التواصل ─── */}
          <motion.div variants={fadeUp}>
            <h2
              className="flex items-center gap-2 text-lg font-bold mb-4"
              style={{ color: '#D4A853' }}
            >
              <Phone className="h-5 w-5" />
              بيانات التواصل
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'rgba(245,245,245,0.7)' }}
                >
                  رقم واتساب العريس *
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  required
                  placeholder="01xxxxxxxxx"
                  className="w-full rounded-xl px-4 py-3 text-base bg-[#0D0D1A]/60 border border-[#D4A853]/20 text-white placeholder:text-white/25 outline-none transition-all duration-300 focus:border-[#D4A853]/50 focus:ring-2 focus:ring-[#D4A853]/10"
                  dir="ltr"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'rgba(245,245,245,0.7)' }}
                >
                  رسالة ترحيب (اختياري)
                </label>
                <input
                  type="text"
                  name="welcomeMessage"
                  value={formData.welcomeMessage}
                  onChange={handleChange}
                  placeholder="بيتشرفوا بدعوتكم لحفل زفافنا"
                  className="w-full rounded-xl px-4 py-3 text-base bg-[#0D0D1A]/60 border border-[#D4A853]/20 text-white placeholder:text-white/25 outline-none transition-all duration-300 focus:border-[#D4A853]/50 focus:ring-2 focus:ring-[#D4A853]/10"
                  dir="rtl"
                />
              </div>
            </div>
          </motion.div>

          {/* ─── Section: التصميم ─── */}
          <motion.div variants={fadeUp}>
            <h2
              className="flex items-center gap-2 text-lg font-bold mb-4"
              style={{ color: '#D4A853' }}
            >
              <Palette className="h-5 w-5" />
              التصميم
            </h2>
            <div>
              <label
                className="block text-sm font-medium mb-3"
                style={{ color: 'rgba(245,245,245,0.7)' }}
              >
                اختاري قالب الدعوة
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {themeOptions.map(t => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, theme: t.value as ThemeName })
                    }
                    className="relative rounded-xl p-3 text-center transition-all duration-300"
                    style={{
                      background:
                        formData.theme === t.value
                          ? 'rgba(212,168,83,0.12)'
                          : 'var(--admin-surface, rgba(13,13,26,0.6))',
                      border:
                        formData.theme === t.value
                          ? '2px solid #D4A853'
                          : '1px solid rgba(212,168,83,0.15)'
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-full mx-auto mb-2"
                      style={{
                        background: `linear-gradient(135deg, ${t.colors.primary}, ${t.colors.secondary})`
                      }}
                    />
                    <p
                      className="text-xs font-medium"
                      style={{
                        color:
                          formData.theme === t.value
                            ? '#D4A853'
                            : 'rgba(245,245,245,0.7)'
                      }}
                    >
                      {t.labelAr}
                    </p>
                    {formData.theme === t.value && (
                      <div
                        className="absolute top-1 left-1 w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ background: '#D4A853' }}
                      >
                        <span
                          className="text-[8px]"
                          style={{ color: '#0D0D1A' }}
                        >
                          ✓
                        </span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ─── Section: المزايا ─── */}
          <motion.div variants={fadeUp}>
            <h2
              className="flex items-center gap-2 text-lg font-bold mb-4"
              style={{ color: '#D4A853' }}
            >
              <Music className="h-5 w-5" />
              المزايا
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {toggles.map(toggle => (
                <button
                  key={toggle.key}
                  type="button"
                  onClick={() =>
                    handleToggle(
                      toggle.key,
                      !formData[toggle.key as keyof typeof formData]
                    )
                  }
                  className="flex items-center justify-between p-3 rounded-xl transition-all duration-300"
                  style={{
                    background: formData[toggle.key as keyof typeof formData]
                      ? 'rgba(212,168,83,0.08)'
                      : 'rgba(13,13,26,0.6)',
                    border: formData[toggle.key as keyof typeof formData]
                      ? '1px solid rgba(212,168,83,0.3)'
                      : '1px solid rgba(212,168,83,0.1)'
                  }}
                >
                  <span
                    className="flex items-center gap-2 text-sm"
                    style={{ color: 'rgba(245,245,245,0.8)' }}
                  >
                    <span>{toggle.icon}</span>
                    {toggle.label}
                  </span>
                  <div
                    className="w-10 h-5 rounded-full transition-all duration-300 relative"
                    style={{
                      background: formData[toggle.key as keyof typeof formData]
                        ? '#D4A853'
                        : 'rgba(245,245,245,0.15)'
                    }}
                  >
                    <div
                      className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300"
                      style={{
                        left: formData[toggle.key as keyof typeof formData]
                          ? '22px'
                          : '2px',
                        background: '#fff'
                      }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* ─── Section: ملاحظات ─── */}
          <motion.div variants={fadeUp}>
            <h2
              className="flex items-center gap-2 text-lg font-bold mb-4"
              style={{ color: '#D4A853' }}
            >
              <MessageSquare className="h-5 w-5" />
              ملاحظات إضافية
            </h2>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="ايه حاجات تانية عايز تضيفها... ألوان معينة، نص معين، أي تفاصيل..."
              rows={4}
              className="w-full rounded-xl px-4 py-3 text-base bg-[#0D0D1A]/60 border border-[#D4A853]/20 text-white placeholder:text-white/25 outline-none transition-all duration-300 focus:border-[#D4A853]/50 focus:ring-2 focus:ring-[#D4A853]/10 resize-none"
              dir="rtl"
            />
          </motion.div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-sm text-red-400 bg-red-400/10 rounded-xl p-3"
            >
              {error}
            </motion.div>
          )}

          {/* Submit */}
          <motion.div variants={fadeUp} className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-bold transition-all duration-300 disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #D4A853, #B8902F)',
                color: '#0D0D1A'
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  أرسل الطلب
                </>
              )}
            </button>
          </motion.div>
        </motion.form>

        {/* Footer */}
        <div className="text-center mt-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-16 bg-gradient-to-l from-[#D4A853]/60 to-transparent" />
            <div className="w-2 h-2 rotate-45 bg-[#D4A853]/60" />
            <div className="h-px w-16 bg-gradient-to-r from-[#D4A853]/60 to-transparent" />
          </div>
          <p className="text-xs" style={{ color: 'rgba(245,245,245,0.35)' }}>
            قُرب © {new Date().getFullYear()} — منصة دعوات الزفاف
          </p>
        </div>
      </div>
    </div>
  );
}
