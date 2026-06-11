'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Send, CheckCircle, Loader2, Calendar, User, Phone, MessageSquare, MapPin, Clock, Music, Palette } from 'lucide-react';
import Link from 'next/link';
import { themeOptions, type ThemeName } from '@/lib/themes';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function OrderPage() {
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
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
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
        body: JSON.stringify(formData),
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

  if (isSuccess) {
    return (
      <div
        dir="rtl"
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: 'linear-gradient(180deg, #0D0D1A 0%, #1A1A2E 50%, #0D0D1A 100%)' }}
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
          <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: '#F5F5F5' }}>
            تم إرسال طلبكم بنجاح! ✨
          </h2>
          <p className="text-base mb-2" style={{ color: '#D4A853' }}>
            هنتواصل معاكم في أقرب وقت إن شاء الله
          </p>
          <p className="text-sm mb-8" style={{ color: 'rgba(245,245,245,0.5)' }}>
            هنجهز الدعوة بالمواصفات اللي طلبتوها وهنبعتلكم اللينك
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #D4A853, #B8902F)',
              color: '#0D0D1A',
            }}
          >
            <Heart className="h-4 w-4" />
            ارجع للرئيسية
          </Link>
        </motion.div>
      </div>
    );
  }

  const toggles = [
    { key: 'enableRsvp', label: 'تأكيد الحضور (RSVP)', icon: '📋' },
    { key: 'enableCountdown', label: 'عداد تنازلي', icon: '⏳' },
    { key: 'enableMusic', label: 'مزيكا خلفية', icon: '🎵' },
    { key: 'enableGallery', label: 'معرض صور', icon: '📸' },
    { key: 'enableGuestPersonalization', label: 'ظرف باسم الضيف', icon: '✉️' },
  ] as const;

  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(180deg, #0D0D1A 0%, #1A1A2E 50%, #0D0D1A 100%)' }}
    >
      {/* Decorative */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, #D4A853, transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 flex-1 w-full max-w-2xl mx-auto px-4 py-10 sm:py-16">
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="h-6 w-6" style={{ color: '#D4A853' }} />
            <h1 className="text-3xl sm:text-4xl font-bold" style={{ color: '#F5F5F5' }}>
              اطلب دعوتك
            </h1>
            <Heart className="h-6 w-6" style={{ color: '#D4A853' }} />
          </div>
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
            <h2 className="flex items-center gap-2 text-lg font-bold mb-4" style={{ color: '#D4A853' }}>
              <User className="h-5 w-5" />
              المعلومات الأساسية
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(245,245,245,0.7)' }}>
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
                <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(245,245,245,0.7)' }}>
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
            <h2 className="flex items-center gap-2 text-lg font-bold mb-4" style={{ color: '#D4A853' }}>
              <Calendar className="h-5 w-5" />
              تفاصيل الزفاف
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(245,245,245,0.7)' }}>
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
                <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(245,245,245,0.7)' }}>
                  <Clock className="inline h-4 w-4 ml-1" style={{ color: '#D4A853' }} />
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
            <h2 className="flex items-center gap-2 text-lg font-bold mb-4" style={{ color: '#D4A853' }}>
              <MapPin className="h-5 w-5" />
              مكان الحفل
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(245,245,245,0.7)' }}>
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
                <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(245,245,245,0.7)' }}>
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
                <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(245,245,245,0.7)' }}>
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
            <h2 className="flex items-center gap-2 text-lg font-bold mb-4" style={{ color: '#D4A853' }}>
              <Phone className="h-5 w-5" />
              بيانات التواصل
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(245,245,245,0.7)' }}>
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
                <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(245,245,245,0.7)' }}>
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
            <h2 className="flex items-center gap-2 text-lg font-bold mb-4" style={{ color: '#D4A853' }}>
              <Palette className="h-5 w-5" />
              التصميم
            </h2>
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: 'rgba(245,245,245,0.7)' }}>
                اختاري قالب الدعوة
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {themeOptions.map((t) => (
                  <button
                    key={t.name}
                    type="button"
                    onClick={() => setFormData({ ...formData, theme: t.name as ThemeName })}
                    className="relative rounded-xl p-3 text-center transition-all duration-300"
                    style={{
                      background: formData.theme === t.name ? 'rgba(212,168,83,0.12)' : 'var(--admin-surface, rgba(13,13,26,0.6))',
                      border: formData.theme === t.name ? '2px solid #D4A853' : '1px solid rgba(212,168,83,0.15)',
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-full mx-auto mb-2"
                      style={{ background: `linear-gradient(135deg, ${t.colors.primary}, ${t.colors.secondary})` }}
                    />
                    <p className="text-xs font-medium" style={{ color: formData.theme === t.name ? '#D4A853' : 'rgba(245,245,245,0.7)' }}>
                      {t.labelAr}
                    </p>
                    {formData.theme === t.name && (
                      <div className="absolute top-1 left-1 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: '#D4A853' }}>
                        <span className="text-[8px]" style={{ color: '#0D0D1A' }}>✓</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ─── Section: المزايا ─── */}
          <motion.div variants={fadeUp}>
            <h2 className="flex items-center gap-2 text-lg font-bold mb-4" style={{ color: '#D4A853' }}>
              <Music className="h-5 w-5" />
              المزايا
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {toggles.map((toggle) => (
                <button
                  key={toggle.key}
                  type="button"
                  onClick={() => handleToggle(toggle.key, !formData[toggle.key as keyof typeof formData])}
                  className="flex items-center justify-between p-3 rounded-xl transition-all duration-300"
                  style={{
                    background: formData[toggle.key as keyof typeof formData] ? 'rgba(212,168,83,0.08)' : 'rgba(13,13,26,0.6)',
                    border: formData[toggle.key as keyof typeof formData] ? '1px solid rgba(212,168,83,0.3)' : '1px solid rgba(212,168,83,0.1)',
                  }}
                >
                  <span className="flex items-center gap-2 text-sm" style={{ color: 'rgba(245,245,245,0.8)' }}>
                    <span>{toggle.icon}</span>
                    {toggle.label}
                  </span>
                  <div
                    className="w-10 h-5 rounded-full transition-all duration-300 relative"
                    style={{
                      background: formData[toggle.key as keyof typeof formData] ? '#D4A853' : 'rgba(245,245,245,0.15)',
                    }}
                  >
                    <div
                      className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300"
                      style={{
                        left: formData[toggle.key as keyof typeof formData] ? '22px' : '2px',
                        background: '#fff',
                      }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* ─── Section: ملاحظات ─── */}
          <motion.div variants={fadeUp}>
            <h2 className="flex items-center gap-2 text-lg font-bold mb-4" style={{ color: '#D4A853' }}>
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
                color: '#0D0D1A',
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
