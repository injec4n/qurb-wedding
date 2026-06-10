import { ThemeConfig, ThemeName } from '@/types/wedding';

export const themes: Record<ThemeName, ThemeConfig> = {
  // ===== 5 TRULY DIFFERENT TEMPLATES =====

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
      secondary: '#111111',
      background: '#050505',
      text: '#E8E0D0',
      button: '#D4AF37',
      accent: '#F0E6C8',
    },
    fontClass: 'font-sans',
    description: 'سينمائي أسود وذهبي — تصميم منقسم أنيق بدون زخارف',
    previewGradient: 'linear-gradient(135deg, #050505 0%, #111111 40%, #050505 100%)',
    layoutStyle: 'modern',
    heroStyle: 'split',
    sectionSpacing: 'compact',
    showPattern: true,
    patternType: 'lines',
    ornamentStyle: 'none',
    cornerOrnaments: false,
    fontScale: 0.9,
  },

  'floral-romance': {
    name: 'floral-romance',
    label: 'Floral Romance',
    labelAr: 'رومانسية زهور',
    colors: {
      primary: '#C4788A',
      secondary: '#FFE8E8',
      background: '#FFF5F5',
      text: '#4A3040',
      button: '#C4788A',
      accent: '#D4A0A7',
    },
    fontClass: 'font-serif',
    description: 'أناقة ورمانسية الزهور — خلفية فاتحة مع زهور ناعمة ولمسة ذهبية',
    previewGradient: 'linear-gradient(135deg, #FFF5F5 0%, #FFE8E8 40%, #FFF5F5 100%)',
    layoutStyle: 'romantic',
    heroStyle: 'centered',
    sectionSpacing: 'normal',
    showPattern: true,
    patternType: 'floral',
    ornamentStyle: 'subtle',
    cornerOrnaments: false,
    fontScale: 1.0,
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
    heroStyle: 'frame',
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
      primary: '#1A1A1A',
      secondary: '#F0F0F0',
      background: '#FAFAFA',
      text: '#1A1A1A',
      button: '#1A1A1A',
      accent: '#333333',
    },
    fontClass: 'font-sans',
    description: 'فخامة عصرية بسيطة — تصميم نظيف بدون زخارف مع خطوط عصرية',
    previewGradient: 'linear-gradient(135deg, #FAFAFA 0%, #F0F0F0 40%, #FAFAFA 100%)',
    layoutStyle: 'minimal',
    heroStyle: 'centered',
    sectionSpacing: 'compact',
    showPattern: false,
    patternType: undefined,
    ornamentStyle: 'none',
    cornerOrnaments: false,
    fontScale: 0.9,
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
