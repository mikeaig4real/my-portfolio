'use client';

import React, { useState } from 'react';
import { Github, Copy, Check } from 'lucide-react';
import { Project } from '@/types/portfolio';
import { BrutalCard } from '@/components/ui/BrutalCard';
import { InlineText } from '@/components/inline/InlineText';
import { EditableTagList } from '@/components/inline/EditableTagList';
import { InlineLinkPopover } from '@/components/inline/InlineLinkPopover';

interface CodeProjectViewProps {
  project: Project;
  accentColor: string;
  cardTitle?: string;
  onUpdateCardTitle?: (newTitle: string) => void;
  isEditingActive?: boolean;
  onUpdateProject?: (updated: Project) => void;
}

export const CodeProjectView: React.FC<CodeProjectViewProps> = ({
  project,
  accentColor,
  cardTitle,
  onUpdateCardTitle,
  isEditingActive = false,
  onUpdateProject,
}) => {
  const [copied, setCopied] = useState(false);

  const updateField = <K extends keyof Project>(field: K, val: Project[K]) => {
    if (onUpdateProject) {
      onUpdateProject({ ...project, [field]: val });
    }
  };

  const updateSnippet = (field: 'code' | 'language', val: string) => {
    if (onUpdateProject) {
      onUpdateProject({
        ...project,
        codeSnippet: {
          code: project.codeSnippet?.code || '',
          language: project.codeSnippet?.language || 'typescript',
          [field]: val,
        },
      });
    }
  };

  const handleCopyCode = () => {
    if (project.codeSnippet?.code) {
      navigator.clipboard.writeText(project.codeSnippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <BrutalCard
      accentColor={accentColor}
      title={cardTitle || `CODE // ${project.title}`}
      badge={project.codeSnippet?.language || 'SNIPPET'}
      isEditingActive={isEditingActive}
      onUpdateTitle={onUpdateCardTitle || ((val) => updateField('title', val))}
      className="h-full flex flex-col justify-between"
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-black dark:text-white font-mono uppercase">
            <InlineText
              value={project.title}
              onChange={(val) => updateField('title', val)}
              isEditingActive={isEditingActive}
            />
          </h3>
          <button
            onClick={handleCopyCode}
            className="px-2 py-1 text-xs font-mono font-bold bg-white text-black border border-black shadow-[2px_2px_0px_0px_#000] flex items-center gap-1 hover:bg-yellow-200 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'COPIED!' : 'COPY'}
          </button>
        </div>

        <div className="bg-slate-950 text-emerald-400 p-3 font-mono text-xs border-2 border-black overflow-x-auto max-h-36 shadow-[3px_3px_0px_0px_#000]">
          {isEditingActive ? (
            <textarea
              value={project.codeSnippet?.code || ''}
              onChange={(e) => updateSnippet('code', e.target.value)}
              className="w-full bg-transparent text-emerald-400 font-mono text-xs outline-none resize-y min-h-15"
              placeholder="Paste code snippet here..."
            />
          ) : (
            <pre><code>{project.codeSnippet?.code}</code></pre>
          )}
        </div>

        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
          <InlineText
            value={project.description}
            onChange={(val) => updateField('description', val)}
            isEditingActive={isEditingActive}
            multiline
          />
        </p>
      </div>

      <div className="mt-3 space-y-2 pt-2 border-t-2 border-black dark:border-white">
        <EditableTagList
          tags={project.tags}
          onChangeTags={(tags) => updateField('tags', tags)}
          isEditingActive={isEditingActive}
          accentBg="bg-purple-200 text-black"
        />

        <div className="flex items-center justify-end gap-1">
          <InlineLinkPopover
            label="Repo"
            url={project.githubUrl || ''}
            variant="purple"
            icon={<Github className="w-3.5 h-3.5 stroke-[2.5]" />}
            isEditingActive={isEditingActive}
            onUpdateLink={(_, newUrl) => updateField('githubUrl', newUrl)}
          />
        </div>
      </div>
    </BrutalCard>
  );
};
