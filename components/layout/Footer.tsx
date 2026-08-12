'use client';

import React, { useCallback, useState } from 'react';
import { usePortfolioStore } from '@/store/usePortfolioStore';
import { SocialLink } from '@/types/portfolio';
import { Edit3, Plus, Trash2 } from 'lucide-react';
import { InlineText } from '@/components/inline/InlineText';
import { FooterEditorModal } from '@/components/admin/FooterEditorModal';

interface FooterProps {
  /**
   * When true, the footer renders in admin-edit mode:
   * - Social link labels & URLs are inline double-click-to-edit
   * - Shows add / delete controls per link
   * - Shows "Manage Links" button to open the full modal for bulk editing
   *
   * Pass `!isPreviewMode` from the admin page so edit controls disappear
   * when the admin switches to visitor preview mode.
   * Always false (default) on the public-facing site.
   */
  isEditMode?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ isEditMode = false }) => {
  const { data, savePortfolio } = usePortfolioStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <footer className="border-t-4 border-black dark:border-white bg-white dark:bg-slate-900 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">

          {/* Left: Badge + copyright */}
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-yellow-300 text-black border border-black font-mono">
              NEOBRUTALISM v2.0
            </span>
            <span>
              © {new Date().getFullYear()} {data.profile.name}. All rights reserved.
            </span>
          </div>

          {/* Right: Social links */}
          <div className="flex items-center gap-3 flex-wrap">
            {data.socials.map((soc: SocialLink) => (
              <div key={soc.id} className="flex items-center gap-1 group">
                  <a
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline hover:text-yellow-500 transition-colors"
                  >
                    {soc.platform}
                  </a>
              </div>
            ))}

            {/* Edit mode controls */}
            {isEditMode && (    
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-0.5 px-1.5 py-0.5 bg-cyan-300 text-black border border-black text-[10px] font-bold uppercase hover:bg-cyan-400 cursor-pointer shadow-[1px_1px_0px_0px_#000]"
                  title="Manage all footer links in panel"
                >
                  <Edit3 className="w-3 h-3" /> Manage
                </button>
            )}
          </div>
        </div>
      </footer>

      {/* Bulk edit modal — only mounted in edit mode */}
      {isEditMode && (
        <FooterEditorModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          data={data}
          onSave={savePortfolio}
        />
      )}
    </>
  );
};
