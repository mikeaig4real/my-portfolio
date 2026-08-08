import React from 'react';

interface BrutalBadgeProps {
  children: React.ReactNode;
  bg?: string;
  className?: string;
}

export const BrutalBadge: React.FC<BrutalBadgeProps> = ({
  children,
  bg = '#facc15',
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 border-2 border-black dark:border-white px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-black shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] ${className}`}
      style={{ backgroundColor: bg }}
    >
      {children}
    </span>
  );
};
