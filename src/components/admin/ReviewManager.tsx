'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { Star, Plus, Trash2, Pencil, Image, Mic, FileText, Upload, X, Play, Pause, ChevronUp, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Review } from '@/types/wedding';

type ReviewFormData = {
  type: 'text' | 'image' | 'audio';
  name: string;
  rating: number;
  text: string;
  imageUrl: string;
  audioUrl: string;
  weddingName: string;
  isActive: boolean;
};

const emptyForm: ReviewFormData = {
  type: 'text',
  name: '',
  rating: 5,
  text: '',
  imageUrl: '',
  audioUrl: '',
  weddingName: '',
  isActive: true,
};

export default function ReviewManager() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ReviewFormData>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/reviews');
      const data = await res.json();
      if (data.success) {
        setReviews(data.data);
      }
    } catch {
      toast.error('فشل في جلب التقييمات');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Audio playback
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleAudioPlayback = (review: Review) => {
    if (playingAudioId === review.id) {
      audioRef.current?.pause();
      setPlayingAudioId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(review.audioUrl);
      audio.onended = () => setPlayingAudioId(null);
      audio.play();
      audioRef.current = audio;
      setPlayingAudioId(review.id);
    }
  };

  // Upload file
  const uploadFile = async (file: File, type: 'image' | 'audio'): Promise<string | null> => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        return data.data.url;
      }
      toast.error(data.error || 'فشل في رفع الملف');
      return null;
    } catch {
      toast.error('فشل في رفع الملف');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file, 'image');
    if (url) {
      setForm((prev) => ({ ...prev, imageUrl: url }));
    }
  };

  // Handle audio upload
  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file, 'audio');
    if (url) {
      setForm((prev) => ({ ...prev, audioUrl: url }));
    }
  };

  // Open dialog for new review
  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIsDialogOpen(true);
  };

  // Open dialog for editing
  const openEdit = (review: Review) => {
    setEditingId(review.id);
    setForm({
      type: review.type as 'text' | 'image' | 'audio',
      name: review.name,
      rating: review.rating,
      text: review.text,
      imageUrl: review.imageUrl,
      audioUrl: review.audioUrl,
      weddingName: review.weddingName,
      isActive: review.isActive,
    });
    setIsDialogOpen(true);
  };

  // Submit form
  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error('اسم العميل مطلوب');
      return;
    }

    if (form.type === 'text' && !form.text.trim()) {
      toast.error('نص التقييم مطلوب');
      return;
    }

    if (form.type === 'image' && !form.imageUrl) {
      toast.error('صورة التقييم مطلوبة');
      return;
    }

    if (form.type === 'audio' && !form.audioUrl) {
      toast.error('ملف الصوت مطلوب');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        // Update
        const res = await fetch(`/api/reviews/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (data.success) {
          toast.success('تم تحديث التقييم بنجاح');
          setIsDialogOpen(false);
          fetchReviews();
        } else {
          toast.error(data.error || 'فشل في تحديث التقييم');
        }
      } else {
        // Create
        const res = await fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (data.success) {
          toast.success('تم إضافة التقييم بنجاح');
          setIsDialogOpen(false);
          fetchReviews();
        } else {
          toast.error(data.error || 'فشل في إضافة التقييم');
        }
      }
    } catch {
      toast.error('حدث خطأ أثناء الحفظ');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle active
  const toggleActive = async (review: Review) => {
    try {
      const res = await fetch(`/api/reviews/${review.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !review.isActive }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(review.isActive ? 'تم إخفاء التقييم' : 'تم إظهار التقييم');
        fetchReviews();
      }
    } catch {
      toast.error('فشل في تحديث حالة التقييم');
    }
  };

  // Delete review
  const deleteReview = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا التقييم؟')) return;
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('تم حذف التقييم');
        fetchReviews();
      }
    } catch {
      toast.error('فشل في حذف التقييم');
    }
  };

  // Move up/down
  const moveReview = async (review: Review, direction: 'up' | 'down') => {
    const sortedReviews = [...reviews].sort((a, b) => a.order - b.order);
    const currentIndex = sortedReviews.findIndex((r) => r.id === review.id);
    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === sortedReviews.length - 1) return;

    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const swapReview = sortedReviews[swapIndex];

    const orders = [
      { id: review.id, order: swapReview.order },
      { id: swapReview.id, order: review.order },
    ];

    try {
      const res = await fetch('/api/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders }),
      });
      const data = await res.json();
      if (data.success) {
        fetchReviews();
      }
    } catch {
      toast.error('فشل في تحديث الترتيب');
    }
  };

  // Star rating component
  const StarRating = ({ value, onChange, readonly = false }: { value: number; onChange?: (v: number) => void; readonly?: boolean }) => (
    <div className="flex items-center gap-1" dir="ltr">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className="transition-colors duration-200 disabled:cursor-default"
        >
          <Star
            className={`h-5 w-5 ${star <= value ? 'text-[#D4A853] fill-[#D4A853]' : 'text-white/20'}`}
          />
        </button>
      ))}
    </div>
  );

  // Type badge
  const TypeBadge = ({ type }: { type: string }) => {
    const config = {
      text: { icon: FileText, label: 'نصي', color: '#D4A853' },
      image: { icon: Image, label: 'صورة', color: '#25D366' },
      audio: { icon: Mic, label: 'صوتي', color: '#60A5FA' },
    }[type] || { icon: FileText, label: type, color: '#D4A853' };

    return (
      <div
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
        style={{ background: `${config.color}15`, color: config.color, border: `1px solid ${config.color}25` }}
      >
        <config.icon className="h-3 w-3" />
        {config.label}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <span className="h-10 w-10 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: 'var(--wedding-gold)', borderTopColor: 'transparent' }} />
        <p className="text-sm mt-4" style={{ color: 'var(--admin-text-secondary)' }}>جاري تحميل التقييمات...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gold-gradient">تقييمات العملاء</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--admin-text-muted)' }}>
            إدارة آراء وتقييمات العملاء — نصوص، صور، وتسجيلات صوتية
          </p>
        </div>
        <Button onClick={openNew} className="btn-wedding text-sm">
          <Plus className="h-4 w-4 ml-2" />
          إضافة تقييم
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'إجمالي', count: reviews.length, color: '#D4A853' },
          { label: 'نصية', count: reviews.filter((r) => r.type === 'text').length, color: '#D4A853' },
          { label: 'صور', count: reviews.filter((r) => r.type === 'image').length, color: '#25D366' },
          { label: 'صوتية', count: reviews.filter((r) => r.type === 'audio').length, color: '#60A5FA' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="admin-card card-glow p-4 text-center"
          >
            <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.count}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--admin-text-muted)' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <div className="admin-card card-glow p-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full mx-auto mb-4" style={{ background: 'rgba(212,168,83,0.08)' }}>
            <Star className="h-8 w-8" style={{ color: 'var(--wedding-gold)' }} />
          </div>
          <p className="text-base font-medium mb-1" style={{ color: 'var(--admin-text-primary)' }}>لا توجد تقييمات بعد</p>
          <p className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>أضف أول تقييم لعملائك</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {reviews
              .sort((a, b) => a.order - b.order)
              .map((review) => (
                <motion.div
                  key={review.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="admin-card card-glow overflow-hidden"
                >
                  <div className="p-4 sm:p-5">
                    <div className="flex items-start gap-4">
                      {/* Left: Order controls */}
                      <div className="flex flex-col gap-1 shrink-0">
                        <button
                          onClick={() => moveReview(review, 'up')}
                          className="p-1 rounded-md transition-colors hover:bg-[#D4A853]/10"
                          style={{ color: 'var(--admin-text-muted)' }}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => moveReview(review, 'down')}
                          className="p-1 rounded-md transition-colors hover:bg-[#D4A853]/10"
                          style={{ color: 'var(--admin-text-muted)' }}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Center: Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <TypeBadge type={review.type} />
                          {!review.isActive && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                              <EyeOff className="h-2.5 w-2.5" />
                              مخفي
                            </span>
                          )}
                          {review.weddingName && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/10">
                              {review.weddingName}
                            </span>
                          )}
                        </div>

                        {/* Name and rating */}
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-sm sm:text-base" style={{ color: 'var(--admin-text-primary)' }}>
                            {review.name}
                          </h3>
                          <StarRating value={review.rating} readonly />
                        </div>

                        {/* Text review */}
                        {review.type === 'text' && review.text && (
                          <p className="text-sm leading-relaxed" style={{ color: 'var(--admin-text-secondary)' }}>
                            &ldquo;{review.text}&rdquo;
                          </p>
                        )}

                        {/* Image review */}
                        {review.type === 'image' && review.imageUrl && (
                          <div className="mt-2 rounded-xl overflow-hidden border border-white/10 max-w-sm">
                            <img
                              src={review.imageUrl}
                              alt={`تقييم ${review.name}`}
                              className="w-full h-auto max-h-48 object-contain bg-black/20"
                            />
                          </div>
                        )}

                        {/* Audio review */}
                        {review.type === 'audio' && review.audioUrl && (
                          <div className="mt-2 flex items-center gap-3">
                            <button
                              onClick={() => toggleAudioPlayback(review)}
                              className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300"
                              style={{
                                background: playingAudioId === review.id ? '#D4A853' : 'rgba(212,168,83,0.1)',
                                color: playingAudioId === review.id ? '#0D0D1A' : '#D4A853',
                              }}
                            >
                              {playingAudioId === review.id ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </button>
                            <div className="flex-1">
                              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-300"
                                  style={{
                                    width: playingAudioId === review.id ? '60%' : '0%',
                                    background: 'linear-gradient(90deg, #D4A853, #E8C874)',
                                  }}
                                />
                              </div>
                              <p className="text-xs mt-1" style={{ color: 'var(--admin-text-muted)' }}>
                                تسجيل صوتي
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => toggleActive(review)}
                          className="p-2 rounded-lg transition-all duration-300"
                          style={{ color: review.isActive ? '#D4A853' : 'var(--admin-text-muted)', background: review.isActive ? 'rgba(212,168,83,0.08)' : 'transparent' }}
                          title={review.isActive ? 'إخفاء' : 'إظهار'}
                        >
                          {review.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => openEdit(review)}
                          className="p-2 rounded-lg transition-all duration-300 hover:bg-[#D4A853]/10"
                          style={{ color: 'var(--admin-text-secondary)' }}
                          title="تعديل"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteReview(review.id)}
                          className="p-2 rounded-lg transition-all duration-300 hover:bg-red-500/10"
                          style={{ color: 'var(--admin-text-muted)' }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--admin-text-muted)')}
                          title="حذف"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className="max-w-lg"
          style={{
            background: 'var(--admin-surface-raised)',
            border: '1px solid var(--admin-border)',
            color: 'var(--admin-text-primary)',
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-gold-gradient text-lg">
              {editingId ? 'تعديل التقييم' : 'إضافة تقييم جديد'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 mt-4" dir="rtl">
            {/* Type selector */}
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--admin-text-secondary)' }}>
                نوع التقييم
              </label>
              <div className="flex gap-2">
                {[
                  { value: 'text', icon: FileText, label: 'نصي' },
                  { value: 'image', icon: Image, label: 'صورة' },
                  { value: 'audio', icon: Mic, label: 'صوتي' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, type: opt.value as 'text' | 'image' | 'audio' }))}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 border ${
                      form.type === opt.value
                        ? 'bg-[#D4A853]/15 border-[#D4A853]/40 text-[#D4A853]'
                        : 'bg-transparent border-white/10 text-white/40 hover:border-[#D4A853]/20 hover:text-white/60'
                    }`}
                  >
                    <opt.icon className="h-4 w-4" />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--admin-text-secondary)' }}>
                اسم العميل *
              </label>
              <Input
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="مثال: أحمد محمد"
                className="admin-input"
              />
            </div>

            {/* Wedding name (optional) */}
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--admin-text-secondary)' }}>
                اسم الزفاف (اختياري)
              </label>
              <Input
                value={form.weddingName}
                onChange={(e) => setForm((prev) => ({ ...prev, weddingName: e.target.value }))}
                placeholder="مثال: زفاف محمد وفاطمة"
                className="admin-input"
              />
            </div>

            {/* Rating */}
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--admin-text-secondary)' }}>
                التقييم
              </label>
              <StarRating
                value={form.rating}
                onChange={(v) => setForm((prev) => ({ ...prev, rating: v }))}
              />
            </div>

            {/* Text content (for text type) */}
            {form.type === 'text' && (
              <div>
                <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--admin-text-secondary)' }}>
                  نص التقييم *
                </label>
                <Textarea
                  value={form.text}
                  onChange={(e) => setForm((prev) => ({ ...prev, text: e.target.value }))}
                  placeholder="اكتب رأي العميل هنا..."
                  rows={4}
                  className="admin-input resize-none"
                />
              </div>
            )}

            {/* Image upload (for image type) */}
            {form.type === 'image' && (
              <div>
                <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--admin-text-secondary)' }}>
                  صورة التقييم (سكرين شوت) *
                </label>
                {form.imageUrl ? (
                  <div className="relative rounded-xl overflow-hidden border border-white/10">
                    <img
                      src={form.imageUrl}
                      alt="صورة التقييم"
                      className="w-full h-auto max-h-64 object-contain bg-black/20"
                    />
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, imageUrl: '' }))}
                      className="absolute top-2 left-2 p-1.5 rounded-full bg-red-500/80 text-white hover:bg-red-500 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full flex flex-col items-center gap-3 py-8 rounded-xl border-2 border-dashed border-white/10 hover:border-[#D4A853]/30 transition-all duration-300"
                    style={{ background: 'rgba(212,168,83,0.03)' }}
                  >
                    {isUploading ? (
                      <span className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: '#D4A853', borderTopColor: 'transparent' }} />
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-[#D4A853]/40" />
                        <p className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>
                          اضغط لرفع صورة التقييم
                        </p>
                      </>
                    )}
                  </button>
                )}
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            )}

            {/* Audio upload (for audio type) */}
            {form.type === 'audio' && (
              <div>
                <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--admin-text-secondary)' }}>
                  تسجيل صوتي *
                </label>
                {form.audioUrl ? (
                  <div className="flex items-center gap-3 p-4 rounded-xl border border-white/10" style={{ background: 'rgba(212,168,83,0.05)' }}>
                    <button
                      type="button"
                      onClick={() => {
                        if (audioRef.current) audioRef.current.pause();
                        const audio = new Audio(form.audioUrl);
                        audio.play();
                        audioRef.current = audio;
                      }}
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-[#D4A853] text-[#0D0D1A]"
                    >
                      <Play className="h-4 w-4" />
                    </button>
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: 'var(--admin-text-primary)' }}>
                        تسجيل صوتي
                      </p>
                      <p className="text-xs" style={{ color: 'var(--admin-text-muted)' }}>
                        جاهز للتشغيل
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, audioUrl: '' }))}
                      className="p-1.5 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => audioInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full flex flex-col items-center gap-3 py-8 rounded-xl border-2 border-dashed border-white/10 hover:border-[#D4A853]/30 transition-all duration-300"
                    style={{ background: 'rgba(212,168,83,0.03)' }}
                  >
                    {isUploading ? (
                      <span className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: '#D4A853', borderTopColor: 'transparent' }} />
                    ) : (
                      <>
                        <Mic className="h-8 w-8 text-[#D4A853]/40" />
                        <p className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>
                          اضغط لرفع التسجيل الصوتي
                        </p>
                      </>
                    )}
                  </button>
                )}
                <input
                  ref={audioInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioUpload}
                  className="hidden"
                />
              </div>
            )}

            {/* Optional text for image/audio types */}
            {(form.type === 'image' || form.type === 'audio') && (
              <div>
                <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--admin-text-secondary)' }}>
                  نص إضافي (اختياري)
                </label>
                <Textarea
                  value={form.text}
                  onChange={(e) => setForm((prev) => ({ ...prev, text: e.target.value }))}
                  placeholder="أضف تعليقاً أو ملخصاً..."
                  rows={2}
                  className="admin-input resize-none"
                />
              </div>
            )}

            {/* Active toggle */}
            <div className="flex items-center justify-between py-2">
              <label className="text-sm font-medium" style={{ color: 'var(--admin-text-secondary)' }}>
                ظاهر في الموقع
              </label>
              <Switch
                checked={form.isActive}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, isActive: checked }))}
              />
            </div>

            {/* Submit button */}
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || isUploading}
              className="btn-wedding w-full text-sm py-5"
            >
              {isSubmitting ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: '#0D0D1A', borderTopColor: 'transparent' }} />
              ) : editingId ? (
                'حفظ التعديلات'
              ) : (
                'إضافة التقييم'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
