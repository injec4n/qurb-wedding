'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { zodResolver } from '@hookform/resolvers/zod';
import { Wedding, ThemeName } from '@/types/wedding';
import { themeOptions, getTheme } from '@/lib/themes';
import { generateSlug } from '@/lib/wedding-utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Save, X, Palette, Settings, Sparkles, ImageIcon, Music, Check } from 'lucide-react';
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
  galleryImages: z.array(z.string()).optional().default([]),
  backgroundMusicUrl: z.string().optional().default(''),
  theme: z.string().optional().default('classic-gold'),
  colorPreset: z.string().optional().default(''),
  primaryColor: z.string().optional().default('#D4A853'),
  secondaryColor: z.string().optional().default('#1A1A2E'),
  backgroundColor: z.string().optional().default('#0D0D1A'),
  textColor: z.string().optional().default('#FFFFFF'),
  buttonColor: z.string().optional().default('#D4A853'),
  accentColor: z.string().optional().default('#E8C874'),
  enableRsvp: z.boolean().optional().default(true),
  enableGallery: z.boolean().optional().default(true),
  enableCountdown: z.boolean().optional().default(true),
  enableMusic: z.boolean().optional().default(true),
  enableGuestPersonalization: z.boolean().optional().default(true),
});

type WeddingFormValues = z.infer<typeof weddingFormSchema>;

interface WeddingFormProps {
  initialData?: Wedding;
  onSubmit: (data: WeddingFormValues) => void;
  isLoading?: boolean;
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

export default function WeddingForm({ initialData, onSubmit, isLoading }: WeddingFormProps) {
  const router = useRouter();
  const [galleryInput, setGalleryInput] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>(
    parseGalleryImages(initialData?.galleryImages)
  );

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
      galleryImages: parseGalleryImages(initialData?.galleryImages),
      backgroundMusicUrl: initialData?.backgroundMusicUrl || '',
      theme: initialData?.theme || 'classic-gold',
      colorPreset: initialData?.colorPreset || '',
      primaryColor: initialData?.primaryColor || '#D4A853',
      secondaryColor: initialData?.secondaryColor || '#1A1A2E',
      backgroundColor: initialData?.backgroundColor || '#0D0D1A',
      textColor: initialData?.textColor || '#FFFFFF',
      buttonColor: initialData?.buttonColor || '#D4A853',
      accentColor: initialData?.accentColor || '#E8C874',
      enableRsvp: initialData?.enableRsvp ?? true,
      enableGallery: initialData?.enableGallery ?? true,
      enableCountdown: initialData?.enableCountdown ?? true,
      enableMusic: initialData?.enableMusic ?? true,
      enableGuestPersonalization: initialData?.enableGuestPersonalization ?? true,
    },
  });

  const { register, handleSubmit, watch, setValue, formState: { errors } } = form;

  const groomName = watch('groomName');
  const brideName = watch('brideName');
  const selectedTheme = watch('theme');

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
        <div className="px-6 pb-6 space-y-4">
          <div className="space-y-2">
            <Label style={{ color: 'var(--admin-text-secondary)' }}>صورة الغلاف</Label>
            <Input
              {...register('coverImage')}
              className="admin-input"
              placeholder="رابط صورة الغلاف"
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <Label style={{ color: 'var(--admin-text-secondary)' }}>صور المعرض</Label>
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
            </div>
            {galleryImages.length > 0 && (
              <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                {galleryImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 rounded-xl p-2.5"
                    style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)' }}
                  >
                    <span className="flex-1 truncate text-sm" style={{ color: 'var(--admin-text-secondary)' }} dir="ltr">
                      {img}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      className="flex items-center justify-center h-7 w-7 rounded-lg transition-colors"
                      style={{ color: '#EF4444' }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Music className="h-4 w-4" style={{ color: 'var(--admin-text-muted)' }} />
              <Label style={{ color: 'var(--admin-text-secondary)' }}>رابط الموسيقى</Label>
            </div>
            <Input
              {...register('backgroundMusicUrl')}
              className="admin-input"
              placeholder="رابط ملف الموسيقى"
              dir="ltr"
            />
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
          {/* Visual Theme Cards Grid */}
          <div className="space-y-3">
            <Label className="text-sm font-medium" style={{ color: 'var(--admin-text-secondary)' }}>اختار قالب التصميم</Label>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {themeOptions.map((option) => {
                const isSelected = selectedTheme === option.value;
                const themeConfig = getTheme(option.value as ThemeName);
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setValue('theme', option.value)}
                    className="relative rounded-xl overflow-hidden transition-all duration-300 text-right"
                    style={{
                      border: isSelected ? '2px solid var(--wedding-gold)' : '2px solid var(--admin-border)',
                      boxShadow: isSelected ? '0 0 20px rgba(212,168,83,0.15)' : 'none',
                      background: 'var(--admin-surface)',
                    }}
                  >
                    {/* Mini Preview */}
                    <div
                      className="h-20 relative flex items-center justify-center"
                      style={{ background: option.previewGradient || themeConfig.colors.background }}
                    >
                      {/* Mini color circles */}
                      <div className="flex items-center gap-2">
                        <div
                          className="h-5 w-5 rounded-full border"
                          style={{ background: themeConfig.colors.primary, borderColor: 'rgba(255,255,255,0.2)' }}
                        />
                        <div
                          className="h-5 w-5 rounded-full border"
                          style={{ background: themeConfig.colors.accent, borderColor: 'rgba(255,255,255,0.2)' }}
                        />
                        <div
                          className="h-5 w-5 rounded-full border"
                          style={{ background: themeConfig.colors.secondary, borderColor: 'rgba(255,255,255,0.2)' }}
                        />
                      </div>
                      {/* Selected indicator */}
                      {isSelected && (
                        <div className="absolute top-2 left-2 flex h-5 w-5 items-center justify-center rounded-full" style={{ background: 'var(--wedding-gold)' }}>
                          <Check className="h-3 w-3" style={{ color: 'var(--admin-surface)' }} />
                        </div>
                      )}
                    </div>
                    {/* Theme info */}
                    <div className="p-2.5">
                      <p className="text-sm font-semibold" style={{ color: isSelected ? 'var(--wedding-gold)' : 'var(--admin-text-primary)' }}>
                        {option.labelAr}
                      </p>
                      <p className="text-[10px] mt-0.5" style={{ color: 'var(--admin-text-muted)' }}>
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
