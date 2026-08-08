'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface AutoGenerateTabProps {
  resumeText: string;
  setResumeText: (val: string) => void;
  provider: 'openrouter' | 'openai' | 'ollama';
  setProvider: (val: 'openrouter' | 'openai' | 'ollama') => void;
  apiKey: string;
  setApiKey: (val: string) => void;
  loading: boolean;
  onGenerate: () => void;
}

export const AutoGenerateTab: React.FC<AutoGenerateTabProps> = ({
  resumeText,
  setResumeText,
  provider,
  setProvider,
  apiKey,
  setApiKey,
  loading,
  onGenerate,
}) => {
  return (
    <div className="space-y-4 font-mono">
      <div>
        <label className="block text-xs font-extrabold uppercase mb-1 text-black dark:text-white">
          Paste CV / Resume Text:
        </label>
        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Paste your full CV or resume text here (experience, skills, projects, contact info)..."
          className="w-full h-36 p-3 bg-slate-100 dark:bg-slate-800 border-2 border-black dark:border-white text-xs outline-none focus:bg-yellow-100 dark:focus:bg-slate-700 text-black dark:text-white resize-y"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold uppercase mb-1 text-black dark:text-white">
            AI Inference Provider:
          </label>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value as 'openrouter' | 'openai' | 'ollama')}
            className="w-full p-2 bg-slate-100 dark:bg-slate-800 border-2 border-black dark:border-white text-xs font-bold text-black dark:text-white outline-none"
          >
            <option value="openrouter">OpenRouter (Google Gemini 2.5 Flash)</option>
            <option value="openai">OpenAI (GPT-4o Mini)</option>
            <option value="ollama">Ollama (Local Endpoint)</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase mb-1 text-black dark:text-white">
            Optional API Key (or uses .env.local):
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-or-v1-..."
            className="w-full p-2 bg-slate-100 dark:bg-slate-800 border-2 border-black dark:border-white text-xs outline-none text-black dark:text-white"
          />
        </div>
      </div>

      <button
        onClick={onGenerate}
        disabled={loading}
        className="w-full py-3 bg-yellow-300 hover:bg-yellow-400 text-black font-extrabold text-xs uppercase border-3 border-black shadow-[4px_4px_0px_0px_#000] flex items-center justify-center gap-2 cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Analyzing Resume & Generating Portfolio...</span>
          </>
        ) : (
          <>
            <span>⚡ Generate Portfolio from CV</span>
          </>
        )}
      </button>
    </div>
  );
};
