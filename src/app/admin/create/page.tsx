'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import WeddingForm from '@/components/admin/WeddingForm';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

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

export default function CreateWeddingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

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

  const handleSubmit = async (data: WeddingFormValues) => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/weddings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        toast.success('تم إنشاء الزفاف بنجاح! 🎉');
        router.push('/admin');
      } else {
        toast.error(result.error || 'فشل في إنشاء الزفاف');
      }
    } catch {
      toast.error('فشل في إنشاء الزفاف');
    } finally {
      setIsLoading(false);
    }
  };

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
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
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
      </header>

      {/* Form */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="mx-auto max-w-4xl px-4 py-8"
      >
        <WeddingForm onSubmit={handleSubmit} isLoading={isLoading} />
      </motion.main>
    </div>
  );
}
