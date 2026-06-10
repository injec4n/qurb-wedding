'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { zodResolver } from '@hookform/resolvers/zod';
import { Wedding, ThemeName } from '@/types/wedding';
import { themeOptions, getTheme } from '@/lib/themes';
import { generateSlug } from '@/lib/wedding-utils';
import { covers, coverCategoryLabels, getCoversByCategory, getCoverById, CoverCategory, CoverItem, couplePhotos } from '@/lib/covers';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Save, X, Palette, Settings, Sparkles, ImageIcon, Music, Check, Upload, Loader2, Eye, EyeOff, Lock, BookOpen, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

const weddingFormSchema = z.object({
  groomName: z.string().min(1, 'اسم العريس مطلوب'),
  brideName: z.string().min(1, 'اسم العريسة مطلوب'),
  slug: z.string().min(1, 'الرابط مطلوب'),
  weddingDate: z.string().min(1, 'تاريخ الزفاف مطلوب'),
  weddingTime: z.string().min(1, 'وقت الزفاف مطلوب'),
  venueName: z.string().min(1, 'اسم القاعة مطلوب'),
  venueAddress: z.string().optional().default(''),
  googleMapsLink: z.string().optional().default(''),
  welcomeMessage: z.string().optional().default(''),
  contactPhone: z.string().optional().default(''),
  coverImage: z.string().optional().default(''),
  coverCategory: z.string().optional().default(''),
  galleryImages: z.array(z.string()).optional().default([]),
  backgroundMusicUrl: z.string().optional().default(''),
  couplePhoto: z.string().optional().default(''),
  clientPassword: z.string().optional().default(''),
  theme: z.string().optional().default('royal-gold'),
  colorPreset: z.string().optional().default(''),
  primaryColor: z.string().optional().default('#C9A84C'),
  secondaryColor: z.string().optional().default('#152040'),
  backgroundColor: z.string().optional().default('#0A0F1E'),
  textColor: z.string().optional().default('#F5E6C8'),
  buttonColor: z.string().optional().default('#C9A84C'),
  accentColor: z.string().optional().default('#E0C878'),
  enableRsvp: z.boolean().optional().default(true),
  enableGallery: z.boolean().optional().default(true),
  enableCountdown: z.boolean().optional().default(true),
  enableMusic: z.boolean().optional().default(true),
  enableGuestPersonalization: z.boolean().optional().default(true),
  // Customizable text fields
  bismallahText: z.string().optional().default('بسم الله الرحمن الرحيم'),
  invitationTitle: z.string().optional().default(''),
  heroSubtitle: z.string().optional().default('بقلوب يملؤها الشوق، بيتشرفوا بدعوتكم لمشاركتنا أجمل ليلة في العمر'),
  heroSubSubtitle: z.string().optional().default('ليلة هنلتقي فيها على مائدة الحب، والله يجمعنا على خير وبركة'),
  detailsTitle: z.string().optional().default('تفاصيل ليلة العمر'),
  detailsSubtitle: z.string().optional().default('بشوق ننتظر حضوركم لنشارك معاً فرحة ليلة العمر'),
  venueTitle: z.string().optional().default('حيث تُحتفل الفرحة'),
  rsvpTitle: z.string().optional().default('هنيتشرفوا بحضوركم ليلة العمر؟'),
  rsvpAttendingText: z.string().optional().default('يتشرفني الحضور بكل سرور'),
  rsvpNotAttendingText: z.string().optional().default('أعتذر، وأتمنى لكم أجمل ليلة'),
  cardInvitationText: z.string().optional().default('بيتشرفوا بدعوتكم لحضور حفل زفافهم'),
  guestWelcomeText: z.string().optional().default('فرحتنا مش بتتكمل غير بوجودكم معانا'),
  guestSubWelcomeText: z.string().optional().default('بوجودكم تزدان ليلتنا وتكتمل فرحتنا'),
});

type WeddingFormValues = z.infer<typeof weddingFormSchema>;

interface WeddingFormProps {
  initialData?: Wedding;
  onSubmit: (data: WeddingFormValues) => void;
  isLoading?: boolean;
  onFormChange?: (data: Record<string, unknown>) => void;
}

// Helper: parse galleryImages from either string (DB) or array (API)
function parseGalleryImages(value: string | string[] | undefined | null): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

// Upload function
const uploadFile = async (file: File, type: 'image' | 'music'): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/upload', { method: 'POST', body: formData });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Upload failed');
  return data.data.url;
};

