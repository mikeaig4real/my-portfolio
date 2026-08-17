'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BentoCardConfig, Project } from '@/types/portfolio';
import { SINGLETON_CARD_TYPES } from '@/lib/constants';
import { CARD_TEMPLATES, CardTemplateOption, buildNewCard } from '@/lib/cardTemplates';
import { PaletteHeader } from './palette/PaletteHeader';
import { TemplateCardItem } from './palette/TemplateCardItem';

interface AddCardPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  cards: BentoCardConfig[];
  projects?: Project[];
  onAddCard: (newCard: BentoCardConfig, newProject?: Project) => void;
}

export const AddCardPaletteModal: React.FC<AddCardPaletteModalProps> = ({
  isOpen,
  onClose,
  cards,
  onAddCard,
}) => {
  const existingTypes = new Set(cards.map((c) => c.type));

  const handleSelectTemplate = (tpl: CardTemplateOption) => {
    const { newCard, newProject } = buildNewCard(tpl, cards);
    onAddCard(newCard, newProject);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-80 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-mono">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-2xl bg-white dark:bg-slate-900 border-4 border-black dark:border-white shadow-[10px_10px_0px_0px_#000] dark:shadow-[10px_10px_0px_0px_#fff] p-6 max-h-[85vh] overflow-y-auto no-scrollbar"
        >
          <PaletteHeader onClose={onClose} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {CARD_TEMPLATES.map((tpl, idx) => {
              const isSingleton = SINGLETON_CARD_TYPES.includes(tpl.type);
              const isAlreadyAdded = isSingleton && existingTypes.has(tpl.type);

              return (
                <TemplateCardItem
                  key={idx}
                  tpl={tpl}
                  isAlreadyAdded={isAlreadyAdded}
                  isSingleton={isSingleton}
                  onSelect={handleSelectTemplate}
                />
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
