import { ThemeConfig, ThemeName } from '@/types/wedding';

export const themes: Record<ThemeName, ThemeConfig> = {
  'classic-gold': {
    name: 'classic-gold',
    label: 'Classic Gold',
    labelAr: 'ذهبي كلاسيكي',
    colors: {
      primary: '#D4A853',
      secondary: '#1A1A2E',
      background: '#0D0D1A',
      text: '#FFFFFF',
      button: '#D4A853',
      accent: '#E8C874',
    },
    fontClass: 'font-serif',
  },
  'modern-dark': {
    name: 'modern-dark',
    label: 'Modern Dark',
    labelAr: 'داكن عصري',
    colors: {
      primary: '#C0C0C0',
      secondary: '#1A1A1A',
      background: '#0A0A0A',
      text: '#E0E0E0',
      button: '#C0C0C0',
      accent: '#FFFFFF',
    },
    fontClass: 'font-sans',
  },
  'elegant-white': {
    name: 'elegant-white',
    label: 'Elegant White',
    labelAr: 'أبيض أنيق',
    colors: {
      primary: '#8B7355',
      secondary: '#F5F0EB',
      background: '#FFFFFF',
      text: '#2C2C2C',
      button: '#8B7355',
      accent: '#A0926B',
    },
    fontClass: 'font-serif',
  },
  'royal-blue': {
    name: 'royal-blue',
    label: 'Royal Blue',
    labelAr: 'أزرق ملكي',
    colors: {
      primary: '#C9A84C',
      secondary: '#1B2A4A',
      background: '#0F1B33',
      text: '#F0E6D3',
      button: '#C9A84C',
      accent: '#E0C878',
    },
    fontClass: 'font-serif',
  },
  'rose-gold': {
    name: 'rose-gold',
    label: 'Rose Gold',
    labelAr: 'ذهبي وردي',
    colors: {
      primary: '#B76E79',
      secondary: '#2D1F22',
      background: '#1A1215',
      text: '#F5E6E8',
      button: '#B76E79',
      accent: '#D4A0A7',
    },
    fontClass: 'font-sans',
  },
  'traditional-arabic': {
    name: 'traditional-arabic',
    label: 'Traditional Arabic',
    labelAr: 'عربي تقليدي',
    colors: {
      primary: '#2E7D32',
      secondary: '#1B5E20',
      background: '#0D3B0F',
      text: '#FFFFFF',
      button: '#2E7D32',
      accent: '#4CAF50',
    },
    fontClass: 'font-serif',
  },
};

export function getTheme(themeName: ThemeName): ThemeConfig {
  return themes[themeName] || themes['classic-gold'];
}

export function getThemeColors(themeName: ThemeName) {
  const theme = getTheme(themeName);
  return theme.colors;
}

export const themeOptions = Object.values(themes).map(t => ({
  value: t.name,
  label: t.label,
  labelAr: t.labelAr,
}));
