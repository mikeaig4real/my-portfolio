'use client';

import React from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { BrutalButton } from '@/components/ui/BrutalButton';

interface ResumeUploadFormProps {
  file: File | null;
  loading: boolean;
  onFileChange: (file: File | null) => void;
  onUpload: () => void;
}

export const ResumeUploadForm: React.FC<ResumeUploadFormProps> = ({
  file,
  loading,
  onFileChange,
  onUpload,
}) => {
  return (
    <div className="border-t-2 border-dashed border-slate-300 dark:border-slate-700 pt-4">
      <label className="block text-xs font-extrabold uppercase mb-1 text-black dark:text-white">
        Upload New Resume (PDF / Document):
      </label>
      <input
        type="file"
        accept=".pdf,.doc,.docx,image/*"
        onChange={(e) => onFileChange(e.target.files?.[0] || null)}
        className="w-full text-xs font-mono text-black dark:text-white border-2 border-black p-2 bg-slate-100 dark:bg-slate-800 mb-3"
      />

      <BrutalButton
        variant="yellow"
        size="md"
        onClick={onUpload}
        disabled={loading || !file}
        className="w-full justify-center"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            Upload & Attach to Profile
          </>
        )}
      </BrutalButton>
    </div>
  );
};
