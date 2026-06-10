'use client';

import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef, useState, useCallback } from 'react';

gsap.registerPlugin(ScrollTrigger);

import type { Wedding, ThemeColors, ThemeConfig } from '@/types/wedding';
import { getWeddingColors } from '@/lib/wedding-utils';
import { getTheme } from '@/lib/themes';

import dynamic from 'next/dynamic';
import Hero from '@/components/wedding/Hero';
import GuestWelcome from '@/components/wedding/GuestWelcome';
import Countdown from '@/components/wedding/Countdown';
import WeddingDetails from '@/components/wedding/WeddingDetails';
import Venue from '@/components/wedding/Venue';
import Gallery from '@/components/wedding/Gallery';
import RsvpSection from '@/components/wedding/RsvpSection';
import MusicPlayer, { MusicPlayerHandle } from '@/components/wedding/MusicPlayer';
import WeddingFooter from '@/components/wedding/WeddingFooter';
import InvitationCard from '@/components/wedding/InvitationCard';
import AddToCalendar from '@/components/wedding/AddToCalendar';

// Dynamic import WelcomeScreen to avoid SSR hydration mismatch with animated particles
const WelcomeScreen = dynamic(() => import('@/components/wedding/WelcomeScreen'), { ssr: false });

interface WeddingPageClientProps {
  wedding: Wedding;
  guestName?: string;
}

// Decorative section divider component - only used between major section groups
function SectionDivider({ colors, ornamentStyle }: { colors: ThemeColors; ornamentStyle: ThemeConfig['ornamentStyle'] }) {
  const isBold = ornamentStyle === 'bold' || ornamentStyle === 'gold';
  const isNone = ornamentStyle === 'none';

  if (isNone) {
    return <div className="py-2 flex items-center justify-center">
      <div className="h-px w-16 sm:w-24" style={{ backgroundColor: colors.primary + '15' }} />
    </div>;
  }

  return (
    <div className="flex items-center justify-center py-2" dir="rtl">
      <div className="flex items-center justify-center gap-4">
        <div
          className="h-px w-12 sm:w-20"
          style={{ backgroundColor: colors.primary + (isBold ? '35' : '20') }}
        />
        <div
          className={`w-2 h-2 rotate-45 ${isBold ? 'w-2.5 h-2.5' : ''}`}
          style={{ backgroundColor: colors.primary + (isBold ? '55' : '40') }}
        />
        <div
          className={`w-3 h-3 rotate-45 ${isBold ? 'w-4 h-4' : ''}`}
          style={{ backgroundColor: colors.primary + (isBold ? '70' : '55') }}
        />
        <div
          className={`w-2 h-2 rotate-45 ${isBold ? 'w-2.5 h-2.5' : ''}`}
          style={{ backgroundColor: colors.primary + (isBold ? '55' : '40') }}
        />
        <div
          className="h-px w-12 sm:w-20"
          style={{ backgroundColor: colors.primary + (isBold ? '35' : '20') }}
        />
      </div>
    </div>
  );
}

// Section reveal animation variants - slower, more graceful
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
  },
};

// Map sectionSpacing to padding classes - significantly reduced
function getSectionPadding(spacing: ThemeConfig['sectionSpacing']): string {
  switch (spacing) {
    case 'compact':
      return 'py-1';
    case 'spacious':
      return 'py-5';
    case 'normal':
    default:
      return 'py-3';
  }
}

