'use client';

import React, { useState, useEffect } from 'react';

interface InlineTextProps {
  value: string;
  onChange: (val: string) => void;
  isEditingActive?: boolean;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
}

export const InlineText: React.FC<InlineTextProps> = ({
  value,
  onChange,
  isEditingActive = false,
  className = '',
  multiline = false,
  placeholder = 'Double click to edit...',
  tag: Tag = 'span',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  if (!isEditingActive) {
    return <Tag className={className}>{value || placeholder}</Tag>;
  }

  const handleBlur = () => {
    setIsEditing(false);
    if (tempValue.trim() !== value) {
      onChange(tempValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      handleBlur();
    } else if (e.key === 'Escape') {
      setTempValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    if (multiline) {
      return (
        <textarea
          autoFocus
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`bg-yellow-100 dark:bg-slate-800 text-black dark:text-white border-2 border-black dark:border-white p-1 font-mono outline-none w-full ${className}`}
          rows={3}
        />
      );
    }

    return (
      <input
        autoFocus
        type="text"
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`bg-yellow-100 dark:bg-slate-800 text-black dark:text-white border-2 border-black dark:border-white px-1.5 py-0.5 font-mono outline-none w-full ${className}`}
      />
    );
  }

  return (
    <Tag
      onDoubleClick={() => setIsEditing(true)}
      title="Double click to edit text"
      className={`cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-pink-500 hover:bg-yellow-100/50 dark:hover:bg-slate-800/50 transition-all rounded-xs ${className}`}
    >
      {value || placeholder}
    </Tag>
  );
};
