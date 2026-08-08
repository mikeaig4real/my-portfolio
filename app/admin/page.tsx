'use client';

import React, { useEffect, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { usePortfolioStore } from '@/store/usePortfolioStore';
import { AdminTopBar } from '@/components/admin/AdminTopBar';
import { BentoGrid } from '@/components/bento/BentoGrid';
import { EditDrawer } from '@/components/editor/EditDrawer';
import { AnalyticsWidget } from '@/components/admin/AnalyticsWidget';
import { CustomizationPanel } from '@/components/admin/CustomizationPanel';
import { CheckpointManagerModal } from '@/components/admin/CheckpointManagerModal';
import { AddCardPaletteModal } from '@/components/admin/AddCardPaletteModal';
import { AIOnboardingModal } from '@/components/admin/AIOnboardingModal';
import { ResumeManagerModal } from '@/components/admin/ResumeManagerModal';
import { MissingCardsBanner } from '@/components/admin/MissingCardsBanner';
import { GridMeshOverlay } from '@/components/bento/GridMeshOverlay';
import { Footer } from '@/components/layout/Footer';
import { useScrollToCard } from '@/hooks/useScrollToCard';
import { CanvasGridBadge } from '@/components/admin/CanvasGridBadge';
import { applyColorScheme, getThemePreset } from '@/lib/colorPalettes';
import { FONT_PRESETS, SINGLETON_CARD_TYPES } from '@/lib/constants';

export default function AdminPage() {
  const {
    data,
    loading,
    isDrawerOpen,
    autoSaveEnabled,
    fetchPortfolio,
    savePortfolio,
    setIsDrawerOpen,
    setData,
    setAutoSaveEnabled,
  } = usePortfolioStore();

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCheckpointsOpen, setIsCheckpointsOpen] = useState(false);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [isAIOnboardingOpen, setIsAIOnboardingOpen] = useState(false);
  const [isResumeManagerOpen, setIsResumeManagerOpen] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [lastAddedCardId, setLastAddedCardId] = useState<string | null>(null);

  const router = useRouter();

  const missingSingletons = SINGLETON_CARD_TYPES.filter(
    (st) => !data.cards.some((c) => c.type === st && c.visible)
  );

  // Custom Hook to smoothly scroll newly added cards into view
  useScrollToCard(lastAddedCardId, data.cards, () => setLastAddedCardId(null));

  useEffect(() => {
    fetch('/api/auth/check')
      .then((res) => res.json())
      .then((resData) => {
        if (!resData.authenticated) {
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
          fetchPortfolio();
        }
      })
      .catch(() => setIsAuthenticated(false));
  }, [fetchPortfolio]);

  if (isAuthenticated === false) {
    notFound();
  }

  if (isAuthenticated === null || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-950 text-black dark:text-white font-mono p-4 text-center">
        <div className="w-12 h-12 border-4 border-black dark:border-white border-t-yellow-400 animate-spin mb-4 shadow-[4px_4px_0px_0px_#facc15]" />
        <h2 className="text-xl font-extrabold uppercase tracking-wider text-black dark:text-white">
          ⚡ LOADING STUDIO ENGINE...
        </h2>
      </div>
    );
  }

  const handleSaveAll = async () => {
    setSaving(true);
    setSavedSuccess(false);
    await savePortfolio();
    setSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSelectFont = (fontId: string) => {
    const updatedCustomization = {
      ...(data.customization || {
        layoutMode: 'bento' as const,
        gridColumns: 4,
        gridGap: 20,
        shadowOffset: 4,
        borderWidth: 2,
        colorScheme: 'cyber_yellow',
        enableAnimations: true,
      }),
      fontFamily: fontId,
    };
    setData({ ...data, customization: updatedCustomization });
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

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
      className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-(--theme-primary) selection:text-black"
    >
      <AdminTopBar
        onSave={handleSaveAll}
        saving={saving}
        savedSuccess={savedSuccess}
        autoSaveEnabled={autoSaveEnabled}
        isPreviewMode={isPreviewMode}
        onTogglePreviewMode={() => setIsPreviewMode(!isPreviewMode)}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenCheckpoints={() => setIsCheckpointsOpen(true)}
        onOpenAddCard={() => setIsAddCardOpen(true)}
        onOpenAIOnboarding={() => setIsAIOnboardingOpen(true)}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-6 flex-1 w-full">
        {!isPreviewMode && (
          <MissingCardsBanner
            missingSingletons={missingSingletons}
            onRestore={() => setIsAddCardOpen(true)}
          />
        )}

        <div className={`relative ${!isPreviewMode ? 'border-3 border-dashed border-yellow-400 dark:border-yellow-300 p-4 sm:p-6 bg-slate-200/40 dark:bg-slate-900/40 shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff]' : ''}`}>
          <GridMeshOverlay visible={!isPreviewMode} />
          <CanvasGridBadge visible={!isPreviewMode} />

          <BentoGrid
            data={data}
            isEditingActive={!isPreviewMode}
            newlyAddedCardId={lastAddedCardId}
            onUpdateCards={(cards) => setData({ ...data, cards })}
            onUpdateProfile={(profile) => setData({ ...data, profile })}
            onUpdateWorkplaces={(workplaces) => setData({ ...data, workplaces })}
            onUpdateSkills={(skills) => setData({ ...data, skills })}
            onUpdateProjects={(projects) => setData({ ...data, projects })}
            onUpdateSocials={(socials) => setData({ ...data, socials })}
            onOpenResumeManager={() => setIsResumeManagerOpen(true)}
          />
        </div>
      </main>

      <Footer />

      <ResumeManagerModal
        isOpen={isResumeManagerOpen}
        onClose={() => setIsResumeManagerOpen(false)}
        currentResumeUrl={data.profile.resumeUrl || ''}
        onUpdateResumeUrl={(resumeUrl) => setData({ ...data, profile: { ...data.profile, resumeUrl } })}
      />

      <AIOnboardingModal
        isOpen={isAIOnboardingOpen}
        onClose={() => setIsAIOnboardingOpen(false)}
        onImportPortfolio={(importedData) => setData(importedData)}
      />

      <AddCardPaletteModal
        isOpen={isAddCardOpen}
        onClose={() => setIsAddCardOpen(false)}
        cards={data.cards}
        projects={data.projects}
        onAddCard={(newCard, newProject) => {
          const updatedCards = [...data.cards, newCard];
          const updatedProjects = newProject ? [...data.projects, newProject] : data.projects;
          setData({ ...data, cards: updatedCards, projects: updatedProjects });
          setLastAddedCardId(newCard.id);
        }}
      />

      <EditDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        data={data}
        onSave={savePortfolio}
      />

      <AnalyticsWidget
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
      />

      <CustomizationPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentScheme={data.customization?.colorScheme || data.colorScheme || 'cyber_yellow'}
        currentFont={data.customization?.fontFamily || 'font-mono'}
        autoSaveEnabled={autoSaveEnabled}
        onSelectScheme={(schemeId) => setData(applyColorScheme(data, schemeId))}
        onSelectFont={handleSelectFont}
        onToggleAutoSave={setAutoSaveEnabled}
        onOpenCheckpoints={() => setIsCheckpointsOpen(true)}
      />

      <CheckpointManagerModal
        isOpen={isCheckpointsOpen}
        onClose={() => setIsCheckpointsOpen(false)}
      />
    </div>
  );
}
