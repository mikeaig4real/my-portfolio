'use client';

import React from 'react';
import { ChatConfig, PortfolioData } from '@/types/portfolio';
import { QUICK_PROMPTS } from '@/types/chat';
import { AssistantStatusHeader } from './assistant/AssistantStatusHeader';
import { AssistantPreviewBar } from './assistant/AssistantPreviewBar';
import { AssistantColorPresets } from './assistant/AssistantColorPresets';
import { AssistantBubbleSection } from './assistant/AssistantBubbleSection';
import { AssistantLabelsSection } from './assistant/AssistantLabelsSection';
import { AssistantIntroMessageSection } from './assistant/AssistantIntroMessageSection';
import { AssistantQuickQuestionsSection } from './assistant/AssistantQuickQuestionsSection';

interface AssistantEditorProps {
  data: PortfolioData;
  onChange: (updatedData: PortfolioData) => void;
}

export const AssistantEditor: React.FC<AssistantEditorProps> = ({ data, onChange }) => {
  const currentConfig: ChatConfig = data.chatConfig || {
    enabled: true,
    bubbleVisible: true,
    bubbleText: 'Questions about my experience? Chat with my AI twin!',
    triggerButtonText: 'AI Assistant',
    triggerButtonSubtext: 'Ask My Resume',
    headerTitle: "{name}'s AI Twin",
    headerSubtitle: 'Online',
    headerBadge: 'RESUME AI',
    introMessage: "Hey there! 👋 I'm {name}'s AI Assistant, trained directly on my live resume & project portfolio.\n\nAsk me anything about my experience, frameworks, architectural choices, or availability! What brings you by today? 🚀",
    quickQuestions: [...QUICK_PROMPTS],
    accentColor: '#facc15',
  };

  const updateConfig = (patch: Partial<ChatConfig>) => {
    const updated: ChatConfig = {
      ...currentConfig,
      ...patch,
    };
    onChange({
      ...data,
      chatConfig: updated,
    });
  };

  return (
    <div className="space-y-6 text-black dark:text-white font-mono">
      {/* 1. Status & Enabled/Disabled Switch */}
      <AssistantStatusHeader
        enabled={currentConfig.enabled !== false}
        onToggleEnabled={(enabled) => updateConfig({ enabled })}
      />

      {/* 2. Live Interactive Visual Preview Bar */}
      <AssistantPreviewBar
        config={currentConfig}
        profileName={data.profile?.name || 'Michael'}
      />

      {/* 3. Color Theme & Palette Presets */}
      <AssistantColorPresets
        currentColor={currentConfig.accentColor || '#facc15'}
        onSelectColor={(accentColor) => updateConfig({ accentColor })}
      />

      {/* 4. Teaser Bubble Controls & Message */}
      <AssistantBubbleSection
        bubbleVisible={currentConfig.bubbleVisible !== false}
        bubbleText={currentConfig.bubbleText || ''}
        onToggleBubble={(bubbleVisible) => updateConfig({ bubbleVisible })}
        onChangeBubbleText={(bubbleText) => updateConfig({ bubbleText })}
      />

      {/* 5. Header and Trigger Button Labels */}
      <AssistantLabelsSection
        config={currentConfig}
        onChangeConfig={updateConfig}
      />

      {/* 6. First-Person Welcome Intro Message */}
      <AssistantIntroMessageSection
        introMessage={currentConfig.introMessage || ''}
        onChangeIntroMessage={(introMessage) => updateConfig({ introMessage })}
      />

      {/* 7. Quick Suggestion Prompt Chips Manager */}
      <AssistantQuickQuestionsSection
        questions={currentConfig.quickQuestions || QUICK_PROMPTS}
        onChangeQuestions={(quickQuestions) => updateConfig({ quickQuestions })}
      />
    </div>
  );
};
