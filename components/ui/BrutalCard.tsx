import React from 'react';
import { InlineText } from '@/components/inline/InlineText';

interface BrutalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  accentColor?: string;
  title?: string;
  badge?: string;
  hoverEffect?: boolean;
  isEditingActive?: boolean;
  onUpdateTitle?: (newTitle: string) => void;
}

export const BrutalCard: React.FC<BrutalCardProps> = ({
  children,
  className = '',
  accentColor = '#facc15',
  title,
  badge,
  hoverEffect = true,
  isEditingActive = false,
  onUpdateTitle,
  ...props
}) => {
  return (
    <div
      className={`relative border-3 border-black dark:border-white bg-white dark:bg-slate-900 rounded-none overflow-visible flex flex-col ${
        hoverEffect
          ? 'shadow-[5px_5px_0px_0px_#000] dark:shadow-[5px_5px_0px_0px_#fff] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#000] dark:hover:shadow-[8px_8px_0px_0px_#fff] transition-all duration-200'
          : 'shadow-[5px_5px_0px_0px_#000] dark:shadow-[5px_5px_0px_0px_#fff]'
      } ${className}`}
      {...props}
    >
      {/* Top Brutal Header Bar if title or accent provided */}
      {(title || accentColor) && (
        <div
          className="px-4 py-2 border-b-3 border-black dark:border-white flex items-center justify-between font-bold text-black text-sm tracking-wider uppercase shrink-0"
          style={{ backgroundColor: accentColor }}
        >
          <span className="truncate">
            <InlineText
              value={title || '/// BENTO'}
              onChange={onUpdateTitle || (() => {})}
              isEditingActive={Boolean(isEditingActive && onUpdateTitle)}
            />
          </span>
          {badge && (
            <span className="bg-black text-white text-[10px] px-2 py-0.5 font-mono uppercase tracking-widest border border-black">
              {badge}
            </span>
          )}
        </div>
      )}
      <div className="p-3.5 md:p-4 flex-1 flex flex-col justify-between">{children}</div>
    </div>
  );
};
