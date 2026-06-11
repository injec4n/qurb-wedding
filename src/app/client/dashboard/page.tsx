'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Heart,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Copy,
  ExternalLink,
  MessageCircle,
  Facebook,
  Send,
  Link2,
  LogOut,
  Plus,
  Users,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface WeddingData {
  id: string;
  slug: string;
  groomName: string;
  brideName: string;
  weddingDate: string;
  venueName: string;
}

interface Stats {
  visitCount: number;
  totalGuests: number;
  attendingCount: number;
  notAttendingCount: number;
  pendingCount: number;
}

interface Guest {
  id: string;
  name: string;
  phone: string;
  guestLink: string;
  rsvp?: {
    status: string;
    message: string;
  };
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');

  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [wedding, setWedding] = useState<WeddingData | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [guestName, setGuestName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [isAddingGuest, setIsAddingGuest] = useState(false);

  // Auth check
  useEffect(() => {
    if (!slug) {
      router.push('/client/login');
      return;
    }

    const checkAuth = async () => {
      try {
        const res = await fetch(
          `/api/client/auth?slug=${encodeURIComponent(slug)}`
        );
        const data = await res.json();
        if (!data.authenticated) {
          router.push('/client/login');
          return;
        }
        setIsAuth(true);
      } catch {
        router.push('/client/login');
      }
    };

    checkAuth();
  }, [slug, router]);

  // Fetch wedding data
  const fetchWedding = useCallback(async () => {
    if (!slug) return;
    try {
      const res = await fetch(`/api/weddings/slug/${encodeURIComponent(slug)}`);
      const data = await res.json();
      if (data.success) {
        setWedding(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch wedding:', err);
    }
  }, [slug]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    if (!wedding?.id) return;
    try {
      const res = await fetch(`/api/weddings/${wedding.id}/stats`);
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, [wedding?.id]);

  // Fetch guests
  const fetchGuests = useCallback(async () => {
    if (!wedding?.id) return;
    try {
      const res = await fetch(`/api/weddings/${wedding.id}/guests`);
      const data = await res.json();
      if (data.success) {
        setGuests(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch guests:', err);
    }
  }, [wedding?.id]);

  // Load data after auth confirmed
  useEffect(() => {
    if (isAuth) {
      const load = async () => {
        setIsLoading(true);
        await fetchWedding();
        setIsLoading(false);
      };
      load();
    }
  }, [isAuth, fetchWedding]);

  // Fetch stats & guests once wedding data is available
  useEffect(() => {
    if (wedding?.id) {
      fetchStats();
      fetchGuests();
    }
  }, [wedding?.id, fetchStats, fetchGuests]);

  const invitationUrl =
    typeof window !== 'undefined' && slug
      ? `${window.location.origin}/w/${slug}`
      : '';

  const shareText = wedding
    ? `يدعوكم ${wedding.groomName} و ${wedding.brideName} لحضور حفل زفافهما - ${wedding.weddingDate} - ${wedding.venueName}`
    : '';

  const handleCopyInvitationLink = async () => {
    try {
      await navigator.clipboard.writeText(invitationUrl);
      toast.success('تم نسخ رابط الدعوة ✨');
    } catch {
      toast.error('فشل في نسخ الرابط');
    }
  };

  const handleOpenInvitation = () => {
    window.open(`/w/${slug}`, '_blank');
  };

  const handleGenerateGuestLink = async () => {
    if (!guestName.trim() || !wedding?.id) return;

    setIsAddingGuest(true);
    try {
      const res = await fetch(`/api/weddings/${wedding.id}/guests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: guestName.trim() })
      });
      const data = await res.json();

      if (data.success) {
        const link = `/w/${slug}?g=${encodeURIComponent(guestName.trim())}`;
        setGeneratedLink(`${window.location.origin}${link}`);
        setGuestName('');
        toast.success('تم إنشاء رابط الضيف ✨');
        fetchGuests(); // Refresh guest list
      } else {
        toast.error(data.error || 'فشل في إنشاء رابط الضيف');
      }
    } catch {
      toast.error('حدث خطأ في الاتصال');
    } finally {
      setIsAddingGuest(false);
    }
  };

  const handleCopyGuestLink = (guestLink: string) => {
    const url = guestLink.startsWith('http')
      ? guestLink
      : `${window.location.origin}/w/${slug}?g=${guestLink}`;
    navigator.clipboard.writeText(url);
    toast.success('تم نسخ رابط الضيف ✨');
  };

  const handleCopyGeneratedLink = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      toast.success('تم نسخ الرابط ✨');
    } catch {
      toast.error('فشل في نسخ الرابط');
    }
  };

  const handleWhatsAppShare = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(shareText + '\n' + invitationUrl)}`,
      '_blank'
    );
  };

  const handleFacebookShare = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(invitationUrl)}`,
      '_blank'
    );
  };

  const handleTelegramShare = () => {
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(invitationUrl)}&text=${encodeURIComponent(shareText)}`,
      '_blank'
    );
  };

  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(invitationUrl);
      toast.success('تم نسخ رابط الدعوة ✨');
    } catch {
      toast.error('فشل في نسخ الرابط');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`/api/client/auth?slug=${encodeURIComponent(slug || '')}`, {
        method: 'DELETE'
      });
      router.push('/client/login');
    } catch {
      router.push('/client/login');
    }
  };

  // Loading state
  if (isAuth === null || isLoading) {
    return (
      <div
        dir="rtl"
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--wedding-deep)' }}
      >
        <div className="flex flex-col items-center gap-4">
          <span
            className="h-10 w-10 animate-spin rounded-full border-2 border-t-transparent"
            style={{
              borderColor: 'var(--wedding-gold)',
              borderTopColor: 'transparent'
            }}
          />
          <p className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>
            جاري تحميل لوحة التحكم...
          </p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'الزيارات',
      value: stats?.visitCount || 0,
      icon: Eye,
      color: '#D4A853'
    },
    {
      label: 'تم التأكيد',
      value: stats?.attendingCount || 0,
      icon: CheckCircle,
      color: '#22C55E'
    },
    {
      label: 'تم الاعتذار',
      value: stats?.notAttendingCount || 0,
      icon: XCircle,
      color: '#EF4444'
    },
    {
      label: 'في الانتظار',
      value: stats?.pendingCount || 0,
      icon: Clock,
      color: '#F59E0B'
    }
  ];

  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col"
      style={{
        background:
          'linear-gradient(180deg, #0D0D1A 0%, #1A1A2E 30%, #0D0D1A 100%)'
      }}
    >
      {/* Decorative background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-[0.03]"
          style={{
            background: 'radial-gradient(circle, #D4A853, transparent 70%)'
          }}
        />
      </div>

      <div className="relative z-10 flex-1 w-full max-w-4xl mx-auto px-4 py-6 sm:py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Heart
              className="h-6 w-6"
              style={{ color: 'var(--wedding-gold)' }}
            />
            <h1
              className="text-2xl sm:text-3xl font-bold"
              style={{ color: 'var(--admin-text-primary)' }}
            >
              {wedding?.groomName} و {wedding?.brideName}
            </h1>
            <Heart
              className="h-6 w-6"
              style={{ color: 'var(--wedding-gold)' }}
            />
          </div>
          <p className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>
            لوحة تحكم الدعوة
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4 mb-6"
        >
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.08 }}
              className="admin-card p-4 sm:p-5 text-center"
            >
              <div className="flex items-center justify-center mb-2">
                <div
                  className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: stat.color + '15' }}
                >
                  <stat.icon
                    className="h-5 w-5 sm:h-6 sm:w-6"
                    style={{ color: stat.color }}
                  />
                </div>
              </div>
              <p
                className="text-2xl sm:text-3xl font-bold mb-1"
                style={{ color: 'var(--admin-text-primary)' }}
              >
                {stat.value}
              </p>
              <p
                className="text-xs sm:text-sm"
                style={{ color: 'var(--admin-text-muted)' }}
              >
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Invitation URL Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="admin-card overflow-hidden mb-6"
          style={{ borderTop: '2px solid var(--wedding-gold)' }}
        >
          <div className="p-5 sm:p-6">
            <h3
              className="flex items-center gap-3 text-base font-bold mb-4"
              style={{ color: 'var(--admin-text-primary)' }}
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ background: 'rgba(212,168,83,0.12)' }}
              >
                <Link2
                  className="h-4 w-4"
                  style={{ color: 'var(--wedding-gold)' }}
                />
              </div>
              رابط الدعوة
            </h3>
            <div
              className="flex items-center gap-3 p-3 sm:p-4 rounded-xl"
              style={{
                background: 'var(--admin-surface)',
                border: '1px solid var(--admin-border)'
              }}
            >
              <p
                className="flex-1 text-sm truncate font-mono"
                dir="ltr"
                style={{ color: 'var(--admin-text-secondary)' }}
              >
                {invitationUrl || `/w/${slug}`}
              </p>
              <button
                onClick={handleCopyInvitationLink}
                className="flex items-center justify-center h-9 w-9 rounded-lg shrink-0 transition-all duration-300"
                style={{
                  color: 'var(--wedding-gold)',
                  background: 'rgba(212,168,83,0.1)'
                }}
                title="نسخ الرابط"
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                onClick={handleOpenInvitation}
                className="flex items-center justify-center h-9 w-9 rounded-lg shrink-0 transition-all duration-300"
                style={{
                  color: 'var(--wedding-gold)',
                  background: 'rgba(212,168,83,0.1)'
                }}
                title="فتح الدعوة"
              >
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Guest Link Generator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="admin-card overflow-hidden mb-6"
          style={{ borderTop: '2px solid var(--wedding-gold)' }}
        >
          <div className="p-5 sm:p-6">
            <h3
              className="flex items-center gap-3 text-base font-bold mb-4"
              style={{ color: 'var(--admin-text-primary)' }}
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ background: 'rgba(212,168,83,0.12)' }}
              >
                <Plus
                  className="h-4 w-4"
                  style={{ color: 'var(--wedding-gold)' }}
                />
              </div>
              إنشاء رابط ضيف
            </h3>

            {/* Input row */}
            <div className="flex gap-3 mb-4">
              <Input
                type="text"
                value={guestName}
                onChange={e => setGuestName(e.target.value)}
                className="admin-input flex-1 h-11"
                placeholder="اسم الضيف"
                onKeyDown={e => {
                  if (e.key === 'Enter') handleGenerateGuestLink();
                }}
              />
              <Button
                onClick={handleGenerateGuestLink}
                disabled={isAddingGuest || !guestName.trim()}
                className="btn-wedding h-11 px-5 shrink-0"
              >
                {isAddingGuest ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'إنشاء رابط'
                )}
              </Button>
            </div>

            {/* Generated link display */}
            {generatedLink && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-4"
              >
                <div
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{
                    background: 'rgba(212,168,83,0.06)',
                    border: '1px solid rgba(212,168,83,0.2)'
                  }}
                >
                  <p
                    className="flex-1 text-sm truncate font-mono"
                    dir="ltr"
                    style={{ color: 'var(--wedding-gold-light)' }}
                  >
                    {generatedLink}
                  </p>
                  <button
                    onClick={handleCopyGeneratedLink}
                    className="flex items-center justify-center h-8 w-8 rounded-lg shrink-0"
                    style={{
                      color: 'var(--wedding-gold)',
                      background: 'rgba(212,168,83,0.1)'
                    }}
                    title="نسخ الرابط"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Guest list */}
            <div className="flex items-center justify-between mb-3 mt-2">
              <span
                className="flex items-center gap-2 text-sm font-medium"
                style={{ color: 'var(--admin-text-secondary)' }}
              >
                <Users
                  className="h-4 w-4"
                  style={{ color: 'var(--wedding-gold)' }}
                />
                قائمة الضيوف
              </span>
              <span
                className="text-xs px-2.5 py-1 rounded-full"
                style={{
                  background: 'rgba(212,168,83,0.1)',
                  color: 'var(--wedding-gold)'
                }}
              >
                {guests.length} ضيف
              </span>
            </div>

            {guests.length === 0 ? (
              <div className="text-center py-8">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full mx-auto mb-3"
                  style={{ background: 'rgba(212,168,83,0.08)' }}
                >
                  <Users
                    className="h-7 w-7"
                    style={{ color: 'var(--wedding-gold)' }}
                  />
                </div>
                <p
                  className="text-sm font-medium mb-1"
                  style={{ color: 'var(--admin-text-primary)' }}
                >
                  لا يوجد ضيوف بعد 🌹
                </p>
                <p
                  className="text-xs"
                  style={{ color: 'var(--admin-text-muted)' }}
                >
                  أضف ضيوف من الحقل أعلاه لتوليد روابط الدعوة
                </p>
              </div>
            ) : (
              <div
                className="space-y-2 max-h-64 overflow-y-auto"
                style={{ scrollbarWidth: 'thin' }}
              >
                {guests.map((guest, index) => {
                  const guestUrl = `/w/${slug}?g=${guest.guestToken || guest.guestLink}`;
                  return (
                    <motion.div
                      key={guest.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}
                      className="flex items-center justify-between p-3 rounded-xl"
                      style={{
                        background: 'var(--admin-surface)',
                        border: '1px solid var(--admin-border)'
                      }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                          style={{
                            background:
                              guest.rsvp?.status === 'attending'
                                ? 'rgba(34,197,94,0.12)'
                                : guest.rsvp?.status === 'not-attending'
                                  ? 'rgba(239,68,68,0.12)'
                                  : 'rgba(212,168,83,0.1)',
                            color:
                              guest.rsvp?.status === 'attending'
                                ? '#22C55E'
                                : guest.rsvp?.status === 'not-attending'
                                  ? '#EF4444'
                                  : 'var(--wedding-gold)'
                          }}
                        >
                          {guest.rsvp?.status === 'attending'
                            ? '✓'
                            : guest.rsvp?.status === 'not-attending'
                              ? '✗'
                              : index + 1}
                        </div>
                        <div className="min-w-0">
                          <p
                            className="text-sm font-medium truncate"
                            style={{ color: 'var(--admin-text-primary)' }}
                          >
                            {guest.name}
                          </p>
                          <p
                            className="text-xs truncate"
                            style={{ color: 'var(--admin-text-muted)' }}
                            dir="ltr"
                          >
                            {guestUrl}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {guest.rsvp && (
                          <span
                            className="text-[10px] px-2 py-0.5 rounded-md font-medium"
                            style={{
                              background:
                                guest.rsvp.status === 'attending'
                                  ? 'rgba(34,197,94,0.1)'
                                  : guest.rsvp.status === 'not-attending'
                                    ? 'rgba(239,68,68,0.1)'
                                    : 'rgba(245,158,11,0.1)',
                              color:
                                guest.rsvp.status === 'attending'
                                  ? '#22C55E'
                                  : guest.rsvp.status === 'not-attending'
                                    ? '#EF4444'
                                    : '#F59E0B'
                            }}
                          >
                            {guest.rsvp.status === 'attending'
                              ? 'مؤكد'
                              : guest.rsvp.status === 'not-attending'
                                ? 'معتذر'
                                : 'معلق'}
                          </span>
                        )}
                        <button
                          onClick={() =>
                            handleCopyGuestLink(
                              guest.guestToken || guest.guestLink
                            )
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-lg"
                          style={{
                            color: 'var(--wedding-gold)',
                            background: 'rgba(212,168,83,0.08)'
                          }}
                          title="نسخ رابط الضيف"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>

        {/* Share Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="admin-card overflow-hidden mb-8"
          style={{ borderTop: '2px solid var(--wedding-gold)' }}
        >
          <div className="p-5 sm:p-6">
            <h3
              className="flex items-center gap-3 text-base font-bold mb-4"
              style={{ color: 'var(--admin-text-primary)' }}
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ background: 'rgba(212,168,83,0.12)' }}
              >
                <Send
                  className="h-4 w-4"
                  style={{ color: 'var(--wedding-gold)' }}
                />
              </div>
              مشاركة الدعوة
            </h3>

            <div className="flex items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleWhatsAppShare}
                className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300"
                style={{
                  backgroundColor: '#25D36615',
                  border: '1px solid #25D36625'
                }}
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: '#25D36620' }}
                >
                  <MessageCircle
                    className="h-6 w-6"
                    style={{ color: '#25D366' }}
                  />
                </div>
                <span
                  className="text-xs font-medium"
                  style={{ color: '#25D366' }}
                >
                  واتساب
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleFacebookShare}
                className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300"
                style={{
                  backgroundColor: '#1877F215',
                  border: '1px solid #1877F225'
                }}
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: '#1877F220' }}
                >
                  <Facebook className="h-6 w-6" style={{ color: '#1877F2' }} />
                </div>
                <span
                  className="text-xs font-medium"
                  style={{ color: '#1877F2' }}
                >
                  فيسبوك
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleTelegramShare}
                className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300"
                style={{
                  backgroundColor: '#0088cc15',
                  border: '1px solid #0088cc25'
                }}
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: '#0088cc20' }}
                >
                  <Send className="h-6 w-6" style={{ color: '#0088cc' }} />
                </div>
                <span
                  className="text-xs font-medium"
                  style={{ color: '#0088cc' }}
                >
                  تيليغرام
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCopyShareLink}
                className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300"
                style={{
                  backgroundColor: 'rgba(212,168,83,0.08)',
                  border: '1px solid rgba(212,168,83,0.15)'
                }}
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: 'rgba(212,168,83,0.12)' }}
                >
                  <Link2
                    className="h-6 w-6"
                    style={{ color: 'var(--wedding-gold)' }}
                  />
                </div>
                <span
                  className="text-xs font-medium"
                  style={{ color: 'var(--wedding-gold)' }}
                >
                  نسخ الرابط
                </span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mb-8"
        >
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300"
            style={{
              background: 'rgba(239,68,68,0.08)',
              color: '#EF4444',
              border: '1px solid rgba(239,68,68,0.15)'
            }}
          >
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </button>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center pb-6"
        >
          <div className="ornament-separator mb-4">
            <div
              className="diamond"
              style={{ background: 'var(--wedding-gold)' }}
            />
          </div>
          <p className="text-xs" style={{ color: 'var(--admin-text-muted)' }}>
            قُرب © {new Date().getFullYear()} — منصة دعوات الزفاف
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function ClientDashboardPage() {
  return (
    <Suspense
      fallback={
        <div
          dir="rtl"
          className="min-h-screen flex items-center justify-center"
          style={{ background: 'var(--wedding-deep)' }}
        >
          <div className="flex flex-col items-center gap-4">
            <span
              className="h-10 w-10 animate-spin rounded-full border-2 border-t-transparent"
              style={{
                borderColor: 'var(--wedding-gold)',
                borderTopColor: 'transparent'
              }}
            />
            <p className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>
              جاري تحميل لوحة التحكم...
            </p>
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
