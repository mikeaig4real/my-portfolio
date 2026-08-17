'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface BrutalButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'yellow' | 'pink' | 'cyan' | 'lime' | 'purple' | 'orange' | 'dark' | 'white';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

export const BrutalButton: React.FC<BrutalButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  href,
  target,
  rel,
  onClick,
  disabled,
  title,
  ...props
}) => {
  const variantStyles: Record<NonNullable<BrutalButtonProps['variant']>, string> = {
    primary: 'bg-[var(--theme-primary,#facc15)] text-black hover:opacity-90',
    secondary: 'bg-[var(--theme-secondary,#70d6ff)] text-black hover:opacity-90',
    accent: 'bg-[var(--theme-accent,#ff70a6)] text-black hover:opacity-90',
    yellow: 'bg-[#facc15] text-black hover:bg-[#eab308] hover:text-black dark:hover:text-black',
    pink: 'bg-[#ff70a6] text-black hover:bg-[#f43f5e] hover:text-black dark:hover:text-black',
    cyan: 'bg-[#70d6ff] text-black hover:bg-[#38bdf8] hover:text-black dark:hover:text-black',
    lime: 'bg-[#a7f3d0] text-black hover:bg-[#34d399] hover:text-black dark:hover:text-black',
    purple: 'bg-[#d8b4fe] text-black hover:bg-[#c084fc] hover:text-black dark:hover:text-black',
    orange: 'bg-[#ff9f1c] text-black hover:bg-[#f97316] hover:text-black dark:hover:text-black',
    dark: 'bg-black text-white hover:bg-slate-900 hover:text-white dark:bg-white dark:text-black dark:hover:bg-slate-200 dark:hover:text-black',
    white: 'bg-white text-black hover:bg-slate-100 hover:text-black dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 dark:hover:text-white',
  };

  const sizeStyles: Record<NonNullable<BrutalButtonProps['size']>, string> = {
    sm: 'px-3 py-1.5 text-xs font-bold gap-1.5',
    md: 'px-5 py-2.5 text-sm font-bold gap-2',
    lg: 'px-7 py-3.5 text-base font-extrabold gap-2.5',
  };

  const baseStyles = `inline-flex items-center justify-center font-mono uppercase tracking-wider border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] cursor-pointer transition-colors ${
    disabled ? 'opacity-50 cursor-not-allowed' : ''
  } ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if (href) {
    return (
      <motion.a
        href={href}
        target={target}
        rel={rel}
        title={title}
        onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
        whileHover={{ x: -2, y: -2, boxShadow: '6px 6px 0px 0px #000' }}
        whileTap={{ x: 2, y: 2, boxShadow: '1px 1px 0px 0px #000' }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={baseStyles}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={props.type || 'button'}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
      disabled={disabled}
      title={title}
      whileHover={{ x: -2, y: -2, boxShadow: '6px 6px 0px 0px #000' }}
      whileTap={{ x: 2, y: 2, boxShadow: '1px 1px 0px 0px #000' }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={baseStyles}
    >
      {children}
    </motion.button>
  );
};
