'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import WeddingList from '@/components/admin/WeddingList';
import GuestManager from '@/components/admin/GuestManager';
import RsvpTable from '@/components/admin/RsvpTable';
import { Users, Calendar, Menu, Heart, ArrowRight, LogOut } from 'lucide-react';

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
      <div dir="rtl" className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <span className="h-10 w-10 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
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
    <div dir="rtl" className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-900/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-600">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-100">لوحة التحكم</h1>
              <p className="text-xs text-zinc-400">إدارة دعوات الزفاف</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab(item.id)}
                  className={
                    activeTab === item.id
                      ? 'bg-amber-600 text-white hover:bg-amber-700'
                      : 'text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100'
                  }
                >
                  <item.icon className="ml-2 h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </nav>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-zinc-400 hover:text-red-400"
              title="تسجيل الخروج"
            >
              <LogOut className="h-4 w-4" />
            </Button>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-zinc-300">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="border-zinc-700 bg-zinc-900 w-64">
                  <SheetTitle className="text-zinc-100 mb-6">القائمة</SheetTitle>
                  <div className="space-y-2">
                    {navItems.map((item) => (
                      <Button
                        key={item.id}
                        variant={activeTab === item.id ? 'default' : 'ghost'}
                        className={`w-full justify-start ${
                          activeTab === item.id
                            ? 'bg-amber-600 text-white hover:bg-amber-700'
                            : 'text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100'
                        }`}
                        onClick={() => setActiveTab(item.id)}
                      >
                        <item.icon className="ml-2 h-4 w-4" />
                        {item.label}
                      </Button>
                    ))}
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-400 hover:bg-zinc-800 hover:text-red-300"
                      onClick={handleLogout}
                    >
                      <LogOut className="ml-2 h-4 w-4" />
                      تسجيل الخروج
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Selected Wedding Banner */}
      {selectedWedding && (
        <div className="border-b border-zinc-800 bg-zinc-900/50">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-amber-400" />
              <span className="text-sm text-zinc-300">
                {selectedWedding.groomName} و {selectedWedding.brideName}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSelection}
              className="text-zinc-400 hover:text-zinc-200"
            >
              <ArrowRight className="ml-1 h-4 w-4" />
              العودة للقائمة
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'weddings' && (
              <WeddingList />
            )}

            {activeTab === 'guests' && selectedWedding && (
              <GuestManager
                weddingId={selectedWedding.id}
                weddingSlug={selectedWedding.slug}
              />
            )}

            {activeTab === 'guests' && !selectedWedding && (
              <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
                <Users className="mb-4 h-16 w-16 text-zinc-600" />
                <p className="text-lg">الرجاء اختيار زفاف من القائمة أولاً</p>
                <Button
                  variant="outline"
                  onClick={() => setActiveTab('weddings')}
                  className="mt-4 border-zinc-600 text-zinc-300 hover:bg-zinc-700"
                >
                  عرض الزفات
                </Button>
              </div>
            )}

            {activeTab === 'rsvps' && selectedWedding && (
              <RsvpTable weddingId={selectedWedding.id} />
            )}

            {activeTab === 'rsvps' && !selectedWedding && (
              <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
                <Calendar className="mb-4 h-16 w-16 text-zinc-600" />
                <p className="text-lg">الرجاء اختيار زفاف من القائمة أولاً</p>
                <Button
                  variant="outline"
                  onClick={() => setActiveTab('weddings')}
                  className="mt-4 border-zinc-600 text-zinc-300 hover:bg-zinc-700"
                >
                  عرض الزفات
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-zinc-900/95 backdrop-blur md:hidden">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-4 py-1 ${
                activeTab === item.id
                  ? 'text-amber-400'
                  : 'text-zinc-500'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
