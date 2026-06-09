'use client';

import { useEffect, useState, useCallback } from 'react';
import { Guest } from '@/types/wedding';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { Plus, Trash2, Copy, Users, UserPlus, ListPlus, Phone, Heart } from 'lucide-react';
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
    const link = `${window.location.origin}/w/${weddingSlug}?guest=${guest.guestLink}`;
    navigator.clipboard.writeText(link).then(() => {
      toast.success('تم نسخ رابط الضيف');
    }).catch(() => {
      toast.error('فشل في نسخ الرابط');
    });
  };

  return (
    <div className="space-y-5">
      {/* Add Single Guest */}
      <div className="admin-card overflow-hidden" style={{ borderTop: '2px solid var(--wedding-gold)' }}>
        <div className="p-6 pb-4">
          <h2 className="flex items-center gap-3 text-xl font-bold" style={{ color: 'var(--admin-text-primary)' }}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: 'rgba(212,168,83,0.12)' }}>
              <UserPlus className="h-5 w-5" style={{ color: 'var(--wedding-gold)' }} />
            </div>
            إضافة ضيف
          </h2>
        </div>
        <div className="px-6 pb-6 space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="admin-input"
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
              className="admin-input"
              placeholder="رقم الهاتف (اختياري)"
              dir="ltr"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addGuest();
                }
              }}
            />
            <button
              onClick={addGuest}
              className="btn-wedding flex items-center justify-center gap-2 px-5 py-2.5 text-sm"
            >
              <Plus className="h-4 w-4" />
              إضافة
            </button>
          </div>

          {/* Ornamental separator */}
          <div className="ornament-separator">
            <div className="diamond" />
          </div>

          {/* Bulk Add Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowBulk(!showBulk)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300"
              style={{
                color: showBulk ? 'var(--wedding-gold)' : 'var(--admin-text-secondary)',
                background: showBulk ? 'rgba(212,168,83,0.08)' : 'var(--admin-surface-overlay)',
                border: '1px solid ' + (showBulk ? 'rgba(212,168,83,0.2)' : 'var(--admin-border)'),
              }}
            >
              <ListPlus className="h-4 w-4" />
              إضافة متعددة
            </button>
            <span className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>
              {guests.length} ضيف
            </span>
          </div>

          {showBulk && (
            <div className="space-y-3">
              <Textarea
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                className="admin-input"
                placeholder="أدخل اسم ضيف في كل سطر"
                rows={5}
              />
              <button
                onClick={bulkAddGuests}
                className="btn-wedding flex items-center gap-2 px-5 py-2.5 text-sm"
              >
                <ListPlus className="h-4 w-4" />
                إضافة الكل
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Guest List */}
      <div className="admin-card overflow-hidden" style={{ borderTop: '2px solid var(--wedding-gold)' }}>
        <div className="p-6 pb-4">
          <h2 className="flex items-center gap-3 text-xl font-bold" style={{ color: 'var(--admin-text-primary)' }}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: 'rgba(212,168,83,0.12)' }}>
              <Users className="h-5 w-5" style={{ color: 'var(--wedding-gold)' }} />
            </div>
            قائمة الضيوف ({guests.length})
          </h2>
        </div>
        <div className="px-6 pb-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: 'var(--wedding-gold)', borderTopColor: 'transparent' }} />
            </div>
          ) : guests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="flex h-20 w-20 items-center justify-center rounded-full mb-5" style={{ background: 'rgba(212,168,83,0.08)' }}>
                <Heart className="h-10 w-10" style={{ color: 'var(--wedding-gold)' }} />
              </div>
              <p className="text-lg font-bold mb-2 text-gold-gradient">أول ضيوفك هيفرحوا بالدعوة 💌</p>
              <p className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>أضيفي أسماء الضيوف وهنوصلكم الدعوة</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {guests.map((guest, index) => (
                <div
                  key={guest.id}
                  className="flex items-center justify-between rounded-xl p-4 transition-all duration-300"
                  style={{
                    background: 'var(--admin-surface)',
                    border: '1px solid var(--admin-border)',
                    borderRight: '3px solid var(--wedding-gold)',
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div
                        className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold shrink-0"
                        style={{ background: 'rgba(212,168,83,0.1)', color: 'var(--wedding-gold)' }}
                      >
                        {index + 1}
                      </div>
                      <p className="font-semibold truncate" style={{ color: 'var(--admin-text-primary)' }}>{guest.name}</p>
                    </div>
                    {guest.phone && (
                      <div className="flex items-center gap-1.5 mt-1 mr-9">
                        <Phone className="h-3 w-3" style={{ color: 'var(--admin-text-muted)' }} />
                        <p className="text-sm" style={{ color: 'var(--admin-text-muted)' }} dir="ltr">{guest.phone}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => copyGuestLink(guest)}
                      className="flex items-center justify-center h-8 w-8 rounded-lg transition-all duration-300"
                      style={{ color: 'var(--wedding-gold)', background: 'rgba(212,168,83,0.08)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(212,168,83,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(212,168,83,0.08)';
                      }}
                      title="نسخ رابط الضيف"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          className="flex items-center justify-center h-8 w-8 rounded-lg transition-all duration-300"
                          style={{ color: 'var(--admin-text-muted)', background: 'var(--admin-surface-overlay)' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#EF4444';
                            e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'var(--admin-text-muted)';
                            e.currentTarget.style.background = 'var(--admin-surface-overlay)';
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent style={{ background: 'var(--admin-surface-raised)', border: '1px solid var(--admin-border-strong)' }}>
                        <AlertDialogHeader>
                          <AlertDialogTitle style={{ color: 'var(--admin-text-primary)' }}>
                            تأكيد الحذف
                          </AlertDialogTitle>
                          <AlertDialogDescription style={{ color: 'var(--admin-text-secondary)' }}>
                            هل أنت متأكد من حذف الضيف {guest.name}؟
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            style={{ background: 'var(--admin-surface-overlay)', color: 'var(--admin-text-primary)', border: '1px solid var(--admin-border)' }}
                          >
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
          )}
        </div>
      </div>
    </div>
  );
}
