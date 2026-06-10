'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import WeddingForm from '@/components/admin/WeddingForm';
import LivePreview from '@/components/admin/LivePreview';
import CreationSuccess from '@/components/admin/CreationSuccess';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Sparkles, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

type WeddingFormValues = {
  groomName: string;
  brideName: string;
  slug: string;
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
  theme: string;
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
};

type CreatedWedding = {
  id: string;
  slug: string;
  groomName: string;
  brideName: string;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  accentColor: string;
  secondaryColor: string;
  theme: string;
};

export default function CreateWeddingPage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [createdWedding, setCreatedWedding] = useState<CreatedWedding | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<{
    groomName: string;
    brideName: string;
    weddingDate: string;
    weddingTime: string;
    venueName: string;
    venueAddress: string;
    welcomeMessage: string;
    coverImage: string;
    couplePhoto: string;
    theme: string;
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    buttonColor: string;
    accentColor: string;
    enableRsvp: boolean;
    enableCountdown: boolean;
    enableGallery: boolean;
  }>({
    groomName: '',
    brideName: '',
    weddingDate: '',
    weddingTime: '',
    venueName: '',
    venueAddress: '',
    welcomeMessage: '',
    coverImage: '',
    couplePhoto: '',
    theme: 'royal-gold',
    primaryColor: '#C9A84C',
    secondaryColor: '#152040',
    backgroundColor: '#0A0F1E',
    textColor: '#F5E6C8',
    buttonColor: '#C9A84C',
    accentColor: '#E0C878',
    enableRsvp: true,
    enableCountdown: true,
    enableGallery: true,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/auth');
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthed(true);
        } else {
          router.replace('/admin/login');
        }
      } catch {
        router.replace('/admin/login');
      } finally {
        setIsChecking(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleFormChange = useCallback((data: WeddingFormValues) => {
    setPreviewData({
      groomName: data.groomName,
      brideName: data.brideName,
      weddingDate: data.weddingDate,
      weddingTime: data.weddingTime,
      venueName: data.venueName,
      venueAddress: data.venueAddress,
      welcomeMessage: data.welcomeMessage,
      coverImage: data.coverImage,
      couplePhoto: data.couplePhoto,
      theme: data.theme,
      primaryColor: data.primaryColor,
      secondaryColor: data.secondaryColor,
      backgroundColor: data.backgroundColor,
      textColor: data.textColor,
      buttonColor: data.buttonColor,
      accentColor: data.accentColor,
      enableRsvp: data.enableRsvp,
      enableCountdown: data.enableCountdown,
      enableGallery: data.enableGallery,
    });
  }, []);

  const handleSubmit = async (data: WeddingFormValues) => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/weddings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success && result.data) {
        toast.success('تم إنشاء الزفاف بنجاح! 🎉');
        setCreatedWedding({
          id: result.data.id,
          slug: result.data.slug,
          groomName: result.data.groomName,
          brideName: result.data.brideName,
          primaryColor: result.data.primaryColor,
          backgroundColor: result.data.backgroundColor,
          textColor: result.data.textColor,
          buttonColor: result.data.buttonColor,
          accentColor: result.data.accentColor,
          secondaryColor: result.data.secondaryColor,
          theme: result.data.theme,
        });
      } else {
        toast.error(result.error || 'فشل في إنشاء الزفاف');
      }
    } catch {
      toast.error('فشل في إنشاء الزفاف');
    } finally {
      setIsLoading(false);
    }
  };

  // Show CreationSuccess if wedding was created
  if (createdWedding) {
    return <CreationSuccess wedding={createdWedding} />;
  }

  if (isChecking) {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center" style={{ background: 'var(--admin-surface)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <span className="h-10 w-10 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: 'var(--wedding-gold)', borderTopColor: 'transparent' }} />
          </div>
          <p className="text-sm" style={{ color: 'var(--admin-text-secondary)' }}>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!isAuthed) return null;

  return (
    <div dir="rtl" className="min-h-screen" style={{ background: 'var(--admin-surface)', color: 'var(--admin-text-primary)' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 backdrop-blur-xl"
        style={{
          background: 'var(--admin-surface-raised)',
          borderBottom: '1px solid var(--admin-border)',
        }}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: 'linear-gradient(135deg, var(--wedding-gold), var(--wedding-gold-dark))' }}
            >
              <Heart className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold" style={{ color: 'var(--admin-text-primary)' }}>
                إنشاء زفاف جديد
              </h1>
              <p className="text-xs" style={{ color: 'var(--admin-text-muted)' }}>
                <Sparkles className="inline h-3 w-3 ml-1" style={{ color: 'var(--wedding-gold)' }} />
                ابدأ رحلة دعوة استثنائية
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Mobile preview toggle */}
            {isMobile && (
              <Button
                variant="ghost"
                onClick={() => setPreviewOpen(!previewOpen)}
                className="transition-colors"
                style={{ color: 'var(--wedding-gold)' }}
              >
                <Eye className="h-5 w-5" />
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={() => router.push('/admin')}
              className="transition-colors"
              style={{ color: 'var(--admin-text-secondary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--admin-surface-overlay)';
                e.currentTarget.style.color = 'var(--wedding-gold)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--admin-text-secondary)';
              }}
            >
              <ArrowRight className="ml-2 h-4 w-4" />
              العودة
            </Button>
          </div>
        </div>
      </header>

      {/* Form + Preview Layout */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="mx-auto max-w-6xl px-4 py-8"
      >
        <div className="flex gap-8">
          {/* Form area */}
          <div className={`flex-1 min-w-0 ${!isMobile ? 'max-w-4xl' : ''}`}>
            <WeddingForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              onFormChange={handleFormChange}
            />
          </div>

          {/* Desktop Preview sidebar */}
          {!isMobile && (
            <div className="w-[360px] shrink-0 hidden lg:block">
              <LivePreview formData={previewData} />
            </div>
          )}
        </div>
      </motion.main>

      {/* Mobile Preview overlay */}
      {isMobile && (
        <LivePreview
          formData={previewData}
          isOpen={previewOpen}
          onToggle={() => setPreviewOpen(!previewOpen)}
        />
      )}
    </div>
  );
}
