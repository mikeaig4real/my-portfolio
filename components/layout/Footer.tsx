'use client';

import React from 'react';
import { usePortfolioStore } from '@/store/usePortfolioStore';
import { SocialLink } from '@/types/portfolio';

export const Footer: React.FC = () => {
  const { data } = usePortfolioStore();

  return (
    <footer className="border-t-4 border-black dark:border-white bg-white dark:bg-slate-900 py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-yellow-300 text-black border border-black font-mono">
            NEOBRUTALISM v2.0
          </span>
          <span>© {new Date().getFullYear()} {data.profile.name}. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          {data.socials.map((soc: SocialLink) => (
            <a
              key={soc.id}
              href={soc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:text-yellow-500 transition-colors"
            >
              {soc.platform}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};
