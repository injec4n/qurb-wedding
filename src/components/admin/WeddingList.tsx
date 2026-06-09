'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Wedding } from '@/types/wedding';
import { formatDateArabic } from '@/lib/wedding-utils';
import { themeOptions, getTheme } from '@/lib/themes';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Pencil, Trash2, ExternalLink, Plus, Users, Calendar, Heart, MapPin, Eye, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface WeddingWithCounts extends Wedding {
  _count?: {
    guests: number;
    rsvps: number;
  };
}

export default function WeddingList() {
  const router = useRouter();
  const [weddings, setWeddings] = useState<WeddingWithCounts[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalGuests, setTotalGuests] = useState(0);
  const [totalRsvps, setTotalRsvps] = useState(0);

  const fetchWeddings = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/weddings');
      const data = await res.json();
      if (data.success) {
        setWeddings(data.data);
        const guests = data.data.reduce(
          (sum: number, w: WeddingWithCounts) => sum + (w._count?.guests || 0),
          0
        );
        const rsvps = data.data.reduce(
          (sum: number, w: WeddingWithCounts) => sum + (w._count?.rsvps || 0),
          0
        );
        setTotalGuests(guests);
        setTotalRsvps(rsvps);
      }
    } catch {
      toast.error('فشل في جلب بيانات الزفات');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeddings();
  }, [fetchWeddings]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/weddings/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('تم حذف الزفاف بنجاح');
        fetchWeddings();
      } else {
        toast.error(data.error || 'فشل في حذف الزفاف');
      }
    } catch {
      toast.error('فشل في حذف الزفاف');
    }
  };

  const getThemeLabel = (themeName: string) => {
    const option = themeOptions.find(t => t.value === themeName);
    return option?.labelAr || themeName;
  };

  const getThemeColor = (themeName: string) => {
    const theme = getTheme(themeName as Wedding['theme']);
    return theme?.colors?.primary || '#D4A853';
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="admin-card card-glow p-5 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(212,168,83,0.2), rgba(212,168,83,0.05))' }}>
            <Heart className="h-7 w-7" style={{ color: 'var(--wedding-gold)' }} fill="currentColor" />
          </div>
          <div>
            <p className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>إجمالي الزفات</p>
            <p className="text-3xl font-bold text-gold-gradient">{weddings.length}</p>
          </div>
        </div>
        <div className="admin-card card-glow p-5 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05))' }}>
            <Users className="h-7 w-7 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>إجمالي الضيوف</p>
            <p className="text-3xl font-bold text-emerald-400">{totalGuests}</p>
          </div>
        </div>
        <div className="admin-card card-glow p-5 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(183,110,121,0.2), rgba(183,110,121,0.05))' }}>
            <Calendar className="h-7 w-7" style={{ color: 'var(--wedding-rose)' }} />
          </div>
          <div>
            <p className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>إجمالي الردود</p>
            <p className="text-3xl font-bold" style={{ color: 'var(--wedding-rose)' }}>{totalRsvps}</p>
          </div>
        </div>
      </div>

      {/* Create Button */}
      <div className="flex justify-start">
        <button
          onClick={() => router.push('/admin/create')}
          className="btn-wedding flex items-center gap-2 px-6 py-2.5 text-sm"
        >
          <Plus className="h-4 w-4" />
          إنشاء زفاف جديد
        </button>
      </div>

      {/* Wedding List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <span className="h-10 w-10 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: 'var(--wedding-gold)', borderTopColor: 'transparent' }} />
        </div>
      ) : weddings.length === 0 ? (
        <div className="admin-card p-12 flex flex-col items-center justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full mb-6" style={{ background: 'rgba(212,168,83,0.08)' }}>
            <Sparkles className="h-12 w-12" style={{ color: 'var(--wedding-gold)' }} />
          </div>
          <p className="text-xl font-bold mb-2 text-gold-gradient">ابدأ رحلتك مع زفاتي ✨</p>
          <p className="text-sm mb-6" style={{ color: 'var(--admin-text-muted)' }}>أول زفافك معانا قريب 🌹</p>
          <button
            onClick={() => router.push('/admin/create')}
            className="btn-wedding flex items-center gap-2 px-6 py-2.5 text-sm"
          >
            <Plus className="h-4 w-4" />
            إنشاء زفاف جديد
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {weddings.map((wedding) => {
            const themeColor = getThemeColor(wedding.theme);
            return (
              <div
                key={wedding.id}
                className="admin-card card-glow flex flex-col sm:flex-row sm:items-center gap-4 p-5"
                style={{ borderRight: `3px solid ${themeColor}` }}
              >
                {/* Wedding Info */}
                <div className="flex-1 min-w-0">
                  {/* Names */}
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold" style={{ color: 'var(--wedding-gold)' }}>
                      {wedding.groomName} و {wedding.brideName}
                    </h3>
                    <span
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{ background: `${themeColor}18`, color: themeColor, border: `1px solid ${themeColor}30` }}
                    >
                      {getThemeLabel(wedding.theme)}
                    </span>
                  </div>

                  {/* Date & Venue */}
                  <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: 'var(--admin-text-secondary)' }}>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" style={{ color: 'var(--admin-text-muted)' }} />
                      {formatDateArabic(wedding.weddingDate)}
                    </span>
                    {wedding.venueName && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" style={{ color: 'var(--admin-text-muted)' }} />
                        {wedding.venueName}
                      </span>
                    )}
                  </div>

                  {/* Guest/RSVP counts */}
                  <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: 'var(--admin-text-muted)' }}>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {wedding._count?.guests || 0} ضيف
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {wedding._count?.rsvps || 0} رد
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  {/* View Invitation Link - More prominent */}
                  <a
                    href={`/w/${wedding.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300"
                    style={{
                      background: 'rgba(212,168,83,0.08)',
                      color: 'var(--wedding-gold)',
                      border: '1px solid rgba(212,168,83,0.15)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(212,168,83,0.15)';
                      e.currentTarget.style.borderColor = 'rgba(212,168,83,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(212,168,83,0.08)';
                      e.currentTarget.style.borderColor = 'rgba(212,168,83,0.15)';
                    }}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>عرض الدعوة</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>

                  {/* Edit */}
                  <button
                    onClick={() => router.push(`/admin/${wedding.id}`)}
                    className="flex items-center justify-center h-9 w-9 rounded-xl transition-all duration-300"
                    style={{ color: 'var(--admin-text-secondary)', background: 'var(--admin-surface-overlay)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--wedding-gold)';
                      e.currentTarget.style.background = 'rgba(212,168,83,0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--admin-text-secondary)';
                      e.currentTarget.style.background = 'var(--admin-surface-overlay)';
                    }}
                    title="تعديل"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>

                  {/* Delete */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        className="flex items-center justify-center h-9 w-9 rounded-xl transition-all duration-300"
                        style={{ color: 'var(--admin-text-secondary)', background: 'var(--admin-surface-overlay)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#EF4444';
                          e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'var(--admin-text-secondary)';
                          e.currentTarget.style.background = 'var(--admin-surface-overlay)';
                        }}
                        title="حذف"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent style={{ background: 'var(--admin-surface-raised)', border: '1px solid var(--admin-border-strong)' }}>
                      <AlertDialogHeader>
                        <AlertDialogTitle style={{ color: 'var(--admin-text-primary)' }}>
                          تأكيد الحذف
                        </AlertDialogTitle>
                        <AlertDialogDescription style={{ color: 'var(--admin-text-secondary)' }}>
                          هل أنت متأكد من حذف زفاف {wedding.groomName} و {wedding.brideName}؟ لا يمكن التراجع عن هذا الإجراء.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          style={{ background: 'var(--admin-surface-overlay)', color: 'var(--admin-text-primary)', border: '1px solid var(--admin-border)' }}
                        >
                          إلغاء
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(wedding.id)}
                          className="bg-red-600 text-white hover:bg-red-700"
                        >
                          حذف
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
