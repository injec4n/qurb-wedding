'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, Lock, Link2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ClientLoginPage() {
  const [slug, setSlug] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug.trim()) {
      toast.error('يرجى إدخال رابط الدعوة');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/client/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: slug.trim(), password: password.trim() }),
      });
      const data = await res.json();

      if (data.success) {
        window.location.href = `/client/dashboard?slug=${encodeURIComponent(slug.trim())}`;
      } else {
        toast.error(data.error || 'فشل في تسجيل الدخول');
      }
    } catch {
      toast.error('حدث خطأ في الاتصال');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ background: 'linear-gradient(180deg, #0D0D1A 0%, #1A1A2E 50%, #0D0D1A 100%)' }}
    >
      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, #D4A853, transparent 70%)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, #D4A853, transparent 70%)' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-8"
        >
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4"
            style={{
              background: 'linear-gradient(135deg, #D4A853 0%, #B8912E 100%)',
              boxShadow: '0 8px 32px rgba(212, 168, 83, 0.25)',
            }}
          >
            <Heart className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gold-gradient mb-1">زفاتي</h1>
          <p
            className="text-sm tracking-wider"
            style={{ color: 'var(--admin-text-secondary)' }}
          >
            منصة دعوات الزفاف
          </p>
        </motion.div>

        {/* Ornamental divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="ornament-separator mb-8"
        >
          <div className="diamond" style={{ background: 'var(--wedding-gold)' }} />
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="admin-card overflow-hidden"
          style={{ borderTop: '2px solid var(--wedding-gold)' }}
        >
          <div className="p-6 sm:p-8">
            <h2
              className="text-xl font-bold text-center mb-1"
              style={{ color: 'var(--admin-text-primary)' }}
            >
              لوحة العميل
            </h2>
            <p
              className="text-sm text-center mb-6"
              style={{ color: 'var(--admin-text-muted)' }}
            >
              أدخل بيانات الدعوة للدخول
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Slug Input */}
              <div className="space-y-2">
                <Label
                  className="text-sm font-medium flex items-center gap-2"
                  style={{ color: 'var(--admin-text-secondary)' }}
                >
                  <Link2 className="h-4 w-4" style={{ color: 'var(--wedding-gold)' }} />
                  رابط الدعوة
                </Label>
                <Input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="admin-input h-12"
                  placeholder="مثال: أحمد-فاطمة"
                  autoFocus
                  dir="ltr"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label
                  className="text-sm font-medium flex items-center gap-2"
                  style={{ color: 'var(--admin-text-secondary)' }}
                >
                  <Lock className="h-4 w-4" style={{ color: 'var(--wedding-gold)' }} />
                  كلمة المرور
                </Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="admin-input h-12"
                  placeholder="أدخل كلمة المرور"
                  dir="ltr"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="btn-wedding w-full h-12 text-base"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'دخول'
                )}
              </Button>
            </form>
          </div>
        </motion.div>

        {/* Ornamental divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="ornament-separator mt-8 mb-6"
        >
          <div className="diamond" style={{ background: 'var(--wedding-gold)' }} />
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center text-xs"
          style={{ color: 'var(--admin-text-muted)' }}
        >
          زفاتي © {new Date().getFullYear()} — منصة دعوات الزفاف
        </motion.p>
      </motion.div>
    </div>
  );
}
