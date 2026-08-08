'use client';

import React from 'react';
import { EditableTagList } from '@/components/inline/EditableTagList';

interface WorkplaceTechBadgesProps {
  skills: string[];
  isEditingActive?: boolean;
  onUpdateSkills?: (skills: string[]) => void;
}

export const WorkplaceTechBadges: React.FC<WorkplaceTechBadgesProps> = ({
  skills = [],
  isEditingActive = false,
  onUpdateSkills,
}) => {
  return (
    <div className="pt-3 border-t-2 border-black dark:border-white">
      <p className="text-[10px] font-mono font-bold uppercase text-slate-500 dark:text-slate-400 mb-1.5">
        Technologies Used:
      </p>
      <EditableTagList
        tags={skills}
        onChangeTags={(newSkills) => {
          if (onUpdateSkills) onUpdateSkills(newSkills);
        }}
        isEditingActive={isEditingActive}
        accentBg="bg-slate-100 dark:bg-slate-800 text-black dark:text-slate-200"
      />
    </div>
  );
};
