'use client';

import React from 'react';
import { Toaster as SonnerToaster, toast } from 'sonner';
import { CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';

export const BentoToaster: React.FC = () => {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        unstyled: true,
        className: 'w-full max-w-sm bg-transparent border-0 p-0 m-0 shadow-none pointer-events-auto',
      }}
    />
  );
};

export const showBentoToast = {
  success: (message: string, title: string = 'SUCCESS') => {
    toast.custom((id) => (
      <div className="bg-emerald-300 text-black border-3 border-black p-3.5 shadow-[5px_5px_0px_0px_#000] font-mono flex items-start gap-2.5 w-full max-w-sm pointer-events-auto">
        <CheckCircle2 className="w-5 h-5 stroke-[2.5] text-black shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-extrabold uppercase text-xs text-black leading-none mb-1">⚡ {title}</p>
          <p className="font-bold text-[11px] leading-tight text-slate-900">{message}</p>
        </div>
        <button
          onClick={() => toast.dismiss(id)}
          className="text-black font-extrabold text-xs hover:opacity-70 cursor-pointer ml-1"
        >
          ✕
        </button>
      </div>
    ));
  },

  error: (message: string, title: string = 'ERROR') => {
    toast.custom((id) => (
      <div className="bg-red-400 text-black border-3 border-black p-3.5 shadow-[5px_5px_0px_0px_#000] font-mono flex items-start gap-2.5 w-full max-w-sm pointer-events-auto">
        <AlertCircle className="w-5 h-5 stroke-[2.5] text-black shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-extrabold uppercase text-xs text-black leading-none mb-1">⚠️ {title}</p>
          <p className="font-bold text-[11px] leading-tight text-black">{message}</p>
        </div>
        <button
          onClick={() => toast.dismiss(id)}
          className="text-black font-extrabold text-xs hover:opacity-70 cursor-pointer ml-1"
        >
          ✕
        </button>
      </div>
    ));
  },

  info: (message: string, title: string = 'INFO') => {
    toast.custom((id) => (
      <div className="bg-yellow-300 text-black border-3 border-black p-3.5 shadow-[5px_5px_0px_0px_#000] font-mono flex items-start gap-2.5 w-full max-w-sm pointer-events-auto">
        <Info className="w-5 h-5 stroke-[2.5] text-black shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-extrabold uppercase text-xs text-black leading-none mb-1">💡 {title}</p>
          <p className="font-bold text-[11px] leading-tight text-black">{message}</p>
        </div>
        <button
          onClick={() => toast.dismiss(id)}
          className="text-black font-extrabold text-xs hover:opacity-70 cursor-pointer ml-1"
        >
          ✕
        </button>
      </div>
    ));
  },

  loading: (message: string, title: string = 'FETCHING') => {
    return toast.custom(() => (
      <div className="bg-cyan-300 text-black border-3 border-black p-3.5 shadow-[5px_5px_0px_0px_#000] font-mono flex items-start gap-2.5 w-full max-w-sm animate-pulse pointer-events-auto">
        <Sparkles className="w-5 h-5 stroke-[2.5] text-black shrink-0 mt-0.5 animate-spin" />
        <div className="flex-1">
          <p className="font-extrabold uppercase text-xs text-black leading-none mb-1">🔮 {title}</p>
          <p className="font-bold text-[11px] leading-tight text-black">{message}</p>
        </div>
      </div>
    ));
  },

  dismiss: (id?: string | number) => {
    toast.dismiss(id);
  },
};
