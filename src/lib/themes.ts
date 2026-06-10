import { ThemeConfig, ThemeName } from '@/types/wedding';

export const themes: Record<ThemeName, ThemeConfig> = {
  // ===== 5 CINEMATIC TEMPLATES with different color schemes =====

  'royal-gold': {
    name: 'royal-gold',
    label: 'Royal Gold',
    labelAr: 'ذهبي ملكي',
    colors: {
      primary: '#C9A84C',
      secondary: '#152040',
      background: '#0A0F1E',
      text: '#F5E6C8',
      button: '#C9A84C',
      accent: '#E0C878',
    },
    fontClass: 'font-serif',
    description: 'فخامة الفنادق الملكية — خلفية كحلي داكن وذهب فاخر مع زخارف عربية',
    previewGradient: 'linear-gradient(135deg, #0A0F1E 0%, #152040 40%, #0A0F1E 100%)',
    layoutStyle: 'classic',
    heroStyle: 'cinematic',
    sectionSpacing: 'compact',
    showPattern: true,
    patternType: 'arabesque',
    ornamentStyle: 'bold',
    cornerOrnaments: true,
    fontScale: 1.15,
  },

  'luxury-dark': {
    name: 'luxury-dark',
    label: 'Luxury Dark',
    labelAr: 'داكن فاخر',
    colors: {
      primary: '#D4AF37',
      secondary: '#1A1A1A',
      background: '#080808',
      text: '#E8E0D0',
      button: '#D4AF37',
      accent: '#F0E6C8',
    },
    fontClass: 'font-serif',
    description: 'سينمائي أسود وذهبي — تصميم فاخر مع إضاءة درامية',
    previewGradient: 'linear-gradient(135deg, #080808 0%, #1A1A1A 40%, #080808 100%)',
    layoutStyle: 'modern',
    heroStyle: 'cinematic',
    sectionSpacing: 'compact',
    showPattern: true,
    patternType: 'lines',
    ornamentStyle: 'bold',
    cornerOrnaments: true,
    fontScale: 1.15,
  },

  'floral-romance': {
    name: 'floral-romance',
    label: 'Floral Romance',
    labelAr: 'رومانسية زهور',
    colors: {
      primary: '#B86E8A',
      secondary: '#3D2030',
      background: '#1A1018',
      text: '#F0D0D8',
      button: '#B86E8A',
      accent: '#D4A0A7',
    },
    fontClass: 'font-serif',
    description: 'أناقة ورمانسية — ورد داكن مع لمسات ذهبية وتصميم سينمائي',
    previewGradient: 'linear-gradient(135deg, #1A1018 0%, #3D2030 40%, #1A1018 100%)',
    layoutStyle: 'romantic',
    heroStyle: 'cinematic',
    sectionSpacing: 'normal',
    showPattern: true,
    patternType: 'floral',
    ornamentStyle: 'subtle',
    cornerOrnaments: true,
    fontScale: 1.05,
  },

  'arabic-heritage': {
    name: 'arabic-heritage',
    label: 'Arabic Heritage',
    labelAr: 'تراث عربي',
    colors: {
      primary: '#C9A84C',
      secondary: '#153025',
      background: '#0A1A15',
      text: '#F0E6D3',
      button: '#C9A84C',
      accent: '#E0C878',
    },
    fontClass: 'font-serif',
    description: 'أنماط عربية وأصالة — إطار زخرفي فاخر مع زخارف إسلامية',
    previewGradient: 'linear-gradient(135deg, #0A1A15 0%, #153025 40%, #0A1A15 100%)',
    layoutStyle: 'traditional',
    heroStyle: 'cinematic',
    sectionSpacing: 'normal',
    showPattern: true,
    patternType: 'arabesque',
    ornamentStyle: 'bold',
    cornerOrnaments: true,
    fontScale: 1.15,
  },

  'minimal-modern': {
    name: 'minimal-modern',
    label: 'Minimal Modern',
    labelAr: 'عصري بسيط',
    colors: {
      primary: '#A0A0A0',
      secondary: '#1A1A1A',
      background: '#0A0A0A',
      text: '#E0E0E0',
      button: '#A0A0A0',
      accent: '#C0C0C0',
    },
    fontClass: 'font-sans',
    description: 'فخامة عصرية بسيطة — تصميم نظيف مع إضاءة سينمائية',
    previewGradient: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 40%, #0A0A0A 100%)',
    layoutStyle: 'minimal',
    heroStyle: 'cinematic',
    sectionSpacing: 'compact',
    showPattern: false,
    patternType: undefined,
    ornamentStyle: 'none',
    cornerOrnaments: false,
    fontScale: 1.0,
  },
};

export function getTheme(themeName: ThemeName): ThemeConfig {
  return themes[themeName] || themes['royal-gold'];
}

export function getThemeColors(themeName: ThemeName) {
  const theme = getTheme(themeName);
  return theme.colors;
}

export const themeOptions = Object.values(themes).map(t => ({
  value: t.name,
  label: t.label,
  labelAr: t.labelAr,
  description: t.description,
  colors: t.colors,
  previewGradient: t.previewGradient,
  heroStyle: t.heroStyle,
  ornamentStyle: t.ornamentStyle,
  patternType: t.patternType,
  fontClass: t.fontClass,
}));
