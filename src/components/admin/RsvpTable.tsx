'use client';

import { useEffect, useState, useCallback } from 'react';
import { RsvpResponse } from '@/types/wedding';
import { CheckCircle, XCircle, Clock, Filter, Heart, MessageCircle, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface RsvpWithGuest extends RsvpResponse {
  guest?: {
    name: string;
    phone: string;
  };
}

interface RsvpTableProps {
  weddingId: string;
}

const statusConfig = {
  attending: {
    label: 'سيحضر',
    icon: CheckCircle,
    color: '#10B981',
    bgClass: 'rgba(16,185,129,0.08)',
    borderClass: 'rgba(16,185,129,0.2)',
  },
  'not-attending': {
    label: 'لن يحضر',
    icon: XCircle,
    color: '#EF4444',
    bgClass: 'rgba(239,68,68,0.08)',
    borderClass: 'rgba(239,68,68,0.2)',
  },
  pending: {
    label: 'قيد الانتظار',
    icon: Clock,
    color: '#F59E0B',
    bgClass: 'rgba(245,158,11,0.08)',
    borderClass: 'rgba(245,158,11,0.2)',
  },
};

type StatusFilter = 'all' | 'attending' | 'not-attending' | 'pending';

export default function RsvpTable({ weddingId }: RsvpTableProps) {
  const [rsvps, setRsvps] = useState<RsvpWithGuest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const fetchRsvps = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/weddings/${weddingId}/rsvps`);
      const data = await res.json();
      if (data.success) {
        setRsvps(data.data);
      }
    } catch {
      toast.error('فشل في جلب بيانات الردود');
    } finally {
      setIsLoading(false);
    }
  }, [weddingId]);

  useEffect(() => {
    fetchRsvps();
  }, [fetchRsvps]);

  const filteredRsvps = rsvps.filter((rsvp) => {
    if (statusFilter === 'all') return true;
    return rsvp.status === statusFilter;
  });

  const counts = {
    attending: rsvps.filter((r) => r.status === 'attending').length,
    'not-attending': rsvps.filter((r) => r.status === 'not-attending').length,
    pending: rsvps.filter((r) => r.status === 'pending').length,
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const filters: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'الكل' },
    { value: 'attending', label: 'سيحضر' },
    { value: 'not-attending', label: 'لن يحضر' },
    { value: 'pending', label: 'قيد الانتظار' },
  ];

  return (
    <div className="space-y-5">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="admin-card card-glow p-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05))' }}>
            <CheckCircle className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-[11px]" style={{ color: 'var(--admin-text-muted)' }}>سيحضر</p>
            <p className="text-2xl font-bold text-emerald-400">{counts.attending}</p>
          </div>
        </div>
        <div className="admin-card card-glow p-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.05))' }}>
            <XCircle className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <p className="text-[11px]" style={{ color: 'var(--admin-text-muted)' }}>لن يحضر</p>
            <p className="text-2xl font-bold text-red-400">{counts['not-attending']}</p>
          </div>
        </div>
        <div className="admin-card card-glow p-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.05))' }}>
            <Clock className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <p className="text-[11px]" style={{ color: 'var(--admin-text-muted)' }}>قيد الانتظار</p>
            <p className="text-2xl font-bold text-amber-400">{counts.pending}</p>
          </div>
        </div>
      </div>

      {/* Filter Buttons - Pill style */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-4 w-4 shrink-0" style={{ color: 'var(--admin-text-muted)' }} />
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setStatusFilter(filter.value)}
            className="px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300"
            style={{
              color: statusFilter === filter.value ? 'var(--wedding-gold)' : 'var(--admin-text-muted)',
              background: statusFilter === filter.value ? 'rgba(212,168,83,0.1)' : 'var(--admin-surface-overlay)',
              border: '1px solid ' + (statusFilter === filter.value ? 'rgba(212,168,83,0.25)' : 'var(--admin-border)'),
            }}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* RSVP List - Elegant card rows */}
      <div className="admin-card overflow-hidden" style={{ borderTop: '2px solid var(--wedding-gold)' }}>
        <div className="p-6 pb-4">
          <h2 className="flex items-center gap-3 text-xl font-bold" style={{ color: 'var(--admin-text-primary)' }}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: 'rgba(212,168,83,0.12)' }}>
              <Heart className="h-5 w-5" style={{ color: 'var(--wedding-gold)' }} />
            </div>
            ردود الضيوف
          </h2>
        </div>
        <div className="px-6 pb-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: 'var(--wedding-gold)', borderTopColor: 'transparent' }} />
            </div>
          ) : filteredRsvps.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="flex h-20 w-20 items-center justify-center rounded-full mb-5" style={{ background: 'rgba(212,168,83,0.08)' }}>
                <Clock className="h-10 w-10" style={{ color: 'var(--wedding-gold)' }} />
              </div>
              <p className="text-lg font-bold mb-2 text-gold-gradient">لسه مستنيين رد الضيوف 🌙</p>
              <p className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>الردود هتظهر هنا أول ما الضيوف يردوا</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredRsvps.map((rsvp) => {
                const config = statusConfig[rsvp.status as keyof typeof statusConfig] || statusConfig.pending;
                const Icon = config.icon;
                const guestName = (rsvp as Record<string, unknown>).guest
                  ? ((rsvp as Record<string, unknown>).guest as { name: string }).name
                  : 'ضيف';
                return (
                  <div
                    key={rsvp.id}
                    className="flex items-start gap-4 rounded-xl p-4 transition-all duration-300"
                    style={{
                      background: 'var(--admin-surface)',
                      border: '1px solid var(--admin-border)',
                      borderRight: `3px solid ${config.color}`,
                    }}
                  >
                    {/* Status icon */}
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-lg shrink-0 mt-0.5"
                      style={{ background: config.bgClass }}
                    >
                      <Icon className="h-4.5 w-4.5" style={{ color: config.color }} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm" style={{ color: 'var(--admin-text-primary)' }}>
                          {guestName}
                        </p>
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                          style={{ background: config.bgClass, color: config.color, border: `1px solid ${config.borderClass}` }}
                        >
                          {config.label}
                        </span>
                      </div>

                      {rsvp.message && (
                        <div className="flex items-start gap-1.5 mt-1.5">
                          <MessageCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: 'var(--admin-text-muted)' }} />
                          <p className="text-sm" style={{ color: 'var(--admin-text-secondary)' }}>{rsvp.message}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5 mt-2">
                        <Calendar className="h-3 w-3" style={{ color: 'var(--admin-text-muted)' }} />
                        <p className="text-[11px]" style={{ color: 'var(--admin-text-muted)' }}>{formatDate(rsvp.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
