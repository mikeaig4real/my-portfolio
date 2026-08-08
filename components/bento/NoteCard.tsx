'use client';

import React from 'react';
import { Award } from 'lucide-react';
import { BrutalCard } from '@/components/ui/BrutalCard';
import { InlineText } from '@/components/inline/InlineText';
import { BentoCustomContent } from '@/types/portfolio';

interface NoteCardProps {
  customContent?: BentoCustomContent;
  accentColor?: string;
  cardTitle?: string;
  onUpdateCardTitle?: (newTitle: string) => void;
  isEditingActive?: boolean;
  onUpdateContent?: (updated: BentoCustomContent) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  customContent,
  accentColor = '#a7f3d0',
  cardTitle,
  onUpdateCardTitle,
  isEditingActive = false,
  onUpdateContent,
}) => {
  const title = customContent?.title || 'Architecture & System Note';
  const body = customContent?.body || 'Building scalable modern web applications with agentic workflows, responsive UI, and high-performance serverless backends.';
  const metricValue = customContent?.metricValue || 'Official';
  const metricLabel = customContent?.metricLabel || 'Verification';

  const updateField = (field: keyof BentoCustomContent, val: string) => {
    if (onUpdateContent) {
      onUpdateContent({ ...customContent, [field]: val });
    }
  };

  return (
    <BrutalCard
      accentColor={accentColor}
      title={cardTitle || title}
      isEditingActive={isEditingActive}
      onUpdateTitle={onUpdateCardTitle}
      className="h-full flex flex-col justify-between overflow-hidden"
    >
      <div className="overflow-y-auto max-h-95 md:max-h-110 pr-1.5 flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400 stroke-[2.5] shrink-0" />
          <span className="text-xs font-mono font-extrabold uppercase text-black dark:text-white">
            <InlineText
              value={title}
              onChange={(val) => updateField('title', val)}
              isEditingActive={isEditingActive}
            />
          </span>
        </div>

        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
          <InlineText
            value={body}
            onChange={(val) => updateField('body', val)}
            isEditingActive={isEditingActive}
            multiline
          />
        </p>
      </div>

      <div className="mt-3 pt-2 border-t-2 border-black dark:border-white flex items-center justify-between shrink-0">
        <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-300">
          <InlineText
            value={metricLabel || 'Verification'}
            onChange={(val) => updateField('metricLabel', val)}
            isEditingActive={isEditingActive}
          />
        </span>
        <span className="text-xs font-mono font-extrabold bg-black text-yellow-300 px-2 py-0.5 border border-white">
          <InlineText
            value={metricValue || 'Official'}
            onChange={(val) => updateField('metricValue', val)}
            isEditingActive={isEditingActive}
          />
        </span>
      </div>
    </BrutalCard>
  );
};
