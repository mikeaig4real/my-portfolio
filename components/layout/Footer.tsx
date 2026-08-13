'use client';

import React, { useState, useCallback, useRef } from 'react';
import { usePortfolioStore } from '@/store/usePortfolioStore';
import { SocialLink } from '@/types/portfolio';
import { Edit3 } from 'lucide-react';
import { FooterEditorModal } from '@/components/admin/FooterEditorModal';
import { SHORTCUT_KEYS } from '@/lib/constants';

interface FooterProps {
  /**
   * When true (admin edit mode only), shows the "Manage" button to open the
   * footer editor modal. Pass `!isPreviewMode` from the admin page.
   * Always false on the public-facing site.
   */
  isEditMode?: boolean;
  /**
   * Called when user triggers the secret multi-tap on the copyright text.
   * The public page passes this to open the stealth login modal.
   * Not needed in admin mode (already authenticated).
   */
  onSecretAdminTap?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  isEditMode = false,
  onSecretAdminTap,
}) => {
  const { data, savePortfolio } = usePortfolioStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- Secret login trigger for mobile ---
  // Using a ref so tap state doesn't cause re-renders
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopyrightTap = useCallback(() => {
    if (!onSecretAdminTap) return;

    tapCountRef.current += 1;

    if (tapCountRef.current >= SHORTCUT_KEYS.MOBILE_ADMIN_TAP_COUNT) {
      // Reached required tap threshold — fire the callback and reset
      onSecretAdminTap();
      tapCountRef.current = 0;
      if (tapTimerRef.current) {
        clearTimeout(tapTimerRef.current);
        tapTimerRef.current = null;
      }
      return;
    }

    // Reset tap count if no further taps within 1.5 s
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    tapTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
      tapTimerRef.current = null;
    }, 1500);
  }, [onSecretAdminTap]);

  return (
    <>
      <footer className="border-t-4 border-black dark:border-white bg-white dark:bg-slate-900 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">

          {/* Left: Badge + copyright (tap target for secret mobile login) */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 bg-yellow-300 text-black border border-black font-mono">
              {data.customization?.footerBadgeText || 'NEOBRUTALISM v2.0'}
            </span>
            {/* The copyright text is a hidden tap target on mobile.
                5 rapid taps → opens the admin login modal. */}
            <span
              onClick={handleCopyrightTap}
              className={`select-none ${onSecretAdminTap ? 'cursor-default active:opacity-70' : ''}`}
              title={onSecretAdminTap ? undefined : undefined}
              aria-hidden={!!onSecretAdminTap}
            >
              © {new Date().getFullYear()} {data.profile.name}. All rights reserved.
            </span>
          </div>

          {/* Right: Social links + optional manage button */}
          <div className="flex items-center gap-3 flex-wrap">
            {data.socials.map((soc: SocialLink) => (
              <div key={soc.id} className="flex items-center gap-1">
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

            {/* Admin edit mode: Manage button */}
            {isEditMode && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-0.5 px-2 py-1 bg-cyan-300 text-black border border-black text-[10px] font-bold uppercase hover:bg-cyan-400 cursor-pointer shadow-[1px_1px_0px_0px_#000] min-h-[32px]"
                title="Manage footer links & content"
              >
                <Edit3 className="w-3 h-3" /> Manage
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Footer editor modal — only mounted in edit mode */}
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
