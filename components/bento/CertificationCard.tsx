'use client';

import React from 'react';
import { Award, ExternalLink } from 'lucide-react';
import { BrutalCard } from '@/components/ui/BrutalCard';
import { InlineText } from '@/components/inline/InlineText';
import { BentoCustomContent } from '@/types/portfolio';
import { InlineLinkPopover } from '@/components/inline/InlineLinkPopover';

interface CertificationCardProps {
  customContent?: BentoCustomContent;
  accentColor?: string;
  cardTitle?: string;
  onUpdateCardTitle?: (newTitle: string) => void;
  isEditingActive?: boolean;
  onUpdateContent?: (updated: BentoCustomContent) => void;
}

export const CertificationCard: React.FC<CertificationCardProps> = ({
  customContent,
  accentColor = '#ff70a6',
  cardTitle,
  onUpdateCardTitle,
  isEditingActive = false,
  onUpdateContent,
}) => {
  const title = customContent?.title || 'Professional Certified Engineer';
  const issuer = customContent?.issuer || 'Certification Authority / Training';
  // Guard against any legacy full ISO strings already in DB (e.g. "2025-01-15T00:00:00.000Z" → "2025")
  const rawIssueDate = customContent?.issueDate || '2025';
  const issueDate = rawIssueDate.length > 4 ? String(new Date(rawIssueDate).getFullYear() || rawIssueDate) : rawIssueDate;
  const credentialUrl = customContent?.credentialUrl || '';
  const hasValidUrl = Boolean(credentialUrl && credentialUrl.trim() !== '' && credentialUrl !== 'https://');

  const updateField = (field: keyof BentoCustomContent, val: string) => {
    if (onUpdateContent) {
      onUpdateContent({ ...customContent, [field]: val });
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (isEditingActive || !hasValidUrl) return;
    // Don't trigger if user clicked an interactive child button
    if ((e.target as HTMLElement).closest('button, a, input')) return;
    window.open(credentialUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <BrutalCard
      accentColor={accentColor}
      title={cardTitle || `CERTIFICATION // ${title}`}
      badge="VERIFIED"
      isEditingActive={isEditingActive}
      onUpdateTitle={onUpdateCardTitle}
      onClick={handleCardClick}
      className={`h-full flex flex-col justify-between overflow-hidden ${
        hasValidUrl && !isEditingActive ? 'cursor-pointer hover:brightness-105' : ''
      }`}
    >
      <div className="overflow-y-auto max-h-95 md:max-h-110 pr-1.5 flex-1 space-y-3">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-yellow-300 border-2 border-black dark:border-white text-black shadow-[3px_3px_0px_0px_#000] shrink-0">
            <Award className="w-6 h-6 stroke-[2.5]" />
          </div>

          <div className="space-y-1 overflow-hidden flex-1">
            <h3 className="text-sm md:text-base font-extrabold text-black dark:text-white font-mono uppercase leading-tight">
              <InlineText
                value={title}
                onChange={(val) => updateField('title', val)}
                isEditingActive={isEditingActive}
              />
            </h3>

            <p className="text-xs font-mono font-bold text-slate-800 dark:text-yellow-300 uppercase">
              <InlineText
                value={issuer}
                onChange={(val) => updateField('issuer', val)}
                isEditingActive={isEditingActive}
              />
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-2.5 border-t-2 border-black dark:border-white flex items-center justify-between font-mono shrink-0">
        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
          ISSUED: <InlineText value={issueDate} onChange={(val) => updateField('issueDate', val)} isEditingActive={isEditingActive} />
        </span>

        <InlineLinkPopover
          label="Verify"
          url={credentialUrl}
          variant="yellow"
          icon={<ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />}
          isEditingActive={isEditingActive}
          onUpdateLink={(_, newUrl) => updateField('credentialUrl', newUrl)}
        />
      </div>
    </BrutalCard>
  );
};
