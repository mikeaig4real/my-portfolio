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
import { EditDrawerHeader } from './drawer/EditDrawerHeader';
import { EditDrawerTabs, DrawerTab } from './drawer/EditDrawerTabs';
import { EditDrawerFooter } from './drawer/EditDrawerFooter';
import { ThemeEditor } from './drawer/ThemeEditor';
import { defaultPortfolioData } from '@/lib/defaultData';
import { applyColorScheme, randomizeCardColors } from '@/lib/colorPalettes';
import confetti from 'canvas-confetti';

interface EditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: PortfolioData;
  onSave: (updatedData: PortfolioData) => Promise<void>;
}

export const EditDrawer: React.FC<EditDrawerProps> = ({
  isOpen,
  onClose,
  data,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<DrawerTab>('profile');
  const [draftData, setDraftData] = useState<PortfolioData>(data);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  React.useEffect(() => {
    if (isOpen) setDraftData(data);
  }, [isOpen, data]);

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
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Reset portfolio to defaults?')) {
      setDraftData(defaultPortfolioData);
      onSave(defaultPortfolioData);
    }
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
            className="fixed inset-0 bg-black z-40 cursor-pointer"
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
              fixed bottom-0 left-0 right-0 z-50 flex flex-col
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
                  onChange={(pr) => setDraftData({ ...draftData, projects: pr })}
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
              onResetDefaults={handleResetDefaults}
              onSave={handleSaveClick}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
