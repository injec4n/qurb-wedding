'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Wedding } from '@/types/wedding';
import { formatDateArabic } from '@/lib/wedding-utils';
import { themeOptions, getTheme } from '@/lib/themes';
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
import {
  Pencil, Trash2, Eye, Plus, Users, Calendar, Heart, MapPin,
  CheckCircle, Clock, Copy, ExternalLink, Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

interface WeddingWithCounts extends Wedding {
  visitCount?: number;
  _count?: {
    guests: number;
    rsvps: number;
  };
}

interface AggregateStats {
  totalWeddings: number;
  totalVisits: number;
  totalAttending: number;
  totalPending: number;
}

export default function WeddingList() {
  const router = useRouter();
  const [weddings, setWeddings] = useState<WeddingWithCounts[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [aggregateStats, setAggregateStats] = useState<AggregateStats>({
    totalWeddings: 0,
    totalVisits: 0,
    totalAttending: 0,
    totalPending: 0,
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchWeddings = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/weddings');
      const data = await res.json();
      if (data.success) {
        const weddingList: WeddingWithCounts[] = data.data;
        setWeddings(weddingList);

        // Calculate aggregate stats
        const totalWeddings = weddingList.length;
        const totalVisits = weddingList.reduce(
          (sum: number, w: WeddingWithCounts) => sum + (w.visitCount || 0),
          0
        );
        const totalAttending = weddingList.reduce(
          (sum: number, w: WeddingWithCounts) => sum + (w._count?.rsvps || 0),
          0
        );
        const totalGuests = weddingList.reduce(
          (sum: number, w: WeddingWithCounts) => sum + (w._count?.guests || 0),
          0
        );
        // Pending = total guests - those with RSVPs (approximate)
        const totalPending = totalGuests - totalAttending;

        setAggregateStats({
          totalWeddings,
          totalVisits,
          totalAttending,
          totalPending: totalPending > 0 ? totalPending : 0,
        });
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

  const copyInvitationLink = (slug: string, weddingId: string) => {
    const link = `${window.location.origin}/w/${slug}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedId(weddingId);
      toast.success('تم نسخ رابط الدعوة');
      setTimeout(() => setCopiedId(null), 2000);
    }).catch(() => {
      toast.error('فشل في نسخ الرابط');
    });
  };

  const statsCards = [
    {
      label: 'إجمالي الزفات',
      value: aggregateStats.totalWeddings,
      icon: Heart,
      iconColor: 'var(--wedding-gold)',
      iconBg: 'linear-gradient(135deg, rgba(212,168,83,0.2), rgba(212,168,83,0.05))',
      valueColor: 'text-gold-gradient',
    },
    {
      label: 'إجمالي الزيارات',
      value: aggregateStats.totalVisits,
      icon: Eye,
      iconColor: '#60A5FA',
      iconBg: 'linear-gradient(135deg, rgba(96,165,250,0.2), rgba(96,165,250,0.05))',
      valueColor: undefined,
      valueStyle: { color: '#60A5FA' },
    },
    {
      label: 'تأكيدات الحضور',
      value: aggregateStats.totalAttending,
      icon: CheckCircle,
      iconColor: '#34D399',
      iconBg: 'linear-gradient(135deg, rgba(52,211,153,0.2), rgba(52,211,153,0.05))',
      valueColor: undefined,
      valueStyle: { color: '#34D399' },
    },
    {
      label: 'في انتظار الرد',
      value: aggregateStats.totalPending,
      icon: Clock,
      iconColor: '#FBBF24',
      iconBg: 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(251,191,36,0.05))',
      valueColor: undefined,
      valueStyle: { color: '#FBBF24' },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards - 4 cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="admin-card card-glow p-4 sm:p-5 flex flex-col items-center sm:items-start sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div
                className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl shrink-0"
                style={{ background: stat.iconBg }}
              >
                <Icon className="h-6 w-6 sm:h-7 sm:w-7" style={{ color: stat.iconColor }} fill={stat.icon === Heart ? 'currentColor' : undefined} />
              </div>
              <div className="text-center sm:text-start">
                <p className="text-[11px] sm:text-sm" style={{ color: 'var(--admin-text-muted)' }}>{stat.label}</p>
                <p
                  className={`text-2xl sm:text-3xl font-bold ${stat.valueColor || ''}`}
                  style={stat.valueStyle}
                >
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
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
        /* Empty State - Premium */
        <div className="admin-card p-12 flex flex-col items-center justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full mb-6" style={{ background: 'rgba(212,168,83,0.08)' }}>
            <Sparkles className="h-12 w-12" style={{ color: 'var(--wedding-gold)' }} />
          </div>
          <p className="text-xl font-bold mb-2 text-gold-gradient">ابدأ رحلتك مع قُرب ✨</p>
          <p className="text-sm mb-6" style={{ color: 'var(--admin-text-muted)' }}>
            أنشئ أول دعوة زفاف وأضف لمسة من الأناقة والتميز
          </p>
          <button
            onClick={() => router.push('/admin/create')}
            className="btn-wedding flex items-center gap-2 px-6 py-2.5 text-sm"
          >
            <Plus className="h-4 w-4" />
            إنشاء زفاف جديد
          </button>
        </div>
      ) : (
        /* Wedding Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {weddings.map((wedding) => {
            const themeColor = getThemeColor(wedding.theme);
            const isCopied = copiedId === wedding.id;

            return (
              <div
                key={wedding.id}
                className="admin-card card-glow p-5 sm:p-6 flex flex-col gap-4"
                style={{ borderTop: `3px solid ${themeColor}` }}
              >
                {/* Header: Groom & Bride names + Theme badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold truncate" style={{ color: 'var(--wedding-gold)' }}>
                      {wedding.groomName} و {wedding.brideName}
                    </h3>
                  </div>
                  <span
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold shrink-0"
                    style={{ background: `${themeColor}18`, color: themeColor, border: `1px solid ${themeColor}30` }}
                  >
                    {getThemeLabel(wedding.theme)}
                  </span>
                </div>

                {/* Details: Date & Venue */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--admin-text-secondary)' }}>
                    <Calendar className="h-4 w-4 shrink-0" style={{ color: 'var(--admin-text-muted)' }} />
                    <span>{formatDateArabic(wedding.weddingDate)}</span>
                  </div>
                  {wedding.venueName && (
                    <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--admin-text-secondary)' }}>
                      <MapPin className="h-4 w-4 shrink-0" style={{ color: 'var(--admin-text-muted)' }} />
                      <span className="truncate">{wedding.venueName}</span>
                    </div>
                  )}
                </div>

                {/* Mini Stats Row */}
                <div className="flex items-center gap-1">
                  <div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
                    style={{ background: 'var(--admin-surface-overlay)', color: 'var(--admin-text-secondary)' }}
                  >
                    <Eye className="h-3.5 w-3.5" style={{ color: '#60A5FA' }} />
                    <span>{wedding.visitCount || 0}</span>
                  </div>
                  <div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
                    style={{ background: 'var(--admin-surface-overlay)', color: 'var(--admin-text-secondary)' }}
                  >
                    <Users className="h-3.5 w-3.5" style={{ color: '#34D399' }} />
                    <span>{wedding._count?.guests || 0}</span>
                  </div>
                  <div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
                    style={{ background: 'var(--admin-surface-overlay)', color: 'var(--admin-text-secondary)' }}
                  >
                    <Heart className="h-3.5 w-3.5" style={{ color: 'var(--wedding-rose)' }} />
                    <span>{wedding._count?.rsvps || 0}</span>
                  </div>
                </div>

                {/* Invitation Link - Copyable */}
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-300"
                  style={{
                    background: 'var(--admin-surface-overlay)',
                    border: '1px solid var(--admin-border)',
                  }}
                  onClick={() => copyInvitationLink(wedding.slug, wedding.id)}
                  role="button"
                  tabIndex={0}
                  aria-label="نسخ رابط الدعوة"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      copyInvitationLink(wedding.slug, wedding.id);
                    }
                  }}
                >
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--admin-text-muted)' }} />
                  <span className="text-xs truncate flex-1" style={{ color: 'var(--admin-text-secondary)' }}>
                    {`/w/${wedding.slug}`}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    {isCopied ? (
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" style={{ color: 'var(--admin-text-muted)' }} />
                    )}
                    <span className="text-[10px] font-medium" style={{ color: isCopied ? '#34D399' : 'var(--admin-text-muted)' }}>
                      {isCopied ? 'تم النسخ' : 'نسخ'}
                    </span>
                  </div>
                </div>

                {/* Action Buttons Row */}
                <div className="flex items-center gap-2 pt-1">
                  {/* View Invitation */}
                  <a
                    href={`/w/${wedding.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-300"
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
                    <span>فتح الدعوة</span>
                  </a>

                  {/* Edit */}
                  <button
                    onClick={() => router.push(`/admin/${wedding.id}`)}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-300"
                    style={{
                      color: 'var(--admin-text-secondary)',
                      background: 'var(--admin-surface-overlay)',
                      border: '1px solid var(--admin-border)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--wedding-gold)';
                      e.currentTarget.style.borderColor = 'rgba(212,168,83,0.25)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--admin-text-secondary)';
                      e.currentTarget.style.borderColor = 'var(--admin-border)';
                    }}
                    title="تعديل"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    <span>تعديل</span>
                  </button>

                  {/* Delete */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-300"
                        style={{
                          color: 'var(--admin-text-secondary)',
                          background: 'var(--admin-surface-overlay)',
                          border: '1px solid var(--admin-border)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#EF4444';
                          e.currentTarget.style.borderColor = 'rgba(239,68,68,0.25)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'var(--admin-text-secondary)';
                          e.currentTarget.style.borderColor = 'var(--admin-border)';
                        }}
                        title="حذف"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>حذف</span>
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
