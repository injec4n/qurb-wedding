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
} from 'lucide-react';

/* ─── Animation helpers ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: 'easeOut' },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ─── Theme data for preview section ─── */
const themeCards = [
  {
    name: 'ذهبي كلاسيكي',
    slug: 'classic-gold',
    colors: ['#D4A853', '#1A1A2E', '#0D0D1A'],
    gradient: 'from-[#D4A853] via-[#1A1A2E] to-[#0D0D1A]',
  },
  {
    name: 'داكن عصري',
    slug: 'modern-dark',
    colors: ['#C0C0C0', '#1A1A1A', '#0A0A0A'],
    gradient: 'from-[#C0C0C0] via-[#1A1A1A] to-[#0A0A0A]',
  },
  {
    name: 'أبيض أنيق',
    slug: 'elegant-white',
    colors: ['#8B7355', '#F5F0EB', '#FFFFFF'],
    gradient: 'from-[#8B7355] via-[#F5F0EB] to-[#FFFFFF]',
  },
  {
    name: 'أزرق ملكي',
    slug: 'royal-blue',
    colors: ['#C9A84C', '#1B2A4A', '#0F1B33'],
    gradient: 'from-[#C9A84C] via-[#1B2A4A] to-[#0F1B33]',
  },
  {
    name: 'ذهبي وردي',
    slug: 'rose-gold',
    colors: ['#B76E79', '#2D1F22', '#1A1215'],
    gradient: 'from-[#B76E79] via-[#2D1F22] to-[#1A1215]',
  },
  {
    name: 'عربي تقليدي',
    slug: 'traditional-arabic',
    colors: ['#2E7D32', '#1B5E20', '#0D3B0F'],
    gradient: 'from-[#2E7D32] via-[#1B5E20] to-[#0D3B0F]',
  },
];

/* ─── Features data ─── */
const features = [
  {
    icon: Globe,
    emoji: '🌐',
    title: 'موقع زفاف احترافي',
    desc: 'موقع ويب كامل بتصميم أنيق يعكس ذوقكم',
  },
  {
    icon: Mail,
    emoji: '💌',
    title: 'دعوة مخصصة لكل ضيف',
    desc: 'كل ضيف يستقبل دعوة باسمه مع رسالة ترحيب شخصية',
  },
  {
    icon: Smartphone,
    emoji: '📱',
    title: 'بطاقة دعوة واتساب',
    desc: 'بطاقة جاهزة للمشاركة على واتساب بضغطة واحدة',
  },
  {
    icon: Camera,
    emoji: '📸',
    title: 'بطاقة إنستاجرام ستوري',
    desc: 'تصميم ستوري مخصص لنشر فرحتكم',
  },
  {
    icon: CheckCircle,
    emoji: '✅',
    title: 'نظام تأكيد حضور',
    desc: 'تتبع حضور الضيوف بسهولة مع نظام RSVP متكامل',
  },
  {
    icon: Timer,
    emoji: '⏱️',
    title: 'عداد تنازلي',
    desc: 'عداد تنازلي حي ليوم الزفاف يخلق الحماس',
  },
];

