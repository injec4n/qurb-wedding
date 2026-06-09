'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ThemeColors } from '@/types/wedding';
import { getCountdownTarget } from '@/lib/wedding-utils';

interface CountdownProps {
  targetDate: string;
  targetTime: string;
  colors: ThemeColors;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(targetDate: string, targetTime: string): TimeLeft | null {
  const target = getCountdownTarget(targetDate, targetTime);
  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor(diff / 1000) % 60,
  };
}

function CountdownUnit({ value, label, colors, delay }: { value: number; label: string; colors: ThemeColors; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
      className="flex flex-col items-center gap-3"
    >
      <div
        className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-2xl flex items-center justify-center"
        style={{
          backgroundColor: colors.primary + '15',
          border: `1px solid ${colors.primary}30`,
        }}
      >
        {/* Elegant inner border */}
        <div
          className="absolute inset-2 rounded-xl"
          style={{ border: `1px solid ${colors.primary}18` }}
        />
        {/* Subtle inner glow */}
        <div
          className="absolute inset-3 rounded-lg opacity-20"
          style={{
            background: `radial-gradient(ellipse at center, ${colors.primary} 0%, transparent 70%)`,
          }}
        />
        <motion.span
          key={value}
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative text-4xl sm:text-5xl md:text-6xl font-bold"
          style={{ color: colors.primary }}
        >
          {String(value).padStart(2, '0')}
        </motion.span>
      </div>
      <span
        className="text-sm sm:text-base font-semibold tracking-wide"
        style={{ color: colors.primary + 'BB' }}
      >
        {label}
      </span>
    </motion.div>
  );
}

export default function Countdown({ targetDate, targetTime, colors }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [hasPassed, setHasPassed] = useState(false);

  useEffect(() => {
    const update = () => {
      const result = calculateTimeLeft(targetDate, targetTime);
      if (result === null) {
        setHasPassed(true);
      } else {
        setTimeLeft(result);
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate, targetTime]);

  if (hasPassed) {
    return (
      <div className="py-16 sm:py-24 px-4" dir="rtl">
        {/* Ornamental divider above */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="h-px w-12 sm:w-20" style={{ backgroundColor: colors.primary + '30' }} />
          <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary + '60' }} />
          <div className="w-1 h-1 rounded-full" style={{ backgroundColor: colors.primary }} />
          <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary + '60' }} />
          <div className="h-px w-12 sm:w-20" style={{ backgroundColor: colors.primary + '30' }} />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="text-center"
        >
          <div
            className="inline-block px-10 py-8 rounded-3xl relative overflow-hidden"
            style={{
              backgroundColor: colors.primary + '12',
              border: `2px solid ${colors.primary}30`,
            }}
          >
            {/* Celebration particles */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  backgroundColor: colors.primary,
                  left: `${10 + (i * 7) % 80}%`,
                  top: `${10 + (i * 13) % 80}%`,
                }}
                animate={{
                  y: [0, -20 - (i % 3) * 10, 0],
                  opacity: [0, 0.8, 0],
                  scale: [0.5, 1.2, 0.5],
                }}
                transition={{
                  duration: 2 + (i % 3),
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: 'easeInOut',
                }}
              />
            ))}

            <p className="text-3xl sm:text-4xl font-bold mb-3 relative" style={{ color: colors.primary }}>
              مبروك للعروسين! 🤲
            </p>
            <p className="text-lg sm:text-xl font-serif relative" style={{ color: colors.text + 'BB' }}>
              حياة سعيدة إن شاء الله
            </p>
          </div>
        </motion.div>

        {/* Ornamental divider below */}
        <div className="flex items-center justify-center gap-4 mt-12">
          <div className="h-px w-12 sm:w-20" style={{ backgroundColor: colors.primary + '30' }} />
          <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary + '60' }} />
          <div className="w-1 h-1 rounded-full" style={{ backgroundColor: colors.primary }} />
          <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary + '60' }} />
          <div className="h-px w-12 sm:w-20" style={{ backgroundColor: colors.primary + '30' }} />
        </div>
      </div>
    );
  }

  if (!timeLeft) return null;

  return (
    <div className="py-16 sm:py-24 px-4" dir="rtl">
      {/* Ornamental divider above */}
      <div className="flex items-center justify-center gap-4 mb-10">
        <div className="h-px w-16 sm:w-24" style={{ backgroundColor: colors.primary + '30' }} />
        <div className="w-2.5 h-2.5 rotate-45" style={{ backgroundColor: colors.primary + '60' }} />
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.primary }} />
        <div className="w-2.5 h-2.5 rotate-45" style={{ backgroundColor: colors.primary + '60' }} />
        <div className="h-px w-16 sm:w-24" style={{ backgroundColor: colors.primary + '30' }} />
      </div>

      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center text-3xl sm:text-4xl md:text-5xl font-bold mb-14 sm:mb-16 font-serif"
        style={{ color: colors.text }}
      >
        العد التنازلي لأجمل ليلة
      </motion.h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8 max-w-2xl mx-auto">
        <CountdownUnit value={timeLeft.days} label="أيام" colors={colors} delay={0} />
        <CountdownUnit value={timeLeft.hours} label="ساعات" colors={colors} delay={0.15} />
        <CountdownUnit value={timeLeft.minutes} label="دقائق" colors={colors} delay={0.3} />
        <CountdownUnit value={timeLeft.seconds} label="ثواني" colors={colors} delay={0.45} />
      </div>

      {/* Ornamental divider below */}
      <div className="flex items-center justify-center gap-4 mt-14">
        <div className="h-px w-16 sm:w-24" style={{ backgroundColor: colors.primary + '30' }} />
        <div className="w-2.5 h-2.5 rotate-45" style={{ backgroundColor: colors.primary + '60' }} />
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.primary }} />
        <div className="w-2.5 h-2.5 rotate-45" style={{ backgroundColor: colors.primary + '60' }} />
        <div className="h-px w-16 sm:w-24" style={{ backgroundColor: colors.primary + '30' }} />
      </div>
    </div>
  );
}
