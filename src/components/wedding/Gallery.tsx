'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { ThemeColors } from '@/types/wedding';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';

interface GalleryProps {
  images: string[];
  colors: ThemeColors;
}

function EmptyPlaceholder({ colors }: { colors: ThemeColors }) {
  return (
    <div
      className="col-span-2 md:col-span-3 rounded-3xl p-12 sm:p-16 text-center"
      style={{
        backgroundColor: colors.primary + '08',
        border: `1px dashed ${colors.primary}25`,
      }}
    >
      <div
        className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
        style={{ backgroundColor: colors.primary + '12' }}
      >
        <Camera className="w-10 h-10" style={{ color: colors.primary + '60' }} />
      </div>
      <p className="text-xl sm:text-2xl font-serif mb-2" style={{ color: colors.primary + '80' }}>
        صور ذكرياتكم ستكون هنا 📸
      </p>
      <p className="text-sm sm:text-base" style={{ color: colors.text + '66' }}>
        ستُضاف الصور قريباً إن شاء الله
      </p>
    </div>
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
        className="text-center text-2xl sm:text-3xl md:text-4xl font-bold mb-4 font-serif"
        style={{ color: colors.text }}
      >
        معرض الصور
      </motion.h2>

      {/* Image counter */}
      {hasImages && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-base mb-10"
          style={{ color: colors.primary + '80' }}
        >
          {images.length} صورة
        </motion.p>
      )}

      {!hasImages && <div className="mb-6" />}

      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
        {hasImages ? (
          images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              whileHover={{ scale: 1.04 }}
              className="aspect-square rounded-2xl overflow-hidden cursor-pointer relative group"
              onClick={() => openLightbox(index)}
              style={{
                border: `1px solid ${colors.primary}18`,
                // Slight gap variation for visual interest
                ...(index % 3 === 1 ? { marginTop: '12px' } : {}),
              }}
            >
              <img
                src={image}
                alt={`صورة ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center"
                style={{ backgroundColor: colors.background + '66' }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.primary + '35' }}
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke={colors.primary} strokeWidth="2">
                    <path d="M15 3h6v6M14 10l6.1-6.1M9 21H3v-6M10 14l-6.1 6.1" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <EmptyPlaceholder colors={colors} />
        )}
      </div>

      {/* Lightbox Dialog */}
      {hasImages && selectedIndex !== null && (
        <Dialog open={selectedIndex !== null} onOpenChange={() => closeLightbox()}>
          <DialogContent
            className="max-w-4xl w-full p-0 overflow-hidden border-0"
            style={{ backgroundColor: colors.background + 'F5' }}
          >
            <div className="relative">
              {/* Close button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 left-4 z-10 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                style={{ backgroundColor: colors.primary + '25', color: colors.primary }}
              >
                <X className="w-5 h-5" />
              </button>

              {/* Image */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
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
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                    style={{ backgroundColor: colors.primary + '25', color: colors.primary }}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={goPrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                    style={{ backgroundColor: colors.primary + '25', color: colors.primary }}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Image counter */}
              <div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-sm font-medium"
                style={{ backgroundColor: colors.primary + '18', color: colors.text }}
              >
                {selectedIndex + 1} / {images.length}
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
