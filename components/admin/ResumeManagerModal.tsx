'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { ResumeCurrentLink } from './resume/ResumeCurrentLink';
import { ResumeUploadForm } from './resume/ResumeUploadForm';

interface ResumeManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentResumeUrl: string;
  onUpdateResumeUrl: (url: string) => void;
}

export const ResumeManagerModal: React.FC<ResumeManagerModalProps> = ({
  isOpen,
  onClose,
  currentResumeUrl,
  onUpdateResumeUrl,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [publicId, setPublicId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/resume', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to upload resume');
      }

      onUpdateResumeUrl(json.data.url);
      if (json.data.publicId) {
        setPublicId(json.data.publicId);
      }
      setSuccessMsg('⚡ Success! Resume uploaded and updated on your profile.');
      setFile(null);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || 'Error uploading file');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCloudinaryFile = async () => {
    if (!publicId) {
      onUpdateResumeUrl('');
      setSuccessMsg('Resume URL cleared.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/resume', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to delete resume file');
      }

      onUpdateResumeUrl('');
      setPublicId(null);
      setSuccessMsg('Existing resume file deleted successfully.');
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || 'Error deleting file');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-80 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-mono">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg bg-white dark:bg-slate-900 border-4 border-black dark:border-white shadow-[10px_10px_0px_0px_#000] dark:shadow-[10px_10px_0px_0px_#fff] p-6"
        >
          <div className="flex items-center justify-between border-b-4 border-black dark:border-white pb-3 mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-yellow-400 stroke-[2.5]" />
              <h2 className="text-base font-extrabold text-black dark:text-white uppercase">
                RESUME / CV MANAGER
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 bg-red-500 text-white border-2 border-black hover:bg-red-600 cursor-pointer shadow-[2px_2px_0px_0px_#000]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-600 text-white border-2 border-black text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-600 text-white border-2 border-black text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="space-y-4">
            <ResumeCurrentLink
              resumeUrl={currentResumeUrl}
              loading={loading}
              onDelete={handleDeleteCloudinaryFile}
            />

            <ResumeUploadForm
              file={file}
              loading={loading}
              onFileChange={setFile}
              onUpload={handleUpload}
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
