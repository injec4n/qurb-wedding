'use client';

import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

import type { Wedding, ThemeColors } from '@/types/wedding';
import { getWeddingColors } from '@/lib/wedding-utils';

import Hero from '@/components/wedding/Hero';
import GuestWelcome from '@/components/wedding/GuestWelcome';
import Countdown from '@/components/wedding/Countdown';
import WeddingDetails from '@/components/wedding/WeddingDetails';
import Venue from '@/components/wedding/Venue';
import Gallery from '@/components/wedding/Gallery';
import RsvpSection from '@/components/wedding/RsvpSection';
import MusicPlayer from '@/components/wedding/MusicPlayer';
import WeddingFooter from '@/components/wedding/WeddingFooter';
import InvitationCard from '@/components/wedding/InvitationCard';
import InstagramStory from '@/components/wedding/InstagramStory';

interface WeddingPageClientProps {
  wedding: Wedding;
  guestName?: string;
}

// Decorative section divider component
function SectionDivider({ colors }: { colors: ThemeColors }) {
  return (
    <div className="flex items-center justify-center py-6" dir="rtl">
      <div className="flex items-center justify-center gap-4">
        <div className="h-px w-12 sm:w-20" style={{ backgroundColor: colors.primary + '20' }} />
        <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary + '40' }} />
        <div className="w-3 h-3 rotate-45" style={{ backgroundColor: colors.primary + '55' }} />
        <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary + '40' }} />
        <div className="h-px w-12 sm:w-20" style={{ backgroundColor: colors.primary + '20' }} />
      </div>
    </div>
  );
}

// Section reveal animation variants - slower, more graceful
const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export default function WeddingPageClient({ wedding, guestName }: WeddingPageClientProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const colors: ThemeColors = getWeddingColors(wedding);
  const galleryImages = Array.isArray(wedding.galleryImages)
    ? wedding.galleryImages
    : [];

  // GSAP parallax effect for the hero only
  useEffect(() => {
    if (!wrapperRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to('.parallax-hero', {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: '.parallax-hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={wrapperRef}
      dir="rtl"
      className="min-h-screen smooth-scroll"
      style={{
        '--color-primary': colors.primary,
        '--color-secondary': colors.secondary,
        '--color-background': colors.background,
        '--color-text': colors.text,
        '--color-button': colors.button,
        '--color-accent': colors.accent,
        backgroundColor: colors.background,
        color: colors.text,
      } as React.CSSProperties}
    >
      {/* 1. Hero Section - Full viewport */}
      <section id="hero" className="parallax-hero">
        <Hero wedding={wedding} colors={colors} />
      </section>

      <SectionDivider colors={colors} />

      {/* 2. Guest Welcome (if guest parameter exists or personalization enabled) */}
      {(guestName || wedding.enableGuestPersonalization) && (
        <motion.section
          id="welcome"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={sectionVariants}
          className="py-4"
        >
          <GuestWelcome
            guestName={guestName}
            groomName={wedding.groomName}
            brideName={wedding.brideName}
            colors={colors}
          />
        </motion.section>
      )}

      {/* 3. Countdown (if enabled) */}
      {wedding.enableCountdown && (
        <motion.section
          id="countdown"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={sectionVariants}
          className="py-4"
        >
          <Countdown
            targetDate={wedding.weddingDate}
            targetTime={wedding.weddingTime}
            colors={colors}
          />
        </motion.section>
      )}

      <SectionDivider colors={colors} />

      {/* 4. Wedding Details */}
      <motion.section
        id="details"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={sectionVariants}
        className="py-4"
      >
        <WeddingDetails wedding={wedding} colors={colors} />
      </motion.section>

      <SectionDivider colors={colors} />

      {/* 5. Venue */}
      <motion.section
        id="venue"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={sectionVariants}
        className="py-4"
      >
        <Venue wedding={wedding} colors={colors} />
      </motion.section>

      {/* 6. Gallery (if enabled) */}
      {wedding.enableGallery && (
        <>
          <SectionDivider colors={colors} />
          <motion.section
            id="gallery"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={sectionVariants}
            className="py-4"
          >
            <Gallery images={galleryImages} colors={colors} />
          </motion.section>
        </>
      )}

      {/* 7. RSVP (if enabled) */}
      {wedding.enableRsvp && (
        <>
          <SectionDivider colors={colors} />
          <motion.section
            id="rsvp"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={sectionVariants}
            className="py-4"
          >
            <RsvpSection
              weddingId={wedding.id}
              guestName={guestName}
              colors={colors}
              enabled={wedding.enableRsvp}
            />
          </motion.section>
        </>
      )}

      <SectionDivider colors={colors} />

      {/* 8. Downloadable Invitation Card & Instagram Story */}
      <motion.section
        id="downloads"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={sectionVariants}
        className="py-4"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8 max-w-5xl mx-auto">
          <InvitationCard wedding={wedding} colors={colors} />
          <InstagramStory wedding={wedding} colors={colors} />
        </div>
      </motion.section>

      <SectionDivider colors={colors} />

      {/* 9. Footer */}
      <motion.section
        id="footer"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-20px' }}
        variants={sectionVariants}
        className="py-4"
      >
        <WeddingFooter
          groomName={wedding.groomName}
          brideName={wedding.brideName}
          colors={colors}
        />
      </motion.section>

      {/* 10. Floating Music Player (if enabled and URL provided) */}
      {wedding.enableMusic && wedding.backgroundMusicUrl && (
        <MusicPlayer
          musicUrl={wedding.backgroundMusicUrl}
          colors={colors}
        />
      )}
    </div>
  );
}
