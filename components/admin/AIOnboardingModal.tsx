'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Wand2, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { PortfolioData } from '@/types/portfolio';
import { validatePortfolioData } from '@/lib/schemas/portfolioSchema';
import { AutoGenerateTab } from './onboarding/AutoGenerateTab';
import { RisenPromptTab } from './onboarding/RisenPromptTab';

interface AIOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportPortfolio: (data: PortfolioData) => void;
}

export const AIOnboardingModal: React.FC<AIOnboardingModalProps> = ({
  isOpen,
  onClose,
  onImportPortfolio,
}) => {
  const [activeTab, setActiveTab] = useState<'auto' | 'risen'>('auto');
  const [resumeText, setResumeText] = useState('');
  const [provider, setProvider] = useState<'openrouter' | 'openai' | 'ollama'>('openrouter');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [pastedJson, setPastedJson] = useState('');

  const handleAutoGenerate = async () => {
    if (!resumeText.trim()) {
      setErrorMsg('Please paste your CV or Resume text first.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          provider,
          apiKey: apiKey.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        const details = json.details ? ` - ${JSON.stringify(json.details)}` : '';
        throw new Error(`${json.error || 'Failed to generate portfolio'}${details}`);
      }

      onImportPortfolio(json.data);
      setSuccessMsg('⚡ Success! Portfolio generated and initialized from CV!');
      setTimeout(() => onClose(), 1500);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || 'Error running AI inference');
    } finally {
      setLoading(false);
    }
  };

  const handleValidatePastedJson = () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const parsed = JSON.parse(pastedJson);
      const validated = validatePortfolioData(parsed) as unknown as PortfolioData;
      onImportPortfolio(validated);
      setSuccessMsg('✅ Success! Validated and hydrated portfolio JSON structure!');
      setTimeout(() => onClose(), 1500);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(`Invalid JSON structure: ${error.message}`);
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
          className="w-full max-w-2xl bg-white dark:bg-slate-900 border-4 border-black dark:border-white shadow-[10px_10px_0px_0px_#000] dark:shadow-[10px_10px_0px_0px_#fff] p-6 max-h-[90vh] overflow-y-auto no-scrollbar"
        >
          <div className="flex items-center justify-between border-b-4 border-black dark:border-white pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-400 stroke-[2.5]" />
              <h2 className="text-lg font-extrabold text-black dark:text-white uppercase">
                AI PORTFOLIO QUICKSTART WIZARD
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 bg-red-500 text-white border-2 border-black hover:bg-red-600 cursor-pointer shadow-[2px_2px_0px_0px_#000]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('auto')}
              className={`flex-1 py-2 px-3 border-2 border-black font-extrabold text-xs uppercase cursor-pointer flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_0px_#000] ${
                activeTab === 'auto'
                  ? 'bg-yellow-300 text-black'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Wand2 className="w-4 h-4" />
              <span>1-Click AI Generation</span>
            </button>

            <button
              onClick={() => setActiveTab('risen')}
              className={`flex-1 py-2 px-3 border-2 border-black font-extrabold text-xs uppercase cursor-pointer flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_0px_#000] ${
                activeTab === 'risen'
                  ? 'bg-cyan-300 text-black'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>RISEN Prompt & JSON Import</span>
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

          {activeTab === 'auto' ? (
            <AutoGenerateTab
              resumeText={resumeText}
              setResumeText={setResumeText}
              provider={provider}
              setProvider={setProvider}
              apiKey={apiKey}
              setApiKey={setApiKey}
              loading={loading}
              onGenerate={handleAutoGenerate}
            />
          ) : (
            <RisenPromptTab
              resumeText={resumeText}
              pastedJson={pastedJson}
              setPastedJson={setPastedJson}
              copiedPrompt={copiedPrompt}
              setCopiedPrompt={setCopiedPrompt}
              onValidate={handleValidatePastedJson}
            />
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
