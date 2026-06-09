export interface Wedding {
  id: string;
  slug: string;
  groomName: string;
  brideName: string;
  weddingDate: string;
  weddingTime: string;
  venueName: string;
  venueAddress: string;
  googleMapsLink: string;
  welcomeMessage: string;
  contactPhone: string;
  coverImage: string;
  coverCategory: string;
  galleryImages: string[]; // JSON array stored as string in DB
  backgroundMusicUrl: string;
  groomPhoto: string;
  bridePhoto: string;
  couplePhoto: string;
  clientPassword: string;
  theme: ThemeName;
  colorPreset: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  accentColor: string;
  enableRsvp: boolean;
  enableGallery: boolean;
  enableCountdown: boolean;
  enableMusic: boolean;
  enableGuestPersonalization: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ThemeName =
  | 'classic-gold'
  | 'modern-dark'
  | 'elegant-white'
  | 'royal-blue'
  | 'rose-gold'
  | 'traditional-arabic';

export interface Guest {
  id: string;
  weddingId: string;
  name: string;
  phone: string;
  guestLink: string;
  createdAt: string;
}

export interface RsvpResponse {
  id: string;
  weddingId: string;
  guestId: string;
  status: 'attending' | 'not-attending' | 'pending';
  message: string;
  createdAt: string;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  button: string;
  accent: string;
}

export interface ThemeConfig {
  name: ThemeName;
  label: string;
  labelAr: string;
  colors: ThemeColors;
  fontClass: string;
  backgroundImage?: string;
  patternStyle?: string;
  description?: string;
  previewGradient?: string;
  layoutStyle: 'classic' | 'modern' | 'minimal' | 'ornate' | 'romantic' | 'traditional';
  heroStyle: 'centered' | 'split' | 'cinematic' | 'frame';
  sectionSpacing: 'compact' | 'normal' | 'spacious';
  showPattern: boolean;
  patternType?: 'geometric' | 'floral' | 'arabesque' | 'dots' | 'lines';
  ornamentStyle: 'gold' | 'subtle' | 'none' | 'bold';
  cornerOrnaments: boolean;
  fontScale: number; // 0.9 for smaller, 1 for normal, 1.1 for larger
}

export interface WeddingFormData {
  groomName: string;
  brideName: string;
  weddingDate: string;
  weddingTime: string;
  venueName: string;
  venueAddress: string;
  googleMapsLink: string;
  welcomeMessage: string;
  contactPhone: string;
  coverImage: string;
  coverCategory: string;
  galleryImages: string[];
  backgroundMusicUrl: string;
  groomPhoto: string;
  bridePhoto: string;
  couplePhoto: string;
  clientPassword: string;
  theme: ThemeName;
  colorPreset: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  accentColor: string;
  enableRsvp: boolean;
  enableGallery: boolean;
  enableCountdown: boolean;
  enableMusic: boolean;
  enableGuestPersonalization: boolean;
}

export interface CreateWeddingRequest extends WeddingFormData {
  slug: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
