'use client';

import React, { useState } from 'react';
import { Plus, X, Check } from 'lucide-react';
import { InlineText } from './InlineText';

interface EditableTagListProps {
  tags: string[];
  onChangeTags: (tags: string[]) => void;
  isEditingActive?: boolean;
  accentBg?: string;
}

export const EditableTagList: React.FC<EditableTagListProps> = ({
  tags,
  onChangeTags,
  isEditingActive = false,
  accentBg = 'bg-yellow-200 dark:bg-slate-800 text-black dark:text-white',
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTagVal, setNewTagVal] = useState('');

  const handleUpdateTag = (idx: number, newTag: string) => {
    const updated = [...tags];
    updated[idx] = newTag;
    onChangeTags(updated);
  };

  const handleRemoveTag = (idx: number) => {
    const updated = tags.filter((_, i) => i !== idx);
    onChangeTags(updated);
  };

  const handleConfirmAddTag = () => {
    if (newTagVal && newTagVal.trim()) {
      onChangeTags([...tags, newTagVal.trim()]);
      setNewTagVal('');
      setIsAdding(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
      {tags.map((tag, idx) => (
        <div
          key={idx}
          className={`group/tag relative inline-flex items-center gap-1 px-2 py-0.5 font-bold border border-black dark:border-white shadow-[1px_1px_0px_0px_#000] dark:shadow-[1px_1px_0px_0px_#fff] ${accentBg}`}
        >
          <span>#</span>
          <InlineText
            value={tag}
            onChange={(val) => handleUpdateTag(idx, val)}
            isEditingActive={isEditingActive}
          />

          {isEditingActive && (
            <button
              onClick={() => handleRemoveTag(idx)}
              className="ml-1 p-0.5 bg-red-500 text-white hover:bg-red-600 rounded-full opacity-80 group-hover/tag:opacity-100 cursor-pointer"
              title="Remove Tag"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          )}
        </div>
      ))}

      {isEditingActive && (
        isAdding ? (
          <div className="inline-flex items-center gap-1 bg-white dark:bg-slate-900 border border-black p-0.5 shadow-[1px_1px_0px_0px_#000]">
            <input
              type="text"
              autoFocus
              value={newTagVal}
              onChange={(e) => setNewTagVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleConfirmAddTag();
                if (e.key === 'Escape') setIsAdding(false);
              }}
              placeholder="Tag name..."
              className="w-24 text-[10px] font-mono font-bold px-1 outline-none text-black dark:text-white bg-transparent"
            />
            <button
              onClick={handleConfirmAddTag}
              className="p-0.5 bg-emerald-400 text-black hover:bg-emerald-500 border border-black cursor-pointer"
            >
              <Check className="w-3 h-3" />
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="p-0.5 bg-red-400 text-black hover:bg-red-500 border border-black cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="px-2 py-0.5 bg-yellow-300 hover:bg-yellow-400 text-black font-extrabold border border-black shadow-[1px_1px_0px_0px_#000] flex items-center gap-1 cursor-pointer"
            title="Add Technology Tag"
          >
            <Plus className="w-3 h-3 stroke-3" />
            <span>+ Tech</span>
          </button>
        )
      )}
    </div>
  );
};
