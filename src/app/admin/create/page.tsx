'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import WeddingForm from '@/components/admin/WeddingForm';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart } from 'lucide-react';
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
        toast.success('تم إنشاء الزفاف بنجاح! يمكنك الآن فتح الرابط: /w/' + data.slug);
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
      <div dir="rtl" className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <span className="h-10 w-10 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthed) return null;

  return (
    <div dir="rtl" className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-900/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-600">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-zinc-100">إنشاء زفاف جديد</h1>
          </div>
          <Button
            variant="ghost"
            onClick={() => router.push('/admin')}
            className="text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
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
        transition={{ duration: 0.3 }}
        className="mx-auto max-w-4xl px-4 py-8"
      >
        <WeddingForm onSubmit={handleSubmit} isLoading={isLoading} />
      </motion.main>
    </div>
  );
}
