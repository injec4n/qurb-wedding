'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Loader2, Heart } from 'lucide-react';
import { ThemeColors } from '@/types/wedding';
import { toast } from 'sonner';

interface RsvpSectionProps {
  weddingId: string;
  guestName?: string;
  colors: ThemeColors;
  enabled: boolean;
}

export default function RsvpSection({ weddingId, guestName, colors, enabled }: RsvpSectionProps) {
  const [status, setStatus] = useState<'idle' | 'attending' | 'not-attending'>('idle');
  const [message, setMessage] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!enabled) return null;

  const handleSubmit = async (responseStatus: 'attending' | 'not-attending') => {
    const finalGuestName = guestName || nameInput.trim();
    if (!finalGuestName) {
      toast.error('يرجى إدخال اسمك');
      return;
    }

    setLoading(true);
    setStatus(responseStatus);

    try {
      const res = await fetch('/api/rsvp/public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weddingId,
          guestName: finalGuestName,
          status: responseStatus,
          message,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        toast.success(
          responseStatus === 'attending'
            ? 'شكراً! سعداء بحضورك 🎉'
            : 'شكراً لتوصالك واهتمامك 🙏'
        );
      } else {
        toast.error(data.error || 'حدث خطأ، يرجى المحاولة مرة أخرى');
        setStatus('idle');
      }
    } catch {
      toast.error('حدث خطأ في الاتصال، يرجى المحاولة مرة أخرى');
      setStatus('idle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 sm:py-16 px-4" dir="rtl">
      {/* Ornamental divider above */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="h-px w-16 sm:w-24" style={{ backgroundColor: colors.primary + '30' }} />
        <div className="w-2.5 h-2.5 rotate-45" style={{ backgroundColor: colors.primary + '60' }} />
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.primary }} />
        <div className="w-2.5 h-2.5 rotate-45" style={{ backgroundColor: colors.primary + '60' }} />
        <div className="h-px w-16 sm:w-24" style={{ backgroundColor: colors.primary + '30' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="max-w-lg mx-auto"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center text-3xl sm:text-4xl md:text-5xl font-bold mb-8 font-serif"
          style={{ color: colors.text }}
        >
          هل نتشرف بحضوركم ليلة العمر؟
        </motion.h2>

        <div
          className="rounded-3xl p-6 sm:p-8 text-center card-glow"
          style={{
            backgroundColor: colors.primary + '0A',
            border: `1px solid ${colors.primary}20`,
          }}
        >
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="py-6"
            >
              {/* Celebration icon */}
              <div
                className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{
                  backgroundColor: status === 'attending' ? '#22C55E18' : colors.primary + '18',
                  border: `2px solid ${status === 'attending' ? '#22C55E30' : colors.primary + '30'}`,
                }}
              >
                {status === 'attending' ? (
                  <Heart className="w-10 h-10 text-green-500" />
                ) : (
                  <X className="w-10 h-10" style={{ color: colors.primary }} />
                )}
              </div>

              <p className="text-2xl sm:text-3xl font-bold mb-4" style={{ color: colors.primary }}>
                {status === 'attending' ? 'تم تأكيد الحضور بكل سرور ✅' : 'تم استلام الاعتذار 🙏'}
              </p>

              {/* Ornamental divider */}
              <div className="flex items-center justify-center gap-3 my-6">
                <div className="h-px w-10" style={{ backgroundColor: colors.primary + '30' }} />
                <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary + '50' }} />
                <div className="h-px w-10" style={{ backgroundColor: colors.primary + '30' }} />
              </div>

              <p className="text-lg sm:text-xl font-serif" style={{ color: colors.text + 'BB' }}>
                {status === 'attending'
                  ? 'فرحتنا تكتمل بحضوركم! نلقاكم عن قريب إن شاء الله 🌹'
                  : 'نسأل الله أن يجمعنا في مناسبة أسعد وأجمل 💐'}
              </p>
            </motion.div>
          ) : (
            <>
              {guestName ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xl sm:text-2xl mb-6 font-serif"
                  style={{ color: colors.text + 'CC' }}
                >
                  يا {guestName}، فرحتنا تكتمل بحضورك معنا
                </motion.p>
              ) : (
                <div className="mb-6 text-right">
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text + 'BB' }}>
                    اسمك *
                  </label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="أدخل اسمك"
                    className="w-full rounded-xl px-5 py-3.5 text-base outline-none transition-all duration-300 focus:ring-2"
                    style={{
                      backgroundColor: colors.background,
                      color: colors.text,
                      border: `1px solid ${colors.primary}30`,
                      direction: 'rtl',
                    }}
                  />
                </div>
              )}

              {/* Response buttons - larger and more elegant */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSubmit('attending')}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-lg font-semibold transition-all duration-300 disabled:opacity-50"
                  style={{
                    backgroundColor: colors.button,
                    color: colors.background,
                    boxShadow: `0 4px 16px ${colors.button}25`,
                  }}
                >
                  {loading && status === 'attending' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Check className="w-5 h-5" />
                  )}
                  يتشرفني الحضور بكل سرور 🌹
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSubmit('not-attending')}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-lg font-semibold transition-all duration-300 disabled:opacity-50"
                  style={{
                    backgroundColor: colors.button + '12',
                    color: colors.button,
                    border: `1px solid ${colors.button}30`,
                  }}
                >
                  {loading && status === 'not-attending' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <X className="w-5 h-5" />
                  )}
                  أعتذر، وأتمنى لكم أجمل ليلة 💐
                </motion.button>
              </div>

              {/* Optional message */}
              <div className="text-right">
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text + 'BB' }}>
                  رسالة اختيارية
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="اترك رسالة للعروسين..."
                  rows={3}
                  className="w-full rounded-xl px-5 py-3.5 text-base resize-none outline-none transition-all duration-300 focus:ring-2"
                  style={{
                    backgroundColor: colors.background,
                    color: colors.text,
                    border: `1px solid ${colors.primary}20`,
                    direction: 'rtl',
                  }}
                />
              </div>
            </>
          )}
        </div>
      </motion.div>

      {/* Ornamental divider below */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <div className="h-px w-16 sm:w-24" style={{ backgroundColor: colors.primary + '30' }} />
        <div className="w-2.5 h-2.5 rotate-45" style={{ backgroundColor: colors.primary + '60' }} />
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.primary }} />
        <div className="w-2.5 h-2.5 rotate-45" style={{ backgroundColor: colors.primary + '60' }} />
        <div className="h-px w-16 sm:w-24" style={{ backgroundColor: colors.primary + '30' }} />
      </div>
    </div>
  );
}
