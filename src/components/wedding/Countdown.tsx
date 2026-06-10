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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
      className="flex flex-col items-center gap-2"
    >
      <div
        className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center"
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
          className="relative text-3xl sm:text-4xl md:text-5xl font-bold"
          style={{ color: colors.primary }}
        >
          {String(value).padStart(2, '0')}
        </motion.span>
      </div>
      <span
        className="text-xs sm:text-sm font-semibold tracking-wide"
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
      <div className="py-4 sm:py-6 px-4" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="text-center"
        >
          <div
            className="inline-block px-8 py-6 rounded-3xl relative overflow-hidden"
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

            <p className="text-2xl sm:text-3xl font-bold mb-2 relative" style={{ color: colors.primary }}>
              بارك الله لهما وجمع بينهما في خير 🤲
            </p>
            <p className="text-base sm:text-lg font-serif relative" style={{ color: colors.text + 'BB' }}>
              أسأل الله أن يديم المحبة بينهما
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!timeLeft) return null;

  return (
    <div className="py-4 sm:py-6 px-4" dir="rtl">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center text-3xl sm:text-4xl md:text-5xl font-bold mb-4 font-serif"
        style={{ color: colors.text }}
      >
        نحو ليلة لا تُنسى
      </motion.h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 max-w-2xl mx-auto">
        <CountdownUnit value={timeLeft.days} label="أيام" colors={colors} delay={0} />
        <CountdownUnit value={timeLeft.hours} label="ساعات" colors={colors} delay={0.15} />
        <CountdownUnit value={timeLeft.minutes} label="دقائق" colors={colors} delay={0.3} />
        <CountdownUnit value={timeLeft.seconds} label="ثواني" colors={colors} delay={0.45} />
      </div>
    </div>
  );
}
