'use client';

import React from 'react';
import { ExternalLink, Trash2 } from 'lucide-react';

interface ResumeCurrentLinkProps {
  resumeUrl: string;
  loading: boolean;
  onDelete: () => void;
}

export const ResumeCurrentLink: React.FC<ResumeCurrentLinkProps> = ({
  resumeUrl,
  loading,
  onDelete,
}) => {
  return (
    <div>
      <label className="block text-xs font-extrabold uppercase mb-1 text-black dark:text-white">
        Current Resume Link:
      </label>
      {resumeUrl ? (
        <div className="p-3 bg-slate-100 dark:bg-slate-800 border-2 border-black dark:border-white flex items-center justify-between gap-2">
          <span className="text-xs font-bold truncate text-black dark:text-white">
            {resumeUrl}
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 bg-yellow-300 text-black border border-black font-extrabold text-[10px] uppercase flex items-center gap-1 cursor-pointer shadow-[2px_2px_0px_0px_#000]"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View
            </a>
            <button
              onClick={onDelete}
              disabled={loading}
              className="p-1.5 bg-red-500 text-white border border-black font-extrabold text-[10px] uppercase flex items-center gap-1 cursor-pointer shadow-[2px_2px_0px_0px_#000]"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        </div>
      ) : (
        <p className="text-xs text-slate-500 italic">No resume uploaded yet.</p>
      )}
    </div>
  );
};
