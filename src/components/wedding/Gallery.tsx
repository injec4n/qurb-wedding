'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ThemeColors } from '@/types/wedding';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';

interface GalleryProps {
  images: string[];
  colors: ThemeColors;
}

const placeholderPatterns = [
  'radial-gradient(circle at 30% 40%, var(--c1) 0%, transparent 50%), radial-gradient(circle at 70% 60%, var(--c2) 0%, transparent 50%)',
  'conic-gradient(from 45deg at 50% 50%, var(--c1) 0%, var(--c2) 25%, var(--c1) 50%, var(--c2) 75%, var(--c1) 100%)',
  'radial-gradient(ellipse at 20% 50%, var(--c1) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, var(--c2) 0%, transparent 60%)',
  'linear-gradient(135deg, var(--c1) 0%, var(--c2) 50%, var(--c1) 100%)',
  'repeating-conic-gradient(var(--c1) 0% 25%, var(--c2) 0% 50%) 50% / 60px 60px',
  'radial-gradient(circle at 50% 50%, var(--c1) 0%, var(--c2) 60%, var(--c1) 100%)',
];

function PlaceholderCard({ index, colors }: { index: number; colors: ThemeColors }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="aspect-square rounded-2xl overflow-hidden relative"
      style={{
        background: placeholderPatterns[index % placeholderPatterns.length],
        ['--c1' as string]: colors.primary + '30',
        ['--c2' as string]: colors.secondary + '40',
        border: `1px solid ${colors.primary}20`,
      }}
    >
      {/* Decorative overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <svg viewBox="0 0 100 100" className="w-16 h-16" style={{ color: colors.primary }}>
          <path d="M50 10L90 50L50 90L10 50Z" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M50 25L75 50L50 75L25 50Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
    </motion.div>
  );
}

export default function Gallery({ images, colors }: GalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const hasImages = images && images.length > 0;

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);
  const goNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length);
    }
  };
  const goPrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
    }
  };

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
        معرض الصور
      </motion.h2>

      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {hasImages ? (
          images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ scale: 1.03 }}
              className="aspect-square rounded-2xl overflow-hidden cursor-pointer relative group"
              onClick={() => openLightbox(index)}
              style={{ border: `1px solid ${colors.primary}20` }}
            >
              <img
                src={image}
                alt={`صورة ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                style={{ backgroundColor: colors.background + '66' }}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary + '40' }}>
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke={colors.primary} strokeWidth="2">
                    <path d="M15 3h6v6M14 10l6.1-6.1M9 21H3v-6M10 14l-6.1 6.1" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          Array.from({ length: 6 }).map((_, index) => (
            <PlaceholderCard key={index} index={index} colors={colors} />
          ))
        )}
      </div>

      {/* Lightbox Dialog */}
      {hasImages && selectedIndex !== null && (
        <Dialog open={selectedIndex !== null} onOpenChange={() => closeLightbox()}>
          <DialogContent
            className="max-w-4xl w-full p-0 overflow-hidden border-0 bg-black/90"
            style={{ backgroundColor: colors.background + 'F0' }}
          >
            <div className="relative">
              {/* Close button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: colors.primary + '30', color: colors.primary }}
              >
                <X className="w-5 h-5" />
              </button>

              {/* Image */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-center min-h-[50vh] sm:min-h-[70vh] p-4"
                >
                  <img
                    src={images[selectedIndex]}
                    alt={`صورة ${selectedIndex + 1}`}
                    className="max-w-full max-h-[70vh] sm:max-h-[80vh] object-contain rounded-lg"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Navigation buttons */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={goNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                    style={{ backgroundColor: colors.primary + '30', color: colors.primary }}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={goPrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                    style={{ backgroundColor: colors.primary + '30', color: colors.primary }}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Image counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-sm" style={{ backgroundColor: colors.primary + '20', color: colors.text }}>
                {selectedIndex + 1} / {images.length}
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
