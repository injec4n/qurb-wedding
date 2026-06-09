'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Wedding } from '@/types/wedding';
import WeddingForm from '@/components/admin/WeddingForm';
import GuestManager from '@/components/admin/GuestManager';
import RsvpTable from '@/components/admin/RsvpTable';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Heart, Users, Calendar, Pencil, ExternalLink } from 'lucide-react';
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

export default function EditWeddingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

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
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!isAuthed) return;
    const fetchWedding = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/weddings/${id}`);
        const data = await res.json();
        if (data.success) {
          setWedding(data.data);
        } else {
          toast.error('الزفاف غير موجود');
          router.push('/admin');
        }
      } catch {
        toast.error('فشل في جلب بيانات الزفاف');
        router.push('/admin');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWedding();
  }, [id, router, isAuthed]);

  const handleSubmit = async (data: WeddingFormValues) => {
    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/weddings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        toast.success('تم تحديث الزفاف بنجاح');
        router.push('/admin');
      } else {
        toast.error(result.error || 'فشل في تحديث الزفاف');
      }
    } catch {
      toast.error('فشل في تحديث الزفاف');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !isAuthed) {
    return (
      <div dir="rtl" className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="flex items-center justify-center py-32">
          <span className="h-10 w-10 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!wedding) {
    return null;
  }

  return (
    <div dir="rtl" className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-900/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-600">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-100">تعديل الزفاف</h1>
              <p className="text-xs text-zinc-400">
                {wedding.groomName} و {wedding.brideName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`/w/${wedding.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300"
            >
              <ExternalLink className="h-4 w-4" />
              عرض الدعوة
            </a>
            <Button
              variant="ghost"
              onClick={() => router.push('/admin')}
              className="text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
            >
              <ArrowRight className="ml-2 h-4 w-4" />
              العودة
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mx-auto max-w-5xl px-4 py-8"
      >
        <Tabs defaultValue="edit" className="space-y-6">
          <TabsList className="bg-zinc-800 border border-zinc-700">
            <TabsTrigger
              value="edit"
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white text-zinc-300"
            >
              <Pencil className="ml-2 h-4 w-4" />
              تعديل الزفاف
            </TabsTrigger>
            <TabsTrigger
              value="guests"
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white text-zinc-300"
            >
              <Users className="ml-2 h-4 w-4" />
              الضيوف
            </TabsTrigger>
            <TabsTrigger
              value="rsvps"
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white text-zinc-300"
            >
              <Calendar className="ml-2 h-4 w-4" />
              الردود
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit">
            <Card className="border-zinc-700 bg-zinc-800/30">
              <CardHeader>
                <CardTitle className="text-zinc-100">بيانات الزفاف</CardTitle>
              </CardHeader>
              <CardContent>
                <WeddingForm
                  initialData={wedding}
                  onSubmit={handleSubmit}
                  isLoading={isSubmitting}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guests">
            <GuestManager
              weddingId={id}
              weddingSlug={wedding.slug}
            />
          </TabsContent>

          <TabsContent value="rsvps">
            <RsvpTable weddingId={id} />
          </TabsContent>
        </Tabs>
      </motion.main>
    </div>
  );
}
