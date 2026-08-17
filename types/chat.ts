export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const QUICK_PROMPTS = [
  '⚡  What is your core tech stack?',
  '🏆 Tell me about your featured projects',
  '💼 Are you available for full-time or contract work?',
  '📍 Where are you based & how can I reach you?',
];

export interface DetectedLeadInfo {
  name?: string;
  email?: string;
  company?: string;
  intent?: string;
}
