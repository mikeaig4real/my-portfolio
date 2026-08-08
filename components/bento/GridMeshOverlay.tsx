'use client';

import React from 'react';

interface GridMeshOverlayProps {
  visible?: boolean;
}

export const GridMeshOverlay: React.FC<GridMeshOverlayProps> = ({ visible = true }) => {
  if (!visible) return null;

  return (
    <div
      className="absolute inset-0 pointer-events-none z-0 rounded-sm opacity-25 dark:opacity-20"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(0, 0, 0, 0.25) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0, 0, 0, 0.25) 1px, transparent 1px)
        `,
        backgroundSize: '140px 140px',
      }}
    >
      <div className="absolute top-2 right-2 px-2 py-0.5 bg-yellow-300 border border-black font-mono text-[9px] font-extrabold uppercase text-black">
        140px × 140px GRID MESH ACTIVE
      </div>
    </div>
  );
};
