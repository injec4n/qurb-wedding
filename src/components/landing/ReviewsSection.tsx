'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Play, Pause, Mic, Quote, Image as ImageIcon } from 'lucide-react';
import { Review } from '@/types/wedding';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

function OrnamentDivider({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className || ''}`}>
      <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-[#D4A853]/60 to-transparent" />
      <div className="w-2 h-2 rotate-45 bg-[#D4A853]/60" />
      <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-[#D4A853]/60 to-transparent" />
    </div>
  );
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState<Record<string, number>>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch active reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/reviews?active=true');
        const data = await res.json();
        if (data.success) {
          setReviews(data.data);
        }
      } catch {
        // Silently fail
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const toggleAudio = useCallback((review: Review) => {
    if (playingAudioId === review.id) {
      audioRef.current?.pause();
      setPlayingAudioId(null);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }

      const audio = new Audio(review.audioUrl);
      audioRef.current = audio;

      // Track progress
      const interval = setInterval(() => {
        if (audio.duration && audio.currentTime) {
          setAudioProgress((prev) => ({
            ...prev,
            [review.id]: (audio.currentTime / audio.duration) * 100,
          }));
        }
      }, 100);
      progressIntervalRef.current = interval;

      audio.onended = () => {
        setPlayingAudioId(null);
        setAudioProgress((prev) => ({ ...prev, [review.id]: 0 }));
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
      };

      audio.play();
      setPlayingAudioId(review.id);
    }
  }, [playingAudioId]);

  // Navigation
  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
    stopAudio();
  };
  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    stopAudio();
  };
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayingAudioId(null);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }
  };

  // Don't render if no reviews
  if (!isLoading && reviews.length === 0) return null;

  // Don't render the section while loading if there are no reviews to show
  if (isLoading) {
    return (
      <section className="relative py-16 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D1A] via-[#0F0F20] to-[#0D0D1A]" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-3 py-8">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: '#D4A853', borderTopColor: 'transparent' }} />
          </div>
        </div>
      </section>
    );
  }

  const currentReview = reviews[currentIndex];

  return (
    <section className="relative py-16 sm:py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D1A] via-[#0F0F20] to-[#0D0D1A]" />

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-[#D4A853]/5 blur-[130px] rounded-full" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
          className="text-center mb-10"
        >
          <motion.div variants={fadeUp} custom={0}>
            <div className="inline-flex items-center gap-2 bg-[#D4A853]/8 border border-[#D4A853]/15 rounded-full px-4 py-1.5 mb-4">
              <Star className="h-3.5 w-3.5 text-[#D4A853] fill-[#D4A853]" />
              <span className="text-[#D4A853] text-xs font-medium tracking-wider">آراء عملائنا</span>
            </div>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3"
          >
            <span className="text-gold-gradient">تقييمات</span>{' '}
            <span className="text-white">العملاء</span>
          </motion.h2>
          <motion.div variants={fadeUp} custom={2}>
            <OrnamentDivider />
          </motion.div>
          <motion.p
            variants={fadeUp}
            custom={3}
            className="text-sm sm:text-base text-white/40 font-light mt-4 max-w-xl mx-auto leading-relaxed"
          >
            شوفوا إيه اللي عملائنا بيقولوه عن تجربتهم مع قُرب
          </motion.p>
        </motion.div>

        {/* Reviews carousel */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="relative"
        >
          {/* Main review card */}
          <div className="relative max-w-3xl mx-auto">
            {/* Card */}
            <div className="rounded-2xl border border-[#D4A853]/15 bg-[#1A1A2E]/40 backdrop-blur-sm overflow-hidden">
              {/* Top gold accent */}
              <div className="h-[2px] w-full bg-gradient-to-l from-[#D4A853]/0 via-[#D4A853]/40 to-[#D4A853]/0" />

              <div className="p-6 sm:p-8 md:p-10">
                {/* Type badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    {currentReview.type === 'text' && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#D4A853]/10 text-[#D4A853] border border-[#D4A853]/20">
                        <Quote className="h-3 w-3" />
                        رأي نصي
                      </div>
                    )}
                    {currentReview.type === 'image' && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20">
                        <ImageIcon className="h-3 w-3" />
                        صورة
                      </div>
                    )}
                    {currentReview.type === 'audio' && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#60A5FA]/10 text-[#60A5FA] border border-[#60A5FA]/20">
                        <Mic className="h-3 w-3" />
                        صوتي
                      </div>
                    )}
                    {currentReview.weddingName && (
                      <span className="text-xs text-white/30 border border-white/10 rounded-full px-3 py-1">
                        {currentReview.weddingName}
                      </span>
                    )}
                  </div>
                  {/* Rating */}
                  <div className="flex items-center gap-0.5" dir="ltr">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= currentReview.rating
                            ? 'text-[#D4A853] fill-[#D4A853]'
                            : 'text-white/15'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* TEXT review */}
                {currentReview.type === 'text' && (
                  <div className="space-y-4">
                    <div className="relative">
                      <Quote className="absolute -top-1 -right-1 h-8 w-8 text-[#D4A853]/10 fill-[#D4A853]/10" />
                      <p className="text-base sm:text-lg text-white/80 font-light leading-relaxed relative z-10">
                        &ldquo;{currentReview.text}&rdquo;
                      </p>
                    </div>
                  </div>
                )}

                {/* IMAGE review */}
                {currentReview.type === 'image' && (
                  <div className="space-y-4">
                    {currentReview.imageUrl && (
                      <div className="rounded-xl overflow-hidden border border-white/10 max-w-md mx-auto">
                        <img
                          src={currentReview.imageUrl}
                          alt={`تقييم ${currentReview.name}`}
                          className="w-full h-auto max-h-72 object-contain bg-black/30"
                        />
                      </div>
                    )}
                    {currentReview.text && (
                      <p className="text-sm text-white/50 font-light leading-relaxed text-center">
                        &ldquo;{currentReview.text}&rdquo;
                      </p>
                    )}
                  </div>
                )}

                {/* AUDIO review */}
                {currentReview.type === 'audio' && (
                  <div className="space-y-5">
                    <div className="flex items-center gap-4 p-4 rounded-xl border border-[#60A5FA]/15 bg-[#60A5FA]/5">
                      <button
                        onClick={() => toggleAudio(currentReview)}
                        className="flex items-center justify-center w-12 h-12 rounded-full shrink-0 transition-all duration-300"
                        style={{
                          background: playingAudioId === currentReview.id ? '#60A5FA' : 'rgba(96,165,250,0.15)',
                          color: playingAudioId === currentReview.id ? '#0D0D1A' : '#60A5FA',
                        }}
                      >
                        {playingAudioId === currentReview.id ? (
                          <Pause className="h-5 w-5" />
                        ) : (
                          <Play className="h-5 w-5 ml-0.5" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        {/* Waveform visual */}
                        <div className="flex items-end gap-[2px] h-8 mb-2">
                          {Array.from({ length: 30 }).map((_, i) => {
                            const height = 20 + Math.sin(i * 0.5) * 30 + Math.random() * 20;
                            const progress = audioProgress[currentReview.id] || 0;
                            const isPast = (i / 30) * 100 < progress;
                            return (
                              <div
                                key={i}
                                className="flex-1 rounded-full transition-all duration-100"
                                style={{
                                  height: `${height}%`,
                                  background: isPast ? '#60A5FA' : 'rgba(96,165,250,0.2)',
                                }}
                              />
                            );
                          })}
                        </div>
                        <p className="text-xs text-[#60A5FA]/60">تسجيل صوتي من العميل</p>
                      </div>
                    </div>
                    {currentReview.text && (
                      <p className="text-sm text-white/50 font-light leading-relaxed text-center">
                        &ldquo;{currentReview.text}&rdquo;
                      </p>
                    )}
                  </div>
                )}

                {/* Divider */}
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-gradient-to-l from-[#D4A853]/20 to-transparent" />
                  <div className="w-1.5 h-1.5 rotate-45 bg-[#D4A853]/30" />
                  <div className="flex-1 h-px bg-gradient-to-r from-[#D4A853]/20 to-transparent" />
                </div>

                {/* Customer name */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4A853]/20 to-[#D4A853]/5 border border-[#D4A853]/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-[#D4A853]">
                        {currentReview.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-sm sm:text-base text-white">
                        {currentReview.name}
                      </p>
                      {currentReview.weddingName && (
                        <p className="text-xs text-white/30">{currentReview.weddingName}</p>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-white/20">
                    {new Date(currentReview.createdAt).toLocaleDateString('ar-EG', {
                      year: 'numeric',
                      month: 'long',
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation arrows */}
            {reviews.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#1A1A2E]/80 border border-[#D4A853]/15 flex items-center justify-center text-[#D4A853]/60 hover:text-[#D4A853] hover:border-[#D4A853]/30 hover:bg-[#1A1A2E] transition-all duration-300 backdrop-blur-sm"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <button
                  onClick={next}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#1A1A2E]/80 border border-[#D4A853]/15 flex items-center justify-center text-[#D4A853]/60 hover:text-[#D4A853] hover:border-[#D4A853]/30 hover:bg-[#1A1A2E] transition-all duration-300 backdrop-blur-sm"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          {/* Dots indicator */}
          {reviews.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    stopAudio();
                    setCurrentIndex(i);
                  }}
                  className="transition-all duration-300 rounded-full"
                  style={{
                    width: i === currentIndex ? '24px' : '8px',
                    height: '8px',
                    background: i === currentIndex
                      ? 'linear-gradient(90deg, #D4A853, #E8C874)'
                      : 'rgba(255,255,255,0.15)',
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
