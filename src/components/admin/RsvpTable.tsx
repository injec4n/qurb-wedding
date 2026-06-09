'use client';

import { useEffect, useState, useCallback } from 'react';
import { RsvpResponse } from '@/types/wedding';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, XCircle, Clock, Filter } from 'lucide-react';
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
    badgeClass: 'bg-emerald-600/20 text-emerald-400 border-emerald-600/30',
  },
  'not-attending': {
    label: 'لن يحضر',
    icon: XCircle,
    badgeClass: 'bg-red-600/20 text-red-400 border-red-600/30',
  },
  pending: {
    label: 'قيد الانتظار',
    icon: Clock,
    badgeClass: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30',
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

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-zinc-700 bg-zinc-800/50">
          <CardContent className="flex items-center gap-3 p-3">
            <CheckCircle className="h-5 w-5 text-emerald-400" />
            <div>
              <p className="text-xs text-zinc-400">سيحضر</p>
              <p className="text-lg font-bold text-emerald-400">{counts.attending}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-zinc-700 bg-zinc-800/50">
          <CardContent className="flex items-center gap-3 p-3">
            <XCircle className="h-5 w-5 text-red-400" />
            <div>
              <p className="text-xs text-zinc-400">لن يحضر</p>
              <p className="text-lg font-bold text-red-400">{counts['not-attending']}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-zinc-700 bg-zinc-800/50">
          <CardContent className="flex items-center gap-3 p-3">
            <Clock className="h-5 w-5 text-yellow-400" />
            <div>
              <p className="text-xs text-zinc-400">قيد الانتظار</p>
              <p className="text-lg font-bold text-yellow-400">{counts.pending}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-zinc-400" />
        {(
          [
            { value: 'all', label: 'الكل' },
            { value: 'attending', label: 'سيحضر' },
            { value: 'not-attending', label: 'لن يحضر' },
            { value: 'pending', label: 'قيد الانتظار' },
          ] as { value: StatusFilter; label: string }[]
        ).map((filter) => (
          <Button
            key={filter.value}
            variant={statusFilter === filter.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter(filter.value)}
            className={
              statusFilter === filter.value
                ? 'bg-amber-600 text-white hover:bg-amber-700'
                : 'border-zinc-600 text-zinc-300 hover:bg-zinc-700'
            }
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {/* RSVP Table */}
      <Card className="border-zinc-700 bg-zinc-800/50">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
            </div>
          ) : filteredRsvps.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-zinc-400">
              <Clock className="mb-3 h-10 w-10 text-zinc-600" />
              <p>لا توجد ردود بعد</p>
            </div>
          ) : (
            <ScrollArea className="max-h-96">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-700 hover:bg-transparent">
                    <TableHead className="text-zinc-300">اسم الضيف</TableHead>
                    <TableHead className="text-zinc-300">الحالة</TableHead>
                    <TableHead className="text-zinc-300">الرسالة</TableHead>
                    <TableHead className="text-zinc-300">التاريخ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRsvps.map((rsvp) => {
                    const config = statusConfig[rsvp.status as keyof typeof statusConfig] || statusConfig.pending;
                    const Icon = config.icon;
                    return (
                      <TableRow
                        key={rsvp.id}
                        className="border-zinc-700 hover:bg-zinc-700/30"
                      >
                        <TableCell className="font-medium text-zinc-100">
                          {(rsvp as Record<string, unknown>).guest
                            ? ((rsvp as Record<string, unknown>).guest as { name: string }).name
                            : 'ضيف'}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`gap-1 ${config.badgeClass}`}
                          >
                            <Icon className="h-3.5 w-3.5" />
                            {config.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-48 truncate text-zinc-300">
                          {rsvp.message || '—'}
                        </TableCell>
                        <TableCell className="text-zinc-400 text-sm">
                          {formatDate(rsvp.createdAt)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
