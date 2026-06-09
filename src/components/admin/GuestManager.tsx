'use client';

import { useEffect, useState, useCallback } from 'react';
import { Guest } from '@/types/wedding';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
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
import { Plus, Trash2, Copy, Users, UserPlus, ListPlus } from 'lucide-react';
import { toast } from 'sonner';

interface GuestManagerProps {
  weddingId: string;
  weddingSlug: string;
}

export default function GuestManager({ weddingId, weddingSlug }: GuestManagerProps) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [bulkText, setBulkText] = useState('');
  const [showBulk, setShowBulk] = useState(false);

  const fetchGuests = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/weddings/${weddingId}/guests`);
      const data = await res.json();
      if (data.success) {
        setGuests(data.data);
      }
    } catch {
      toast.error('فشل في جلب بيانات الضيوف');
    } finally {
      setIsLoading(false);
    }
  }, [weddingId]);

  useEffect(() => {
    fetchGuests();
  }, [fetchGuests]);

  const addGuest = async () => {
    if (!newName.trim()) {
      toast.error('الرجاء إدخال اسم الضيف');
      return;
    }
    try {
      const res = await fetch(`/api/weddings/${weddingId}/guests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim(), phone: newPhone.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('تم إضافة الضيف بنجاح');
        setNewName('');
        setNewPhone('');
        fetchGuests();
      } else {
        toast.error(data.error || 'فشل في إضافة الضيف');
      }
    } catch {
      toast.error('فشل في إضافة الضيف');
    }
  };

  const bulkAddGuests = async () => {
    const names = bulkText
      .split('\n')
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    if (names.length === 0) {
      toast.error('الرجاء إدخال أسماء الضيوف');
      return;
    }

    try {
      const res = await fetch(`/api/weddings/${weddingId}/guests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bulk: true, names }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`تم إضافة ${data.data.length} ضيف بنجاح`);
        setBulkText('');
        setShowBulk(false);
        fetchGuests();
      } else {
        toast.error(data.error || 'فشل في إضافة الضيوف');
      }
    } catch {
      toast.error('فشل في إضافة الضيوف');
    }
  };

  const deleteGuest = async (id: string) => {
    try {
      const res = await fetch(`/api/guests/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('تم حذف الضيف بنجاح');
        fetchGuests();
      } else {
        toast.error(data.error || 'فشل في حذف الضيف');
      }
    } catch {
      toast.error('فشل في حذف الضيف');
    }
  };

  const copyGuestLink = (guest: Guest) => {
    const link = `${window.location.origin}/${weddingSlug}?guest=${guest.guestLink}`;
    navigator.clipboard.writeText(link).then(() => {
      toast.success('تم نسخ رابط الضيف');
    }).catch(() => {
      toast.error('فشل في نسخ الرابط');
    });
  };

  return (
    <div className="space-y-4">
      {/* Add Single Guest */}
      <Card className="border-zinc-700 bg-zinc-800/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-zinc-100">
            <UserPlus className="h-5 w-5 text-amber-400" />
            إضافة ضيف
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="border-zinc-600 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500"
              placeholder="اسم الضيف"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addGuest();
                }
              }}
            />
            <Input
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              className="border-zinc-600 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500"
              placeholder="رقم الهاتف (اختياري)"
              dir="ltr"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addGuest();
                }
              }}
            />
            <Button
              onClick={addGuest}
              className="bg-amber-600 text-white hover:bg-amber-700"
            >
              <Plus className="ml-2 h-4 w-4" />
              إضافة
            </Button>
          </div>

          <Separator className="bg-zinc-700" />

          {/* Bulk Add Toggle */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBulk(!showBulk)}
              className="border-zinc-600 text-zinc-300 hover:bg-zinc-700"
            >
              <ListPlus className="ml-2 h-4 w-4" />
              إضافة متعددة
            </Button>
            <span className="text-sm text-zinc-400">
              {guests.length} ضيف
            </span>
          </div>

          {showBulk && (
            <div className="space-y-3">
              <Textarea
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                className="border-zinc-600 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500"
                placeholder="أدخل اسم ضيف في كل سطر"
                rows={5}
              />
              <Button
                onClick={bulkAddGuests}
                className="bg-amber-600 text-white hover:bg-amber-700"
              >
                <ListPlus className="ml-2 h-4 w-4" />
                إضافة الكل
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Guest List */}
      <Card className="border-zinc-700 bg-zinc-800/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-zinc-100">
            <Users className="h-5 w-5 text-amber-400" />
            قائمة الضيوف ({guests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
            </div>
          ) : guests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-zinc-400">
              <Users className="mb-3 h-10 w-10 text-zinc-600" />
              <p>لا يوجد ضيوف بعد</p>
            </div>
          ) : (
            <ScrollArea className="max-h-96">
              <div className="space-y-2">
                {guests.map((guest) => (
                  <div
                    key={guest.id}
                    className="flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-900/50 p-3"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-zinc-100">{guest.name}</p>
                      {guest.phone && (
                        <p className="text-sm text-zinc-400" dir="ltr">{guest.phone}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyGuestLink(guest)}
                        className="text-zinc-300 hover:bg-zinc-700 hover:text-amber-400"
                        title="نسخ رابط الضيف"
                      >
                        <Copy className="h-4 w-4" />
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
                              هل أنت متأكد من حذف الضيف {guest.name}؟
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-zinc-600 bg-zinc-700 text-zinc-200 hover:bg-zinc-600">
                              إلغاء
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteGuest(guest.id)}
                              className="bg-red-600 text-white hover:bg-red-700"
                            >
                              حذف
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
