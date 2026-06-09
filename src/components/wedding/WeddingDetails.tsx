'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Phone, MessageCircle } from 'lucide-react';
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
      sublabel: wedding.venueAddress || undefined,
      emoji: '📍',
    },
  ];

  return (
    <div className="py-20 px-4" dir="rtl">
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
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center text-2xl sm:text-3xl md:text-4xl font-bold mb-14 font-serif"
        style={{ color: colors.text }}
      >
        تفاصيل الحفل
      </motion.h2>

      <div className="max-w-lg mx-auto space-y-5">
        {details.map((detail, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="flex items-start gap-5 p-6 rounded-2xl card-glow"
            style={{
              backgroundColor: colors.primary + '0A',
              border: `1px solid ${colors.primary}18`,
            }}
          >
            <div
              className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: colors.primary + '18',
                border: `1px solid ${colors.primary}20`,
              }}
            >
              <detail.icon className="w-6 h-6" style={{ color: colors.primary }} />
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <p className="text-lg sm:text-xl font-semibold" style={{ color: colors.text }}>
                {detail.label}
              </p>
              {detail.sublabel && (
                <p className="text-base mt-1.5" style={{ color: colors.text + '99' }}>
                  {detail.sublabel}
                </p>
              )}
            </div>
          </motion.div>
        ))}

        {/* Contact Phone */}
        {wedding.contactPhone && (
          <motion.a
            href={`tel:${wedding.contactPhone}`}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex items-start gap-5 p-6 rounded-2xl cursor-pointer hover:scale-[1.02] transition-transform card-glow"
            style={{
              backgroundColor: colors.primary + '0A',
              border: `1px solid ${colors.primary}18`,
            }}
          >
            <div
              className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: colors.primary + '18',
                border: `1px solid ${colors.primary}20`,
              }}
            >
              <Phone className="w-6 h-6" style={{ color: colors.primary }} />
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <p className="text-lg sm:text-xl font-semibold" style={{ color: colors.text }}>
                {wedding.contactPhone}
              </p>
              <p className="text-sm mt-1" style={{ color: colors.text + '88' }}>
                للتواصل والاستفسار
              </p>
            </div>
          </motion.a>
        )}
      </div>

      {/* Welcome Message */}
      {wedding.welcomeMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-lg mx-auto mt-10 p-8 rounded-3xl text-center relative"
          style={{
            backgroundColor: colors.accent + '08',
            border: `1px solid ${colors.accent}15`,
          }}
        >
          {/* Decorative frame corners */}
          <div className="absolute top-2 right-2 w-5 h-5" style={{ color: colors.accent + '35' }}>
            <svg viewBox="0 0 20 20"><path d="M0 0 L20 0 L20 4 L4 4 L4 20 L0 20Z" fill="currentColor" /></svg>
          </div>
          <div className="absolute top-2 left-2 w-5 h-5" style={{ color: colors.accent + '35' }}>
            <svg viewBox="0 0 20 20"><path d="M20 0 L0 0 L0 4 L16 4 L16 20 L20 20Z" fill="currentColor" /></svg>
          </div>
          <div className="absolute bottom-2 right-2 w-5 h-5" style={{ color: colors.accent + '35' }}>
            <svg viewBox="0 0 20 20"><path d="M0 20 L20 20 L20 16 L4 16 L4 0 L0 0Z" fill="currentColor" /></svg>
          </div>
          <div className="absolute bottom-2 left-2 w-5 h-5" style={{ color: colors.accent + '35' }}>
            <svg viewBox="0 0 20 20"><path d="M20 20 L0 20 L0 16 L16 16 L16 0 L20 0Z" fill="currentColor" /></svg>
          </div>

          <MessageCircle className="w-7 h-7 mx-auto mb-4" style={{ color: colors.accent }} />
          <p className="text-lg sm:text-xl leading-relaxed font-serif" style={{ color: colors.text + 'DD' }}>
            {wedding.welcomeMessage}
          </p>
        </motion.div>
      )}

      {/* Map button - more prominent */}
      {wedding.googleMapsLink && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex justify-center mt-10"
        >
          <a
            href={wedding.googleMapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{
              backgroundColor: colors.button,
              color: colors.background,
              boxShadow: `0 4px 20px ${colors.button}30`,
            }}
          >
            <MapPin className="w-5 h-5" />
            عرض على الخريطة
          </a>
        </motion.div>
      )}

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
