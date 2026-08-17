'use client';

import React from 'react';
import { Trash2, MessageSquare } from 'lucide-react';
import { VisitorLead, ChatTranscript } from '@/types';

interface AnalyticsLeadsTabProps {
  leads: VisitorLead[];
  chatTranscripts: ChatTranscript[];
  selectedVisitorForChat: string | null;
  onToggleChatVisitor: (visitorId: string) => void;
  onRunAiAnalysis: (visitorId: string) => void;
  onDeleteLead: (visitorId: string) => void;
}

export const AnalyticsLeadsTab: React.FC<AnalyticsLeadsTabProps> = ({
  leads,
  chatTranscripts,
  selectedVisitorForChat,
  onToggleChatVisitor,
  onRunAiAnalysis,
  onDeleteLead,
}) => {
  return (
    <div className="space-y-4">
      <div className="p-3 bg-pink-100 dark:bg-slate-800 border-2 border-black text-xs font-bold text-black dark:text-white flex items-center justify-between">
        <span>
          🎯 Conversational Leads Captured by Resume AI Assistant ({leads.length})
        </span>
        <span className="text-[10px] text-slate-500">Auto-extracted from chats</span>
      </div>

      {leads && leads.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {leads.map((lead, idx) => (
            <div
              key={idx}
              className="p-3 bg-white dark:bg-slate-900 border-2 border-black shadow-[3px_3px_0px_0px_#000] space-y-2 text-xs"
            >
              <div className="flex items-center justify-between border-b border-black pb-1.5">
                <span className="font-extrabold text-sm text-pink-600 dark:text-pink-400">
                  {lead.name || 'Anonymous Visitor'}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onRunAiAnalysis(lead.visitorId)}
                    className="px-2 py-0.5 bg-yellow-300 text-black border border-black font-extrabold text-[9px] uppercase cursor-pointer"
                    title="Run AI Intent Analysis for this lead"
                  >
                    Analyze Lead
                  </button>
                  <button
                    onClick={() => onDeleteLead(lead.visitorId)}
                    className="p-1 bg-red-500 text-white border border-black hover:bg-red-600 cursor-pointer"
                    title="Delete lead & chat history"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="space-y-1 text-[11px]">
                {lead.company && (
                  <p>
                    <span className="font-bold text-slate-500">Company:</span>{' '}
                    <span className="font-extrabold text-black dark:text-white">{lead.company}</span>
                  </p>
                )}
                {lead.email && (
                  <p>
                    <span className="font-bold text-slate-500">Email:</span>{' '}
                    <a
                      href={`mailto:${lead.email}`}
                      className="font-extrabold text-cyan-600 hover:underline"
                    >
                      {lead.email}
                    </a>
                  </p>
                )}
                {lead.intent && (
                  <p>
                    <span className="font-bold text-slate-500">Detected Intent:</span>{' '}
                    <span className="px-1.5 py-0.5 bg-yellow-200 text-black border border-black font-bold text-[10px]">
                      {lead.intent}
                    </span>
                  </p>
                )}
                <p className="text-[10px] text-slate-400">
                  Last active: {new Date(lead.lastActive).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => onToggleChatVisitor(lead.visitorId)}
                className="w-full py-1 bg-slate-100 dark:bg-slate-800 hover:bg-yellow-200 dark:hover:bg-slate-700 text-black dark:text-white border border-black font-extrabold text-[10px] uppercase flex items-center justify-center gap-1 cursor-pointer"
              >
                <MessageSquare className="w-3 h-3" />
                {selectedVisitorForChat === lead.visitorId
                  ? 'Hide Conversation'
                  : 'View Chat Transcript'}
              </button>

              {/* Chat Transcript Dropdown */}
              {selectedVisitorForChat === lead.visitorId && (
                <div className="p-2 bg-slate-50 dark:bg-slate-950 border border-black space-y-2 max-h-40 overflow-y-auto">
                  {chatTranscripts
                    .filter((c) => c.visitorId === lead.visitorId)
                    .map((msg, mIdx) => (
                      <div
                        key={mIdx}
                        className={`p-1.5 border text-[10px] ${
                          msg.role === 'user'
                            ? 'bg-cyan-200 text-black border-cyan-500 ml-4'
                            : 'bg-white dark:bg-slate-900 text-black dark:text-slate-100 border-black mr-4'
                        }`}
                      >
                        <span className="font-extrabold uppercase block text-[8px] text-slate-500">
                          {msg.role === 'user' ? 'Visitor' : 'Resume AI'}
                        </span>
                        {msg.content}
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-slate-500 text-xs italic bg-slate-50 dark:bg-slate-800 border-2 border-black">
          No visitor leads captured yet. The Resume Chatbot will automatically lure and collect visitor identities!
        </div>
      )}
    </div>
  );
};
