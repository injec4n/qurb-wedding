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
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function CountdownUnit({ value, label, colors, delay }: { value: number; label: string; colors: ThemeColors; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="flex flex-col items-center gap-2"
    >
      <div
        className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl flex items-center justify-center shadow-lg"
        style={{ backgroundColor: colors.primary + '20', border: `2px solid ${colors.primary}40` }}
      >
        <div
          className="absolute inset-1 rounded-xl opacity-20"
          style={{ backgroundColor: colors.primary }}
        />
        <motion.span
          key={value}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative text-3xl sm:text-4xl md:text-5xl font-bold"
          style={{ color: colors.primary }}
        >
          {String(value).padStart(2, '0')}
        </motion.span>
      </div>
      <span className="text-sm sm:text-base font-medium" style={{ color: colors.text + 'CC' }}>
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
      <div className="py-16 px-4" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="text-center"
        >
          <div
            className="inline-block px-8 py-4 rounded-2xl text-2xl sm:text-3xl font-bold"
            style={{ backgroundColor: colors.primary + '20', color: colors.primary, border: `2px solid ${colors.primary}40` }}
          >
            الحفل قد بدأ! 🎉
          </div>
        </motion.div>
      </div>
    );
  }

  if (!timeLeft) return null;

  return (
    <div className="py-16 px-4" dir="rtl">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center text-xl sm:text-2xl font-bold mb-8"
        style={{ color: colors.text }}
      >
        العد التنازلي ليوم الزفاف
      </motion.h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-2xl mx-auto">
        <CountdownUnit value={timeLeft.days} label="أيام" colors={colors} delay={0} />
        <CountdownUnit value={timeLeft.hours} label="ساعات" colors={colors} delay={0.1} />
        <CountdownUnit value={timeLeft.minutes} label="دقائق" colors={colors} delay={0.2} />
        <CountdownUnit value={timeLeft.seconds} label="ثواني" colors={colors} delay={0.3} />
      </div>

      {/* Decorative separator */}
      <div className="flex items-center justify-center mt-12 gap-3">
        <div className="h-px w-16 sm:w-24" style={{ backgroundColor: colors.primary + '40' }} />
        <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary }} />
        <div className="h-px w-16 sm:w-24" style={{ backgroundColor: colors.primary + '40' }} />
      </div>
    </div>
  );
}
