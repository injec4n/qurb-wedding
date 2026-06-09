import { ThemeColors } from '@/types/wedding';

interface WeddingFooterProps {
  groomName: string;
  brideName: string;
  colors: ThemeColors;
}

export default function WeddingFooter({ groomName, brideName, colors }: WeddingFooterProps) {
  return (
    <footer className="py-10 px-4 text-center" dir="rtl">
      {/* Decorative top line */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="h-px w-16 sm:w-24" style={{ backgroundColor: colors.primary + '30' }} />
        <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary }} />
        <div className="h-px w-16 sm:w-24" style={{ backgroundColor: colors.primary + '30' }} />
      </div>

      <p className="text-base sm:text-lg mb-2" style={{ color: colors.text + 'BB' }}>
        صُنع بكل حب ❤️
      </p>
      <p className="text-sm sm:text-base font-semibold" style={{ color: colors.primary + 'CC' }}>
        زفاف {groomName} و {brideName}
      </p>

      {/* Decorative bottom line */}
      <div className="flex items-center justify-center gap-3 mt-6">
        <div className="h-px w-8" style={{ backgroundColor: colors.primary + '20' }} />
        <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: colors.primary + '60' }} />
        <div className="h-px w-8" style={{ backgroundColor: colors.primary + '20' }} />
      </div>
    </footer>
  );
}
