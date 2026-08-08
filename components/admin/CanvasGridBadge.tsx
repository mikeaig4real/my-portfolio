'use client';

import React from 'react';

interface CanvasGridBadgeProps {
  visible?: boolean;
}

export const CanvasGridBadge: React.FC<CanvasGridBadgeProps> = ({ visible = true }) => {
  if (!visible) return null;

  return (
    <div className="absolute -top-3.5 left-4 z-10 bg-yellow-300 dark:bg-yellow-400 text-black px-2 py-0.5 border border-black font-mono text-[10px] font-extrabold uppercase tracking-wider shadow-[1px_1px_0px_0px_#000]">
      ⚡ VIEWER CANVAS PERIMETER (140px UNIT SQUARE GRID MESH)
    </div>
  );
};
