'use client';

import { useState } from 'react';
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
  MapPin
} from 'lucide-react';
import Link from 'next/link';

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
  const [formData, setFormData] = useState({
    groomName: '',
    brideName: '',
    weddingDate: '',
    venueName: '',
    phone: '',
    email: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
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
            متابعة الطلب عبر واتساب أو مكالمة
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
          <p className="text-base" style={{ color: 'rgba(245,245,245,0.6)' }}>
            عبّي البيانات وهنوصل معاك في أقرب وقت
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
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Names Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div variants={fadeUp}>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: 'rgba(245,245,245,0.7)' }}
              >
                <User
                  className="inline h-4 w-4 ml-1"
                  style={{ color: '#D4A853' }}
                />
                اسم العريس
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
            </motion.div>
            <motion.div variants={fadeUp}>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: 'rgba(245,245,245,0.7)' }}
              >
                <Heart
                  className="inline h-4 w-4 ml-1"
                  style={{ color: '#D4A853' }}
                />
                اسم العروسة
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
            </motion.div>
          </div>

          {/* Date & Venue */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div variants={fadeUp}>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: 'rgba(245,245,245,0.7)' }}
              >
                <Calendar
                  className="inline h-4 w-4 ml-1"
                  style={{ color: '#D4A853' }}
                />
                ميعاد الزفاف
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
            </motion.div>
            <motion.div variants={fadeUp}>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: 'rgba(245,245,245,0.7)' }}
              >
                <MapPin
                  className="inline h-4 w-4 ml-1"
                  style={{ color: '#D4A853' }}
                />
                مكان الحفل
              </label>
              <input
                type="text"
                name="venueName"
                value={formData.venueName}
                onChange={handleChange}
                placeholder="مثال: فندق هيلتون"
                className="w-full rounded-xl px-4 py-3 text-base bg-[#0D0D1A]/60 border border-[#D4A853]/20 text-white placeholder:text-white/25 outline-none transition-all duration-300 focus:border-[#D4A853]/50 focus:ring-2 focus:ring-[#D4A853]/10"
                dir="rtl"
              />
            </motion.div>
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div variants={fadeUp}>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: 'rgba(245,245,245,0.7)' }}
              >
                <Phone
                  className="inline h-4 w-4 ml-1"
                  style={{ color: '#D4A853' }}
                />
                رقم الواتساب
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="01xxxxxxxxx"
                className="w-full rounded-xl px-4 py-3 text-base bg-[#0D0D1A]/60 border border-[#D4A853]/20 text-white placeholder:text-white/25 outline-none transition-all duration-300 focus:border-[#D4A853]/50 focus:ring-2 focus:ring-[#D4A853]/10"
                dir="ltr"
              />
            </motion.div>
            <motion.div variants={fadeUp}>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: 'rgba(245,245,245,0.7)' }}
              >
                📧 الإيميل (اختياري)
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                className="w-full rounded-xl px-4 py-3 text-base bg-[#0D0D1A]/60 border border-[#D4A853]/20 text-white placeholder:text-white/25 outline-none transition-all duration-300 focus:border-[#D4A853]/50 focus:ring-2 focus:ring-[#D4A853]/10"
                dir="ltr"
              />
            </motion.div>
          </div>

          {/* Notes */}
          <motion.div variants={fadeUp}>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: 'rgba(245,245,245,0.7)' }}
            >
              <MessageSquare
                className="inline h-4 w-4 ml-1"
                style={{ color: '#D4A853' }}
              />
              ملاحظات (اختياري)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="ايه حاجات تانية عايز تضيفها..."
              rows={3}
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
