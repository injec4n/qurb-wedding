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
  galleryImages: string[]; // JSON array stored as string in DB
  backgroundMusicUrl: string;
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
  galleryImages: string[];
  backgroundMusicUrl: string;
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
