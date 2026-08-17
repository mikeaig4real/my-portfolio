'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PortfolioData } from '@/types/portfolio';
import { ProfileEditor } from './ProfileEditor';
import { WorkplaceEditor } from './WorkplaceEditor';
import { ProjectEditor } from './ProjectEditor';
import { LayoutEditor } from './LayoutEditor';
import { SocialsEditor } from './SocialsEditor';
import { SkillsEditor } from './SkillsEditor';
import { AssistantEditor } from './AssistantEditor';
import { EditDrawerHeader } from './drawer/EditDrawerHeader';

import { EditDrawerTabs, DrawerTab } from './drawer/EditDrawerTabs';
import { EditDrawerFooter } from './drawer/EditDrawerFooter';
import { ThemeEditor } from './drawer/ThemeEditor';
import { defaultPortfolioData } from '@/lib/defaultData';
import { applyColorScheme, randomizeCardColors } from '@/lib/colorPalettes';
import confetti from 'canvas-confetti';
import { BentoConfirmModal } from '@/components/ui/BentoConfirmModal';
import { showBentoToast } from '@/components/ui/BentoToast';
import { logger } from '@/lib/logger';

interface EditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: PortfolioData;
  onSave: (updatedData: PortfolioData) => Promise<void>;
  onSyncLive?: (updatedData: PortfolioData) => void;
}

export const EditDrawer: React.FC<EditDrawerProps> = ({
  isOpen,
  onClose,
  data,
  onSave,
  onSyncLive,
}) => {
  const [activeTab, setActiveTab] = useState<DrawerTab>('profile');
  const [draftData, setDraftData] = useState<PortfolioData>(data);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  React.useEffect(() => {
    if (isOpen) setDraftData(data);
  }, [isOpen, data]);

  const updateDraftAndSync = (updated: PortfolioData) => {
    setDraftData(updated);
    if (onSyncLive) onSyncLive(updated);
  };

  const handleSaveClick = async () => {
    setSaving(true);
    try {
      await onSave(draftData);
      setSavedSuccess(true);
      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      logger.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmResetDefaults = () => {
    updateDraftAndSync(defaultPortfolioData);
    onSave(defaultPortfolioData);
    showBentoToast.success('Portfolio reset to default configuration!', 'RESET COMPLETE');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-60 cursor-pointer"
          />

          {/* Drawer panel — bottom sheet on mobile, right panel on sm+ */}
          <motion.div
            // Mobile: slide up from bottom
            // sm+: slide in from right
            initial={{ y: '100%', x: 0 }}
            animate={{ y: 0, x: 0 }}
            exit={{ y: '100%', x: 0 }}
            // Override for sm+ screens via a class instead of framer so we don't need media queries in JS
            className="
              fixed bottom-0 left-0 right-0 z-70 flex flex-col
              h-[82vh] w-full
              sm:top-0 sm:right-0 sm:left-auto sm:bottom-auto sm:h-full sm:w-full sm:max-w-2xl
              bg-white dark:bg-slate-900
              border-t-4 sm:border-t-0 sm:border-l-4 border-black dark:border-white
              shadow-[0px_-6px_0px_0px_#000] sm:shadow-[-10px_0px_0px_0px_#000]
            "
            style={{ transition: 'none' }}
          >
            {/* Mobile drag handle */}
            <div className="sm:hidden flex justify-center pt-2 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
            </div>

            <EditDrawerHeader onClose={onClose} />
            <EditDrawerTabs activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="flex-1 p-4 sm:p-5 overflow-y-auto overscroll-contain">
              {activeTab === 'profile' && (
                <ProfileEditor
                  profile={draftData.profile}
                  onChange={(p) => setDraftData({ ...draftData, profile: p })}
                />
              )}
              {activeTab === 'experience' && (
                <WorkplaceEditor
                  workplaces={draftData.workplaces}
                  onChange={(w) => setDraftData({ ...draftData, workplaces: w })}
                />
              )}
              {activeTab === 'projects' && (
                <ProjectEditor
                  projects={draftData.projects}
                  cards={draftData.cards}
                  onChange={(pr) => updateDraftAndSync({ ...draftData, projects: pr })}
                  onAddCardToGrid={(newCard) =>
                    updateDraftAndSync({ ...draftData, cards: [...draftData.cards, newCard] })
                  }
                />
              )}
              {activeTab === 'skills' && (
                <SkillsEditor
                  skills={draftData.skills}
                  onChange={(s) => setDraftData({ ...draftData, skills: s })}
                />
              )}
              {activeTab === 'socials' && (
                <SocialsEditor
                  socials={draftData.socials}
                  onChange={(soc) => setDraftData({ ...draftData, socials: soc })}
                />
              )}
              {activeTab === 'assistant' && (
                <AssistantEditor
                  data={draftData}
                  onChange={(updated) => updateDraftAndSync(updated)}
                />
              )}
              {activeTab === 'layout' && (

                <LayoutEditor
                  cards={draftData.cards}
                  onChange={(c) => setDraftData({ ...draftData, cards: c })}
                />
              )}
              {activeTab === 'colors' && (
                <ThemeEditor
                  currentScheme={draftData.colorScheme}
                  onApplyScheme={(s) => setDraftData(applyColorScheme(draftData, s))}
                  onRandomize={() => setDraftData(randomizeCardColors(draftData))}
                />
              )}
            </div>

            <EditDrawerFooter
              saving={saving}
              savedSuccess={savedSuccess}
              onResetDefaults={() => setIsResetConfirmOpen(true)}
              onSave={handleSaveClick}
            />
          </motion.div>

          <BentoConfirmModal
            isOpen={isResetConfirmOpen}
            title="⚠️ RESET ENTIRE PORTFOLIO?"
            message="Are you sure you want to reset all portfolio content, cards, projects, and themes to default settings? Any unsaved edits will be permanently overwritten."
            confirmText="Yes, Reset Portfolio"
            cancelText="Keep Current Portfolio"
            variant="danger"
            onClose={() => setIsResetConfirmOpen(false)}
            onConfirm={handleConfirmResetDefaults}
          />
        </>
      )}
    </AnimatePresence>
  );
};
