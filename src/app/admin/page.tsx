'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import WeddingList from '@/components/admin/WeddingList';
import GuestManager from '@/components/admin/GuestManager';
import RsvpTable from '@/components/admin/RsvpTable';
import { Users, Calendar, Menu, Heart, ArrowRight, LogOut, Sparkles } from 'lucide-react';

interface SelectedWedding {
  id: string;
  slug: string;
  groomName: string;
  brideName: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('weddings');
  const [selectedWedding, setSelectedWedding] = useState<SelectedWedding | null>(null);
  const [isAuthed, setIsAuthed] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/auth');
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthed(true);
        } else {
          router.replace('/admin/login');
        }
      } catch {
        router.replace('/admin/login');
      } finally {
        setIsChecking(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  if (isChecking) {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center" style={{ background: 'var(--admin-surface)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <span className="h-12 w-12 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: 'var(--wedding-gold)', borderTopColor: 'transparent' }} />
          </div>
          <p className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!isAuthed) {
    return null;
  }

  const handleSelectWedding = (wedding: SelectedWedding) => {
    setSelectedWedding(wedding);
    setActiveTab('guests');
  };

  const clearSelection = () => {
    setSelectedWedding(null);
    setActiveTab('weddings');
  };

  const navItems = [
    { id: 'weddings', label: 'الزفات', icon: Heart },
    { id: 'guests', label: 'الضيوف', icon: Users },
    { id: 'rsvps', label: 'الردود', icon: Calendar },
  ];

  return (
    <div dir="rtl" className="min-h-screen flex flex-col" style={{ background: 'var(--admin-surface)', color: 'var(--admin-text-primary)' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl" style={{ background: 'rgba(17,17,24,0.95)', borderBottom: '1px solid var(--admin-border)' }}>
        {/* Gold gradient bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, var(--wedding-gold), transparent)' }} />
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          {/* Logo Area */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: 'linear-gradient(135deg, var(--wedding-gold), var(--wedding-gold-light))', boxShadow: '0 4px 16px rgba(212,168,83,0.25)' }}>
              <Heart className="h-5 w-5" style={{ color: 'var(--admin-surface)' }} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gold-gradient">زفاتي</h1>
              <p className="text-xs" style={{ color: 'var(--admin-text-muted)' }}>إدارة دعوات الزفاف</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Desktop Navigation - Elegant underline style */}
            <nav className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className="relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300"
                  style={{
                    color: activeTab === item.id ? 'var(--wedding-gold)' : 'var(--admin-text-secondary)',
                    background: activeTab === item.id ? 'rgba(212,168,83,0.08)' : 'transparent',
                  }}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                  {activeTab === item.id && (
                    <motion.div
                      layoutId="navUnderline"
                      className="absolute bottom-0 right-2 left-2 h-0.5 rounded-full"
                      style={{ background: 'linear-gradient(90deg, var(--wedding-gold), var(--wedding-gold-light))' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </nav>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center h-8 w-8 rounded-lg transition-all duration-300"
              style={{ color: 'var(--admin-text-muted)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#EF4444';
                e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--admin-text-muted)';
                e.currentTarget.style.background = 'transparent';
              }}
              title="تسجيل الخروج"
            >
              <LogOut className="h-4 w-4" />
            </button>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <button className="flex items-center justify-center h-9 w-9 rounded-lg transition-colors" style={{ color: 'var(--admin-text-secondary)' }}>
                    <Menu className="h-5 w-5" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72" style={{ background: 'var(--admin-surface-raised)', borderLeft: '1px solid var(--admin-border)' }}>
                  <SheetTitle className="text-gold-gradient text-xl mb-8">زفاتي</SheetTitle>
                  <div className="space-y-1">
                    {navItems.map((item) => (
                      <button
                        key={item.id}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                          activeTab === item.id ? 'btn-wedding' : ''
                        }`}
                        style={activeTab !== item.id ? { color: 'var(--admin-text-secondary)' } : {}}
                        onClick={() => setActiveTab(item.id)}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </button>
                    ))}
                    <div className="ornament-separator mt-4 mb-4">
                      <div className="diamond" />
                    </div>
                    <button
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300"
                      style={{ color: '#EF4444' }}
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      تسجيل الخروج
                    </button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Selected Wedding Banner */}
      <AnimatePresence>
        {selectedWedding && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ background: 'rgba(212,168,83,0.04)', borderBottom: '1px solid var(--admin-border)' }}
          >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: 'rgba(212,168,83,0.12)' }}>
                  <Heart className="h-4 w-4" style={{ color: 'var(--wedding-gold)' }} fill="currentColor" />
                </div>
                <div>
                  <span className="text-sm font-medium" style={{ color: 'var(--wedding-gold)' }}>
                    {selectedWedding.groomName} و {selectedWedding.brideName}
                  </span>
                </div>
              </div>
              <button
                onClick={clearSelection}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300"
                style={{ color: 'var(--admin-text-secondary)', background: 'var(--admin-surface-overlay)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--wedding-gold)';
                  e.currentTarget.style.background = 'rgba(212,168,83,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--admin-text-secondary)';
                  e.currentTarget.style.background = 'var(--admin-surface-overlay)';
                }}
              >
                <ArrowRight className="h-3.5 w-3.5" />
                العودة للقائمة
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'weddings' && (
              <div className="space-y-6">
                {/* Welcome Section */}
                <div className="admin-card card-glow p-6 sm:p-8">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ background: 'linear-gradient(135deg, var(--wedding-gold), var(--wedding-gold-light))', boxShadow: '0 4px 16px rgba(212,168,83,0.25)' }}>
                      <Heart className="h-6 w-6" style={{ color: 'var(--admin-surface)' }} fill="currentColor" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gold-gradient">مرحباً بك في زفاتي</h2>
                      <p className="text-sm mt-0.5" style={{ color: 'var(--admin-text-secondary)' }}>إدارة دعوات الزفاف بكل أناقة</p>
                    </div>
                  </div>
                  <div className="ornament-separator mt-2 mb-2">
                    <div className="diamond" />
                  </div>
                  <p className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>
                    من هنا يمكنك إنشاء وإدارة دعوات الزفاف، متابعة ردود الضيوف، وتخصيص كل تفصيلة بدقة.
                  </p>
                </div>

                <WeddingList />
              </div>
            )}

            {activeTab === 'guests' && selectedWedding && (
              <GuestManager
                weddingId={selectedWedding.id}
                weddingSlug={selectedWedding.slug}
              />
            )}

            {activeTab === 'guests' && !selectedWedding && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="flex h-20 w-20 items-center justify-center rounded-full mb-6" style={{ background: 'rgba(212,168,83,0.08)' }}>
                  <Users className="h-10 w-10" style={{ color: 'var(--wedding-gold)' }} />
                </div>
                <p className="text-lg font-medium mb-2" style={{ color: 'var(--admin-text-primary)' }}>اختار زفاف من القائمة الأول 🌹</p>
                <p className="text-sm mb-6" style={{ color: 'var(--admin-text-muted)' }}>علشان تقدر تدير قائمة الضيوف</p>
                <button
                  onClick={() => setActiveTab('weddings')}
                  className="btn-wedding px-6 py-2.5 text-sm"
                >
                  عرض الزفات
                </button>
              </div>
            )}

            {activeTab === 'rsvps' && selectedWedding && (
              <RsvpTable weddingId={selectedWedding.id} />
            )}

            {activeTab === 'rsvps' && !selectedWedding && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="flex h-20 w-20 items-center justify-center rounded-full mb-6" style={{ background: 'rgba(212,168,83,0.08)' }}>
                  <Calendar className="h-10 w-10" style={{ color: 'var(--wedding-gold)' }} />
                </div>
                <p className="text-lg font-medium mb-2" style={{ color: 'var(--admin-text-primary)' }}>اختار زفاف من القائمة الأول 🌙</p>
                <p className="text-sm mb-6" style={{ color: 'var(--admin-text-muted)' }}>علشان تشوف ردود الضيوف</p>
                <button
                  onClick={() => setActiveTab('weddings')}
                  className="btn-wedding px-6 py-2.5 text-sm"
                >
                  عرض الزفات
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl md:hidden" style={{ background: 'rgba(17,17,24,0.95)', borderTop: '1px solid var(--admin-border)' }}>
        <div className="flex items-center justify-around py-2 px-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="relative flex flex-col items-center gap-1 px-5 py-2 rounded-xl transition-all duration-300"
              style={{
                color: activeTab === item.id ? 'var(--wedding-gold)' : 'var(--admin-text-muted)',
                background: activeTab === item.id ? 'rgba(212,168,83,0.08)' : 'transparent',
              }}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
              {activeTab === item.id && (
                <motion.div
                  layoutId="mobileNavIndicator"
                  className="absolute -top-0.5 right-3 left-3 h-0.5 rounded-full"
                  style={{ background: 'linear-gradient(90deg, var(--wedding-gold), var(--wedding-gold-light))' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
