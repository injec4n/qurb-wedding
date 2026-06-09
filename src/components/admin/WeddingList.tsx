'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Wedding } from '@/types/wedding';
import { formatDateArabic } from '@/lib/wedding-utils';
import { themeOptions } from '@/lib/themes';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Pencil, Trash2, ExternalLink, Plus, Users, Calendar, Heart } from 'lucide-react';
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

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-zinc-700 bg-zinc-800/50">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-600/20">
              <Heart className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">إجمالي الزفات</p>
              <p className="text-2xl font-bold text-zinc-100">{weddings.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-zinc-700 bg-zinc-800/50">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-600/20">
              <Users className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">إجمالي الضيوف</p>
              <p className="text-2xl font-bold text-zinc-100">{totalGuests}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-zinc-700 bg-zinc-800/50">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-600/20">
              <Calendar className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">إجمالي الردود</p>
              <p className="text-2xl font-bold text-zinc-100">{totalRsvps}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Button */}
      <div className="flex justify-start">
        <Button
          onClick={() => router.push('/admin/create')}
          className="bg-amber-600 text-white hover:bg-amber-700"
        >
          <Plus className="ml-2 h-4 w-4" />
          إنشاء زفاف جديد
        </Button>
      </div>

      {/* Weddings Table */}
      <Card className="border-zinc-700 bg-zinc-800/50">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
            </div>
          ) : weddings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
              <Heart className="mb-4 h-12 w-12 text-zinc-600" />
              <p className="text-lg">لا توجد زفات بعد</p>
              <p className="text-sm">ابدأ بإنشاء زفاف جديد</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-700 hover:bg-transparent">
                    <TableHead className="text-zinc-300">العريس</TableHead>
                    <TableHead className="text-zinc-300">العريسة</TableHead>
                    <TableHead className="text-zinc-300">التاريخ</TableHead>
                    <TableHead className="text-zinc-300">القاعة</TableHead>
                    <TableHead className="text-zinc-300">القالب</TableHead>
                    <TableHead className="text-zinc-300">الرابط</TableHead>
                    <TableHead className="text-zinc-300">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {weddings.map((wedding) => (
                    <TableRow
                      key={wedding.id}
                      className="border-zinc-700 hover:bg-zinc-700/30"
                    >
                      <TableCell className="font-medium text-zinc-100">
                        {wedding.groomName}
                      </TableCell>
                      <TableCell className="text-zinc-200">
                        {wedding.brideName}
                      </TableCell>
                      <TableCell className="text-zinc-300">
                        {formatDateArabic(wedding.weddingDate)}
                      </TableCell>
                      <TableCell className="text-zinc-300">
                        {wedding.venueName}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="border-amber-600/30 text-amber-400"
                        >
                          {getThemeLabel(wedding.theme)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <a
                          href={`/${wedding.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-amber-400 hover:text-amber-300"
                          dir="ltr"
                        >
                          {wedding.slug}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/admin/${wedding.id}`)}
                            className="text-zinc-300 hover:bg-zinc-700 hover:text-amber-400"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-zinc-300 hover:bg-zinc-700 hover:text-red-400"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="border-zinc-700 bg-zinc-800">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-zinc-100">
                                  تأكيد الحذف
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-zinc-400">
                                  هل أنت متأكد من حذف زفاف {wedding.groomName} و {wedding.brideName}؟ لا يمكن التراجع عن هذا الإجراء.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-zinc-600 bg-zinc-700 text-zinc-200 hover:bg-zinc-600">
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
