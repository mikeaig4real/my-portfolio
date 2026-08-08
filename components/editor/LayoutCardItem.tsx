'use client';

import React from 'react';
import { BentoCardConfig } from '@/types/portfolio';
import { BrutalSelect, BrutalInput } from '@/components/ui/BrutalInput';
import { ArrowUp, ArrowDown, Eye, EyeOff, Trash2 } from 'lucide-react';
import { CustomNoteEditor } from './CustomNoteEditor';

interface LayoutCardItemProps {
  card: BentoCardConfig;
  index: number;
  totalCards: number;
  onMove: (index: number, direction: 'up' | 'down') => void;
  onToggleVisible: (id: string) => void;
  onRemoveCard: (id: string) => void;
  onUpdateCard: (id: string, field: keyof BentoCardConfig, value: BentoCardConfig[keyof BentoCardConfig]) => void;
  onUpdateCustomContent: (id: string, subField: string, value: string) => void;
}

export const LayoutCardItem: React.FC<LayoutCardItemProps> = ({
  card,
  index,
  totalCards,
  onMove,
  onToggleVisible,
  onRemoveCard,
  onUpdateCard,
  onUpdateCustomContent,
}) => {
  return (
    <div
      className={`p-3.5 border-2 border-black dark:border-white space-y-3 shadow-[3px_3px_0px_0px_#000] ${
        card.visible ? 'bg-white dark:bg-slate-800' : 'bg-gray-200 dark:bg-slate-900 opacity-60'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex flex-col gap-1">
            <button
              onClick={() => onMove(index, 'up')}
              disabled={index === 0}
              className="p-1 border border-black bg-yellow-300 disabled:opacity-30 cursor-pointer hover:bg-yellow-400 text-black"
            >
              <ArrowUp className="w-3 h-3" />
            </button>
            <button
              onClick={() => onMove(index, 'down')}
              disabled={index === totalCards - 1}
              className="p-1 border border-black bg-yellow-300 disabled:opacity-30 cursor-pointer hover:bg-yellow-400 text-black"
            >
              <ArrowDown className="w-3 h-3" />
            </button>
          </div>

          <div>
            <span className="text-xs font-mono font-bold uppercase text-black dark:text-white block">
              #{index + 1} {card.title}
            </span>
            <span className="text-[10px] font-mono text-slate-500 uppercase block">
              Type: {card.type} | Span: {card.colSpan} Col
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleVisible(card.id)}
            className={`p-1.5 border-2 border-black font-mono font-bold text-xs flex items-center gap-1 cursor-pointer ${
              card.visible ? 'bg-emerald-300 text-black' : 'bg-rose-300 text-black'
            }`}
          >
            {card.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => onRemoveCard(card.id)}
            className="p-1.5 bg-red-500 text-white border-2 border-black hover:bg-red-600 cursor-pointer"
            title="Delete Card"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Card Config Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 bg-slate-100 dark:bg-slate-900 p-2.5 border border-black">
        <BrutalInput
          label="Card Title Header"
          value={card.title}
          onChange={(e) => onUpdateCard(card.id, 'title', e.target.value)}
        />

        <BrutalSelect
          label="Column Width Span"
          options={[
            { label: '1 Column', value: '1' },
            { label: '2 Columns', value: '2' },
          ]}
          value={String(card.colSpan)}
          onChange={(e) => onUpdateCard(card.id, 'colSpan', Number(e.target.value))}
        />

        <BrutalInput
          label="Accent Header Color"
          value={card.accentColor}
          onChange={(e) => onUpdateCard(card.id, 'accentColor', e.target.value)}
        />
      </div>

      {/* Custom Content fields if custom_note */}
      {card.type === 'custom_note' && (
        <CustomNoteEditor
          cardId={card.id}
          customContent={card.customContent}
          onUpdateCustomContent={onUpdateCustomContent}
        />
      )}
    </div>
  );
};
