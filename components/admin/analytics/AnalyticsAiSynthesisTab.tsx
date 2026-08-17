'use client';

import React from 'react';
import { VisitorIntentAnalysis, VisitorSessionOption } from '@/types';
import { AiSynthesisScopeSelector } from './ai/AiSynthesisScopeSelector';
import { AiVisitorIdentityCard } from './ai/AiVisitorIdentityCard';
import { AiExecutiveBriefingCard } from './ai/AiExecutiveBriefingCard';

interface AnalyticsAiSynthesisTabProps {
  aiAnalysis: VisitorIntentAnalysis | null;
  isAnalyzing: boolean;
  analysisError: string | null;
  selectedVisitorId: string;
  visitorOptions: VisitorSessionOption[];
  onSelectVisitor: (visitorId: string) => void;
  onRunAiAnalysis: (visitorId?: string) => void;
}

export const AnalyticsAiSynthesisTab: React.FC<AnalyticsAiSynthesisTabProps> = ({
  aiAnalysis,
  isAnalyzing,
  analysisError,
  selectedVisitorId,
  visitorOptions,
  onSelectVisitor,
  onRunAiAnalysis,
}) => {
  const isSingleVisitorMode =
    aiAnalysis?.analysisMode === 'single_visitor' ||
    (selectedVisitorId && selectedVisitorId !== 'all');

  return (
    <div className="space-y-4">
      {/* 1. Scope Selector, Action Controls & Loading/Error Feedback */}
      <AiSynthesisScopeSelector
        selectedVisitorId={selectedVisitorId}
        visitorOptions={visitorOptions}
        isAnalyzing={isAnalyzing}
        analysisError={analysisError}
        onSelectVisitor={onSelectVisitor}
        onRunAiAnalysis={onRunAiAnalysis}
      />

      {/* 2. Synthesized Results (Identity Card & Executive Briefing) */}
      {aiAnalysis && !isAnalyzing && (
        <div className="space-y-4">
          {/* Rich Visitor Identity or Macro Traffic Header */}
          <AiVisitorIdentityCard
            meta={aiAnalysis.visitorMetadata}
            isSingleVisitorMode={Boolean(isSingleVisitorMode)}
          />

          {/* Synthesized Executive Briefing Card */}
          <AiExecutiveBriefingCard analysis={aiAnalysis} />
        </div>
      )}
    </div>
  );
};
