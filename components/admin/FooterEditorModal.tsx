'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, X, Save } from 'lucide-react';
import { SocialsEditor } from '@/components/editor/SocialsEditor';
import { BrutalInput } from '@/components/ui/BrutalInput';
import { BrutalButton } from '@/components/ui/BrutalButton';
import { SocialLink, PortfolioData } from '@/types/portfolio';

interface FooterEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PortfolioData;
  onSave: (updatedData: PortfolioData) => Promise<void>;
}

export const FooterEditorModal: React.FC<FooterEditorModalProps> = ({
  isOpen,
  onClose,
  data,
  onSave,
}) => {
  const [draftSocials, setDraftSocials] = useState<SocialLink[]>(data.socials);
  const [draftBadgeText, setDraftBadgeText] = useState<string>('NEOBRUTALISM v2.0');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync draft state when modal opens with fresh data
  useEffect(() => {
    if (isOpen) {
      setDraftSocials(data.socials);
    }
  }, [isOpen, data.socials]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({ ...data, socials: draftSocials });
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Footer save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 border-4 border-black dark:border-white shadow-[10px_10px_0px_0px_#70d6ff]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-black dark:border-white p-4 shrink-0">
              <h3 className="text-sm font-mono font-extrabold uppercase text-black dark:text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-cyan-500 stroke-[2.5]" />
                Edit Footer Content
              </h3>
              <button
                onClick={onClose}
                className="p-1 border border-black dark:border-white hover:bg-red-500 hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Badge / Branding text */}
              <div>
                <BrutalInput
                  label="Footer Badge Text (e.g. version label)"
                  value={draftBadgeText}
                  onChange={(e) => setDraftBadgeText(e.target.value)}
                  placeholder="NEOBRUTALISM v2.0"
                />
                <p className="text-[10px] text-slate-500 font-mono mt-1">
                  Copyright line uses your Profile Name automatically: © {new Date().getFullYear()} {data.profile.name}
                </p>
              </div>

              {/* Social links editor — reuse the existing component */}
              <SocialsEditor socials={draftSocials} onChange={setDraftSocials} />
            </div>

            {/* Footer actions */}
            <div className="border-t-2 border-black dark:border-white p-4 flex items-center justify-end gap-3 shrink-0 bg-slate-50 dark:bg-slate-800">
              <BrutalButton variant="white" size="sm" onClick={onClose}>
                Cancel
              </BrutalButton>
              <BrutalButton
                variant="cyan"
                size="sm"
                onClick={handleSave}
                disabled={saving}
              >
                <Save className="w-3.5 h-3.5" />
                {saving ? 'Saving...' : savedSuccess ? '✓ Saved!' : 'Save Footer'}
              </BrutalButton>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
