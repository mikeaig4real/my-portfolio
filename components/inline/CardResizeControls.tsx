'use client';

import React from 'react';
import { Columns, Rows } from 'lucide-react';
import { BentoCardType } from '@/types/portfolio';
import { CARD_TYPE_BOUNDS } from '@/lib/constants';

interface CardResizeControlsProps {
  colSpan: number;
  rowSpan: number;
  cardType?: BentoCardType;
  onUpdateSpan: (colSpan: number, rowSpan: number) => void;
}

export const CardResizeControls: React.FC<CardResizeControlsProps> = ({
  colSpan,
  rowSpan,
  cardType,
  onUpdateSpan,
}) => {
  const bounds = cardType
    ? CARD_TYPE_BOUNDS[cardType]
    : { minCol: 1, maxCol: 4, minRow: 1, maxRow: 3 };

  const handleStepCol = () => {
    let nextCol = colSpan + 1;
    if (nextCol > bounds.maxCol) nextCol = bounds.minCol;
    onUpdateSpan(nextCol, rowSpan);
  };

  const handleStepRow = () => {
    let nextRow = rowSpan + 1;
    if (nextRow > bounds.maxRow) nextRow = bounds.minRow;
    onUpdateSpan(colSpan, nextRow);
  };

  return (
    <div className="flex items-center gap-1 bg-black text-white p-1 border border-white text-xs font-mono">
      <button
        onClick={handleStepCol}
        title={`Columns: ${colSpan} (Min ${bounds.minCol}, Max ${bounds.maxCol}). Click to step.`}
        className="px-1.5 py-0.5 hover:bg-yellow-300 hover:text-black dark:hover:text-black flex items-center gap-1 cursor-pointer font-bold"
      >
        <Columns className="w-3 h-3" />
        <span>{colSpan}C</span>
      </button>

      <button
        onClick={handleStepRow}
        title={`Rows: ${rowSpan} (Min ${bounds.minRow}, Max ${bounds.maxRow}). Click to step.`}
        className="px-1.5 py-0.5 hover:bg-yellow-300 hover:text-black dark:hover:text-black flex items-center gap-1 cursor-pointer font-bold"
      >
        <Rows className="w-3 h-3" />
        <span>{rowSpan}R</span>
      </button>
    </div>
  );
};