export default function WeddingForm({ initialData, onSubmit, isLoading, onFormChange }: WeddingFormProps) {
  const router = useRouter();
  const [galleryInput, setGalleryInput] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>(
    parseGalleryImages(initialData?.galleryImages)
  );
  const [coverUploading, setCoverUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [musicUploading, setMusicUploading] = useState(false);
  const [couplePhotoUploading, setCouplePhotoUploading] = useState(false);

  const [coverDragOver, setCoverDragOver] = useState(false);
  const [musicDragOver, setMusicDragOver] = useState(false);
  const [couplePhotoDragOver, setCouplePhotoDragOver] = useState(false);

  const [showClientPassword, setShowClientPassword] = useState(false);
  const [selectedCoverCategory, setSelectedCoverCategory] = useState<CoverCategory>('luxury');
  const [textsOpen, setTextsOpen] = useState(false);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const musicInputRef = useRef<HTMLInputElement>(null);
  const couplePhotoInputRef = useRef<HTMLInputElement>(null);


  const form = useForm<WeddingFormValues>({
    resolver: zodResolver(weddingFormSchema),
    defaultValues: {
      groomName: initialData?.groomName || '',
      brideName: initialData?.brideName || '',
      slug: initialData?.slug || '',
      weddingDate: initialData?.weddingDate || '',
      weddingTime: initialData?.weddingTime || '',
      venueName: initialData?.venueName || '',
      venueAddress: initialData?.venueAddress || '',
      googleMapsLink: initialData?.googleMapsLink || '',
      welcomeMessage: initialData?.welcomeMessage || '',
      contactPhone: initialData?.contactPhone || '',
      coverImage: initialData?.coverImage || '',
      coverCategory: initialData?.coverCategory || '',
      galleryImages: parseGalleryImages(initialData?.galleryImages),
      backgroundMusicUrl: initialData?.backgroundMusicUrl || '',
      couplePhoto: initialData?.couplePhoto || '',
      clientPassword: initialData?.clientPassword || '',
      theme: initialData?.theme || 'royal-gold',
      colorPreset: initialData?.colorPreset || '',
      primaryColor: initialData?.primaryColor || '#C9A84C',
      secondaryColor: initialData?.secondaryColor || '#152040',
      backgroundColor: initialData?.backgroundColor || '#0A0F1E',
      textColor: initialData?.textColor || '#F5E6C8',
      buttonColor: initialData?.buttonColor || '#C9A84C',
      accentColor: initialData?.accentColor || '#E0C878',
      enableRsvp: initialData?.enableRsvp ?? true,
      enableGallery: initialData?.enableGallery ?? true,
      enableCountdown: initialData?.enableCountdown ?? true,
      enableMusic: initialData?.enableMusic ?? true,
      enableGuestPersonalization: initialData?.enableGuestPersonalization ?? true,
      bismallahText: (initialData as Record<string, unknown>)?.bismallahText as string || 'بسم الله الرحمن الرحيم',
      invitationTitle: (initialData as Record<string, unknown>)?.invitationTitle as string || '',
      heroSubtitle: (initialData as Record<string, unknown>)?.heroSubtitle as string || 'بقلوب يملؤها الشوق، بيتشرفوا بدعوتكم لمشاركتنا أجمل ليلة في العمر',
      heroSubSubtitle: (initialData as Record<string, unknown>)?.heroSubSubtitle as string || 'ليلة هنلتقي فيها على مائدة الحب، والله يجمعنا على خير وبركة',
      detailsTitle: (initialData as Record<string, unknown>)?.detailsTitle as string || 'تفاصيل ليلة العمر',
      detailsSubtitle: (initialData as Record<string, unknown>)?.detailsSubtitle as string || 'بشوق ننتظر حضوركم لنشارك معاً فرحة ليلة العمر',
      venueTitle: (initialData as Record<string, unknown>)?.venueTitle as string || 'حيث تُحتفل الفرحة',
      rsvpTitle: (initialData as Record<string, unknown>)?.rsvpTitle as string || 'هنيتشرفوا بحضوركم ليلة العمر؟',
      rsvpAttendingText: (initialData as Record<string, unknown>)?.rsvpAttendingText as string || 'يتشرفني الحضور بكل سرور',
      rsvpNotAttendingText: (initialData as Record<string, unknown>)?.rsvpNotAttendingText as string || 'أعتذر، وأتمنى لكم أجمل ليلة',
      cardInvitationText: (initialData as Record<string, unknown>)?.cardInvitationText as string || 'بيتشرفوا بدعوتكم لحضور حفل زفافهم',
      guestWelcomeText: (initialData as Record<string, unknown>)?.guestWelcomeText as string || 'فرحتنا مش بتتكمل غير بوجودكم معانا',
      guestSubWelcomeText: (initialData as Record<string, unknown>)?.guestSubWelcomeText as string || 'بوجودكم تزدان ليلتنا وتكتمل فرحتنا',
    },
  });

  const { register, handleSubmit, watch, setValue, formState: { errors } } = form;

  const groomName = watch('groomName');
  const brideName = watch('brideName');
  const selectedTheme = watch('theme');
  const coverImageValue = watch('coverImage');
  const musicUrlValue = watch('backgroundMusicUrl');
  const couplePhotoValue = watch('couplePhoto');

  const coverCategoryValue = watch('coverCategory');

  // Watch all form values for live preview using callback to avoid infinite loops
  useEffect(() => {
    const subscription = watch((formValues) => {
      if (onFormChange) {
        onFormChange({
          ...formValues,
          groomName: formValues.groomName ?? groomName,
          brideName: formValues.brideName ?? brideName,
        } as Record<string, unknown>);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, onFormChange]);

  // Auto-generate slug from names
  useEffect(() => {
    if (!initialData && groomName && brideName) {
      const slug = generateSlug(groomName, brideName);
      setValue('slug', slug);
    }
  }, [groomName, brideName, initialData, setValue]);

  // Apply theme colors when theme changes (works for both create and edit)
  useEffect(() => {
    const themeConfig = getTheme(selectedTheme as Wedding['theme']);
    if (themeConfig) {
      setValue('primaryColor', themeConfig.colors.primary);
      setValue('secondaryColor', themeConfig.colors.secondary);
      setValue('backgroundColor', themeConfig.colors.background);
      setValue('textColor', themeConfig.colors.text);
      setValue('buttonColor', themeConfig.colors.button);
      setValue('accentColor', themeConfig.colors.accent);
    }
  }, [selectedTheme, setValue]);

  // Helper: check if file is an image (permissive for .jfif etc.)
  const isImageFile = (file: File) => {
    if (file.type.startsWith('image/')) return true;
    const ext = file.name.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'webp', 'gif', 'jfif', 'bmp', 'svg'].includes(ext || '');
  };

  // Cover image upload handler
  const handleCoverUpload = useCallback(async (file: File) => {
    if (!isImageFile(file)) return;
    try {
      setCoverUploading(true);
      const url = await uploadFile(file, 'image');
      setValue('coverImage', url);
    } catch (err) {
      console.error('Cover upload error:', err);
    } finally {
      setCoverUploading(false);
    }
  }, [setValue]);

  // Gallery image upload handler
  const handleGalleryUpload = useCallback(async (file: File) => {
    if (!isImageFile(file)) return;
    try {
      setGalleryUploading(true);
      const url = await uploadFile(file, 'image');
      const updated = [...galleryImages, url];
      setGalleryImages(updated);
      setValue('galleryImages', updated);
    } catch (err) {
      console.error('Gallery upload error:', err);
    } finally {
      setGalleryUploading(false);
    }
  }, [galleryImages, setValue]);

  // Music upload handler
  const handleMusicUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('audio/')) return;
    try {
      setMusicUploading(true);
      const url = await uploadFile(file, 'music');
      setValue('backgroundMusicUrl', url);
    } catch (err) {
      console.error('Music upload error:', err);
    } finally {
      setMusicUploading(false);
    }
  }, [setValue]);

  // Drag and drop handlers for cover
  const handleCoverDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setCoverDragOver(true);
  };
  const handleCoverDragLeave = () => setCoverDragOver(false);
  const handleCoverDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setCoverDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && isImageFile(file)) {
      handleCoverUpload(file);
    }
  };

  // Photo upload handler
  const handleCouplePhotoUpload = useCallback(async (file: File) => {
    if (!isImageFile(file)) return;
    try {
      setCouplePhotoUploading(true);
      const url = await uploadFile(file, 'image');
      setValue('couplePhoto', url);
    } catch (err) {
      console.error('Couple photo upload error:', err);
    } finally {
      setCouplePhotoUploading(false);
    }
  }, [setValue]);

  // Drag and drop handlers for music
  const handleMusicDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setMusicDragOver(true);
  };
  const handleMusicDragLeave = () => setMusicDragOver(false);
  const handleMusicDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setMusicDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('audio/')) {
      handleMusicUpload(file);
    }
  };

  // Drag and drop handlers for couple photo
  const handleCouplePhotoDragOver = (e: React.DragEvent) => { e.preventDefault(); setCouplePhotoDragOver(true); };
  const handleCouplePhotoDragLeave = () => setCouplePhotoDragOver(false);
  const handleCouplePhotoDrop = (e: React.DragEvent) => {
    e.preventDefault(); setCouplePhotoDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && isImageFile(file)) handleCouplePhotoUpload(file);
  };

  const addGalleryImage = () => {
    if (galleryInput.trim()) {
      const updated = [...galleryImages, galleryInput.trim()];
      setGalleryImages(updated);
      setValue('galleryImages', updated);
      setGalleryInput('');
    }
  };

  const removeGalleryImage = (index: number) => {
    const updated = galleryImages.filter((_, i) => i !== index);
    setGalleryImages(updated);
    setValue('galleryImages', updated);
  };

  const handleFormSubmit = (data: WeddingFormValues) => {
    onSubmit({ ...data, galleryImages });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="admin-card overflow-hidden" style={{ borderTop: '2px solid var(--wedding-gold)' }}>
        <div className="p-6 pb-4">
          <h2 className="flex items-center gap-3 text-xl font-bold" style={{ color: 'var(--admin-text-primary)' }}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: 'rgba(212,168,83,0.12)' }}>
              <Sparkles className="h-5 w-5" style={{ color: 'var(--wedding-gold)' }} />
            </div>
            المعلومات الأساسية
          </h2>
        </div>
        <div className="px-6 pb-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label style={{ color: 'var(--admin-text-secondary)' }}>اسم العريس *</Label>
              <Input
                {...register('groomName')}
                className="admin-input"
                placeholder="أدخل اسم العريس"
              />
              {errors.groomName && (
                <p className="text-sm text-red-400">{errors.groomName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label style={{ color: 'var(--admin-text-secondary)' }}>اسم العريسة *</Label>
              <Input
                {...register('brideName')}
                className="admin-input"
                placeholder="أدخل اسم العريسة"
              />
              {errors.brideName && (
                <p className="text-sm text-red-400">{errors.brideName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label style={{ color: 'var(--admin-text-secondary)' }}>الرابط (Slug) *</Label>
            <Input
              {...register('slug')}
              className="admin-input text-left"
              placeholder="auto-generated-slug"
              dir="ltr"
            />
            {errors.slug && (
              <p className="text-sm text-red-400">{errors.slug.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label style={{ color: 'var(--admin-text-secondary)' }}>تاريخ الزفاف *</Label>
              <Input
                type="date"
                {...register('weddingDate')}
                className="admin-input"
              />
              {errors.weddingDate && (
                <p className="text-sm text-red-400">{errors.weddingDate.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label style={{ color: 'var(--admin-text-secondary)' }}>وقت الزفاف *</Label>
              <Input
                type="time"
                {...register('weddingTime')}
                className="admin-input"
              />
              {errors.weddingTime && (
                <p className="text-sm text-red-400">{errors.weddingTime.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Venue Information */}
      <div className="admin-card overflow-hidden" style={{ borderTop: '2px solid var(--wedding-gold)' }}>
        <div className="p-6 pb-4">
          <h2 className="flex items-center gap-3 text-xl font-bold" style={{ color: 'var(--admin-text-primary)' }}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: 'rgba(212,168,83,0.12)' }}>
              <Settings className="h-5 w-5" style={{ color: 'var(--wedding-gold)' }} />
            </div>
            معلومات القاعة
          </h2>
        </div>
        <div className="px-6 pb-6 space-y-4">
          <div className="space-y-2">
            <Label style={{ color: 'var(--admin-text-secondary)' }}>اسم القاعة *</Label>
            <Input
              {...register('venueName')}
              className="admin-input"
              placeholder="أدخل اسم القاعة"
            />
            {errors.venueName && (
              <p className="text-sm text-red-400">{errors.venueName.message}</p>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label style={{ color: 'var(--admin-text-secondary)' }}>عنوان القاعة</Label>
              <Input
                {...register('venueAddress')}
                className="admin-input"
                placeholder="أدخل عنوان القاعة"
              />
            </div>
            <div className="space-y-2">
              <Label style={{ color: 'var(--admin-text-secondary)' }}>رابط الخريطة</Label>
              <Input
                {...register('googleMapsLink')}
                className="admin-input"
                placeholder="https://maps.google.com/..."
                dir="ltr"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label style={{ color: 'var(--admin-text-secondary)' }}>رسالة الترحيب</Label>
              <Textarea
                {...register('welcomeMessage')}
                className="admin-input"
                placeholder="أدخل رسالة الترحيب بالضيوف"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label style={{ color: 'var(--admin-text-secondary)' }}>رقم الهاتف</Label>
              <Input
                {...register('contactPhone')}
                className="admin-input"
                placeholder="01xxxxxxxxx"
                dir="ltr"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Media */}
      <div className="admin-card overflow-hidden" style={{ borderTop: '2px solid var(--wedding-gold)' }}>
        <div className="p-6 pb-4">
          <h2 className="flex items-center gap-3 text-xl font-bold" style={{ color: 'var(--admin-text-primary)' }}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: 'rgba(212,168,83,0.12)' }}>
              <ImageIcon className="h-5 w-5" style={{ color: 'var(--wedding-gold)' }} />
            </div>
            الوسائط
          </h2>
        </div>
        <div className="px-6 pb-6 space-y-5">
          {/* Cover Image Upload */}
          <div className="space-y-3">
            <Label style={{ color: 'var(--admin-text-secondary)' }}>صورة الغلاف</Label>
            {/* Drag-and-drop upload zone */}
            <div
              className={`relative rounded-xl transition-all duration-300 cursor-pointer ${
                coverDragOver ? 'ring-2 ring-offset-2' : ''
              }`}
              style={{
                border: coverDragOver
                  ? '2px dashed var(--wedding-gold)'
                  : '2px dashed var(--admin-border)',
                background: coverDragOver
                  ? 'rgba(212,168,83,0.06)'
                  : 'var(--admin-surface)',
                ringColor: 'var(--wedding-gold)',
              }}
              onDragOver={handleCoverDragOver}
              onDragLeave={handleCoverDragLeave}
              onDrop={handleCoverDrop}
              onClick={() => coverInputRef.current?.click()}
            >
              <input
                ref={coverInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg,image/gif,image/jfif,image/bmp,image/svg+xml"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleCoverUpload(file);
                  e.target.value = '';
                }}
              />
              {coverUploading ? (
                <div className="flex flex-col items-center justify-center py-8 gap-2">
                  <Loader2 className="h-8 w-8 animate-spin" style={{ color: 'var(--wedding-gold)' }} />
                  <p className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>جاري رفع الصورة...</p>
                </div>
              ) : coverImageValue ? (
                <div className="relative group">
                  <img
                    src={coverImageValue}
                    alt="صورة الغلاف"
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                    <p className="text-sm text-white font-medium">اضغط لتغيير الصورة</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 gap-2">
                  <Upload className="h-8 w-8" style={{ color: 'var(--admin-text-muted)' }} />
                  <p className="text-sm" style={{ color: 'var(--admin-text-secondary)' }}>
                    اسحب الصورة هنا أو اضغط للاختيار
                  </p>
                  <p className="text-xs" style={{ color: 'var(--admin-text-muted)' }}>
                    JPG, PNG, WebP — حتى 10MB
                  </p>
                </div>
              )}
            </div>
            {/* URL fallback */}
            <div className="space-y-1.5">
              <p className="text-xs" style={{ color: 'var(--admin-text-muted)' }}>أو أدخل رابط الصورة يدوياً:</p>
              <Input
                {...register('coverImage')}
                className="admin-input"
                placeholder="رابط صورة الغلاف"
                dir="ltr"
              />
            </div>
          </div>

          {/* Gallery Images */}
          <div className="space-y-3">
            <Label style={{ color: 'var(--admin-text-secondary)' }}>صور المعرض</Label>
            {/* Upload button + URL input */}
            <div className="flex gap-2">
              <Input
                value={galleryInput}
                onChange={(e) => setGalleryInput(e.target.value)}
                className="admin-input flex-1"
                placeholder="أدخل رابط الصورة"
                dir="ltr"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addGalleryImage();
                  }
                }}
              />
              <button
                type="button"
                onClick={addGalleryImage}
                className="flex items-center justify-center h-9 w-9 rounded-xl transition-all duration-300 shrink-0"
                style={{ color: 'var(--wedding-gold)', background: 'rgba(212,168,83,0.08)', border: '1px solid rgba(212,168,83,0.15)' }}
              >
                <Plus className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                disabled={galleryUploading}
                className="flex items-center gap-2 px-3 h-9 rounded-xl text-xs font-medium transition-all duration-300 shrink-0"
                style={{ color: 'var(--wedding-gold)', background: 'rgba(212,168,83,0.08)', border: '1px solid rgba(212,168,83,0.15)' }}
              >
                {galleryUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                رفع صورة
              </button>
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg,image/gif,image/jfif,image/bmp,image/svg+xml"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleGalleryUpload(file);
                  e.target.value = '';
                }}
              />
            </div>
            {galleryImages.length > 0 && (
              <div className="mt-2 grid grid-cols-3 gap-2 max-h-72 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                {galleryImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-xl overflow-hidden"
                    style={{ border: '1px solid var(--admin-border)' }}
                  >
                    <img
                      src={img}
                      alt={`صورة المعرض ${idx + 1}`}
                      className="w-full h-24 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(idx)}
                        className="flex items-center justify-center h-7 w-7 rounded-lg bg-red-500/80 text-white transition-colors hover:bg-red-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    {/* URL fallback display */}
                    <div className="p-1.5" style={{ background: 'var(--admin-surface)' }}>
                      <p className="text-[9px] truncate" style={{ color: 'var(--admin-text-muted)' }} dir="ltr">
                        {img}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Couple Photo Upload */}
          <div className="space-y-3">
            <Label style={{ color: 'var(--admin-text-secondary)' }}>صورة الزوجين</Label>
            <p className="text-xs" style={{ color: 'var(--admin-text-muted)' }}>
              تُستخدم في بطاقة الدعوة، شاشة الترحيب، والقسم الرئيسي
            </p>
            <div
              className={`relative rounded-xl transition-all duration-300 cursor-pointer ${
                couplePhotoDragOver ? 'ring-2 ring-offset-2' : ''
              }`}
              style={{
                border: couplePhotoDragOver
                  ? '2px dashed var(--wedding-gold)'
                  : '2px dashed var(--admin-border)',
                background: couplePhotoDragOver
                  ? 'rgba(212,168,83,0.06)'
                  : 'var(--admin-surface)',
                ringColor: 'var(--wedding-gold)',
              }}
              onDragOver={handleCouplePhotoDragOver}
              onDragLeave={handleCouplePhotoDragLeave}
              onDrop={handleCouplePhotoDrop}
              onClick={() => couplePhotoInputRef.current?.click()}
            >
              <input
                ref={couplePhotoInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg,image/gif,image/jfif,image/bmp,image/svg+xml"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleCouplePhotoUpload(file);
                  e.target.value = '';
                }}
              />
              {couplePhotoUploading ? (
                <div className="flex flex-col items-center justify-center py-6 gap-2">
                  <Loader2 className="h-6 w-6 animate-spin" style={{ color: 'var(--wedding-gold)' }} />
                  <p className="text-xs" style={{ color: 'var(--admin-text-muted)' }}>جاري الرفع...</p>
                </div>
              ) : couplePhotoValue ? (
                <div className="relative group">
                  <img
                    src={couplePhotoValue}
                    alt="صورة الزوجين"
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                    <p className="text-sm text-white font-medium">اضغط لتغيير الصورة</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 gap-1.5">
                  <Upload className="h-6 w-6" style={{ color: 'var(--admin-text-muted)' }} />
                  <p className="text-sm" style={{ color: 'var(--admin-text-secondary)' }}>
                    اسحب الصورة هنا أو اضغط للاختيار
                  </p>
                  <p className="text-xs" style={{ color: 'var(--admin-text-muted)' }}>
                    JPG, PNG, WebP — حتى 10MB
                  </p>
                </div>
              )}
            </div>
            <Input
              {...register('couplePhoto')}
              className="admin-input text-xs"
              placeholder="أو رابط صورة الزوجين"
              dir="ltr"
            />

            {/* Default Couple Photo Selection */}
            <div className="space-y-2">
              <p className="text-xs font-medium" style={{ color: 'var(--admin-text-secondary)' }}>
                أو اختر من الصور الافتراضية:
              </p>
              <div className="flex gap-2 flex-wrap">
                {couplePhotos.map((option) => {
                  const isSelected = couplePhotoValue === option.image;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setValue('couplePhoto', option.image)}
                      className="relative rounded-xl overflow-hidden transition-all duration-300 group"
                      style={{
                        width: '56px',
                        height: '56px',
                        border: isSelected ? '2px solid var(--wedding-gold)' : '2px solid var(--admin-border)',
                        boxShadow: isSelected ? '0 0 10px rgba(212,168,83,0.25)' : 'none',
                      }}
                    >
                      <img
                        src={option.image}
                        alt={option.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      {isSelected && (
                        <div className="absolute top-0.5 left-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full" style={{ background: 'var(--wedding-gold)' }}>
                          <Check className="h-2 w-2" style={{ color: 'var(--admin-surface)' }} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Background Music Upload */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Music className="h-4 w-4" style={{ color: 'var(--admin-text-muted)' }} />
              <Label style={{ color: 'var(--admin-text-secondary)' }}>موسيقى الخلفية</Label>
            </div>
            {/* Drag-and-drop upload zone for music */}
            <div
              className={`relative rounded-xl transition-all duration-300 cursor-pointer ${
                musicDragOver ? 'ring-2 ring-offset-2' : ''
              }`}
              style={{
                border: musicDragOver
                  ? '2px dashed var(--wedding-gold)'
                  : '2px dashed var(--admin-border)',
                background: musicDragOver
                  ? 'rgba(212,168,83,0.06)'
                  : 'var(--admin-surface)',
                ringColor: 'var(--wedding-gold)',
              }}
              onDragOver={handleMusicDragOver}
              onDragLeave={handleMusicDragLeave}
              onDrop={handleMusicDrop}
              onClick={() => musicInputRef.current?.click()}
            >
              <input
                ref={musicInputRef}
                type="file"
                accept="audio/mpeg,audio/wav,audio/ogg,.mp3,.wav,.ogg"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleMusicUpload(file);
                  e.target.value = '';
                }}
              />
              {musicUploading ? (
                <div className="flex flex-col items-center justify-center py-8 gap-2">
                  <Loader2 className="h-8 w-8 animate-spin" style={{ color: 'var(--wedding-gold)' }} />
                  <p className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>جاري رفع الموسيقى...</p>
                </div>
              ) : musicUrlValue ? (
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{ background: 'rgba(212,168,83,0.12)' }}
                    >
                      <Music className="h-5 w-5" style={{ color: 'var(--wedding-gold)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--admin-text-primary)' }} dir="ltr">
                        {musicUrlValue.split('/').pop()}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--admin-text-muted)' }}>اضغط لتغيير الملف</p>
                    </div>
                  </div>
                  {/* Audio player preview */}
                  <audio
                    controls
                    className="w-full h-8"
                    style={{ filter: 'invert(0.8) hue-rotate(180deg)' }}
                  >
                    <source src={musicUrlValue} />
                  </audio>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 gap-2">
                  <Upload className="h-8 w-8" style={{ color: 'var(--admin-text-muted)' }} />
                  <p className="text-sm" style={{ color: 'var(--admin-text-secondary)' }}>
                    اسحب ملف الموسيقى هنا أو اضغط للاختيار
                  </p>
                  <p className="text-xs" style={{ color: 'var(--admin-text-muted)' }}>
                    MP3, WAV, OGG — حتى 20MB
                  </p>
                </div>
              )}
            </div>
            {/* URL fallback */}
            <div className="space-y-1.5">
              <p className="text-xs" style={{ color: 'var(--admin-text-muted)' }}>أو أدخل رابط الموسيقى يدوياً:</p>
              <Input
                {...register('backgroundMusicUrl')}
                className="admin-input"
                placeholder="رابط ملف الموسيقى"
                dir="ltr"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Theme & Colors - VISUAL THEME CARDS */}
      <div className="admin-card overflow-hidden" style={{ borderTop: '2px solid var(--wedding-gold)' }}>
        <div className="p-6 pb-4">
          <h2 className="flex items-center gap-3 text-xl font-bold" style={{ color: 'var(--admin-text-primary)' }}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: 'rgba(212,168,83,0.12)' }}>
              <Palette className="h-5 w-5" style={{ color: 'var(--wedding-gold)' }} />
            </div>
            القالب والألوان
          </h2>
        </div>
        <div className="px-6 pb-6 space-y-6">
          {/* Visual Theme Cards — 5 truly different templates */}
          <div className="space-y-3">
            <Label className="text-sm font-medium" style={{ color: 'var(--admin-text-secondary)' }}>اختار قالب التصميم</Label>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {themeOptions.map((option) => {
                const isSelected = selectedTheme === option.value;
                const themeConfig = getTheme(option.value as ThemeName);
                const isDark = themeConfig.colors.background === '#050505' || themeConfig.colors.background === '#0A0F1E' || themeConfig.colors.background === '#0A1A15';
                const isLight = themeConfig.colors.background === '#FAFAFA' || themeConfig.colors.background === '#FFF5F5';
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setValue('theme', option.value)}
                    className="relative rounded-xl overflow-hidden transition-all duration-300 text-right"
                    style={{
                      border: isSelected ? '2px solid var(--wedding-gold)' : '2px solid var(--admin-border)',
                      boxShadow: isSelected ? '0 0 24px rgba(212,168,83,0.2)' : 'none',
                      background: 'var(--admin-surface)',
                    }}
                  >
                    {/* Large Preview Area */}
                    <div
                      className="h-32 sm:h-36 relative flex flex-col items-center justify-center gap-3 overflow-hidden"
                      style={{ background: option.previewGradient || themeConfig.colors.background }}
                    >
                      {/* Mini mockup of hero layout */}
                      <div className="relative w-full h-full flex items-center justify-center px-4">
                        {/* Background pattern indicator */}
                        {themeConfig.showPattern && (
                          <div className="absolute inset-0 opacity-20" style={{ color: themeConfig.colors.primary }}>
                            {themeConfig.patternType === 'arabesque' && (
                              <svg className="w-full h-full"><defs><pattern id={`tp-${option.value}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="10" fill="none" stroke="currentColor" strokeWidth="0.5" /><path d="M20 10 Q25 15 20 20 Q15 15 20 10Z" fill="none" stroke="currentColor" strokeWidth="0.3" /></pattern></defs><rect width="100%" height="100%" fill={`url(#tp-${option.value})`} /></svg>
                            )}
                            {themeConfig.patternType === 'floral' && (
                              <svg className="w-full h-full"><defs><pattern id={`tp-${option.value}`} x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse"><circle cx="15" cy="15" r="6" fill="none" stroke="currentColor" strokeWidth="0.4" /><circle cx="15" cy="15" r="2" fill="none" stroke="currentColor" strokeWidth="0.3" /></pattern></defs><rect width="100%" height="100%" fill={`url(#tp-${option.value})`} /></svg>
                            )}
                            {themeConfig.patternType === 'lines' && (
                              <svg className="w-full h-full"><defs><pattern id={`tp-${option.value}`} x="0" y="0" width="15" height="15" patternUnits="userSpaceOnUse"><line x1="0" y1="15" x2="15" y2="0" stroke="currentColor" strokeWidth="0.3" /></pattern></defs><rect width="100%" height="100%" fill={`url(#tp-${option.value})`} /></svg>
                            )}
                          </div>
                        )}

                        {/* Hero style indicator */}
                        {themeConfig.heroStyle === 'cinematic' && (
                          <div className="relative z-10 text-center">
                            <div className="text-xs font-bold" style={{ color: themeConfig.colors.primary }}>اسم العريس</div>
                            <div className="w-1 h-1 rounded-full mx-auto my-1" style={{ backgroundColor: themeConfig.colors.accent }} />
                            <div className="text-xs font-bold" style={{ color: themeConfig.colors.primary }}>اسم العروس</div>
                            {/* Light beam indicators */}
                            <div className="absolute top-0 left-1/4 w-px h-full opacity-30" style={{ background: `linear-gradient(180deg, transparent, ${themeConfig.colors.primary}, transparent)` }} />
                            <div className="absolute top-0 left-3/4 w-px h-full opacity-30" style={{ background: `linear-gradient(180deg, transparent, ${themeConfig.colors.primary}, transparent)` }} />
                          </div>
                        )}
                        {themeConfig.heroStyle === 'split' && (
                          <div className="relative z-10 w-full flex items-center">
                            <div className="w-1/2 flex items-center justify-center">
                              <div className="w-10 h-12 rounded-sm" style={{ border: `1px solid ${themeConfig.colors.primary}40` }} />
                            </div>
                            <div className="w-px h-12" style={{ backgroundColor: themeConfig.colors.primary + '30' }} />
                            <div className="w-1/2 text-center pr-2">
                              <div className="text-xs font-bold" style={{ color: themeConfig.colors.primary }}>اسم العريس</div>
                              <div className="w-1 h-1 rounded-full mx-auto my-0.5" style={{ backgroundColor: themeConfig.colors.accent + '60' }} />
                              <div className="text-xs font-bold" style={{ color: themeConfig.colors.primary }}>اسم العروس</div>
                            </div>
                          </div>
                        )}
                        {themeConfig.heroStyle === 'centered' && (
                          <div className="relative z-10 text-center">
                            <div className="text-xs font-bold" style={{ color: themeConfig.colors.primary }}>اسم العريس</div>
                            {themeConfig.ornamentStyle !== 'none' ? (
                              <div className="flex items-center justify-center gap-1 my-1">
                                <div className="h-px w-3" style={{ backgroundColor: themeConfig.colors.primary + '40' }} />
                                <div className="w-1 h-1 rotate-45" style={{ backgroundColor: themeConfig.colors.accent + '60' }} />
                                <div className="h-px w-3" style={{ backgroundColor: themeConfig.colors.primary + '40' }} />
                              </div>
                            ) : (
                              <div className="h-px w-6 mx-auto my-1" style={{ backgroundColor: themeConfig.colors.primary + '20' }} />
                            )}
                            <div className="text-xs font-bold" style={{ color: themeConfig.colors.primary }}>اسم العروس</div>
                          </div>
                        )}
                        {themeConfig.heroStyle === 'frame' && (
                          <div className="relative z-10">
                            <div className="p-3 text-center" style={{ border: `1px solid ${themeConfig.colors.primary}50` }}>
                              <div className="absolute -top-1 -right-1 w-3 h-3" style={{ color: themeConfig.colors.primary + '80' }}><svg viewBox="0 0 20 20"><path d="M0 0 L20 0 L20 3 L3 3 L3 20 L0 20Z" fill="currentColor" /></svg></div>
                              <div className="absolute -top-1 -left-1 w-3 h-3" style={{ color: themeConfig.colors.primary + '80', transform: 'scaleX(-1)' }}><svg viewBox="0 0 20 20"><path d="M0 0 L20 0 L20 3 L3 3 L3 20 L0 20Z" fill="currentColor" /></svg></div>
                              <div className="text-xs font-bold" style={{ color: themeConfig.colors.primary }}>اسم العريس</div>
                              <div className="w-1 h-1 rounded-full mx-auto my-0.5" style={{ backgroundColor: themeConfig.colors.accent }} />
                              <div className="text-xs font-bold" style={{ color: themeConfig.colors.primary }}>اسم العروس</div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Selected indicator */}
                      {isSelected && (
                        <div className="absolute top-2 left-2 flex h-6 w-6 items-center justify-center rounded-full" style={{ background: 'var(--wedding-gold)' }}>
                          <Check className="h-3.5 w-3.5" style={{ color: 'var(--admin-surface)' }} />
                        </div>
                      )}

                      {/* Color swatches at bottom */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                        <div className="h-4 w-4 rounded-full border" style={{ background: themeConfig.colors.primary, borderColor: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)' }} />
                        <div className="h-4 w-4 rounded-full border" style={{ background: themeConfig.colors.accent, borderColor: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)' }} />
                        <div className="h-4 w-4 rounded-full border" style={{ background: themeConfig.colors.background, borderColor: 'rgba(128,128,128,0.3)' }} />
                        <div className="h-4 w-4 rounded-full border" style={{ background: themeConfig.colors.text, borderColor: 'rgba(128,128,128,0.3)' }} />
                      </div>
                    </div>

                    {/* Theme info — more detailed */}
                    <div className="p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold" style={{ color: isSelected ? 'var(--wedding-gold)' : 'var(--admin-text-primary)' }}>
                          {option.labelAr}
                        </p>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: 'var(--admin-surface-overlay)', color: 'var(--admin-text-muted)' }}>
                          {themeConfig.heroStyle === 'cinematic' ? 'سينمائي' : themeConfig.heroStyle === 'split' ? 'منقسم' : themeConfig.heroStyle === 'frame' ? 'إطار' : 'وسطي'}
                        </span>
                      </div>
                      <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--admin-text-muted)' }}>
                        {option.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ornamental separator */}
          <div className="ornament-separator">
            <div className="diamond" />
          </div>

          {/* Color Pickers */}
          <div className="space-y-3">
            <Label className="text-sm font-medium" style={{ color: 'var(--admin-text-secondary)' }}>تخصيص الألوان</Label>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {([
                { name: 'primaryColor' as const, label: 'اللون الأساسي' },
                { name: 'secondaryColor' as const, label: 'اللون الثانوي' },
                { name: 'backgroundColor' as const, label: 'لون الخلفية' },
                { name: 'textColor' as const, label: 'لون النص' },
                { name: 'buttonColor' as const, label: 'لون الزر' },
                { name: 'accentColor' as const, label: 'لون التمييز' },
              ]).map((color) => (
                <div key={color.name} className="space-y-2">
                  <Label className="text-xs" style={{ color: 'var(--admin-text-muted)' }}>{color.label}</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      {...register(color.name)}
                      className="h-9 w-12 cursor-pointer rounded-lg border-0 bg-transparent"
                      style={{ border: '1px solid var(--admin-border)' }}
                    />
                    <Input
                      {...register(color.name)}
                      className="admin-input text-xs"
                      dir="ltr"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Feature Toggles */}
      <div className="admin-card overflow-hidden" style={{ borderTop: '2px solid var(--wedding-gold)' }}>
        <div className="p-6 pb-4">
          <h2 className="flex items-center gap-3 text-xl font-bold" style={{ color: 'var(--admin-text-primary)' }}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: 'rgba(212,168,83,0.12)' }}>
              <Settings className="h-5 w-5" style={{ color: 'var(--wedding-gold)' }} />
            </div>
            إعدادات الميزات
          </h2>
        </div>
        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {([
              { name: 'enableRsvp' as const, label: 'تفعيل التأكيد' },
              { name: 'enableGallery' as const, label: 'تفعيل المعرض' },
              { name: 'enableCountdown' as const, label: 'تفعيل العداد' },
              { name: 'enableMusic' as const, label: 'تفعيل الموسيقى' },
              { name: 'enableGuestPersonalization' as const, label: 'تفعيل تخصيص الضيوف' },
            ]).map((toggle) => (
              <div
                key={toggle.name}
                className="flex items-center justify-between rounded-xl p-4"
                style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)' }}
              >
                <Label className="cursor-pointer text-sm" style={{ color: 'var(--admin-text-secondary)' }}>{toggle.label}</Label>
                <Switch
                  checked={watch(toggle.name)}
                  onCheckedChange={(checked) => setValue(toggle.name, checked)}
                  className="data-[state=checked]:bg-[var(--wedding-gold)]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cover Library */}
      <div className="admin-card overflow-hidden" style={{ borderTop: '2px solid var(--wedding-gold)' }}>
        <div className="p-6 pb-4">
          <h2 className="flex items-center gap-3 text-xl font-bold" style={{ color: 'var(--admin-text-primary)' }}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: 'rgba(212,168,83,0.12)' }}>
              <Palette className="h-5 w-5" style={{ color: 'var(--wedding-gold)' }} />
            </div>
            مكتبة الأغلفة
          </h2>
        </div>
        <div className="px-6 pb-6 space-y-4">
          {/* Category Tabs */}
          <div className="flex gap-2 flex-wrap">
            {(Object.keys(coverCategoryLabels) as CoverCategory[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCoverCategory(cat)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                style={{
                  background: selectedCoverCategory === cat ? 'var(--wedding-gold)' : 'var(--admin-surface)',
                  color: selectedCoverCategory === cat ? 'var(--admin-surface)' : 'var(--admin-text-secondary)',
                  border: selectedCoverCategory === cat ? '1px solid var(--wedding-gold)' : '1px solid var(--admin-border)',
                }}
              >
                {coverCategoryLabels[cat]}
              </button>
            ))}
          </div>

          {/* Cover Grid */}
          <div className="grid grid-cols-3 gap-3 md:grid-cols-5">
            {getCoversByCategory(selectedCoverCategory).map((cover) => {
              const isSelected = coverCategoryValue === cover.id;
              return (
                <button
                  key={cover.id}
                  type="button"
                  onClick={() => {
                    setValue('coverImage', cover.image);
                    setValue('coverCategory', cover.id);
                  }}
                  className="relative rounded-xl overflow-hidden transition-all duration-300 aspect-[3/4]"
                  style={{
                    border: isSelected ? '2px solid var(--wedding-gold)' : '2px solid var(--admin-border)',
                    boxShadow: isSelected ? '0 0 12px rgba(212,168,83,0.2)' : 'none',
                  }}
                >
                  {/* Cover image preview */}
                  <img
                    src={cover.image}
                    alt={cover.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Cover name */}
                  <div className="absolute bottom-0 inset-x-0 p-1.5 text-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <p className="text-[10px] font-medium text-white truncate">{cover.name}</p>
                  </div>
                  {/* Selected indicator */}
                  {isSelected && (
                    <div className="absolute top-1.5 left-1.5 flex h-4 w-4 items-center justify-center rounded-full" style={{ background: 'var(--wedding-gold)' }}>
                      <Check className="h-2.5 w-2.5" style={{ color: 'var(--admin-surface)' }} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Current cover info */}
          {coverCategoryValue && (
            <p className="text-xs" style={{ color: 'var(--admin-text-muted)' }}>
              الغلاف المختار: {covers.find(c => c.id === coverCategoryValue)?.name || coverCategoryValue}
            </p>
          )}
        </div>
      </div>



      {/* Texts & Customization Section - Collapsible */}
      <div className="admin-card overflow-hidden" style={{ borderTop: '2px solid var(--wedding-gold)' }}>
        <button
          type="button"
          onClick={() => setTextsOpen(!textsOpen)}
          className="w-full p-6 pb-4 flex items-center justify-between cursor-pointer"
        >
          <h2 className="flex items-center gap-3 text-xl font-bold" style={{ color: 'var(--admin-text-primary)' }}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: 'rgba(212,168,83,0.12)' }}>
              <BookOpen className="h-5 w-5" style={{ color: 'var(--wedding-gold)' }} />
            </div>
            النصوص والتخصيص
          </h2>
          <ChevronDown
            className="h-5 w-5 transition-transform duration-300"
            style={{ color: 'var(--admin-text-muted)', transform: textsOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </button>
        {textsOpen && (
          <div className="px-6 pb-6 space-y-4">
            <p className="text-xs mb-2" style={{ color: 'var(--admin-text-muted)' }}>
              خصّص النصوص اللي بتظهر في الدعوة. سيب الحقل فاضي عشان يستخدم النص الافتراضي.
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label style={{ color: 'var(--admin-text-secondary)' }}>نص البسملة</Label>
                <Input
                  {...register('bismallahText')}
                  className="admin-input"
                  placeholder="بسم الله الرحمن الرحيم"
                />
              </div>
              <div className="space-y-2">
                <Label style={{ color: 'var(--admin-text-secondary)' }}>عنوان الدعوة</Label>
                <Input
                  {...register('invitationTitle')}
                  className="admin-input"
                  placeholder="يظهر أسماء العروسين إذا فارغ"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label style={{ color: 'var(--admin-text-secondary)' }}>النص الرئيسي</Label>
              <Textarea
                {...register('heroSubtitle')}
                className="admin-input"
                placeholder="بقلوب يملؤها الشوق، بيتشرفوا بدعوتكم لمشاركتنا أجمل ليلة في العمر"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label style={{ color: 'var(--admin-text-secondary)' }}>النص الفرعي</Label>
              <Textarea
                {...register('heroSubSubtitle')}
                className="admin-input"
                placeholder="ليلة هنلتقي فيها على مائدة الحب، والله يجمعنا على خير وبركة"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label style={{ color: 'var(--admin-text-secondary)' }}>عنوان التفاصيل</Label>
                <Input
                  {...register('detailsTitle')}
                  className="admin-input"
                  placeholder="تفاصيل ليلة العمر"
                />
              </div>
              <div className="space-y-2">
                <Label style={{ color: 'var(--admin-text-secondary)' }}>نص التفاصيل</Label>
                <Input
                  {...register('detailsSubtitle')}
                  className="admin-input"
                  placeholder="بشوق ننتظر حضوركم لنشارك معاً فرحة ليلة العمر"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label style={{ color: 'var(--admin-text-secondary)' }}>عنوان المكان</Label>
                <Input
                  {...register('venueTitle')}
                  className="admin-input"
                  placeholder="حيث تُحتفل الفرحة"
                />
              </div>
              <div className="space-y-2">
                <Label style={{ color: 'var(--admin-text-secondary)' }}>عنوان الرد</Label>
                <Input
                  {...register('rsvpTitle')}
                  className="admin-input"
                  placeholder="هنيتشرفوا بحضوركم ليلة العمر؟"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label style={{ color: 'var(--admin-text-secondary)' }}>نص تأكيد الحضور</Label>
                <Input
                  {...register('rsvpAttendingText')}
                  className="admin-input"
                  placeholder="يتشرفني الحضور بكل سرور"
                />
              </div>
              <div className="space-y-2">
                <Label style={{ color: 'var(--admin-text-secondary)' }}>نص الاعتذار</Label>
                <Input
                  {...register('rsvpNotAttendingText')}
                  className="admin-input"
                  placeholder="أعتذر، وأتمنى لكم أجمل ليلة"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label style={{ color: 'var(--admin-text-secondary)' }}>نص بطاقة الدعوة</Label>
              <Input
                {...register('cardInvitationText')}
                className="admin-input"
                placeholder="بيتشرفوا بدعوتكم لحضور حفل زفافهم"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label style={{ color: 'var(--admin-text-secondary)' }}>نص ترحيب الضيف</Label>
                <Input
                  {...register('guestWelcomeText')}
                  className="admin-input"
                  placeholder="فرحتنا مش بتتكمل غير بوجودكم معانا"
                />
              </div>
              <div className="space-y-2">
                <Label style={{ color: 'var(--admin-text-secondary)' }}>نص ترحيب فرعي</Label>
                <Input
                  {...register('guestSubWelcomeText')}
                  className="admin-input"
                  placeholder="بوجودكم تزدان ليلتنا وتكتمل فرحتنا"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Client Password */}
      <div className="admin-card overflow-hidden" style={{ borderTop: '2px solid var(--wedding-gold)' }}>
        <div className="p-6 pb-4">
          <h2 className="flex items-center gap-3 text-xl font-bold" style={{ color: 'var(--admin-text-primary)' }}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: 'rgba(212,168,83,0.12)' }}>
              <Lock className="h-5 w-5" style={{ color: 'var(--wedding-gold)' }} />
            </div>
            كلمة مرور لوحة العميل
          </h2>
        </div>
        <div className="px-6 pb-6 space-y-3">
          <div className="relative">
            <Input
              type={showClientPassword ? 'text' : 'password'}
              {...register('clientPassword')}
              className="admin-input pl-10"
              placeholder="أدخل كلمة المرور"
            />
            <button
              type="button"
              onClick={() => setShowClientPassword(!showClientPassword)}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors"
              style={{ color: 'var(--admin-text-muted)' }}
            >
              {showClientPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-xs" style={{ color: 'var(--admin-text-muted)' }}>
            اتركها فارغة للسماح بالدخول بدون كلمة مرور
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 pb-8">
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300"
          style={{ color: 'var(--admin-text-secondary)', background: 'var(--admin-surface-overlay)', border: '1px solid var(--admin-border)' }}
          disabled={isLoading}
        >
          <X className="h-4 w-4" />
          إلغاء
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="btn-wedding flex items-center gap-2 px-6 py-2.5 text-sm"
        >
          {isLoading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: 'var(--admin-surface)', borderTopColor: 'transparent' }} />
              جاري الحفظ...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              حفظ
            </>
          )}
        </button>
      </div>
    </form>
  );
}
