'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { zodResolver } from '@hookform/resolvers/zod';
import { Wedding } from '@/types/wedding';
import { themeOptions, getTheme } from '@/lib/themes';
import { generateSlug } from '@/lib/wedding-utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2, Save, X, Palette, Settings, Sparkles, ImageIcon, Music } from 'lucide-react';

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

export default function WeddingForm({ initialData, onSubmit, isLoading }: WeddingFormProps) {
  const [galleryInput, setGalleryInput] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>(
    initialData ? (Array.isArray(initialData.galleryImages) ? initialData.galleryImages : []) : []
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
      galleryImages: Array.isArray(initialData?.galleryImages) ? initialData.galleryImages : [],
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

  // Apply theme colors when theme changes
  useEffect(() => {
    if (!initialData) {
      const themeConfig = getTheme(selectedTheme as Wedding['theme']);
      if (themeConfig) {
        setValue('primaryColor', themeConfig.colors.primary);
        setValue('secondaryColor', themeConfig.colors.secondary);
        setValue('backgroundColor', themeConfig.colors.background);
        setValue('textColor', themeConfig.colors.text);
        setValue('buttonColor', themeConfig.colors.button);
        setValue('accentColor', themeConfig.colors.accent);
      }
    }
  }, [selectedTheme, initialData, setValue]);

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
      <Card className="border-zinc-700 bg-zinc-800/50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg text-zinc-100">
            <Sparkles className="h-5 w-5 text-amber-400" />
            المعلومات الأساسية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-zinc-300">اسم العريس *</Label>
              <Input
                {...register('groomName')}
                className="border-zinc-600 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500"
                placeholder="أدخل اسم العريس"
              />
              {errors.groomName && (
                <p className="text-sm text-red-400">{errors.groomName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">اسم العريسة *</Label>
              <Input
                {...register('brideName')}
                className="border-zinc-600 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500"
                placeholder="أدخل اسم العريسة"
              />
              {errors.brideName && (
                <p className="text-sm text-red-400">{errors.brideName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-300">الرابط (Slug) *</Label>
            <Input
              {...register('slug')}
              className="border-zinc-600 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500 text-left"
              placeholder="auto-generated-slug"
              dir="ltr"
            />
            {errors.slug && (
              <p className="text-sm text-red-400">{errors.slug.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-zinc-300">تاريخ الزفاف *</Label>
              <Input
                type="date"
                {...register('weddingDate')}
                className="border-zinc-600 bg-zinc-900 text-zinc-100"
              />
              {errors.weddingDate && (
                <p className="text-sm text-red-400">{errors.weddingDate.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">وقت الزفاف *</Label>
              <Input
                type="time"
                {...register('weddingTime')}
                className="border-zinc-600 bg-zinc-900 text-zinc-100"
              />
              {errors.weddingTime && (
                <p className="text-sm text-red-400">{errors.weddingTime.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Venue Information */}
      <Card className="border-zinc-700 bg-zinc-800/50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg text-zinc-100">
            <Settings className="h-5 w-5 text-amber-400" />
            معلومات القاعة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-zinc-300">اسم القاعة *</Label>
            <Input
              {...register('venueName')}
              className="border-zinc-600 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500"
              placeholder="أدخل اسم القاعة"
            />
            {errors.venueName && (
              <p className="text-sm text-red-400">{errors.venueName.message}</p>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-zinc-300">عنوان القاعة</Label>
              <Input
                {...register('venueAddress')}
                className="border-zinc-600 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500"
                placeholder="أدخل عنوان القاعة"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">رابط الخريطة</Label>
              <Input
                {...register('googleMapsLink')}
                className="border-zinc-600 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500"
                placeholder="https://maps.google.com/..."
                dir="ltr"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-zinc-300">رسالة الترحيب</Label>
              <Textarea
                {...register('welcomeMessage')}
                className="border-zinc-600 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500"
                placeholder="أدخل رسالة الترحيب بالضيوف"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">رقم الهاتف</Label>
              <Input
                {...register('contactPhone')}
                className="border-zinc-600 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500"
                placeholder="01xxxxxxxxx"
                dir="ltr"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media */}
      <Card className="border-zinc-700 bg-zinc-800/50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg text-zinc-100">
            <ImageIcon className="h-5 w-5 text-amber-400" />
            الوسائط
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-zinc-300">صورة الغلاف</Label>
            <Input
              {...register('coverImage')}
              className="border-zinc-600 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500"
              placeholder="رابط صورة الغلاف"
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-300">صور المعرض</Label>
            <div className="flex gap-2">
              <Input
                value={galleryInput}
                onChange={(e) => setGalleryInput(e.target.value)}
                className="border-zinc-600 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500"
                placeholder="أدخل رابط الصورة"
                dir="ltr"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addGalleryImage();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={addGalleryImage}
                className="border-zinc-600 text-zinc-300 hover:bg-zinc-700"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {galleryImages.length > 0 && (
              <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                {galleryImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 rounded-md bg-zinc-900 p-2"
                  >
                    <span className="flex-1 truncate text-sm text-zinc-300" dir="ltr">
                      {img}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeGalleryImage(idx)}
                      className="h-7 w-7 p-0 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Music className="h-4 w-4 text-zinc-400" />
              <Label className="text-zinc-300">رابط الموسيقى</Label>
            </div>
            <Input
              {...register('backgroundMusicUrl')}
              className="border-zinc-600 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500"
              placeholder="رابط ملف الموسيقى"
              dir="ltr"
            />
          </div>
        </CardContent>
      </Card>

      {/* Theme & Colors */}
      <Card className="border-zinc-700 bg-zinc-800/50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg text-zinc-100">
            <Palette className="h-5 w-5 text-amber-400" />
            القالب والألوان
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-zinc-300">القالب</Label>
            <Select
              value={selectedTheme}
              onValueChange={(value) => setValue('theme', value)}
            >
              <SelectTrigger className="border-zinc-600 bg-zinc-900 text-zinc-100">
                <SelectValue placeholder="اختر القالب" />
              </SelectTrigger>
              <SelectContent className="border-zinc-600 bg-zinc-900">
                {themeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.labelAr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator className="bg-zinc-700" />

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
                <Label className="text-zinc-300">{color.label}</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    {...register(color.name)}
                    className="h-9 w-12 cursor-pointer rounded border border-zinc-600 bg-transparent"
                  />
                  <Input
                    {...register(color.name)}
                    className="border-zinc-600 bg-zinc-900 text-zinc-100"
                    dir="ltr"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Feature Toggles */}
      <Card className="border-zinc-700 bg-zinc-800/50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg text-zinc-100">
            <Settings className="h-5 w-5 text-amber-400" />
            إعدادات الميزات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {([
              { name: 'enableRsvp' as const, label: 'تفعيل التأكيد' },
              { name: 'enableGallery' as const, label: 'تفعيل المعرض' },
              { name: 'enableCountdown' as const, label: 'تفعيل العداد' },
              { name: 'enableMusic' as const, label: 'تفعيل الموسيقى' },
              { name: 'enableGuestPersonalization' as const, label: 'تفعيل تخصيص الضيوف' },
            ]).map((toggle) => (
              <div
                key={toggle.name}
                className="flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-900/50 p-3"
              >
                <Label className="cursor-pointer text-zinc-300">{toggle.label}</Label>
                <Switch
                  checked={watch(toggle.name)}
                  onCheckedChange={(checked) => setValue(toggle.name, checked)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          className="border-zinc-600 text-zinc-300 hover:bg-zinc-700"
          disabled={isLoading}
        >
          <X className="ml-2 h-4 w-4" />
          إلغاء
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-amber-600 text-white hover:bg-amber-700"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              جاري الحفظ...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              حفظ
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}
