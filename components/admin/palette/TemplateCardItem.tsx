'use client';

import React from 'react';
import { Plus, UserCheck, Briefcase, Layers, Share2, Award, Layout, Code2, FileText } from 'lucide-react';
import { CardTemplateOption } from '@/lib/cardTemplates';
import { BENTO_CARD_TYPES } from '@/lib/constants';

interface TemplateCardItemProps {
  tpl: CardTemplateOption;
  isAlreadyAdded: boolean;
  isSingleton: boolean;
  onSelect: (tpl: CardTemplateOption) => void;
}

const getTemplateIcon = (type: string) => {
  switch (type) {
    case BENTO_CARD_TYPES.HERO_PROFILE:
      return <UserCheck className="w-5 h-5 text-yellow-500" />;
    case BENTO_CARD_TYPES.WORKPLACE:
      return <Briefcase className="w-5 h-5 text-cyan-500" />;
    case BENTO_CARD_TYPES.TECH_STACK:
      return <Layers className="w-5 h-5 text-lime-500" />;
    case BENTO_CARD_TYPES.SOCIALS:
      return <Share2 className="w-5 h-5 text-purple-500" />;
    case BENTO_CARD_TYPES.CERTIFICATION:
      return <Award className="w-5 h-5 text-pink-500" />;
    case BENTO_CARD_TYPES.FEATURED_PROJECT:
      return <Layout className="w-5 h-5 text-orange-500" />;
    case BENTO_CARD_TYPES.CUSTOM_NOTE:
      return <FileText className="w-5 h-5 text-yellow-500" />;
    default:
      return <Code2 className="w-5 h-5 text-emerald-500" />;
  }
};

export const TemplateCardItem: React.FC<TemplateCardItemProps> = ({
  tpl,
  isAlreadyAdded,
  isSingleton,
  onSelect,
}) => {
  return (
    <div
      className={`p-3.5 border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] flex flex-col justify-between transition-all font-mono ${
        isAlreadyAdded
          ? 'bg-slate-100 dark:bg-slate-800 opacity-60'
          : 'bg-white dark:bg-slate-900 hover:scale-[1.02]'
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {getTemplateIcon(tpl.type)}
            <span className="text-sm font-extrabold text-black dark:text-white uppercase">
              {tpl.title}
            </span>
          </div>
          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-black text-white border border-white">
            {tpl.category}
          </span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
          {tpl.description}
        </p>
      </div>

      <div className="mt-3 pt-2.5 border-t border-black/20 dark:border-white/20 flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-500 uppercase">
          {isSingleton ? 'SINGLETON (MAX 1)' : 'MULTI-INSTANCE'}
        </span>

        <button
          onClick={() => !isAlreadyAdded && onSelect(tpl)}
          disabled={isAlreadyAdded}
          className={`px-3 py-1 font-extrabold text-xs uppercase border-2 border-black flex items-center gap-1 shadow-[2px_2px_0px_0px_#000] ${
            isAlreadyAdded
              ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
              : 'bg-yellow-300 text-black hover:bg-yellow-400 cursor-pointer'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isAlreadyAdded ? 'ADDED' : 'ADD CARD'}</span>
        </button>
      </div>
    </div>
  );
};
