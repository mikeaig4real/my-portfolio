'use client';

import React, { useState } from 'react';
import { Plus, Trash2, RotateCcw } from 'lucide-react';
import { QUICK_PROMPTS } from '@/types/chat';

interface AssistantQuickQuestionsSectionProps {
  questions: string[];
  onChangeQuestions: (questions: string[]) => void;
}

export const AssistantQuickQuestionsSection: React.FC<AssistantQuickQuestionsSectionProps> = ({
  questions,
  onChangeQuestions,
}) => {
  const [newQuestion, setNewQuestion] = useState('');

  const questionsList = questions && questions.length > 0 ? questions : QUICK_PROMPTS;

  const handleAdd = () => {
    const text = newQuestion.trim();
    if (!text) return;
    onChangeQuestions([...questionsList, text]);
    setNewQuestion('');
  };

  const handleUpdate = (index: number, val: string) => {
    const updated = [...questionsList];
    updated[index] = val;
    onChangeQuestions(updated);
  };

  const handleDelete = (index: number) => {
    const updated = questionsList.filter((_, i) => i !== index);
    onChangeQuestions(updated);
  };

  const handleReset = () => {
    onChangeQuestions([...QUICK_PROMPTS]);
  };

  return (
    <div className="p-3 bg-white dark:bg-slate-900 border-2 border-black dark:border-white space-y-3 shadow-[3px_3px_0px_0px_#000] font-mono">
      <div className="flex items-center justify-between border-b border-black dark:border-white pb-1.5">
        <div>
          <h5 className="text-xs font-extrabold uppercase text-black dark:text-white">
            Quick Suggestion Prompt Chips ({questionsList.length})
          </h5>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">
            One-click question buttons presented to visitors in the chat drawer.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-yellow-300 text-black dark:text-white hover:text-black border border-black text-[9px] font-extrabold uppercase flex items-center gap-1 cursor-pointer"
          title="Reset to original 4 default questions"
        >
          <RotateCcw className="w-3 h-3" /> Reset Defaults
        </button>
      </div>

      {/* Existing questions */}
      <div className="space-y-2">
        {questionsList.map((q, idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            <span className="text-[10px] font-extrabold px-1.5 py-1 bg-black text-yellow-300 border border-black shrink-0">
              #{idx + 1}
            </span>
            <input
              type="text"
              value={q}
              onChange={(e) => handleUpdate(idx, e.target.value)}
              className="flex-1 p-1.5 text-xs border-2 border-black bg-slate-50 dark:bg-slate-800 text-black dark:text-white font-bold"
            />
            <button
              onClick={() => handleDelete(idx)}
              className="p-1.5 bg-red-500 text-white border border-black hover:bg-red-600 cursor-pointer shrink-0"
              title="Delete this prompt"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add new question */}
      <div className="pt-2 border-t border-black dark:border-white flex items-center gap-2">
        <input
          type="text"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Add new question (e.g. 🚀 What is your experience with Agentic AI?)"
          className="flex-1 p-2 text-xs border-2 border-black bg-white dark:bg-slate-800 text-black dark:text-white font-bold"
        />
        <button
          onClick={handleAdd}
          disabled={!newQuestion.trim()}
          className="px-3 py-2 bg-yellow-300 hover:bg-yellow-400 disabled:opacity-50 text-black border-2 border-black font-extrabold text-xs uppercase flex items-center gap-1 cursor-pointer shadow-[2px_2px_0px_0px_#000]"
        >
          <Plus className="w-3.5 h-3.5 stroke-3" /> Add
        </button>
      </div>
    </div>
  );
};
