'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Globe,
  Mail,
  Smartphone,
  Camera,
  CheckCircle,
  Timer,
  PenTool,
  Palette,
  Rocket,
  Heart,
  ChevronLeft,
  ArrowLeft,
  Sparkles,
  Star,
  MessageCircle,
  Facebook,
  Eye,
} from 'lucide-react';

/* ─── Animation helpers ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.14, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ─── Theme data with full color objects ─── */
const themeCards = [
  {
    name: 'ذهبي كلاسيكي',
    slug: 'classic-gold',
    description: 'أناقة ذهبية كلاسيكية',
    colors: { primary: '#D4A853', secondary: '#1A1A2E', background: '#0D0D1A', text: '#FFFFFF', button: '#D4A853', accent: '#E8C874' },
  },
  {
    name: 'داكن عصري',
    slug: 'modern-dark',
    description: 'عصرية وفخامة',
    colors: { primary: '#C0C0C0', secondary: '#1A1A1A', background: '#0A0A0A', text: '#E0E0E0', button: '#C0C0C0', accent: '#FFFFFF' },
  },
  {
    name: 'أبيض أنيق',
    slug: 'elegant-white',
    description: 'نقاء وأناقة',
    colors: { primary: '#8B7355', secondary: '#F5F0EB', background: '#FFFFFF', text: '#2C2C2C', button: '#8B7355', accent: '#A0926B' },
  },
  {
    name: 'أزرق ملكي',
    slug: 'royal-blue',
    description: 'فخامة ملكية',
    colors: { primary: '#C9A84C', secondary: '#1B2A4A', background: '#0F1B33', text: '#F0E6D3', button: '#C9A84C', accent: '#E0C878' },
  },
  {
    name: 'ذهبي وردي',
    slug: 'rose-gold',
    description: 'رمانسية ودافئة',
    colors: { primary: '#B76E79', secondary: '#2D1F22', background: '#1A1215', text: '#F5E6E8', button: '#B76E79', accent: '#D4A0A7' },
  },
  {
    name: 'عربي تقليدي',
    slug: 'traditional-arabic',
    description: 'تراث وأصالة',
    colors: { primary: '#2E7D32', secondary: '#1B5E20', background: '#0D3B0F', text: '#FFFFFF', button: '#2E7D32', accent: '#4CAF50' },
  },
];

/* ─── Features data ─── */
const features = [
  {
    icon: Globe,
    title: 'موقع زفاف استثنائي',
    desc: 'موقع ويب يحمل تفاصيل قصتكم، بتصميم يليق ببهجة المناسبة',
  },
  {
    icon: Mail,
    title: 'دعوة تحمل اسم كل ضيف',
    desc: 'رسالة ترحيب شخصية تُشعر كل ضيف بأنه مميز في فرحتكم',
  },
  {
    icon: Smartphone,
    title: 'بطاقة واتساب فاخرة',
    desc: 'بطاقة رقمية أنيقة تصل لضيوفكم بلمسة واحدة عبر واتساب',
  },
  {
    icon: Camera,
    title: 'ستوري إنستاجرام مخصصة',
    desc: 'تصميم ستوري يعكس فرحتكم ويُشارك العالم لحظتكم السعيدة',
  },
  {
    icon: CheckCircle,
    title: 'تأكيد حضور سلس',
    desc: 'نظام RSVP متكامل يُسهّل عليكم متابعة حضور أحبتكم',
  },
  {
    icon: Timer,
    title: 'عداد تنازلي لليلة العمر',
    desc: 'عداد حي يُضيف لمسة شوق وترقب لأيامكم المتبقية',
  },
];

/* ─── Steps data ─── */
const steps = [
  {
    icon: PenTool,
    title: 'سجّلوا بياناتكم',
    desc: 'أدخلوا تفاصيل ليلة العمر واختاروا القالب الذي يعكس ذوقكم',
  },
  {
    icon: Palette,
    title: 'صمّموا دعوتكم',
    desc: 'اختاروا الألوان والزخارف وأضيفوا صوركم لتبدو الدعوة كما تحلمون',
  },
  {
    icon: Rocket,
    title: 'شاركوا فرحتكم',
    desc: 'أرسلوا الدعوات المخصصة لأحبتكم وانتظروهم في ليلة لا تُنسى',
  },
];

