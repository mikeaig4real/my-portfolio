'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Project } from '@/types/portfolio';
import { BrutalCard } from '@/components/ui/BrutalCard';
import { InlineText } from '@/components/inline/InlineText';
import { InlineLinkPopover } from '@/components/inline/InlineLinkPopover';
import { trackProjectClick } from '@/lib/analyticsTracker';

interface MetricProjectViewProps {
  project: Project;
  accentColor: string;
  cardTitle?: string;
  onUpdateCardTitle?: (newTitle: string) => void;
  isEditingActive?: boolean;
  onUpdateProject?: (updated: Project) => void;
}

export const MetricProjectView: React.FC<MetricProjectViewProps> = ({
  project,
  accentColor,
  cardTitle,
  onUpdateCardTitle,
  isEditingActive = false,
  onUpdateProject,
}) => {
  const updateField = <K extends keyof Project>(field: K, val: Project[K]) => {
    if (onUpdateProject) {
      onUpdateProject({ ...project, [field]: val });
    }
  };

  const updateMetric = (field: 'label' | 'value', val: string) => {
    if (onUpdateProject) {
      onUpdateProject({
        ...project,
        metric: {
          label: project.metric?.label || 'Metric',
          value: project.metric?.value || '0',
          [field]: val,
        },
      });
    }
  };

  return (
    <BrutalCard
      accentColor={accentColor}
      title={cardTitle || `STATS // ${project.title}`}
      isEditingActive={isEditingActive}
      onUpdateTitle={onUpdateCardTitle || ((val) => updateField('title', val))}
      className="h-full flex flex-col justify-between"
    >
      <div className="space-y-2 text-center py-0.5">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="inline-block bg-black text-yellow-300 px-4 py-2 border-3 border-black text-2xl md:text-3xl font-extrabold font-mono shadow-[4px_4px_0px_0px_#ff70a6]"
        >
          <InlineText
            value={project.metric?.value || '99.9%'}
            onChange={(val) => updateMetric('value', val)}
            isEditingActive={isEditingActive}
          />
        </motion.div>

        <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          <InlineText
            value={project.metric?.label || 'Performance Metric'}
            onChange={(val) => updateMetric('label', val)}
            isEditingActive={isEditingActive}
          />
        </p>

        <h3 className="text-base font-bold text-black dark:text-white font-mono uppercase mt-1">
          <InlineText
            value={project.title}
            onChange={(val) => updateField('title', val)}
            isEditingActive={isEditingActive}
          />
        </h3>
      </div>

      <div className="mt-2 pt-2 border-t-2 border-black dark:border-white flex items-center justify-center gap-2">
        <InlineLinkPopover
          label="View Dashboard"
          url={project.demoUrl || ''}
          variant="pink"
          icon={<ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />}
          isEditingActive={isEditingActive}
          onClick={() => trackProjectClick(project.id, project.title, 'metric_dashboard')}
          onUpdateLink={(_, newUrl) => updateField('demoUrl', newUrl)}
        />
      </div>
    </BrutalCard>
  );
};
