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
  couplePhoto: string;
  galleryImages: string[]; // JSON array stored as string in DB
  backgroundMusicUrl: string;
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
  // Customizable text fields
  bismallahText: string;
  invitationTitle: string;
  heroSubtitle: string;
  heroSubSubtitle: string;
  detailsTitle: string;
  detailsSubtitle: string;
  venueTitle: string;
  rsvpTitle: string;
  rsvpAttendingText: string;
  rsvpNotAttendingText: string;
  cardInvitationText: string;
  guestWelcomeText: string;
  guestSubWelcomeText: string;
  createdAt: string;
  updatedAt: string;
}

export type ThemeName =
  | 'royal-gold'
  | 'luxury-dark'
  | 'floral-romance'
  | 'arabic-heritage'
  | 'minimal-modern';

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
  defaultCover?: string; // Path to default cover image for this theme
  defaultCouplePhoto?: string; // Path to default couple photo for this theme
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
  couplePhoto: string;
  galleryImages: string[];
  backgroundMusicUrl: string;
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
  // Customizable text fields
  bismallahText: string;
  invitationTitle: string;
  heroSubtitle: string;
  heroSubSubtitle: string;
  detailsTitle: string;
  detailsSubtitle: string;
  venueTitle: string;
  rsvpTitle: string;
  rsvpAttendingText: string;
  rsvpNotAttendingText: string;
  cardInvitationText: string;
  guestWelcomeText: string;
  guestSubWelcomeText: string;
}

export interface CreateWeddingRequest extends WeddingFormData {
  slug: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface Review {
  id: string;
  type: 'text' | 'image' | 'audio';
  name: string;
  rating: number;
  text: string;
  imageUrl: string;
  audioUrl: string;
  weddingName: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}
