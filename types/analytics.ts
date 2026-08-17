export interface AnalyticsEvent {
  id?: string;
  _id?: string;
  type: string;
  visitorId?: string;
  visitCount?: number;
  targetId?: string;
  targetTitle?: string;
  timestamp: string | Date;
  userAgent?: string;
  ip?: string;
  country?: string;
  city?: string;
  region?: string;
  isp?: string;
  browser?: string;
  os?: string;
  device?: string;
  screen?: string;
  language?: string;
  duration?: number;
  scrollDepth?: number;
  section?: string;
  details?: string;
}

export interface VisitorLead {
  visitorId: string;
  name?: string;
  email?: string;
  company?: string;
  intent?: string;
  satisfaction?: string;
  notes?: string;
  lastActive: string | Date;
  ip?: string;
  country?: string;
  city?: string;
}

export interface ChatTranscript {
  id: string;
  _id?: string;
  visitorId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string | Date;
}

export interface AnalyticsData {
  totalViews: number;
  totalResumeDownloads: number;
  totalContactClicks: number;
  totalSocialClicks: number;
  totalProjectClicks: number;
  projectClicks: Record<string, number>;
  sectionEngagement: Record<string, number>;
  visitorLeads: VisitorLead[];
  chatTranscripts: ChatTranscript[];
  recentEvents: AnalyticsEvent[];
}

export interface VisitorProfileMetadata {
  visitorId?: string;
  ip?: string;
  location?: string;
  city?: string;
  country?: string;
  device?: string;
  browser?: string;
  os?: string;
  screen?: string;
  totalEvents?: number;
  totalDwellSeconds?: number;
  lastActive?: string | Date;
  visitCount?: number;
  leadName?: string;
  leadEmail?: string;
  leadCompany?: string;
  leadIntent?: string;
}

export interface VisitorIntentAnalysis {
  analysisMode?: 'single_visitor' | 'aggregate_traffic';
  visitorMetadata?: VisitorProfileMetadata;
  visitorSummary: string;
  intentCategory: 'Hiring / Recruitment' | 'Client Project' | 'Peer Developer' | 'General Explorer' | 'High-Intent Leads' | 'Mixed Traffic' | string;
  intentScore: number;
  primaryInterest: string;
  didTheyFindWhatTheyWanted: string;
  keyObservations: string[];
  recommendedAction: string;
}

export interface VisitorSessionOption {
  visitorId: string;
  ip?: string;
  location: string;
  device: string;
  eventCount: number;
  totalDwellSeconds: number;
  leadName?: string;
  leadEmail?: string;
  leadCompany?: string;
  lastActive: Date | string;
}

export type AnalyticsDeleteAction = 'delete_event' | 'delete_chat' | 'delete_lead' | 'clear_events' | 'reset_all';