/* ─── Steps data ─── */
const steps = [
  {
    icon: PenTool,
    emoji: '📝',
    title: 'أنشئ زفافك',
    desc: 'أدخل بيانات الزفاف واختر القالب المناسب',
  },
  {
    icon: Palette,
    emoji: '🎨',
    title: 'خصص التصميم',
    desc: 'اختر الألوان والقالب وأضف صورك',
  },
  {
    icon: Rocket,
    emoji: '🚀',
    title: 'شارك الدعوة',
    desc: 'أرسل الروابط المخصصة لضيوفك',
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
      className={`absolute rounded-full blur-3xl opacity-20 ${className}`}
      animate={{
        y: [0, -20, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 6,
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

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0D0D1A] text-white overflow-x-hidden">
      {/* ─── NAVBAR ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0D0D1A]/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-[#D4A853] fill-[#D4A853]" />
            <span className="text-xl font-bold text-[#D4A853]">زفاتي</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/w/mohamed-fatma">
              <Button
                variant="ghost"
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                شاهد مثال
              </Button>
            </Link>
            <Link href="/admin/create">
              <Button className="bg-[#D4A853] hover:bg-[#E8C874] text-[#0D0D1A] font-bold">
                ابدأ الآن
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D1A] via-[#1A1A2E]/60 to-[#0D0D1A]" />
        <GeometricPattern className="absolute inset-0 w-full h-full text-[#D4A853] opacity-[0.03]" />

        {/* Floating orbs */}
        <FloatingOrb className="w-72 h-72 bg-[#D4A853] top-[10%] right-[10%]" delay={0} />
        <FloatingOrb className="w-96 h-96 bg-[#1A1A2E] bottom-[20%] left-[5%]" delay={2} />
        <FloatingOrb className="w-60 h-60 bg-[#E8C874] top-[60%] right-[30%]" delay={4} />

        {/* Decorative corner elements */}
        <motion.div
          className="absolute top-24 right-8 w-32 h-32 border border-[#D4A853]/20 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute bottom-32 left-12 w-24 h-24 border border-[#D4A853]/15 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute top-1/3 left-[8%] w-2 h-2 bg-[#D4A853] rounded-full"
          animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.5, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/3 right-[12%] w-3 h-3 bg-[#E8C874] rounded-full"
          animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.3, 1] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        />

        {/* Hero content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-center gap-6"
          >
            {/* Bismallah */}
            <motion.p
              variants={fadeUp}
              custom={0}
              className="text-[#D4A853]/80 text-sm sm:text-base font-medium tracking-wide"
            >
              بسم الله الرحمن الرحيم
            </motion.p>

            {/* Main headline */}
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
            >
              <span className="text-white">أنشئ موقع</span>
              <br />
              <span className="bg-gradient-to-l from-[#D4A853] via-[#E8C874] to-[#D4A853] bg-clip-text text-transparent">
                دعوة زفافك
              </span>
              <br />
              <span className="text-white">في دقائق</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-lg sm:text-xl text-white/70 max-w-2xl leading-relaxed"
            >
              منصة احترافية لدعوات الزفاف — تصميم أنيق، مشاركة سهلة، تجربة لا تُنسى
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              variants={fadeUp}
              custom={3}
              className="flex flex-col sm:flex-row items-center gap-4 mt-4"
            >
              <Link href="/admin/create">
                <Button
                  size="lg"
                  className="bg-[#D4A853] hover:bg-[#E8C874] text-[#0D0D1A] font-bold text-lg px-8 py-6 rounded-xl shadow-lg shadow-[#D4A853]/25 hover:shadow-[#D4A853]/40 transition-all duration-300"
                >
                  ابدأ الآن
                  <ChevronLeft className="mr-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/w/mohamed-fatma">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-[#D4A853]/40 text-[#D4A853] hover:bg-[#D4A853]/10 font-bold text-lg px-8 py-6 rounded-xl transition-all duration-300"
                >
                  شاهد مثال
                  <ArrowLeft className="mr-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-6 h-10 border-2 border-[#D4A853]/40 rounded-full flex items-start justify-center p-1">
              <motion.div
                className="w-1.5 h-1.5 bg-[#D4A853] rounded-full"
                animate={{ y: [0, 16, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FEATURES SECTION ─── */}
      <section id="features" className="relative py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D1A] via-[#111122] to-[#0D0D1A]" />
        <GeometricPattern className="absolute inset-0 w-full h-full text-[#D4A853] opacity-[0.02]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            >
              كل ما تحتاجه{' '}
              <span className="bg-gradient-to-l from-[#D4A853] to-[#E8C874] bg-clip-text text-transparent">
                لدعوة زفافك
              </span>
            </motion.h2>
            <motion.div
              variants={fadeUp}
              custom={1}
              className="w-24 h-1 bg-gradient-to-l from-[#D4A853] to-[#E8C874] mx-auto rounded-full"
            />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={scaleIn}
                custom={i}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="group relative p-6 rounded-2xl bg-[#1A1A2E]/80 border border-white/5 hover:border-[#D4A853]/30 transition-all duration-300 backdrop-blur-sm"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#D4A853]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10">
                  <span className="text-3xl mb-4 block">{f.emoji}</span>
                  <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-white/60 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── THEMES PREVIEW SECTION ─── */}
      <section id="themes" className="relative py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D1A] via-[#0F0F22] to-[#0D0D1A]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            >
              اختر من بين{' '}
              <span className="bg-gradient-to-l from-[#D4A853] to-[#E8C874] bg-clip-text text-transparent">
                قوالب احترافية
              </span>
            </motion.h2>
            <motion.div
              variants={fadeUp}
              custom={1}
              className="w-24 h-1 bg-gradient-to-l from-[#D4A853] to-[#E8C874] mx-auto rounded-full"
            />
          </motion.div>

          {/* Horizontal scrollable carousel */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {themeCards.map((theme, i) => (
              <motion.div
                key={theme.slug}
                variants={scaleIn}
                custom={i}
                whileHover={{ y: -8, scale: 1.03, transition: { duration: 0.25 } }}
                className="snap-center shrink-0 w-[260px] sm:w-[280px] rounded-2xl overflow-hidden border border-white/10 hover:border-[#D4A853]/40 transition-all duration-300 cursor-pointer group"
              >
                {/* Color swatch / preview area */}
                <div
                  className={`h-44 bg-gradient-to-br ${theme.gradient} relative overflow-hidden`}
                >
                  {/* Decorative inner elements */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 border-2 border-white/20 rounded-full flex items-center justify-center">
                      <Heart className="h-6 w-6 text-white/40 group-hover:text-white/70 transition-colors" />
                    </div>
                  </div>
                  {/* Diagonal stripes */}
                  <div className="absolute inset-0 opacity-10">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `repeating-linear-gradient(
                          45deg,
                          transparent,
                          transparent 10px,
                          rgba(255,255,255,0.05) 10px,
                          rgba(255,255,255,0.05) 20px
                        )`,
                      }}
                    />
                  </div>
                </div>

                {/* Theme info */}
                <div className="p-4 bg-[#1A1A2E]">
                  <h3 className="font-bold text-white text-lg mb-2">{theme.name}</h3>
                  <div className="flex gap-2">
                    {theme.colors.map((color, ci) => (
                      <div
                        key={ci}
                        className="w-8 h-8 rounded-full border-2 border-white/10"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll hint for mobile */}
          <div className="flex items-center justify-center gap-2 mt-6 text-white/30 text-sm sm:hidden">
            <ArrowLeft className="h-4 w-4" />
            <span>اسحب لمزيد من القوالب</span>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS SECTION ─── */}
      <section id="how-it-works" className="relative py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D1A] via-[#111122] to-[#0D0D1A]" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            >
              كيف{' '}
              <span className="bg-gradient-to-l from-[#D4A853] to-[#E8C874] bg-clip-text text-transparent">
                يعمل؟
              </span>
            </motion.h2>
            <motion.div
              variants={fadeUp}
              custom={1}
              className="w-24 h-1 bg-gradient-to-l from-[#D4A853] to-[#E8C874] mx-auto rounded-full"
            />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                variants={fadeUp}
                custom={i}
                className="relative flex flex-col items-center text-center"
              >
                {/* Step number */}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#D4A853] text-[#0D0D1A] font-bold flex items-center justify-center text-sm">
                  {i + 1}
                </div>

                {/* Icon circle */}
                <div className="w-20 h-20 rounded-2xl bg-[#1A1A2E] border border-[#D4A853]/20 flex items-center justify-center mb-5">
                  <span className="text-3xl">{step.emoji}</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-white/60 leading-relaxed">{step.desc}</p>

                {/* Connector line (only between steps on desktop) */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 -left-4 w-8 border-t border-dashed border-[#D4A853]/30" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── CTA SECTION ─── */}
      <section id="cta" className="relative py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D1A] via-[#1A1A2E]/40 to-[#0D0D1A]" />
        <GeometricPattern className="absolute inset-0 w-full h-full text-[#D4A853] opacity-[0.03]" />

        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#D4A853]/10 blur-[120px] rounded-full" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center"
        >
          <motion.h2
            variants={fadeUp}
            custom={0}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
          >
            جاهز تبدأ؟
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={1}
            className="text-xl text-white/60 mb-8"
          >
            أنشئ دعوة زفافك الآن مجاناً
          </motion.p>
          <motion.div variants={fadeUp} custom={2}>
            <Link href="/admin/create">
              <Button
                size="lg"
                className="bg-[#D4A853] hover:bg-[#E8C874] text-[#0D0D1A] font-bold text-xl px-12 py-7 rounded-xl shadow-lg shadow-[#D4A853]/25 hover:shadow-[#D4A853]/50 transition-all duration-300"
              >
                ابدأ الآن مجاناً
                <ChevronLeft className="mr-2 h-6 w-6" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="relative border-t border-white/5 py-10">
        <div className="absolute inset-0 bg-[#0D0D1A]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-[#D4A853] fill-[#D4A853]" />
              <span className="font-bold text-[#D4A853]">زفاتي</span>
              <span className="text-white/40 text-sm">© 2025</span>
            </div>

            <p className="text-white/40 text-sm">
              منصة دعوات الزفاف الاحترافية
            </p>

            <div className="flex items-center gap-4 text-sm">
              <Link
                href="/admin"
                className="text-white/50 hover:text-[#D4A853] transition-colors"
              >
                لوحة التحكم
              </Link>
              <Link
                href="/w/mohamed-fatma"
                className="text-white/50 hover:text-[#D4A853] transition-colors"
              >
                شاهد مثال
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
