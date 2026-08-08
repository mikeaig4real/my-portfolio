'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Calendar, MapPin } from 'lucide-react';
import { nanoid } from 'nanoid';
import { Workplace } from '@/types/portfolio';
import { BrutalCard } from '@/components/ui/BrutalCard';
import { BrutalBadge } from '@/components/ui/BrutalBadge';
import { InlineText } from '@/components/inline/InlineText';
import { DeleteEdgeControl } from '@/components/inline/ItemEdgeControls';
import { WorkplaceTechBadges } from './WorkplaceTechBadges';

interface WorkplaceCardProps {
  workplaces: Workplace[];
  accentColor?: string;
  cardTitle?: string;
  onUpdateCardTitle?: (newTitle: string) => void;
  isEditingActive?: boolean;
  onUpdateWorkplaces?: (workplaces: Workplace[]) => void;
}

export const WorkplaceCard: React.FC<WorkplaceCardProps> = ({
  workplaces,
  accentColor = '#ff70a6',
  cardTitle,
  onUpdateCardTitle,
  isEditingActive = false,
  onUpdateWorkplaces,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  if (!workplaces || workplaces.length === 0) return null;
  const currentWork = workplaces[activeTab] || workplaces[0];

  const handleUpdateCurrentField = (field: keyof Workplace, val: string) => {
    if (!onUpdateWorkplaces) return;
    onUpdateWorkplaces(
      workplaces.map((w, idx) =>
        idx === activeTab ? { ...w, [field]: val } : w
      )
    );
  };

  const handleAddRole = () => {
    if (!onUpdateWorkplaces) return;
    const newWork: Workplace = {
      id: `work_${nanoid()}`,
      company: 'New Company',
      role: 'Software Engineer',
      period: '2025 — Present',
      location: 'Remote',
      description: 'Building scalable modern applications.',
      skills: ['TypeScript', 'React', 'Node.js'],
      isCurrent: true,
      logoBg: '#facc15',
    };
    onUpdateWorkplaces([newWork, ...workplaces]);
    setActiveTab(0);
  };

  const handleDeleteRole = (id: string) => {
    if (!onUpdateWorkplaces) return;
    const filtered = workplaces.filter((w) => w.id !== id);
    onUpdateWorkplaces(filtered);
    setActiveTab(0);
  };

  return (
    <BrutalCard
      accentColor={accentColor}
      title={cardTitle || 'Work Experience'}
      badge={`${workplaces.length} ROLES`}
      isEditingActive={isEditingActive}
      onUpdateTitle={onUpdateCardTitle}
      className="h-full flex flex-col justify-between"
    >
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b-2 border-black dark:border-white mb-4 no-scrollbar">
        {workplaces.map((work, idx) => (
          <div key={work.id} className="relative group/tab flex items-center">
            <button
              onClick={() => setActiveTab(idx)}
              className={`px-3 py-1.5 text-xs font-mono font-bold uppercase whitespace-nowrap border-2 border-black dark:border-white transition-all cursor-pointer ${
                activeTab === idx
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-[3px_3px_0px_0px_#facc15]'
                  : 'bg-white text-black dark:bg-slate-800 dark:text-white hover:bg-yellow-300 hover:text-black dark:hover:text-black'
              }`}
            >
              {work.company}
            </button>

            {isEditingActive && workplaces.length > 1 && (
              <span className="ml-1 hidden group-hover/tab:inline-block">
                <DeleteEdgeControl onDelete={() => handleDeleteRole(work.id)} />
              </span>
            )}
          </div>
        ))}

        {isEditingActive && (
          <button
            onClick={handleAddRole}
            className="px-2 py-1 bg-yellow-300 text-black border-2 border-black text-xs font-mono font-bold hover:bg-yellow-400 cursor-pointer whitespace-nowrap"
          >
            + Add Role
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentWork.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-3 flex-1 flex flex-col justify-between"
        >
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-extrabold text-black dark:text-white font-mono uppercase">
                <InlineText
                  value={currentWork.role}
                  onChange={(val) => handleUpdateCurrentField('role', val)}
                  isEditingActive={isEditingActive}
                />
              </h3>
              {currentWork.isCurrent ? (
                <button
                  type="button"
                  onClick={() => {
                    if (isEditingActive && onUpdateWorkplaces) {
                      onUpdateWorkplaces(
                        workplaces.map((w, idx) =>
                          idx === activeTab ? { ...w, isCurrent: !w.isCurrent } : w
                        )
                      );
                    }
                  }}
                  className={isEditingActive ? 'cursor-pointer hover:opacity-80' : ''}
                  title={isEditingActive ? 'Click to toggle Current status' : undefined}
                >
                  <BrutalBadge bg="#a7f3d0">CURRENT ⚡</BrutalBadge>
                </button>
              ) : isEditingActive && onUpdateWorkplaces ? (
                <button
                  type="button"
                  onClick={() => {
                    onUpdateWorkplaces(
                      workplaces.map((w, idx) =>
                        idx === activeTab ? { ...w, isCurrent: true } : w
                      )
                    );
                  }}
                  className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-black dark:text-white text-[10px] font-mono font-bold border border-black uppercase cursor-pointer hover:bg-emerald-300 hover:text-black shadow-[1px_1px_0px_0px_#000]"
                >
                  + Set As Current
                </button>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono font-bold text-slate-600 dark:text-slate-300 mt-1">
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-pink-500 stroke-[2.5]" />
                <InlineText
                  value={currentWork.company}
                  onChange={(val) => handleUpdateCurrentField('company', val)}
                  isEditingActive={isEditingActive}
                />
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-500 stroke-[2.5]" />
                <InlineText
                  value={currentWork.period}
                  onChange={(val) => handleUpdateCurrentField('period', val)}
                  isEditingActive={isEditingActive}
                />
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-500 stroke-[2.5]" />
                <InlineText
                  value={currentWork.location}
                  onChange={(val) => handleUpdateCurrentField('location', val)}
                  isEditingActive={isEditingActive}
                />
              </span>
            </div>

            <div className="text-xs md:text-sm text-slate-700 dark:text-slate-300 mt-3 font-medium leading-relaxed">
              <InlineText
                value={currentWork.description}
                onChange={(val) => handleUpdateCurrentField('description', val)}
                isEditingActive={isEditingActive}
                multiline
              />
            </div>
          </div>

          <WorkplaceTechBadges
            skills={currentWork.skills}
            isEditingActive={isEditingActive}
            onUpdateSkills={(newSkills) => {
              if (!onUpdateWorkplaces) return;
              onUpdateWorkplaces(
                workplaces.map((w, idx) =>
                  idx === activeTab ? { ...w, skills: newSkills } : w
                )
              );
            }}
          />
        </motion.div>
      </AnimatePresence>
    </BrutalCard>
  );
};
