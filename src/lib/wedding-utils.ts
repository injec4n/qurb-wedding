import { Wedding, ThemeColors, ThemeName } from '@/types/wedding';
import { getTheme } from '@/lib/themes';

export function generateSlug(groomName: string, brideName: string): string {
  const groom = groomName.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\u0600-\u06FF-]/g, '');
  const bride = brideName.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\u0600-\u06FF-]/g, '');
  return `${groom}-${bride}`;
}

export function parseGalleryImages(images: string | string[]): string[] {
  if (Array.isArray(images)) return images;
  try {
    return JSON.parse(images);
  } catch {
    return [];
  }
}

export function formatDateArabic(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const months = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    const days = [
      'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'
    ];
    const day = days[date.getDay()];
    const d = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day}، ${d} ${month} ${year}`;
  } catch {
    return dateStr;
  }
}

export function formatTimeArabic(timeStr: string): string {
  try {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const period = hours >= 12 ? 'مساءً' : 'صباحاً';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  } catch {
    return timeStr;
  }
}

export function getWeddingColors(wedding: Wedding): ThemeColors {
  return {
    primary: wedding.primaryColor,
    secondary: wedding.secondaryColor,
    background: wedding.backgroundColor,
    text: wedding.textColor,
    button: wedding.buttonColor,
    accent: wedding.accentColor,
  };
}

export function getGuestWelcomeMessage(guestName: string, groomName: string, brideName: string): { title: string; subtitle: string; message: string } {
  return {
    title: `أهلاً ${guestName} 🌷`,
    subtitle: 'تم تجهيز هذه الدعوة خصيصاً لك',
    message: 'وجودك هيكمل فرحتنا',
  };
}

export function getGeneralWelcomeMessage(groomName: string, brideName: string): { title: string; subtitle: string; message: string } {
  return {
    title: `يسعدنا دعوتكم 🌹`,
    subtitle: `لحفل زفاف ${groomName} و ${brideName}`,
    message: 'نتشرف بحضوركم ومشاركتكم فرحتنا',
  };
}

export function getCountdownTarget(dateStr: string, timeStr: string): Date {
  return new Date(`${dateStr}T${timeStr || '00:00'}`);
}

/**
 * Get the effective cover image for a wedding.
 * Returns the custom cover if set, otherwise the theme's default cover.
 */
export function getEffectiveCoverImage(wedding: Wedding): string {
  if (wedding.coverImage) return wedding.coverImage;
  const theme = getTheme((wedding.theme || 'royal-gold') as ThemeName);
  return theme.defaultCover || '';
}

/**
 * Get the effective couple photo for a wedding.
 * Returns the custom couple photo if set, otherwise the theme's default couple photo.
 */
export function getEffectiveCouplePhoto(wedding: Wedding): string {
  if (wedding.couplePhoto) return wedding.couplePhoto;
  const theme = getTheme((wedding.theme || 'royal-gold') as ThemeName);
  return theme.defaultCouplePhoto || '/images/demo-couple.png';
}