/* ─── Testimonials data ─── */
const testimonials = [
  {
    name: 'أحمد و نورة',
    text: 'تجربة مذهلة! الدعوات كانت أنيقة جداً وأعجب جميع ضيوفنا. التخصيص كان سهلاً والنتيجة فاقت توقعاتنا. شكراً قُرب!',
    rating: 5,
  },
  {
    name: 'خالد و سارة',
    text: 'من أفضل القرارات التي اتخذناها لتخطيط الزفاف. الدعوات الرقمية وفرت علينا الكثير من الوقت والجهد بتصميم احترافي.',
    rating: 5,
  },
  {
    name: 'عمر و لينا',
    text: 'أحببنا كيف استطاع كل ضيف أن يشعر بالخصوصية من خلال دعوته الشخصية. تصميم راقٍ وتجربة لا تُنسى!',
    rating: 5,
  },
];

/* ─── Floating decoration component ─── */
function FloatingOrb({
  className,
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl ${className}`}
      animate={{
        y: [0, -15, 0],
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    />
  );
}

/* ─── Decorative Islamic geometric pattern SVG ─── */
function GeometricPattern({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <pattern id="geo" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M20 0L40 20L20 40L0 20Z" stroke="currentColor" strokeWidth="0.5" fill="none" />
        <circle cx="20" cy="20" r="6" stroke="currentColor" strokeWidth="0.5" fill="none" />
      </pattern>
      <rect width="200" height="200" fill="url(#geo)" />
    </svg>
  );
}

/* ─── Ornament Separator Component ─── */
function OrnamentSeparator({ className }: { className?: string }) {
  return (
    <div className={`ornament-separator ${className || ''}`}>
      <div className="diamond" />
    </div>
  );
}

/* ─── Cinematic Invitation Preview Card ─── */
function CinematicPreviewCard({
  theme,
  index,
}: {
  theme: (typeof themeCards)[0];
  index: number;
}) {
  const { colors } = theme;
  const isLightBg = colors.background === '#FFFFFF' || colors.background === '#F5F0EB';

  return (
    <motion.div
      variants={scaleIn}
      custom={index}
      whileHover={{ y: -8, transition: { duration: 0.3, ease: 'easeOut' } }}
      className="card-glow group"
    >
      <Link href="/admin/create" className="block">
        {/* 3:4 portrait card */}
        <div
          className="relative rounded-2xl overflow-hidden border border-white/10 hover:border-[var(--wedding-gold)]/40 transition-all duration-500 shadow-lg hover:shadow-xl hover:shadow-[var(--wedding-gold)]/10"
          style={{ backgroundColor: colors.background, aspectRatio: '3/4' }}
        >
          {/* Inner content */}
          <div className="relative h-full flex flex-col items-center justify-between p-5 sm:p-6">
            {/* Corner ornaments */}
            <div className="absolute top-3 right-3 w-7 h-7">
              <svg viewBox="0 0 30 30" fill="none" className="w-full h-full opacity-25">
                <path d="M0 0 L30 0 L30 8 L8 8 L8 30 L0 30 Z" fill={colors.primary} />
              </svg>
            </div>
            <div className="absolute top-3 left-3 w-7 h-7 rotate-90">
              <svg viewBox="0 0 30 30" fill="none" className="w-full h-full opacity-25">
                <path d="M0 0 L30 0 L30 8 L8 8 L8 30 L0 30 Z" fill={colors.primary} />
              </svg>
            </div>
            <div className="absolute bottom-3 right-3 w-7 h-7 -rotate-90">
              <svg viewBox="0 0 30 30" fill="none" className="w-full h-full opacity-25">
                <path d="M0 0 L30 0 L30 8 L8 8 L8 30 L0 30 Z" fill={colors.primary} />
              </svg>
            </div>
            <div className="absolute bottom-3 left-3 w-7 h-7 rotate-180">
              <svg viewBox="0 0 30 30" fill="none" className="w-full h-full opacity-25">
                <path d="M0 0 L30 0 L30 8 L8 8 L8 30 L0 30 Z" fill={colors.primary} />
              </svg>
            </div>

            {/* Elegant border frame */}
            <div
              className="absolute inset-3 sm:inset-4 rounded-lg border"
              style={{ borderColor: `${colors.primary}20` }}
            />

            {/* Top: Bismallah */}
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

            {/* Center: Couple names with decorative divider */}
            <div className="flex flex-col items-center gap-3">
              <p
                className="text-xl sm:text-2xl font-bold leading-relaxed"
                style={{ color: colors.text }}
              >
                محمد
              </p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-8 h-px" style={{ backgroundColor: colors.primary, opacity: 0.4 }} />
                <Heart
                  className="h-4 w-4"
                  style={{ color: colors.primary, fill: colors.primary, opacity: 0.7 }}
                />
                <div className="w-8 h-px" style={{ backgroundColor: colors.primary, opacity: 0.4 }} />
              </div>
              <p
                className="text-xl sm:text-2xl font-bold leading-relaxed"
                style={{ color: colors.text }}
              >
                فاطمة
              </p>
            </div>

            {/* Bottom: Date and venue */}
            <div className="flex flex-col items-center gap-1 pb-2">
              <div className="flex items-center gap-2 w-full max-w-[80px] mb-2">
                <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, ${colors.primary}30, transparent)` }} />
                <div className="w-1 h-1 rotate-45" style={{ backgroundColor: colors.primary, opacity: 0.3 }} />
                <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, ${colors.primary}30, transparent)` }} />
              </div>
              <p
                className="text-[10px] sm:text-xs font-light tracking-wider opacity-60"
                style={{ color: colors.text }}
              >
                الجمعة ١٥ شعبان ١٤٤٧
              </p>
              <p
                className="text-[10px] sm:text-xs font-light tracking-wider opacity-50"
                style={{ color: colors.text }}
              >
                فندق الريتز كارلتون — جدة
              </p>
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                <Eye className="h-4 w-4 text-white" />
                <span className="text-white text-sm font-medium">عرض القالب</span>
              </div>
            </div>
          </div>
        </div>

        {/* Theme info below the card */}
        <div className="mt-4 flex items-center justify-between px-1">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-white">
              {theme.name}
            </h3>
            <p className="text-xs text-white/50">
              {theme.description}
            </p>
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

/* ─── Star Rating Component ─── */
function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          className="h-3.5 w-3.5 fill-[var(--wedding-gold)] text-[var(--wedding-gold)]"
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--wedding-deep)] text-white overflow-x-hidden" dir="rtl">
      {/* ─── NAVBAR ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--wedding-deep)]/70 backdrop-blur-xl border-b border-[var(--wedding-gold)]/8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Heart className="h-5 w-5 text-[var(--wedding-gold)] fill-[var(--wedding-gold)] group-hover:scale-110 transition-transform duration-300" />
            <span className="text-xl font-bold text-gold-gradient">قُرب</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/client/login">
              <Button
                variant="ghost"
                className="text-white/60 hover:text-[var(--wedding-gold)] hover:bg-[var(--wedding-gold)]/8 transition-all duration-300 text-xs sm:text-sm font-light"
              >
                دخول العملاء
              </Button>
            </Link>
            <Link href="/w/mohamed-fatma">
              <Button
                variant="ghost"
                className="text-white/60 hover:text-[var(--wedding-gold)] hover:bg-[var(--wedding-gold)]/8 transition-all duration-300 text-xs sm:text-sm font-light"
              >
                شاهد مثال
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

      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--wedding-deep)] via-[var(--wedding-charcoal)]/40 to-[var(--wedding-deep)]" />
        <GeometricPattern className="absolute inset-0 w-full h-full text-[var(--wedding-gold)] opacity-[0.02]" />

        {/* Subtle floating orbs */}
        <FloatingOrb className="w-80 h-80 bg-[var(--wedding-gold)]/10 top-[8%] right-[8%]" delay={0} />
        <FloatingOrb className="w-[500px] h-[500px] bg-[var(--wedding-charcoal)]/30 bottom-[15%] left-[3%]" delay={3} />
        <FloatingOrb className="w-64 h-64 bg-[var(--wedding-gold-light)]/8 top-[55%] right-[25%]" delay={5} />

        {/* Subtle decorative circles */}
        <motion.div
          className="absolute top-28 right-12 w-36 h-36 border border-[var(--wedding-gold)]/10 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute bottom-36 left-16 w-28 h-28 border border-[var(--wedding-gold)]/8 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        />

        {/* Hero content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-center gap-6"
          >
            {/* Bismallah */}
            <motion.div variants={fadeUp} custom={0} className="flex flex-col items-center gap-3">
              <p className="text-[var(--wedding-gold)]/70 text-sm sm:text-base font-light tracking-[0.15em]">
                بسم الله الرحمن الرحيم
              </p>
              <div className="ornament-separator w-40">
                <div className="diamond" />
              </div>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.15] tracking-tight"
            >
              <span className="text-white">أنشئ دعوة</span>
              <br />
              <span className="text-gold-gradient">زفافك الأنيقة</span>
              <br />
              <span className="text-white/90">في لحظات</span>
            </motion.h1>

            {/* Romantic tagline */}
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-sm sm:text-base md:text-lg text-white/50 font-light max-w-2xl leading-relaxed"
            >
              كل قصة حب تستحق دعوة استثنائية
            </motion.p>

            {/* Sub description */}
            <motion.p
              variants={fadeUp}
              custom={3}
              className="text-xs sm:text-sm text-white/40 font-light max-w-xl leading-relaxed"
            >
              منصة فاخرة لدعوات الزفاف الرقمية — تصميم يليق بليلة العمر،
              ومشاركة تصل للقلب
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              variants={fadeUp}
              custom={4}
              className="flex flex-col sm:flex-row items-center gap-4 mt-4"
            >
              <Link href="/admin/create">
                <Button
                  size="lg"
                  className="btn-wedding text-base px-8 py-6 rounded-xl"
                >
                  ابدأ رحلتكم
                  <ChevronLeft className="mr-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/w/mohamed-fatma">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-[var(--wedding-gold)]/30 text-[var(--wedding-gold)] hover:bg-[var(--wedding-gold)]/8 hover:border-[var(--wedding-gold)]/50 font-light text-base px-8 py-6 rounded-xl transition-all duration-400"
                >
                  شاهد مثال حي
                  <ArrowLeft className="mr-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-[var(--wedding-gold)]/40 text-xs font-light tracking-wider">اكتشف المزيد</span>
              <div className="w-5 h-8 border border-[var(--wedding-gold)]/30 rounded-full flex items-start justify-center p-1">
                <motion.div
                  className="w-1 h-1.5 bg-[var(--wedding-gold)]/60 rounded-full"
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FEATURES SECTION ─── */}
      <section id="features" className="relative py-16 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--wedding-deep)] via-[#0F0F20] to-[var(--wedding-deep)]" />
        <GeometricPattern className="absolute inset-0 w-full h-full text-[var(--wedding-gold)] opacity-[0.015]" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-10"
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            >
              كل ما تحلمون به{' '}
              <span className="text-gold-gradient">لليلة العمر</span>
            </motion.h2>
            <motion.div variants={fadeUp} custom={1}>
              <OrnamentSeparator className="max-w-xs mx-auto" />
            </motion.div>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-white/40 font-light text-sm sm:text-base mt-4 max-w-lg mx-auto"
            >
              أدوات صُممت لتجعل دعوتكم ذكرى تُحفظ
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={scaleIn}
                custom={i}
                whileHover={{ y: -6, transition: { duration: 0.3, ease: 'easeOut' } }}
                className="card-glow group relative rounded-2xl overflow-hidden border border-white/5 hover:border-[var(--wedding-gold)]/25 transition-all duration-500 bg-[var(--wedding-charcoal)]/60 backdrop-blur-sm"
              >
                {/* Gold accent line at top */}
                <div className="h-[2px] w-full bg-gradient-to-l from-[var(--wedding-gold)]/0 via-[var(--wedding-gold)]/60 to-[var(--wedding-gold)]/0 group-hover:via-[var(--wedding-gold)]/90 transition-all duration-500" />

                <div className="relative z-10 p-4 sm:p-6">
                  {/* Icon */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[var(--wedding-gold)]/10 border border-[var(--wedding-gold)]/15 flex items-center justify-center mb-4 group-hover:bg-[var(--wedding-gold)]/15 group-hover:border-[var(--wedding-gold)]/25 transition-all duration-400">
                    <f.icon className="h-5 w-5 text-[var(--wedding-gold)]" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-white/50 font-light leading-relaxed text-sm sm:text-base">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── THEMES PREVIEW SECTION ─── */}
      <section id="themes" className="relative py-16 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--wedding-deep)] via-[#0A0A18] to-[var(--wedding-deep)]" />

        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[var(--wedding-gold)]/5 blur-[150px] rounded-full" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-10"
          >
            <motion.div variants={fadeUp} custom={0}>
              <div className="inline-flex items-center gap-2 bg-[var(--wedding-gold)]/8 border border-[var(--wedding-gold)]/15 rounded-full px-4 py-1.5 mb-4">
                <Sparkles className="h-3.5 w-3.5 text-[var(--wedding-gold)]" />
                <span className="text-[var(--wedding-gold)] text-xs font-medium tracking-wider">تصاميم فاخرة</span>
              </div>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            >
              قوالب تليق{' '}
              <span className="text-gold-gradient">بليلة العمر</span>
            </motion.h2>
            <motion.div variants={fadeUp} custom={2}>
              <OrnamentSeparator className="max-w-xs mx-auto" />
            </motion.div>
            <motion.p
              variants={fadeUp}
              custom={3}
              className="text-white/40 font-light text-sm sm:text-base mt-4 max-w-lg mx-auto"
            >
              كل قالب حُبك بعناية ليكون إطاراً يليق بأجمل لحظاتكم
            </motion.p>
          </motion.div>

          {/* Grid layout: 2 cols mobile, 3 cols desktop */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {themeCards.map((theme, i) => (
              <CinematicPreviewCard key={theme.slug} theme={theme} index={i} />
            ))}
          </motion.div>

          {/* CTA under themes */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mt-10"
          >
            <Link href="/admin/create">
              <Button
                size="lg"
                className="btn-wedding text-sm sm:text-base px-8 py-5 rounded-xl"
              >
                ابدأ بتصميم دعوتكم الآن
                <ChevronLeft className="mr-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── HOW IT WORKS SECTION ─── */}
      <section id="how-it-works" className="relative py-16 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--wedding-deep)] via-[#0F0F20] to-[var(--wedding-deep)]" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-10"
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            >
              ثلاث خطوات نحو{' '}
              <span className="text-gold-gradient">دعوة أحلامكم</span>
            </motion.h2>
            <motion.div variants={fadeUp} custom={1}>
              <OrnamentSeparator className="max-w-xs mx-auto" />
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="relative grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-6"
          >
            {/* Connecting line with diamond ornaments - desktop only */}
            <div className="hidden md:block absolute top-[44px] left-[16.67%] right-[16.67%] h-[2px]">
              <div className="w-full h-full bg-gradient-to-l from-[var(--wedding-gold)]/20 via-[var(--wedding-gold)]/10 to-[var(--wedding-gold)]/20" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rotate-45 bg-[var(--wedding-gold)]/30 border border-[var(--wedding-gold)]/50" />
              <div className="absolute top-1/2 left-[25%] -translate-x-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-[var(--wedding-gold)]/20" />
              <div className="absolute top-1/2 left-[75%] -translate-x-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-[var(--wedding-gold)]/20" />
            </div>

            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                variants={fadeUp}
                custom={i}
                className="relative flex flex-col items-center text-center"
              >
                {/* Step number badge */}
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[var(--wedding-gold)] text-[var(--wedding-deep)] font-bold flex items-center justify-center text-xs z-10 shadow-lg shadow-[var(--wedding-gold)]/20">
                  {i + 1}
                </div>

                {/* Icon circle with gold border */}
                <div className="w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] rounded-full bg-[var(--wedding-charcoal)]/80 border-2 border-[var(--wedding-gold)]/25 flex items-center justify-center mb-5 group-hover:border-[var(--wedding-gold)]/50 transition-all duration-400">
                  <step.icon className="h-7 w-7 sm:h-8 sm:w-8 text-[var(--wedding-gold)]" />
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-white/50 font-light leading-relaxed text-sm sm:text-base max-w-[280px]">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── TESTIMONIALS SECTION ─── */}
      <section id="testimonials" className="relative py-16 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--wedding-deep)] via-[#0A0A18] to-[var(--wedding-deep)]" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-10"
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            >
              ماذا قال{' '}
              <span className="text-gold-gradient">عملاؤنا</span>
            </motion.h2>
            <motion.div variants={fadeUp} custom={1}>
              <OrnamentSeparator className="max-w-xs mx-auto" />
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6"
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                variants={scaleIn}
                custom={i}
                className="relative rounded-2xl overflow-hidden border border-[var(--wedding-gold)]/15 bg-[var(--wedding-charcoal)]/80 backdrop-blur-sm p-5 sm:p-6"
              >
                {/* Gold accent at top */}
                <div className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-l from-[var(--wedding-gold)]/0 via-[var(--wedding-gold)]/50 to-[var(--wedding-gold)]/0" />

                {/* Stars */}
                <div className="mb-4">
                  <StarRating count={t.rating} />
                </div>

                {/* Review text */}
                <p className="text-white/70 font-light leading-relaxed text-sm sm:text-base mb-5">
                  &ldquo;{t.text}&rdquo;
                </p>

                {/* Couple name */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[var(--wedding-gold)]/15 border border-[var(--wedding-gold)]/25 flex items-center justify-center">
                    <Heart className="h-3.5 w-3.5 text-[var(--wedding-gold)] fill-[var(--wedding-gold)]" />
                  </div>
                  <span className="text-sm font-bold text-[var(--wedding-gold)]">{t.name}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── CTA SECTION ─── */}
      <section id="cta" className="relative py-16 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--wedding-deep)] via-[var(--wedding-charcoal)]/30 to-[var(--wedding-deep)]" />
        <GeometricPattern className="absolute inset-0 w-full h-full text-[var(--wedding-gold)] opacity-[0.02]" />

        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-[var(--wedding-gold)]/8 blur-[130px] rounded-full" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center"
        >
          {/* Decorative top ornament */}
          <motion.div variants={fadeUp} custom={0} className="flex justify-center mb-6">
            <OrnamentSeparator className="max-w-xs" />
          </motion.div>

          <motion.h2
            variants={fadeUp}
            custom={1}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-[1.2]"
          >
            ليلة عمركم{' '}
            <span className="text-gold-gradient">تستحق الأجمل</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-base sm:text-lg text-white/40 font-light mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            دعونا نساعدكم في صنع لحظةٍ تبقى في الذاكرة
          </motion.p>

          <motion.div variants={fadeUp} custom={3} className="flex flex-col items-center gap-4">
            <Link href="/admin/create">
              <Button
                size="lg"
                className="btn-wedding text-lg px-10 py-6 rounded-xl"
              >
                ابدأوا رحلتكم الآن
                <ChevronLeft className="mr-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="text-white/25 text-xs font-light">ابدأوا في لحظات — بدون تعقيدات</p>
          </motion.div>

          {/* Decorative bottom ornament */}
          <motion.div variants={fadeUp} custom={4} className="flex justify-center mt-8">
            <OrnamentSeparator className="max-w-xs" />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── SOCIAL MEDIA / CONTACT SECTION ─── */}
      <section id="contact" className="relative py-16 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--wedding-deep)] via-[#0F0F20] to-[var(--wedding-deep)]" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-10"
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            >
              <span className="text-gold-gradient">تواصل معنا</span>
            </motion.h2>
            <motion.div variants={fadeUp} custom={1}>
              <OrnamentSeparator className="max-w-xs mx-auto" />
            </motion.div>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-white/40 font-light text-sm sm:text-base mt-4 max-w-md mx-auto"
            >
              نحن هنا لمساعدتكم في كل خطوة
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
          >
            {/* WhatsApp */}
            <motion.a
              href="https://wa.me/201000000000"
              target="_blank"
              rel="noopener noreferrer"
              variants={scaleIn}
              custom={0}
              whileHover={{ y: -6, transition: { duration: 0.3, ease: 'easeOut' } }}
              className="card-glow group relative rounded-2xl overflow-hidden border border-[#25D366]/20 hover:border-[#25D366]/40 transition-all duration-500 bg-[#25D366]/5 backdrop-blur-sm p-6 flex flex-col items-center gap-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#25D366]/15 border border-[#25D366]/25 flex items-center justify-center group-hover:bg-[#25D366]/25 transition-all duration-400">
                <MessageCircle className="h-6 w-6 text-[#25D366]" />
              </div>
              <div className="text-center">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1">واتساب</h3>
                <p className="text-white/50 font-light text-xs sm:text-sm">تحدثوا معنا مباشرة</p>
              </div>
            </motion.a>

            {/* Instagram */}
            <motion.a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              variants={scaleIn}
              custom={1}
              whileHover={{ y: -6, transition: { duration: 0.3, ease: 'easeOut' } }}
              className="card-glow group relative rounded-2xl overflow-hidden border border-[#E1306C]/20 hover:border-[#E1306C]/40 transition-all duration-500 bg-gradient-to-br from-[#E1306C]/5 via-[#833AB4]/5 to-[#F77737]/5 backdrop-blur-sm p-6 flex flex-col items-center gap-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E1306C]/15 via-[#833AB4]/15 to-[#F77737]/15 border border-[#E1306C]/25 flex items-center justify-center group-hover:from-[#E1306C]/25 group-hover:via-[#833AB4]/25 group-hover:to-[#F77737]/25 transition-all duration-400">
                <Camera className="h-6 w-6 text-[#E1306C]" />
              </div>
              <div className="text-center">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1">إنستاجرام</h3>
                <p className="text-white/50 font-light text-xs sm:text-sm">تابعوا أحدث تصاميمنا</p>
              </div>
            </motion.a>

            {/* Facebook */}
            <motion.a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              variants={scaleIn}
              custom={2}
              whileHover={{ y: -6, transition: { duration: 0.3, ease: 'easeOut' } }}
              className="card-glow group relative rounded-2xl overflow-hidden border border-[#1877F2]/20 hover:border-[#1877F2]/40 transition-all duration-500 bg-[#1877F2]/5 backdrop-blur-sm p-6 flex flex-col items-center gap-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#1877F2]/15 border border-[#1877F2]/25 flex items-center justify-center group-hover:bg-[#1877F2]/25 transition-all duration-400">
                <Facebook className="h-6 w-6 text-[#1877F2]" />
              </div>
              <div className="text-center">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1">فيسبوك</h3>
                <p className="text-white/50 font-light text-xs sm:text-sm">انضموا لمجتمعنا</p>
              </div>
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="relative mt-auto">
        {/* Ornamental top border */}
        <div className="h-[2px] bg-gradient-to-l from-transparent via-[var(--wedding-gold)]/25 to-transparent" />
        <div className="flex justify-center -mt-[5px]">
          <div className="w-2.5 h-2.5 rotate-45 bg-[var(--wedding-gold)]/25 border border-[var(--wedding-gold)]/40" />
        </div>

        <div className="bg-[var(--wedding-deep)] pt-8 pb-6">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col items-center gap-6">
              {/* Brand */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-[var(--wedding-gold)] fill-[var(--wedding-gold)]" />
                  <span className="font-bold text-gold-gradient text-lg">قُرب</span>
                </div>
                <p className="text-white/30 text-xs font-light">
                  منصة دعوات الزفاف الفاخرة
                </p>
              </div>

              {/* Links */}
              <div className="flex items-center gap-6 text-xs sm:text-sm">
                <Link
                  href="/client/login"
                  className="text-white/35 hover:text-[var(--wedding-gold)] transition-colors duration-300 font-light"
                >
                  لوحة العميل
                </Link>
                <Link
                  href="/admin"
                  className="text-white/35 hover:text-[var(--wedding-gold)] transition-colors duration-300 font-light"
                >
                  لوحة التحكم
                </Link>
                <Link
                  href="/w/mohamed-fatma"
                  className="text-white/35 hover:text-[var(--wedding-gold)] transition-colors duration-300 font-light"
                >
                  شاهد مثال
                </Link>
              </div>

              {/* Social icons */}
              <div className="flex items-center gap-4">
                <a
                  href="https://wa.me/201000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#25D366]/15 hover:border-[#25D366]/30 transition-all duration-300"
                >
                  <MessageCircle className="h-4 w-4 text-[#25D366]" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#E1306C]/15 hover:border-[#E1306C]/30 transition-all duration-300"
                >
                  <Camera className="h-4 w-4 text-[#E1306C]" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#1877F2]/15 hover:border-[#1877F2]/30 transition-all duration-300"
                >
                  <Facebook className="h-4 w-4 text-[#1877F2]" />
                </a>
              </div>

              {/* Copyright */}
              <div className="flex items-center gap-2 text-white/20 text-xs font-light">
                <span>قُرب © 2025</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