export default function WeddingPageClient({ wedding, guestName }: WeddingPageClientProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const musicPlayerRef = useRef<MusicPlayerHandle>(null);
  const colors: ThemeColors = getWeddingColors(wedding);
  const themeConfig: ThemeConfig = getTheme(wedding.theme);
  const galleryImages = Array.isArray(wedding.galleryImages)
    ? wedding.galleryImages
    : [];

  const sectionPadding = getSectionPadding(themeConfig.sectionSpacing);

  // Welcome screen state - show when guest parameter is present
  const [showWelcome, setShowWelcome] = useState(!!guestName);

  // Handle envelope open - start music
  const handleWelcomeOpen = useCallback(() => {
    setShowWelcome(false);
    // Auto-play music after envelope opens (user interaction allows autoplay)
    setTimeout(() => {
      musicPlayerRef.current?.play();
    }, 500);
  }, []);

  // Prevent scrolling when welcome screen is visible
  useEffect(() => {
    if (showWelcome) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showWelcome]);

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
    <>
      {/* Welcome screen overlay for personalized guests */}
      <AnimatePresence>
        {showWelcome && guestName && (
          <WelcomeScreen
            guestName={guestName}
            groomName={wedding.groomName}
            brideName={wedding.brideName}
            colors={colors}
            couplePhoto={wedding.couplePhoto}
            onOpen={handleWelcomeOpen}
          />
        )}
      </AnimatePresence>

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
          fontSize: `${themeConfig.fontScale * 100}%`,
        } as React.CSSProperties}
      >
      {/* 1. Hero Section - Full viewport */}
      <section id="hero" className="parallax-hero">
        <Hero
          wedding={wedding}
          colors={colors}
          heroStyle={themeConfig.heroStyle}
          ornamentStyle={themeConfig.ornamentStyle}
          cornerOrnaments={themeConfig.cornerOrnaments}
          showPattern={themeConfig.showPattern}
          patternType={themeConfig.patternType}
          fontScale={themeConfig.fontScale}
          couplePhoto={wedding.couplePhoto}
        />
      </section>

      {/* Divider: Hero → Details Group */}
      <SectionDivider colors={colors} ornamentStyle={themeConfig.ornamentStyle} />

      {/* 2. Guest Welcome (if guest parameter exists or personalization enabled) */}
      {/* No divider between GuestWelcome and Countdown - same visual group */}
      {(guestName || wedding.enableGuestPersonalization) && (
        <motion.section
          id="welcome"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={sectionVariants}
          className={sectionPadding}
        >
          <GuestWelcome
            guestName={guestName}
            groomName={wedding.groomName}
            brideName={wedding.brideName}
            colors={colors}
            couplePhoto={wedding.couplePhoto}
            guestWelcomeText={wedding.guestWelcomeText}
            guestSubWelcomeText={wedding.guestSubWelcomeText}
          />
        </motion.section>
      )}

      {/* 3. Countdown (if enabled) - grouped with Details, no divider between */}
      {wedding.enableCountdown && (
        <motion.section
          id="countdown"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={sectionVariants}
          className={sectionPadding}
        >
          <Countdown
            targetDate={wedding.weddingDate}
            targetTime={wedding.weddingTime}
            colors={colors}
          />
        </motion.section>
      )}

      {/* 4. Wedding Details - grouped with Countdown & Calendar */}
      <motion.section
        id="details"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={sectionVariants}
        className={sectionPadding}
      >
        <WeddingDetails wedding={wedding} colors={colors} />
      </motion.section>

      {/* 4b. Add To Calendar - grouped with Details, no divider */}
      <motion.section
        id="calendar"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={sectionVariants}
        className={sectionPadding}
      >
        <AddToCalendar
          groomName={wedding.groomName}
          brideName={wedding.brideName}
          weddingDate={wedding.weddingDate}
          weddingTime={wedding.weddingTime}
          venueName={wedding.venueName}
          venueAddress={wedding.venueAddress}
          colors={colors}
        />
      </motion.section>

      {/* Divider: Details Group → Venue */}
      <SectionDivider colors={colors} ornamentStyle={themeConfig.ornamentStyle} />

      {/* 5. Venue */}
      <motion.section
        id="venue"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={sectionVariants}
        className={sectionPadding}
      >
        <Venue wedding={wedding} colors={colors} />
      </motion.section>

      {/* 6. Gallery (if enabled) */}
      {wedding.enableGallery && (
        <>
          {/* Divider: Venue → Gallery */}
          <SectionDivider colors={colors} ornamentStyle={themeConfig.ornamentStyle} />
          <motion.section
            id="gallery"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={sectionVariants}
            className={sectionPadding}
          >
            <Gallery images={galleryImages} colors={colors} />
          </motion.section>
        </>
      )}

      {/* 7. RSVP (if enabled) - grouped with InvitationCard */}
      {wedding.enableRsvp && (
        <>
          {/* Divider: Gallery/Venue → RSVP Group */}
          <SectionDivider colors={colors} ornamentStyle={themeConfig.ornamentStyle} />
          <motion.section
            id="rsvp"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={sectionVariants}
            className={sectionPadding}
          >
            <RsvpSection
              weddingId={wedding.id}
              guestName={guestName}
              colors={colors}
              enabled={wedding.enableRsvp}
              rsvpTitle={wedding.rsvpTitle}
              rsvpAttendingText={wedding.rsvpAttendingText}
              rsvpNotAttendingText={wedding.rsvpNotAttendingText}
            />
          </motion.section>
        </>
      )}

      {/* 8. Invitation Card - grouped with RSVP, no divider */}
      <motion.section
        id="downloads"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={sectionVariants}
        className={sectionPadding}
      >
        <InvitationCard wedding={wedding} colors={colors} slug={wedding.slug} couplePhoto={wedding.couplePhoto} />
      </motion.section>

      {/* Divider: RSVP Group → Footer */}
      <SectionDivider colors={colors} ornamentStyle={themeConfig.ornamentStyle} />

      {/* 9. Footer */}
      <motion.section
        id="footer"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-20px' }}
        variants={sectionVariants}
        className={sectionPadding}
      >
        <WeddingFooter
          groomName={wedding.groomName}
          brideName={wedding.brideName}
          colors={colors}
        />
      </motion.section>

      {/* 10. Floating Music Player (if enabled) */}
      {wedding.enableMusic && (
        <MusicPlayer
          ref={musicPlayerRef}
          musicUrl={wedding.backgroundMusicUrl || '/audio/default-music.mp3'}
          colors={colors}
        />
      )}
      </div>
    </>
  );
}
