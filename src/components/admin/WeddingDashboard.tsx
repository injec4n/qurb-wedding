'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Copy,
  Download,
  ExternalLink,
  Heart,
  Link2,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface WeddingDashboardProps {
  weddingId: string;
  weddingSlug: string;
  groomName: string;
  brideName: string;
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
  guestToken: string;
  rsvp?: {
    status: string;
    message: string;
  };
}

export default function WeddingDashboard({
  weddingId,
  weddingSlug,
  groomName,
  brideName
}: WeddingDashboardProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingCard, setDownloadingCard] = useState(false);
  const [downloadingStory, setDownloadingStory] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`/api/weddings/${weddingId}/stats`);
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, [weddingId]);

  const fetchGuests = useCallback(async () => {
    try {
      const res = await fetch(`/api/weddings/${weddingId}/guests`);
      const data = await res.json();
      if (data.success) {
        setGuests(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch guests:', err);
    }
  }, [weddingId]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await Promise.all([fetchStats(), fetchGuests()]);
      setIsLoading(false);
    };
    load();
  }, [fetchStats, fetchGuests]);

  const copyInvitationLink = () => {
    const url = `${window.location.origin}/w/${weddingSlug}`;
    navigator.clipboard.writeText(url);
    toast.success('تم نسخ رابط الدعوة ✨');
  };

  const copyGuestLink = (guest: Guest) => {
    const token = guest.guestToken || guest.guestLink;
    const url = `${window.location.origin}/w/${weddingSlug}?g=${token}`;

    navigator.clipboard.writeText(url);
    toast.success('تم نسخ رابط الضيف ✨');
  };

  const openInvitation = () => {
    window.open(`/w/${weddingSlug}`, '_blank');
  };

  const downloadWhatsAppCard = async () => {
    setDownloadingCard(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const card = document.getElementById('whatsapp-card-preview');
      if (card) {
        const canvas = await html2canvas(card, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#0D0D1A'
        });
        const link = document.createElement('a');
        link.download = `wedding-card-${weddingSlug}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        toast.success('تم تحميل بطاقة واتساب ✨');
      }
    } catch (err) {
      console.error('Download error:', err);
      toast.error('فشل في تحميل البطاقة');
    } finally {
      setDownloadingCard(false);
    }
  };

  const downloadInstagramStory = async () => {
    setDownloadingStory(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const story = document.getElementById('instagram-story-preview');
      if (story) {
        const canvas = await html2canvas(story, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#0D0D1A'
        });
        const link = document.createElement('a');
        link.download = `wedding-story-${weddingSlug}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        toast.success('تم تحميل ستوري إنستاجرام ✨');
      }
    } catch (err) {
      console.error('Download error:', err);
      toast.error('فشل في تحميل الستوري');
    } finally {
      setDownloadingStory(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
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
      label: 'إجمالي الزيارات',
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
    <div className="space-y-6" dir="rtl">
      {/* Wedding Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center py-4"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <Heart className="h-5 w-5" style={{ color: 'var(--wedding-gold)' }} />
          <h2
            className="text-2xl sm:text-3xl font-bold"
            style={{ color: 'var(--admin-text-primary)' }}
          >
            {groomName} و {brideName}
          </h2>
          <Heart className="h-5 w-5" style={{ color: 'var(--wedding-gold)' }} />
        </div>
        <p className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>
          لوحة تحكم دعوة الزفاف
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="admin-card p-5 sm:p-6 text-center"
          >
            <div className="flex items-center justify-center mb-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: stat.color + '15' }}
              >
                <stat.icon className="h-6 w-6" style={{ color: stat.color }} />
              </div>
            </div>
            <p
              className="text-3xl sm:text-4xl font-bold mb-1"
              style={{ color: 'var(--admin-text-primary)' }}
            >
              {stat.value}
            </p>
            <p className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="admin-card overflow-hidden"
        style={{ borderTop: '2px solid var(--wedding-gold)' }}
      >
        <div className="p-6 pb-4">
          <h3
            className="flex items-center gap-3 text-lg font-bold"
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
            إجراءات سريعة
          </h3>
        </div>
        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {/* Copy Link */}
            <button
              onClick={copyInvitationLink}
              className="flex items-center gap-3 p-4 rounded-xl transition-all duration-300"
              style={{
                background: 'var(--admin-surface)',
                border: '1px solid var(--admin-border)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--wedding-gold)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--admin-border)';
              }}
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ background: 'rgba(212,168,83,0.1)' }}
              >
                <Copy
                  className="h-5 w-5"
                  style={{ color: 'var(--wedding-gold)' }}
                />
              </div>
              <div className="text-right">
                <p
                  className="text-sm font-semibold"
                  style={{ color: 'var(--admin-text-primary)' }}
                >
                  نسخ رابط الدعوة
                </p>
                <p
                  className="text-xs"
                  style={{ color: 'var(--admin-text-muted)' }}
                  dir="ltr"
                >
                  /w/{weddingSlug}
                </p>
              </div>
            </button>

            {/* Open Invitation */}
            <button
              onClick={openInvitation}
              className="flex items-center gap-3 p-4 rounded-xl transition-all duration-300"
              style={{
                background: 'var(--admin-surface)',
                border: '1px solid var(--admin-border)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--wedding-gold)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--admin-border)';
              }}
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ background: 'rgba(212,168,83,0.1)' }}
              >
                <ExternalLink
                  className="h-5 w-5"
                  style={{ color: 'var(--wedding-gold)' }}
                />
              </div>
              <div className="text-right">
                <p
                  className="text-sm font-semibold"
                  style={{ color: 'var(--admin-text-primary)' }}
                >
                  فتح الدعوة
                </p>
                <p
                  className="text-xs"
                  style={{ color: 'var(--admin-text-muted)' }}
                >
                  عرض الدعوة في تبويب جديد
                </p>
              </div>
            </button>

            {/* Download WhatsApp Card */}
            <button
              onClick={downloadWhatsAppCard}
              disabled={downloadingCard}
              className="flex items-center gap-3 p-4 rounded-xl transition-all duration-300 disabled:opacity-50"
              style={{
                background: 'var(--admin-surface)',
                border: '1px solid var(--admin-border)'
              }}
              onMouseEnter={e => {
                if (!downloadingCard)
                  e.currentTarget.style.borderColor = '#25D366';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--admin-border)';
              }}
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ background: 'rgba(37,211,102,0.1)' }}
              >
                {downloadingCard ? (
                  <Loader2
                    className="h-5 w-5 animate-spin"
                    style={{ color: '#25D366' }}
                  />
                ) : (
                  <Download className="h-5 w-5" style={{ color: '#25D366' }} />
                )}
              </div>
              <div className="text-right">
                <p
                  className="text-sm font-semibold"
                  style={{ color: 'var(--admin-text-primary)' }}
                >
                  بطاقة واتساب
                </p>
                <p
                  className="text-xs"
                  style={{ color: 'var(--admin-text-muted)' }}
                >
                  تحميل بطاقة للمشاركة
                </p>
              </div>
            </button>

            {/* Download Instagram Story */}
            <button
              onClick={downloadInstagramStory}
              disabled={downloadingStory}
              className="flex items-center gap-3 p-4 rounded-xl transition-all duration-300 disabled:opacity-50"
              style={{
                background: 'var(--admin-surface)',
                border: '1px solid var(--admin-border)'
              }}
              onMouseEnter={e => {
                if (!downloadingStory)
                  e.currentTarget.style.borderColor = '#E1306C';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--admin-border)';
              }}
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ background: 'rgba(225,48,108,0.1)' }}
              >
                {downloadingStory ? (
                  <Loader2
                    className="h-5 w-5 animate-spin"
                    style={{ color: '#E1306C' }}
                  />
                ) : (
                  <Download className="h-5 w-5" style={{ color: '#E1306C' }} />
                )}
              </div>
              <div className="text-right">
                <p
                  className="text-sm font-semibold"
                  style={{ color: 'var(--admin-text-primary)' }}
                >
                  ستوري إنستاجرام
                </p>
                <p
                  className="text-xs"
                  style={{ color: 'var(--admin-text-muted)' }}
                >
                  تحميل ستوري للمشاركة
                </p>
              </div>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Guest List with Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="admin-card overflow-hidden"
        style={{ borderTop: '2px solid var(--wedding-gold)' }}
      >
        <div className="p-6 pb-4 flex items-center justify-between">
          <h3
            className="flex items-center gap-3 text-lg font-bold"
            style={{ color: 'var(--admin-text-primary)' }}
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ background: 'rgba(212,168,83,0.12)' }}
            >
              <Users
                className="h-4 w-4"
                style={{ color: 'var(--wedding-gold)' }}
              />
            </div>
            قائمة الضيوف وروابط الدعوة
          </h3>
          <span
            className="text-sm px-3 py-1 rounded-full"
            style={{
              background: 'rgba(212,168,83,0.1)',
              color: 'var(--wedding-gold)'
            }}
          >
            {guests.length} ضيف
          </span>
        </div>
        <div className="px-6 pb-6">
          {guests.length === 0 ? (
            <div className="text-center py-12">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full mx-auto mb-4"
                style={{ background: 'rgba(212,168,83,0.08)' }}
              >
                <Users
                  className="h-8 w-8"
                  style={{ color: 'var(--wedding-gold)' }}
                />
              </div>
              <p
                className="text-base font-medium mb-2"
                style={{ color: 'var(--admin-text-primary)' }}
              >
                لا يوجد ضيوف بعد 🌹
              </p>
              <p
                className="text-sm"
                style={{ color: 'var(--admin-text-muted)' }}
              >
                أضف ضيوف من تبويب الضيوف لتوليد روابط الدعوة
              </p>
            </div>
          ) : (
            <div
              className="space-y-2 max-h-96 overflow-y-auto"
              style={{ scrollbarWidth: 'thin' }}
            >
              {guests.map((guest, index) => {
                const guestUrl = `/w/${weddingSlug}?g=${guest.guestToken || guest.guestLink}`;
                return (
                  <motion.div
                    key={guest.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 sm:p-4 rounded-xl transition-all duration-300"
                    style={{
                      background: 'var(--admin-surface)',
                      border: '1px solid var(--admin-border)'
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold"
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
                          className="text-sm font-semibold truncate"
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
                          className="text-xs px-2 py-1 rounded-md font-medium"
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
                        onClick={() => copyGuestLink(guest)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300"
                        style={{
                          color: 'var(--wedding-gold)',
                          background: 'rgba(212,168,83,0.08)'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background =
                            'rgba(212,168,83,0.15)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background =
                            'rgba(212,168,83,0.08)';
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
    </div>
  );
}
