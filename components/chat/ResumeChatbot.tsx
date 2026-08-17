'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolioStore } from '@/store/usePortfolioStore';
import { getVisitorInfo, trackChatInteraction } from '@/lib/analyticsTracker';
import { ChatMessage, QUICK_PROMPTS } from './types';
import { ChatTriggerButton } from './ChatTriggerButton';
import { ChatHeader } from './ChatHeader';
import { ChatMessagesFeed } from './ChatMessagesFeed';
import { ChatQuickSuggestions } from './ChatQuickSuggestions';
import { ChatInputForm } from './ChatInputForm';

export const ResumeChatbot: React.FC = () => {
  const { data } = usePortfolioStore();
  const profile = data.profile;
  const chatConfig = data.chatConfig;

  const isChatEnabled = chatConfig?.enabled !== false;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasPromptedVisitor, setHasPromptedVisitor] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize with a clean first-person greeting
  useEffect(() => {
    if (messages.length === 0) {
      const defaultIntro =
        chatConfig?.introMessage ||
        "Hey there! 👋 I'm {name}'s AI Assistant, trained directly on my live resume & project portfolio.\n\nAsk me anything about my experience, frameworks, architectural choices, or availability! What brings you by today? 🚀";

      const formattedIntro = defaultIntro
        .replace(/\{name\}/gi, profile.name || 'Michael')
        .replace(/\*\*/g, ''); // strip any accidental asterisks

      setMessages([
        {
          id: 'welcome_msg',
          role: 'assistant',
          content: formattedIntro,
          timestamp: new Date(),
        },
      ]);
    }
  }, [profile.name, chatConfig?.introMessage, messages.length]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  if (!isChatEnabled) {
    return null;
  }

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputValue).trim();
    if (!textToSend || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date(),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputValue('');
    setIsLoading(true);
    setHasPromptedVisitor(false);

    const { visitorId } = getVisitorInfo();

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
          visitorId,
        }),
      });

      const json = await response.json();
      if (json.success && json.data?.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant_${Date.now()}`,
            role: 'assistant',
            content: json.data.reply,
            timestamp: new Date(),
          },
        ]);
        trackChatInteraction(newHistory.length + 1);
      } else {
        throw new Error(json.error || 'Failed to get response');
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, I had a brief connection hiccup! Feel free to ask again or reach out directly to me via email! 📬',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPromptsList =
    chatConfig?.quickQuestions && chatConfig.quickQuestions.length > 0
      ? chatConfig.quickQuestions
      : QUICK_PROMPTS;

  return (
    <div className="fixed bottom-5 right-5 z-50 font-mono">
      {/* Floating Avatar Trigger Button */}
      {!isOpen && (
        <ChatTriggerButton
          profile={profile}
          config={chatConfig}
          hasPromptedVisitor={hasPromptedVisitor}
          onOpen={() => {
            setIsOpen(true);
            setHasPromptedVisitor(false);
          }}
          onDismissPrompt={() => setHasPromptedVisitor(false)}
        />
      )}

      {/* Expanded Chat Drawer / Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="w-[92vw] sm:w-96 max-w-md h-137.5 max-h-[85vh] bg-white dark:bg-slate-900 border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_#70d6ff] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <ChatHeader
              profile={profile}
              config={chatConfig}
              onClose={() => setIsOpen(false)}
              onMinimize={() => setIsOpen(false)}
            />

            {/* Chat Messages Feed */}
            <ChatMessagesFeed
              messages={messages}
              isLoading={isLoading}
              messagesEndRef={messagesEndRef}
            />

            {/* Quick Suggestion Chips */}
            {messages.length <= 3 && !isLoading && (
              <ChatQuickSuggestions
                prompts={quickPromptsList}
                onSelectPrompt={handleSendMessage}
              />
            )}

            {/* Input Form */}
            <ChatInputForm
              inputValue={inputValue}
              isLoading={isLoading}
              onInputChange={setInputValue}
              onSend={() => handleSendMessage()}
              inputRef={inputRef}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


