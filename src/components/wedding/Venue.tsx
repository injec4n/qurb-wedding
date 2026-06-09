'use client';

import { motion } from 'framer-motion';
import { MapPin, Navigation } from 'lucide-react';
import { Wedding, ThemeColors } from '@/types/wedding';

interface VenueProps {
  wedding: Wedding;
  colors: ThemeColors;
}

export default function Venue({ wedding, colors }: VenueProps) {
  const hasMap = !!wedding.googleMapsLink;

  return (
    <div className="py-16 px-4" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl mx-auto"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-xl sm:text-2xl font-bold mb-8"
          style={{ color: colors.text }}
        >
          موقع الحفل
        </motion.h2>

        {/* Venue card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-3xl overflow-hidden"
          style={{
            backgroundColor: colors.primary + '0D',
            border: `1px solid ${colors.primary}20`,
          }}
        >
          {/* Map embed or decorative header */}
          {hasMap ? (
            <div className="w-full h-48 sm:h-64 bg-gray-100 relative">
              <iframe
                src={wedding.googleMapsLink}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="موقع الحفل"
                className="w-full h-full"
              />
            </div>
          ) : (
            <div
              className="w-full h-32 sm:h-48 flex items-center justify-center relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${colors.secondary}40 0%, ${colors.primary}20 100%)`,
              }}
            >
              {/* Decorative pattern */}
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="venue-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                      <circle cx="20" cy="20" r="3" fill="none" stroke="currentColor" strokeWidth="0.5" />
                      <path d="M0 20L20 0L40 20L20 40Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#venue-pattern)" style={{ color: colors.primary }} />
                </svg>
              </div>
              <MapPin className="w-12 h-12 relative" style={{ color: colors.primary + '80' }} />
            </div>
          )}

          {/* Venue info */}
          <div className="p-6 sm:p-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <MapPin className="w-5 h-5" style={{ color: colors.primary }} />
              <h3 className="text-xl sm:text-2xl font-bold" style={{ color: colors.primary }}>
                {wedding.venueName}
              </h3>
            </div>
            <p className="text-base sm:text-lg mb-4" style={{ color: colors.text + 'BB' }}>
              {wedding.venueAddress}
            </p>

            {hasMap && (
              <a
                href={wedding.googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: colors.button + '20',
                  color: colors.button,
                  border: `1px solid ${colors.button}40`,
                }}
              >
                <Navigation className="w-4 h-4" />
                الاتجاهات على الخريطة
              </a>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
