'use client';

import { motion } from 'framer-motion';
import { ThemeColors } from '@/types/wedding';

interface GuestWelcomeProps {
  guestName?: string;
  groomName: string;
  brideName: string;
  colors: ThemeColors;
}

export default function GuestWelcome({ guestName, groomName, brideName, colors }: GuestWelcomeProps) {
  const isPersonalized = !!guestName;

  return (
    <div className="py-16 px-4" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8 }}
        className="max-w-lg mx-auto"
      >
        <div
          className="relative rounded-3xl p-8 sm:p-10 text-center"
          style={{
            backgroundColor: colors.primary + '10',
            border: `2px solid ${colors.primary}30`,
          }}
        >
          {/* Decorative corner dots */}
          <div className="absolute top-3 right-3 w-3 h-3 rounded-full" style={{ backgroundColor: colors.primary + '40' }} />
          <div className="absolute top-3 left-3 w-3 h-3 rounded-full" style={{ backgroundColor: colors.primary + '40' }} />
          <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full" style={{ backgroundColor: colors.primary + '40' }} />
          <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full" style={{ backgroundColor: colors.primary + '40' }} />

          {/* Inner decorative border */}
          <div
            className="absolute inset-4 rounded-2xl pointer-events-none"
            style={{ border: `1px solid ${colors.primary}15` }}
          />

          {isPersonalized ? (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <p className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: colors.primary }}>
                  أهلاً {guestName} 🌷
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-3"
              >
                <p className="text-lg sm:text-xl" style={{ color: colors.text + 'CC' }}>
                  تم تجهيز هذه الدعوة خصيصاً لك
                </p>
                <div className="flex items-center justify-center gap-3 my-4">
                  <div className="h-px w-8" style={{ backgroundColor: colors.primary + '40' }} />
                  <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: colors.primary }} />
                  <div className="h-px w-8" style={{ backgroundColor: colors.primary + '40' }} />
                </div>
                <p className="text-xl sm:text-2xl font-serif font-semibold" style={{ color: colors.accent }}>
                  وجودك هيكمل فرحتنا
                </p>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <p className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: colors.primary }}>
                  يسعدنا دعوتكم 🌹
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-3"
              >
                <p className="text-lg sm:text-xl" style={{ color: colors.text + 'CC' }}>
                  لحفل زفاف {groomName} و {brideName}
                </p>
                <div className="flex items-center justify-center gap-3 my-4">
                  <div className="h-px w-8" style={{ backgroundColor: colors.primary + '40' }} />
                  <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: colors.primary }} />
                  <div className="h-px w-8" style={{ backgroundColor: colors.primary + '40' }} />
                </div>
                <p className="text-xl sm:text-2xl font-serif font-semibold" style={{ color: colors.accent }}>
                  نتشرف بحضوركم ومشاركتكم فرحتنا
                </p>
              </motion.div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
