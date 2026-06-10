'use client';

import { motion } from 'framer-motion';
import { ThemeColors } from '@/types/wedding';

interface WeddingFooterProps {
  groomName: string;
  brideName: string;
  colors: ThemeColors;
}

export default function WeddingFooter({ groomName, brideName, colors }: WeddingFooterProps) {
  return (
    <footer className="py-6 sm:py-8 px-4 text-center" dir="rtl">
      {/* Dua message */}
      <p className="text-sm sm:text-base mb-3 font-serif leading-relaxed" style={{ color: colors.text + 'AA' }}>
        نسأل الله أن يبارك في زواجكما ويجمع بينكما على خير ومحبة
      </p>

      <p className="text-base sm:text-lg mb-1.5 font-serif" style={{ color: colors.text + 'BB' }}>
        صُنع بكل حب ودعاء ❤️
      </p>
      <p className="text-sm font-semibold mb-4" style={{ color: colors.primary + 'BB' }}>
        زفاف {groomName} و {brideName}
      </p>

      {/* Elegant branding section */}
      <div className="mt-4">
        {/* Thin separator */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-10" style={{ background: `linear-gradient(to left, ${colors.primary}15, transparent)` }} />
          <div className="w-1 h-1 rotate-45" style={{ backgroundColor: colors.primary + '25' }} />
          <div className="h-px w-10" style={{ background: `linear-gradient(to right, ${colors.primary}15, transparent)` }} />
        </div>

        {/* Brand link - elegant and subtle */}
        <motion.a
          href="/"
          whileHover={{ scale: 1.02 }}
          className="inline-flex flex-col items-center gap-1 group cursor-pointer"
          style={{ textDecoration: 'none' }}
        >
          <p
            className="text-xs tracking-wider opacity-50 group-hover:opacity-80 transition-opacity duration-300"
            style={{ color: colors.text + '80' }}
          >
            عايز دعوة زي كده؟
          </p>
          <p
            className="text-lg sm:text-xl font-bold tracking-wider group-hover:opacity-100 opacity-60 transition-opacity duration-300"
            style={{ color: colors.primary }}
          >
            قُرب
          </p>
          <p
            className="text-[10px] tracking-widest opacity-40 group-hover:opacity-70 transition-opacity duration-300"
            style={{ color: colors.primary + '90' }}
          >
            دعوات زفاف رقمية
          </p>
        </motion.a>
      </div>
    </footer>
  );
}
