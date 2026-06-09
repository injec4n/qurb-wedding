'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Wedding, ThemeColors } from '@/types/wedding';
import { formatDateArabic, formatTimeArabic } from '@/lib/wedding-utils';

interface WeddingDetailsProps {
  wedding: Wedding;
  colors: ThemeColors;
}

export default function WeddingDetails({ wedding, colors }: WeddingDetailsProps) {
  const details = [
    {
      icon: Calendar,
      label: formatDateArabic(wedding.weddingDate),
      emoji: '📅',
    },
    {
      icon: Clock,
      label: formatTimeArabic(wedding.weddingTime),
      emoji: '🕐',
    },
    {
      icon: MapPin,
      label: wedding.venueName,
      sublabel: wedding.venueAddress,
      emoji: '📍',
    },
  ];

  return (
    <div className="py-16 px-4" dir="rtl">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center text-xl sm:text-2xl font-bold mb-10"
        style={{ color: colors.text }}
      >
        تفاصيل الحفل
      </motion.h2>

      <div className="max-w-lg mx-auto space-y-4">
        {details.map((detail, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className="flex items-start gap-4 p-5 rounded-2xl"
            style={{
              backgroundColor: colors.primary + '0D',
              border: `1px solid ${colors.primary}20`,
            }}
          >
            <div
              className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: colors.primary + '20' }}
            >
              <detail.icon className="w-5 h-5" style={{ color: colors.primary }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-lg sm:text-xl font-semibold" style={{ color: colors.text }}>
                {detail.emoji} {detail.label}
              </p>
              {detail.sublabel && (
                <p className="text-base mt-1" style={{ color: colors.text + '99' }}>
                  {detail.sublabel}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Map button */}
      {wedding.googleMapsLink && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex justify-center mt-8"
        >
          <a
            href={wedding.googleMapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{
              backgroundColor: colors.button,
              color: colors.background,
            }}
          >
            <MapPin className="w-4 h-4" />
            عرض على الخريطة
          </a>
        </motion.div>
      )}

      {/* Decorative separator */}
      <div className="flex items-center justify-center mt-12 gap-3">
        <div className="h-px w-16 sm:w-24" style={{ backgroundColor: colors.primary + '30' }} />
        <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary + '60' }} />
        <div className="h-px w-16 sm:w-24" style={{ backgroundColor: colors.primary + '30' }} />
      </div>
    </div>
  );
}
