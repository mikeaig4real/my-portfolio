'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const BrutalInput: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-mono font-bold uppercase tracking-wider text-black dark:text-white">
          {label}
        </label>
      )}
      <input
        className={`border-3 border-black dark:border-white bg-white dark:bg-slate-900 px-3 py-2 text-sm font-medium text-black dark:text-white placeholder:text-gray-400 focus:outline-none focus:bg-yellow-100 dark:focus:bg-slate-800 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] transition-all ${className}`}
        {...props}
      />
    </div>
  );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const BrutalTextarea: React.FC<TextareaProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-mono font-bold uppercase tracking-wider text-black dark:text-white">
          {label}
        </label>
      )}
      <textarea
        className={`border-3 border-black dark:border-white bg-white dark:bg-slate-900 px-3 py-2 text-sm font-medium text-black dark:text-white placeholder:text-gray-400 focus:outline-none focus:bg-yellow-100 dark:focus:bg-slate-800 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] transition-all min-h-22.5 ${className}`}
        {...props}
      />
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { label: string; value: string }[];
}

export const BrutalSelect: React.FC<SelectProps> = ({ label, options, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-mono font-bold uppercase tracking-wider text-black dark:text-white">
          {label}
        </label>
      )}
      <select
        className={`border-3 border-black dark:border-white bg-white dark:bg-slate-900 px-3 py-2 text-sm font-bold text-black dark:text-white focus:outline-none focus:bg-yellow-100 dark:focus:bg-slate-800 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] cursor-pointer ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
