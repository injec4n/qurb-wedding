'use client';

import { motion } from 'framer-motion';
import { ThemeColors } from '@/types/wedding';

interface GuestWelcomeProps {
  guestName?: string;
  groomName: string;
  brideName: string;
  colors: ThemeColors;
  couplePhoto?: string;
}

export default function GuestWelcome({ guestName, groomName, brideName, colors, couplePhoto }: GuestWelcomeProps) {
  const isPersonalized = !!guestName;

  return (
    <div className="py-6 sm:py-10 px-4" dir="rtl">
      {/* Ornamental divider above */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="h-px w-16 sm:w-24" style={{ backgroundColor: colors.primary + '30' }} />
        <div className="w-2.5 h-2.5 rotate-45" style={{ backgroundColor: colors.primary + '60' }} />
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.primary }} />
        <div className="w-2.5 h-2.5 rotate-45" style={{ backgroundColor: colors.primary + '60' }} />
        <div className="h-px w-16 sm:w-24" style={{ backgroundColor: colors.primary + '30' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="max-w-xl mx-auto"
      >
        <div
          className="relative rounded-3xl p-6 sm:p-8 text-center card-glow"
          style={{
            backgroundColor: colors.primary + '0A',
            border: `2px solid ${colors.primary}25`,
          }}
        >
          {/* Outer decorative frame corners */}
          <div className="absolute top-3 right-3 w-8 h-8" style={{ color: colors.primary + '40' }}>
            <svg viewBox="0 0 30 30" className="w-full h-full">
              <path d="M0 0 L30 0 L30 6 L6 6 L6 30 L0 30Z" fill="currentColor" />
            </svg>
          </div>
          <div className="absolute top-3 left-3 w-8 h-8" style={{ color: colors.primary + '40' }}>
            <svg viewBox="0 0 30 30" className="w-full h-full">
              <path d="M30 0 L0 0 L0 6 L24 6 L24 30 L30 30Z" fill="currentColor" />
            </svg>
          </div>
          <div className="absolute bottom-3 right-3 w-8 h-8" style={{ color: colors.primary + '40' }}>
            <svg viewBox="0 0 30 30" className="w-full h-full">
              <path d="M0 30 L30 30 L30 24 L6 24 L6 0 L0 0Z" fill="currentColor" />
            </svg>
          </div>
          <div className="absolute bottom-3 left-3 w-8 h-8" style={{ color: colors.primary + '40' }}>
            <svg viewBox="0 0 30 30" className="w-full h-full">
              <path d="M30 30 L0 30 L0 24 L24 24 L24 0 L30 0Z" fill="currentColor" />
            </svg>
          </div>

          {/* Inner decorative border */}
          <div
            className="absolute inset-5 rounded-2xl pointer-events-none"
            style={{ border: `1px solid ${colors.primary}12` }}
          />
          <div
            className="absolute inset-7 rounded-xl pointer-events-none"
            style={{ border: `1px solid ${colors.primary}08` }}
          />

          {/* Couple photo */}
          {couplePhoto && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="flex justify-center mb-6"
            >
              <div
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden"
                style={{
                  border: `3px solid ${colors.primary}`,
                  boxShadow: `0 0 20px ${colors.primary}20, inset 0 0 10px ${colors.primary}10`,
                  padding: '3px',
                }}
              >
                <img
                  src={couplePhoto}
                  alt="صورة الزوجين"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </motion.div>
          )}

          {isPersonalized ? (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <p className="text-5xl sm:text-6xl font-bold mb-5" style={{ color: colors.primary }}>
                  أهلاً بيك {' '}
                  <motion.span
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
                    className="inline-block"
                    style={{ color: colors.accent }}
                  >
                    {guestName}
                  </motion.span>{' '}
                  🌷
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="space-y-4"
              >
                <p className="text-xl sm:text-2xl" style={{ color: colors.text + 'CC' }}>
                  فرحتنا مش بتتكمل غير بوجودكم معانا
                </p>
                <div className="flex items-center justify-center gap-4 my-4">
                  <div className="h-px w-12" style={{ backgroundColor: colors.primary + '40' }} />
                  <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary }} />
                  <div className="h-px w-12" style={{ backgroundColor: colors.primary + '40' }} />
                </div>
                <p className="text-2xl sm:text-3xl font-serif font-semibold" style={{ color: colors.accent }}>
                  بوجودكم تزدان ليلتنا وتكتمل فرحتنا
                </p>
                <p className="text-base sm:text-lg" style={{ color: colors.text + '99' }}>
                  أنتم الزينة اللي بتكمل ليلتنا، والفرحة اللي بتملأ قلوبنا
                </p>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <p className="text-5xl sm:text-6xl font-bold mb-5" style={{ color: colors.primary }}>
                  بيتشرفوا بمشاركتكم أفرح ليلة في حياتنا 🌹
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="space-y-4"
              >
                <p className="text-xl sm:text-2xl" style={{ color: colors.text + 'CC' }}>
                  زفاف {groomName} و {brideName}
                </p>
                <div className="flex items-center justify-center gap-4 my-4">
                  <div className="h-px w-12" style={{ backgroundColor: colors.primary + '40' }} />
                  <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary }} />
                  <div className="h-px w-12" style={{ backgroundColor: colors.primary + '40' }} />
                </div>
                <p className="text-2xl sm:text-3xl font-serif font-semibold" style={{ color: colors.accent }}>
                  بوجودكم تزدان ليلتنا وتكتمل فرحتنا
                </p>
                <p className="text-base sm:text-lg" style={{ color: colors.text + '99' }}>
                  بوجودكم بتتكمل الفرحة وبتزدان الليلة
                </p>
              </motion.div>
            </>
          )}
        </div>
      </motion.div>

      {/* Ornamental divider below */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <div className="h-px w-16 sm:w-24" style={{ backgroundColor: colors.primary + '30' }} />
        <div className="w-2.5 h-2.5 rotate-45" style={{ backgroundColor: colors.primary + '60' }} />
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.primary }} />
        <div className="w-2.5 h-2.5 rotate-45" style={{ backgroundColor: colors.primary + '60' }} />
        <div className="h-px w-16 sm:w-24" style={{ backgroundColor: colors.primary + '30' }} />
      </div>
    </div>
  );
}
