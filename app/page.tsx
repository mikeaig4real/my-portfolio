'use client';

import React, { useEffect, useState } from 'react';
import { usePortfolioStore } from '@/store/usePortfolioStore';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BentoGrid } from '@/components/bento/BentoGrid';
import { StealthLoginModal } from '@/components/admin/StealthLoginModal';
import { useRouter } from 'next/navigation';
import { FONT_PRESETS, ANALYTICS_EVENTS, SHORTCUT_KEYS } from '@/lib/constants';
import { getThemePreset } from '@/lib/colorPalettes';

export default function Home() {
  const { data, loading, fetchPortfolio } = usePortfolioStore();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchPortfolio();

    const screenRes = typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : '1920x1080';
    const lang = typeof window !== 'undefined' ? navigator.language : 'en';

    // Log non-blocking visitor analytics with screen & language telemetry
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: ANALYTICS_EVENTS.PAGE_VIEW,
        screen: screenRes,
        language: lang,
      }),
    }).catch(() => {});

    // Cross-tab & Focus Synchronization: auto-refetch when user switches back to this tab or when data updates in another tab
    const handleFocusOrVisibility = () => {
      fetchPortfolio();
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.PORTFOLIO_DRAFT) {
        fetchPortfolio();
      }
    };

    window.addEventListener('focus', handleFocusOrVisibility);
    document.addEventListener('visibilitychange', handleFocusOrVisibility);
    window.addEventListener('storage', handleStorageChange);

    // Secret shortcut: Ctrl + Alt + Shift + KEY
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.ctrlKey &&
        e.altKey &&
        e.shiftKey &&
        e.key.toLowerCase() === SHORTCUT_KEYS.ADMIN_UNLOCK_KEY
      ) {
        e.preventDefault();
        setIsLoginOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('focus', handleFocusOrVisibility);
      document.removeEventListener('visibilitychange', handleFocusOrVisibility);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [fetchPortfolio]);

  const currentFontCss =
    FONT_PRESETS.find((f) => f.id === (data.customization?.fontFamily || 'font-mono'))
      ?.cssValue || 'monospace';

  const activeTheme = getThemePreset(data.customization?.colorScheme || data.colorScheme);

  return (
    <div
      style={
        {
          fontFamily: currentFontCss,
          '--theme-primary': activeTheme.primary,
          '--theme-secondary': activeTheme.secondary,
          '--theme-accent': activeTheme.accent,
        } as React.CSSProperties
      }
      className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-[var(--theme-primary)] selection:text-black"
    >
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-3 font-mono">
            <div className="w-12 h-12 bg-yellow-300 border-3 border-black animate-spin shadow-[4px_4px_0px_0px_#000]" />
            <p className="text-sm font-extrabold uppercase">Loading Bento Portfolio...</p>
          </div>
        ) : (
          <BentoGrid data={data} isEditingActive={false} />
        )}
      </main>

      <Footer />

      <StealthLoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={() => router.push('/admin')}
      />
    </div>
  );
}
