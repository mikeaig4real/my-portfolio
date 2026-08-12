'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, FileText, Upload, ExternalLink } from 'lucide-react';
import { Profile } from '@/types/portfolio';
import { BrutalCard } from '@/components/ui/BrutalCard';
import { BrutalButton } from '@/components/ui/BrutalButton';
import { InlineText } from '@/components/inline/InlineText';
import { InlineImagePicker } from '@/components/inline/InlineImagePicker';

interface HeroProfileCardProps {
  profile: Profile;
  accentColor?: string;
  cardTitle?: string;
  onUpdateCardTitle?: (newTitle: string) => void;
  isEditingActive?: boolean;
  onUpdateProfile?: (updated: Profile) => void;
  onOpenResumeManager?: () => void;
}

export const HeroProfileCard: React.FC<HeroProfileCardProps> = ({
  profile,
  accentColor = '#facc15',
  cardTitle,
  onUpdateCardTitle,
  isEditingActive = false,
  onUpdateProfile,
  onOpenResumeManager,
}) => {
  const updateField = (field: keyof Profile, val: string) => {
    if (onUpdateProfile) {
      onUpdateProfile({ ...profile, [field]: val });
    }
  };

  return (
    <BrutalCard
      accentColor={accentColor}
      title={cardTitle || 'Profile & Bio'}
      badge="AVAILABLE"
      isEditingActive={isEditingActive}
      onUpdateTitle={onUpdateCardTitle}
      className="h-full flex flex-col justify-between overflow-hidden"
    >
      <div className="overflow-y-auto max-h-95 md:max-h-110 pr-1.5 flex-1">
        <div className="flex flex-col md:flex-row gap-5 items-start">
          <motion.div
            whileHover={{ scale: 1.05, rotate: -3 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="relative shrink-0"
          >
            <InlineImagePicker
              imageUrl={profile.avatar}
              onImageUploaded={(url) => updateField('avatar', url)}
              onImageRemoved={() => updateField('avatar', '')}
              isEditingActive={isEditingActive}
              className="w-24 h-24 md:w-32 md:h-32 border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] bg-yellow-300"
              alt={profile.name}
              placeholderText="Upload Avatar"
            />
            <span className="absolute -bottom-2 -right-2 z-30 bg-black text-white text-lg p-1.5 border-2 border-white dark:border-black shadow-[2px_2px_0px_0px_#000]">
              <InlineText
                value={profile.statusEmoji || '⚡'}
                onChange={(val) => updateField('statusEmoji', val)}
                isEditingActive={isEditingActive}
              />
            </span>
          </motion.div>

          <div className="flex-1 space-y-2.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-emerald-300 border-2 border-black text-xs font-mono font-bold uppercase text-black shadow-[2px_2px_0px_0px_#000]">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
              <InlineText
                value={profile.availability}
                onChange={(val) => updateField('availability', val)}
                isEditingActive={isEditingActive}
              />
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-black dark:text-white uppercase font-mono">
              <InlineText
                value={profile.name}
                onChange={(val) => updateField('name', val)}
                isEditingActive={isEditingActive}
              />
            </h1>

            <p className="text-sm font-bold text-slate-800 dark:text-yellow-300 uppercase tracking-wide">
              <InlineText
                value={profile.title}
                onChange={(val) => updateField('title', val)}
                isEditingActive={isEditingActive}
              />
            </p>

            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
              <MapPin className="w-4 h-4 text-rose-500 stroke-[2.5]" />
              <InlineText
                value={profile.location}
                onChange={(val) => updateField('location', val)}
                isEditingActive={isEditingActive}
              />
            </div>
          </div>
        </div>

        {/* Separate Full-Width Profile Summary Entity */}
        <div className="w-full mt-4 pt-3 border-t-2 border-black/15 dark:border-white/15">
          <h4 className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            {'/// PROFILE SUMMARY'}
          </h4>
          <div className="text-xs md:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
            <InlineText
              value={profile.bio}
              onChange={(val) => updateField('bio', val)}
              isEditingActive={isEditingActive}
              multiline
            />
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t-2 border-black dark:border-white flex flex-wrap items-center gap-3 shrink-0">
        <BrutalButton
          variant="yellow"
          size="sm"
          href={`mailto:${profile.email}`}
        >
          <Mail className="w-4 h-4 stroke-[2.5]" />
          Email Me
        </BrutalButton>

        <BrutalButton
          variant="cyan"
          size="sm"
          href={profile.githubUrl || 'https://github.com'}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink className="w-4 h-4 stroke-[2.5]" />
          GitHub Profile
        </BrutalButton>

        {profile.resumeUrl ? (
          <BrutalButton
            variant="pink"
            size="sm"
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FileText className="w-4 h-4 stroke-[2.5]" />
            View / Download Resume
          </BrutalButton>
        ) : isEditingActive && onOpenResumeManager ? (
          <BrutalButton
            variant="pink"
            size="sm"
            onClick={onOpenResumeManager}
          >
            <Upload className="w-4 h-4 stroke-[2.5]" />
            + Add Resume / CV
          </BrutalButton>
        ) : null}

        {isEditingActive && profile.resumeUrl && onOpenResumeManager && (
          <button
            onClick={onOpenResumeManager}
            className="px-2 py-1 bg-yellow-300 text-black border border-black font-extrabold text-[10px] uppercase flex items-center gap-1 cursor-pointer shadow-[2px_2px_0px_0px_#000]"
          >
            <Upload className="w-3 h-3" />
            Manage Resume
          </button>
        )}
      </div>
    </BrutalCard>
  );
};
