'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Heart,
  ChevronLeft,
  Sparkles,
  Palette,
  UserPlus,
  Share2,
  PenTool,
  Layout,
  Send,
  Eye,
} from 'lucide-react';
import { themes } from '@/lib/themes';
import { useMemo } from 'react';

/* ─── Animation helpers ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ─── Ornament Separator ─── */
function OrnamentDivider({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className || ''}`}>
      <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-[#D4A853]/60 to-transparent" />
      <div className="w-2 h-2 rotate-45 bg-[#D4A853]/60" />
      <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-[#D4A853]/60 to-transparent" />
    </div>
  );
}

/* ─── Gold Particle System ─── */
function GoldParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 8 + 6,
        delay: Math.random() * 5,
        opacity: Math.random() * 0.4 + 0.1,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: '#D4A853',
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [p.opacity, p.opacity * 1.5, p.opacity],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

/* ─── Features data ─── */
const features = [
  {
    icon: Palette,
    title: 'تصميمات فاخرة',
    desc: '5 قوالب مميزة بتصاميم سينمائية تليق بليلة العمر',
  },
  {
    icon: PenTool,
    title: 'تخصيص كامل',
    desc: 'ألوان، صور، موسيقى — كل تفصيلة تحت سيطرتكم',
  },
  {
    icon: UserPlus,
    title: 'تجربة شخصية',
    desc: 'رابط خاص لكل ضيف باسمه — يخلّيه يحس إنه مميز',
  },
  {
    icon: Share2,
    title: 'بطاقات ومشاركة',
    desc: 'تحميل ومشاركة عبر واتساب بضغطة واحدة',
  },
];

/* ─── Steps data ─── */
const steps = [
  {
    icon: PenTool,
    title: 'أنشئ الدعوة',
    desc: 'عبّي بيانات الزفاف',
  },
  {
    icon: Layout,
    title: 'اختار القالب',
    desc: 'اختار التصميم اللي يعجبك',
  },
  {
    icon: Send,
    title: 'شارك الرابط',
    desc: 'ابعت الرابط للضيوف',
  },
];

/* ─── Template data from themes ─── */
const templateList = Object.values(themes);

/* ─── Template Preview Card ─── */
function TemplateCard({ theme, index }: { theme: (typeof templateList)[0]; index: number }) {
  const { colors, previewGradient, labelAr, description, name } = theme;
  const isLightBg = colors.background === '#FAFAFA' || colors.background === '#FFF5F5';

  return (
    <motion.div
      variants={scaleIn}
      custom={index}
      whileHover={{ y: -6, transition: { duration: 0.3, ease: 'easeOut' } }}
      className="group"
    >
      <Link href={`/w/mohamed-fatma?theme=${name}`} className="block">
        <div
          className="relative rounded-2xl overflow-hidden border border-white/10 hover:border-[#D4A853]/40 transition-all duration-500 shadow-lg hover:shadow-xl hover:shadow-[#D4A853]/10"
          style={{ background: previewGradient, aspectRatio: '3/4' }}
        >
          {/* Inner card content */}
          <div className="relative h-full flex flex-col items-center justify-between p-5 sm:p-6">
            {/* Corner ornaments */}
            {[
              'top-3 right-3',
              'top-3 left-3 rotate-90',
              'bottom-3 right-3 -rotate-90',
              'bottom-3 left-3 rotate-180',
            ].map((pos, ci) => (
              <div key={ci} className={`absolute ${pos.split(' ').slice(0, 2).join(' ')} w-7 h-7 ${pos.includes('rotate-90') ? 'rotate-90' : ''} ${pos.includes('-rotate-90') ? '-rotate-90' : ''} ${pos.includes('rotate-180') ? 'rotate-180' : ''}`}>
                <svg viewBox="0 0 30 30" fill="none" className="w-full h-full opacity-25">
                  <path d="M0 0 L30 0 L30 8 L8 8 L8 30 L0 30 Z" fill={colors.primary} />
                </svg>
              </div>
            ))}

            {/* Inner border frame */}
            <div
              className="absolute inset-3 sm:inset-4 rounded-lg border"
              style={{ borderColor: `${colors.primary}20` }}
            />

            {/* Bismallah */}
            <div className="flex flex-col items-center gap-2 pt-2">
              <p
                className="text-xs sm:text-sm font-medium tracking-wider opacity-60"
                style={{ color: colors.primary }}
              >
                بسم الله الرحمن الرحيم
              </p>
              <div className="flex items-center gap-2 w-full max-w-[100px]">
                <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, ${colors.primary}40, transparent)` }} />
                <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: colors.primary, opacity: 0.5 }} />
                <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, ${colors.primary}40, transparent)` }} />
              </div>
            </div>

            {/* Couple names */}
            <div className="flex flex-col items-center gap-3">
              <p className="text-xl sm:text-2xl font-bold" style={{ color: colors.text }}>
                محمد
              </p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-px" style={{ backgroundColor: colors.primary, opacity: 0.4 }} />
                <Heart className="h-4 w-4" style={{ color: colors.primary, fill: colors.primary, opacity: 0.7 }} />
                <div className="w-8 h-px" style={{ backgroundColor: colors.primary, opacity: 0.4 }} />
              </div>
              <p className="text-xl sm:text-2xl font-bold" style={{ color: colors.text }}>
                فاطمة
              </p>
            </div>

            {/* Date & venue */}
            <div className="flex flex-col items-center gap-1 pb-2">
              <div className="flex items-center gap-2 w-full max-w-[80px] mb-2">
                <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, ${colors.primary}30, transparent)` }} />
                <div className="w-1 h-1 rotate-45" style={{ backgroundColor: colors.primary, opacity: 0.3 }} />
                <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, ${colors.primary}30, transparent)` }} />
              </div>
              <p className="text-[10px] sm:text-xs font-light tracking-wider opacity-60" style={{ color: colors.text }}>
                الجمعة ١٥ شعبان ١٤٤٧
              </p>
              <p className="text-[10px] sm:text-xs font-light tracking-wider opacity-50" style={{ color: colors.text }}>
                فندق الريتز كارلتون — جدة
              </p>
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2.5">
                <Eye className="h-4 w-4 text-white" />
                <span className="text-white text-sm font-medium">شاهد المثال</span>
              </div>
            </div>
          </div>
        </div>

        {/* Theme info below card */}
        <div className="mt-3 flex items-center justify-between px-1">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-white">{labelAr}</h3>
            <p className="text-xs text-white/50 leading-relaxed">{description}</p>
          </div>
          <div className="flex gap-1.5">
            {[colors.primary, colors.secondary, colors.accent].map((color, ci) => (
              <div
                key={ci}
                className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border"
                style={{
                  backgroundColor: color,
                  borderColor: isLightBg ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.12)',
                }}
              />
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0D0D1A] text-white overflow-x-hidden" dir="rtl">
      {/* ─── NAVBAR ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0D0D1A]/60 backdrop-blur-xl border-b border-[#D4A853]/8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Heart className="h-5 w-5 text-[#D4A853] fill-[#D4A853] group-hover:scale-110 transition-transform duration-300" />
            <span className="text-xl font-bold text-gold-gradient">قُرب</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/w/mohamed-fatma">
              <Button
                variant="ghost"
                className="text-white/60 hover:text-[#D4A853] hover:bg-[#D4A853]/8 transition-all duration-300 text-xs sm:text-sm font-light"
              >
                شاهد المثال
              </Button>
            </Link>
            <Link href="/admin/create">
              <Button className="btn-wedding text-xs sm:text-sm px-4 sm:px-5 py-2">
                ابدأ الآن
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION — DRAMATIC & CINEMATIC
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D1A] via-[#0F0F24] to-[#0D0D1A]" />

        {/* Geometric pattern overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.015]" viewBox="0 0 400 400">
          <defs>
            <pattern id="heroPattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M30 0L60 30L30 60L0 30Z" stroke="#D4A853" strokeWidth="0.5" fill="none" />
            </pattern>
          </defs>
          <rect width="400" height="400" fill="url(#heroPattern)" />
        </svg>

        {/* Gold particles */}
        <GoldParticles />

        {/* Ambient glow orbs */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full blur-[150px] bg-[#D4A853]/8 top-[10%] right-[5%]"
          animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full blur-[120px] bg-[#D4A853]/5 bottom-[15%] left-[10%]"
          animate={{ y: [0, 15, 0], scale: [1, 1.03, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />

        {/* Slow rotating circle decorations */}
        <motion.div
          className="absolute top-24 right-8 sm:right-16 w-32 sm:w-40 h-32 sm:h-40 border border-[#D4A853]/8 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute bottom-24 left-8 sm:left-16 w-24 sm:w-32 h-24 sm:h-32 border border-[#D4A853]/6 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
        />

        {/* Hero content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-center gap-5"
          >
            {/* Ornamental top */}
            <motion.div variants={fadeUp} custom={0}>
              <OrnamentDivider />
            </motion.div>

            {/* Main brand name — large calligraphy-style */}
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-7xl sm:text-8xl md:text-9xl font-bold tracking-tight text-gold-gradient leading-none"
            >
              قُرب
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-lg sm:text-xl md:text-2xl text-white/80 font-light"
            >
              دعوات زفاف رقمية بلمسة فاخرة
            </motion.p>

            {/* Ornamental divider */}
            <motion.div variants={fadeUp} custom={3}>
              <OrnamentDivider />
            </motion.div>

            {/* Emotional tagline */}
            <motion.p
              variants={fadeUp}
              custom={4}
              className="text-sm sm:text-base md:text-lg text-white/50 font-light max-w-2xl leading-relaxed"
            >
              خلّي دعوة زفافك تكون ذكرى تفضل مع الضيوف للأبد
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              variants={fadeUp}
              custom={5}
              className="flex flex-col sm:flex-row items-center gap-4 mt-4"
            >
              <Link href="/admin/create">
                <Button
                  size="lg"
                  className="btn-wedding text-base sm:text-lg px-8 sm:px-10 py-5 sm:py-6 rounded-xl"
                >
                  ابدأ الآن
                  <ChevronLeft className="mr-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/w/mohamed-fatma">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-[#D4A853]/30 text-[#D4A853] hover:bg-[#D4A853]/8 hover:border-[#D4A853]/50 font-light text-base sm:text-lg px-8 sm:px-10 py-5 sm:py-6 rounded-xl transition-all duration-400"
                >
                  شاهد المثال
                  <Eye className="mr-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0D0D1A] to-transparent" />
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FEATURES SECTION — COMPACT
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative py-16 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D1A] via-[#0F0F20] to-[#0D0D1A]" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="text-center mb-10"
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3"
            >
              <span className="text-gold-gradient">ليه قُرب؟</span>
            </motion.h2>
            <motion.div variants={fadeUp} custom={1}>
              <OrnamentDivider />
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5"
          >
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={scaleIn}
                custom={i}
                whileHover={{ y: -4, transition: { duration: 0.25, ease: 'easeOut' } }}
                className="card-glow group relative rounded-2xl overflow-hidden border border-white/5 hover:border-[#D4A853]/25 transition-all duration-500 bg-[#1A1A2E]/60 backdrop-blur-sm"
              >
                {/* Top gold accent line */}
                <div className="h-[2px] w-full bg-gradient-to-l from-[#D4A853]/0 via-[#D4A853]/50 to-[#D4A853]/0 group-hover:via-[#D4A853]/80 transition-all duration-500" />

                <div className="relative z-10 p-5 sm:p-6 flex items-start gap-4">
                  {/* Icon */}
                  <div className="shrink-0 w-11 h-11 rounded-xl bg-[#D4A853]/10 border border-[#D4A853]/15 flex items-center justify-center group-hover:bg-[#D4A853]/15 group-hover:border-[#D4A853]/25 transition-all duration-400">
                    <f.icon className="h-5 w-5 text-[#D4A853]" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-1">{f.title}</h3>
                    <p className="text-white/50 font-light leading-relaxed text-sm">{f.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          TEMPLATE SHOWCASE — THE KEY SECTION
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative py-16 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D1A] via-[#0A0A18] to-[#0D0D1A]" />

        {/* Center glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#D4A853]/5 blur-[150px] rounded-full" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="text-center mb-10"
          >
            <motion.div variants={fadeUp} custom={0}>
              <div className="inline-flex items-center gap-2 bg-[#D4A853]/8 border border-[#D4A853]/15 rounded-full px-4 py-1.5 mb-4">
                <Sparkles className="h-3.5 w-3.5 text-[#D4A853]" />
                <span className="text-[#D4A853] text-xs font-medium tracking-wider">5 قوالب فاخرة</span>
              </div>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3"
            >
              اختار القالب{' '}
              <span className="text-gold-gradient">اللي يعبر عنك</span>
            </motion.h2>
            <motion.div variants={fadeUp} custom={2}>
              <OrnamentDivider />
            </motion.div>
          </motion.div>

          {/* Template grid: 2 cols mobile, 3 cols tablet, 5 cols desktop */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5"
          >
            {templateList.map((theme, i) => (
              <TemplateCard key={theme.name} theme={theme} index={i} />
            ))}
          </motion.div>

          {/* CTA under templates */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mt-10"
          >
            <Link href="/w/mohamed-fatma">
              <Button
                variant="outline"
                size="lg"
                className="border-[#D4A853]/30 text-[#D4A853] hover:bg-[#D4A853]/8 hover:border-[#D4A853]/50 font-light text-sm sm:text-base px-8 py-5 rounded-xl transition-all duration-400"
              >
                شاهد مثال حي للقالب
                <Eye className="mr-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          HOW IT WORKS — 3 SIMPLE STEPS
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative py-16 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D1A] via-[#0F0F20] to-[#0D0D1A]" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="text-center mb-10"
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3"
            >
              <span className="text-gold-gradient">3 خطوات بس</span>
            </motion.h2>
            <motion.div variants={fadeUp} custom={1}>
              <OrnamentDivider />
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="relative grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
          >
            {/* Connecting line — desktop only */}
            <div className="hidden md:block absolute top-[40px] left-[16.67%] right-[16.67%] h-[2px]">
              <div className="w-full h-full bg-gradient-to-l from-[#D4A853]/20 via-[#D4A853]/10 to-[#D4A853]/20" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rotate-45 bg-[#D4A853]/30 border border-[#D4A853]/50" />
              <div className="absolute top-1/2 left-[25%] -translate-x-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-[#D4A853]/20" />
              <div className="absolute top-1/2 left-[75%] -translate-x-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-[#D4A853]/20" />
            </div>

            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                variants={fadeUp}
                custom={i}
                className="relative flex flex-col items-center text-center"
              >
                {/* Step number */}
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#D4A853] text-[#0D0D1A] font-bold flex items-center justify-center text-xs z-10 shadow-lg shadow-[#D4A853]/20">
                  {i + 1}
                </div>

                {/* Icon circle */}
                <div className="w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] rounded-full bg-[#1A1A2E]/80 border-2 border-[#D4A853]/25 flex items-center justify-center mb-5">
                  <step.icon className="h-7 w-7 sm:h-8 sm:w-8 text-[#D4A853]" />
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5">{step.title}</h3>
                <p className="text-white/50 font-light leading-relaxed text-sm sm:text-base">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CTA SECTION — EMOTIONAL
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative py-16 sm:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D1A] via-[#1A1A2E]/30 to-[#0D0D1A]" />

        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-[#D4A853]/8 blur-[130px] rounded-full" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
          className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center"
        >
          <motion.div variants={fadeUp} custom={0}>
            <OrnamentDivider />
          </motion.div>

          <motion.h2
            variants={fadeUp}
            custom={1}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 mt-5 leading-[1.2]"
          >
            <span className="text-gold-gradient">جاهز تبدأ؟</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-base sm:text-lg text-white/40 font-light mb-8 max-w-xl mx-auto leading-relaxed"
          >
            أنشئ دعوة زفافك الرقمية في دقائق
          </motion.p>

          <motion.div variants={fadeUp} custom={3} className="flex flex-col items-center gap-4">
            <Link href="/admin/create">
              <Button
                size="lg"
                className="btn-wedding text-lg px-10 py-6 rounded-xl"
              >
                ابدأ الآن
                <ChevronLeft className="mr-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} custom={4} className="mt-8">
            <OrnamentDivider />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════ */}
      <footer className="relative mt-auto">
        {/* Top border */}
        <div className="h-[2px] bg-gradient-to-l from-transparent via-[#D4A853]/25 to-transparent" />
        <div className="flex justify-center -mt-[5px]">
          <div className="w-2.5 h-2.5 rotate-45 bg-[#D4A853]/25 border border-[#D4A853]/40" />
        </div>

        <div className="bg-[#0D0D1A] pt-8 pb-6">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col items-center gap-5">
              {/* Brand */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-[#D4A853] fill-[#D4A853]" />
                  <span className="font-bold text-gold-gradient text-lg">قُرب</span>
                </div>
                <p className="text-white/30 text-xs font-light">
                  منصة دعوات الزفاف الرقمية
                </p>
              </div>

              {/* Links */}
              <div className="flex items-center gap-6">
                <Link
                  href="/admin/create"
                  className="text-white/40 hover:text-[#D4A853] text-xs sm:text-sm font-light transition-colors duration-300"
                >
                  إنشاء دعوة
                </Link>
                <div className="w-1 h-1 rounded-full bg-white/15" />
                <Link
                  href="/client/login"
                  className="text-white/40 hover:text-[#D4A853] text-xs sm:text-sm font-light transition-colors duration-300"
                >
                  دخول العملاء
                </Link>
              </div>

              {/* Bottom line */}
              <div className="h-px w-full max-w-xs bg-gradient-to-l from-transparent via-white/10 to-transparent" />

              <p className="text-white/20 text-[10px] font-light">
                © {new Date().getFullYear()} قُرب — جميع الحقوق محفوظة
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
