'use client';

import React from 'react';
import { BentoCustomContent } from '@/types/portfolio';
import { BrutalInput } from '@/components/ui/BrutalInput';

interface CustomNoteEditorProps {
  cardId: string;
  customContent?: BentoCustomContent;
  onUpdateCustomContent: (id: string, subField: string, value: string) => void;
}

export const CustomNoteEditor: React.FC<CustomNoteEditorProps> = ({
  cardId,
  customContent,
  onUpdateCustomContent,
}) => {
  return (
    <div className="space-y-2 bg-yellow-50 dark:bg-slate-900 p-2.5 border border-black">
      <BrutalInput
        label="Note Title"
        value={customContent?.title || ''}
        onChange={(e) => onUpdateCustomContent(cardId, 'title', e.target.value)}
      />
      <BrutalInput
        label="Note Body / Text"
        value={customContent?.body || ''}
        onChange={(e) => onUpdateCustomContent(cardId, 'body', e.target.value)}
      />
      <div className="grid grid-cols-2 gap-2">
        <BrutalInput
          label="Metric Value (Optional)"
          value={customContent?.metricValue || ''}
          onChange={(e) => onUpdateCustomContent(cardId, 'metricValue', e.target.value)}
        />
        <BrutalInput
          label="Metric Label (Optional)"
          value={customContent?.metricLabel || ''}
          onChange={(e) => onUpdateCustomContent(cardId, 'metricLabel', e.target.value)}
        />
      </div>
    </div>
  );
};
