'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation } from 'lucide-react';
import { Wedding, ThemeColors } from '@/types/wedding';

interface VenueProps {
  wedding: Wedding;
  colors: ThemeColors;
}

export default function Venue({ wedding, colors }: VenueProps) {
  const hasMap = !!wedding.googleMapsLink;
  const [mapHovered, setMapHovered] = useState(false);

  return (
    <div className="py-4 sm:py-6 px-4" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="max-w-2xl mx-auto"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center text-3xl sm:text-4xl md:text-5xl font-bold mb-5 font-serif"
          style={{ color: colors.text }}
        >
          {wedding.venueTitle || 'حيث تُحتفل الفرحة'}
        </motion.h2>

        {/* Venue card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="rounded-3xl overflow-hidden card-glow"
          style={{
            backgroundColor: colors.primary + '0A',
            border: `1px solid ${colors.primary}20`,
          }}
        >
          {/* Decorative header */}
          <div
            className="w-full h-20 sm:h-32 flex items-center justify-center relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${colors.secondary}40 0%, ${colors.primary}20 100%)`,
            }}
          >
            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-[0.06]" style={{ color: colors.primary }}>
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="venue-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                    <circle cx="20" cy="20" r="3" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    <path d="M0 20L20 0L40 20L20 40Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#venue-pattern)" />
              </svg>
            </div>
            {/* Prominent map pin icon */}
            <div
              className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: colors.primary + '20',
                border: `2px solid ${colors.primary}30`,
              }}
            >
              <MapPin className="w-8 h-8 sm:w-10 sm:h-10 relative" style={{ color: colors.primary + '90' }} />
            </div>
          </div>

          {/* Venue info */}
          <div className="p-4 sm:p-6 text-center">
            <h3
              className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 font-serif"
              style={{ color: colors.primary }}
            >
              {wedding.venueName}
            </h3>
            {wedding.venueAddress && (
              <p className="text-sm sm:text-base mb-4" style={{ color: colors.text + 'BB' }}>
                {wedding.venueAddress}
              </p>
            )}

            {/* Ornamental divider inside card */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-10" style={{ backgroundColor: colors.primary + '25' }} />
              <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: colors.primary + '50' }} />
              <div className="h-px w-10" style={{ backgroundColor: colors.primary + '25' }} />
            </div>

            {hasMap && (
              <a
                href={wedding.googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setMapHovered(true)}
                onMouseLeave={() => setMapHovered(false)}
                className="inline-flex items-center gap-3 px-6 py-3 rounded-xl text-base font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: colors.button,
                  color: colors.background,
                  boxShadow: mapHovered ? `0 4px 24px ${colors.button}40` : `0 4px 16px ${colors.button}25`,
                  outline: 'none',
                }}
              >
                <Navigation className="w-5 h-5" />
                الاتجاهات على الخريطة
              </a>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
