import { ThemeColors } from '@/types/wedding';

interface WeddingFooterProps {
  groomName: string;
  brideName: string;
  colors: ThemeColors;
}

export default function WeddingFooter({ groomName, brideName, colors }: WeddingFooterProps) {
  return (
    <footer className="py-10 sm:py-14 px-4 text-center" dir="rtl">
      {/* Larger ornamental divider at top */}
      <div className="flex items-center justify-center gap-5 mb-6">
        <div className="h-px w-20 sm:w-32" style={{ backgroundColor: colors.primary + '25' }} />
        <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary + '40' }} />
        <div className="w-3 h-3 rotate-45" style={{ backgroundColor: colors.primary + '60' }} />
        <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary + '40' }} />
        <div className="h-px w-20 sm:w-32" style={{ backgroundColor: colors.primary + '25' }} />
      </div>

      {/* Dua message */}
      <p className="text-lg sm:text-xl mb-6 font-serif" style={{ color: colors.text + 'BB' }}>
        نسأل الله أن يبارك في زواجكما ويجمع بينكما على خير ومحبة، ويجعلكما قرة أعين لبعضكما
      </p>

      <p className="text-xl sm:text-2xl mb-3 font-serif" style={{ color: colors.text + 'CC' }}>
        صُنع بكل حب ودعاء ❤️
      </p>
      <p className="text-base sm:text-lg font-semibold mb-4" style={{ color: colors.primary + 'CC' }}>
        زفاف {groomName} و {brideName}
      </p>

      {/* Zafati branding */}
      <div className="flex items-center justify-center gap-2 mt-6 mb-6">
        <div className="h-px w-8" style={{ backgroundColor: colors.primary + '20' }} />
        <div className="w-1 h-1 rotate-45" style={{ backgroundColor: colors.primary + '40' }} />
        <div className="h-px w-8" style={{ backgroundColor: colors.primary + '20' }} />
      </div>
      <p
        className="text-sm font-bold tracking-wider"
        style={{ color: colors.primary + '80' }}
      >
        قُرب
      </p>

      {/* Bottom decorative line */}
      <div className="flex items-center justify-center gap-3 mt-8">
        <div className="h-px w-6" style={{ backgroundColor: colors.primary + '15' }} />
        <div className="w-1 h-1 rotate-45" style={{ backgroundColor: colors.primary + '30' }} />
        <div className="h-px w-6" style={{ backgroundColor: colors.primary + '15' }} />
      </div>
    </footer>
  );
}
