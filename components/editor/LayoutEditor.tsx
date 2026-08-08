'use client';

import React from 'react';
import { BentoCardConfig } from '@/types/portfolio';
import { BrutalButton } from '@/components/ui/BrutalButton';
import { Plus } from 'lucide-react';
import { LayoutCardItem } from './LayoutCardItem';

interface LayoutEditorProps {
  cards: BentoCardConfig[];
  onChange: (updatedCards: BentoCardConfig[]) => void;
}

export const LayoutEditor: React.FC<LayoutEditorProps> = ({ cards, onChange }) => {
  const sortedCards = [...cards].sort((a, b) => a.order - b.order);

  const handleAddCustomCard = () => {
    const newCard: BentoCardConfig = {
      id: `card-${Date.now()}`,
      type: 'custom_note',
      title: 'New Custom Bento Card',
      colSpan: 1,
      rowSpan: 1,
      order: cards.length + 1,
      visible: true,
      accentColor: '#facc15',
      customContent: {
        title: '💡 Custom Callout',
        body: 'Click edit to customize this card content.',
        metricValue: '100%',
        metricLabel: 'Custom Metric',
      },
    };
    onChange([...cards, newCard]);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newCards = [...sortedCards];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newCards.length) return;

    const tempOrder = newCards[index].order;
    newCards[index].order = newCards[targetIdx].order;
    newCards[targetIdx].order = tempOrder;

    onChange(newCards);
  };

  const handleToggleVisible = (id: string) => {
    onChange(
      cards.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c))
    );
  };

  const handleRemoveCard = (id: string) => {
    onChange(cards.filter((c) => c.id !== id));
  };

  const handleUpdateCard = (id: string, field: keyof BentoCardConfig, value: BentoCardConfig[keyof BentoCardConfig]) => {
    onChange(cards.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const handleUpdateCustomContent = (id: string, subField: string, value: string) => {
    onChange(
      cards.map((c) =>
        c.id === id
          ? {
              ...c,
              customContent: { ...c.customContent, [subField]: value },
            }
          : c
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-2">
        <h3 className="text-sm font-mono font-extrabold uppercase text-black dark:text-white">
          📐 Bento Grid Cards ({cards.length})
        </h3>
        <BrutalButton variant="yellow" size="sm" onClick={handleAddCustomCard}>
          <Plus className="w-3.5 h-3.5" /> Add New Card
        </BrutalButton>
      </div>

      <div className="space-y-3 max-h-115 overflow-y-auto pr-1">
        {sortedCards.map((card, idx) => (
          <LayoutCardItem
            key={card.id}
            card={card}
            index={idx}
            totalCards={sortedCards.length}
            onMove={handleMove}
            onToggleVisible={handleToggleVisible}
            onRemoveCard={handleRemoveCard}
            onUpdateCard={handleUpdateCard}
            onUpdateCustomContent={handleUpdateCustomContent}
          />
        ))}
      </div>
    </div>
  );
};
