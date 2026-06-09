'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Loader2 } from 'lucide-react';
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
            ? 'شكراً! نتطلع لرؤيتك 🎉'
            : 'شكراً لتوصالك 🙏'
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
    <div className="py-16 px-4" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8 }}
        className="max-w-lg mx-auto"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-xl sm:text-2xl font-bold mb-8"
          style={{ color: colors.text }}
        >
          تأكيد الحضور
        </motion.h2>

        <div
          className="rounded-3xl p-6 sm:p-8 text-center"
          style={{
            backgroundColor: colors.primary + '0D',
            border: `1px solid ${colors.primary}20`,
          }}
        >
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="py-4"
            >
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: status === 'attending' ? '#22C55E20' : colors.primary + '20' }}
              >
                {status === 'attending' ? (
                  <Check className="w-8 h-8 text-green-500" />
                ) : (
                  <X className="w-8 h-8" style={{ color: colors.primary }} />
                )}
              </div>
              <p className="text-xl font-bold mb-2" style={{ color: colors.primary }}>
                {status === 'attending' ? 'تم تأكيد الحضور ✅' : 'تم تسجيل الاعتذار 🙏'}
              </p>
              <p className="text-base" style={{ color: colors.text + 'BB' }}>
                {status === 'attending'
                  ? 'نتطلع لرؤيتك في الحفل!'
                  : 'نتمنى أن نراك في مناسبة أخرى'}
              </p>
            </motion.div>
          ) : (
            <>
              {guestName ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-lg mb-4"
                  style={{ color: colors.text + 'CC' }}
                >
                  يا {guestName}، هل ستتمكن من الحضور؟
                </motion.p>
              ) : (
                <div className="mb-4 text-right">
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text + 'BB' }}>
                    اسمك *
                  </label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="أدخل اسمك"
                    className="w-full rounded-xl px-4 py-3 text-base outline-none transition-all duration-200 focus:ring-2"
                    style={{
                      backgroundColor: colors.background,
                      color: colors.text,
                      border: `1px solid ${colors.primary}30`,
                      direction: 'rtl',
                    }}
                  />
                </div>
              )}

              {/* Response buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSubmit('attending')}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold transition-all duration-300 disabled:opacity-50"
                  style={{
                    backgroundColor: colors.button,
                    color: colors.background,
                  }}
                >
                  {loading && status === 'attending' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Check className="w-5 h-5" />
                  )}
                  سأحضر ✅
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSubmit('not-attending')}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold transition-all duration-300 disabled:opacity-50"
                  style={{
                    backgroundColor: colors.button + '15',
                    color: colors.button,
                    border: `1px solid ${colors.button}30`,
                  }}
                >
                  {loading && status === 'not-attending' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <X className="w-5 h-5" />
                  )}
                  لن أتمكن من الحضور ❌
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
                  className="w-full rounded-xl px-4 py-3 text-base resize-none outline-none transition-all duration-200 focus:ring-2"
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
    </div>
  );
}
