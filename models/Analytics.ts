import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalyticsEvent {
  id?: string;
  type: string;
  visitorId?: string;
  visitCount?: number;
  targetId?: string;
  targetTitle?: string;
  timestamp: Date;
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

export interface IVisitorLead {
  visitorId: string;
  name?: string;
  email?: string;
  company?: string;
  intent?: string;
  satisfaction?: string;
  notes?: string;
  lastActive: Date;
  ip?: string;
  country?: string;
  city?: string;
}

export interface IChatMessage {
  id: string;
  visitorId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface IAnalytics extends Document {
  totalViews: number;
  totalResumeDownloads: number;
  totalContactClicks: number;
  totalSocialClicks: number;
  totalProjectClicks: number;
  projectClicks: Map<string, number>;
  sectionEngagement: Map<string, number>;
  recentEvents: IAnalyticsEvent[];
  visitorLeads: IVisitorLead[];
  chatTranscripts: IChatMessage[];
  updatedAt: Date;
}

const AnalyticsSchema: Schema = new Schema(
  {
    totalViews: { type: Number, default: 0 },
    totalResumeDownloads: { type: Number, default: 0 },
    totalContactClicks: { type: Number, default: 0 },
    totalSocialClicks: { type: Number, default: 0 },
    totalProjectClicks: { type: Number, default: 0 },
    projectClicks: { type: Map, of: Number, default: {} },
    sectionEngagement: { type: Map, of: Number, default: {} },
    visitorLeads: [
      {
        visitorId: { type: String, required: true },
        name: { type: String },
        email: { type: String },
        company: { type: String },
        intent: { type: String },
        satisfaction: { type: String },
        notes: { type: String },
        lastActive: { type: Date, default: Date.now },
        ip: { type: String },
        country: { type: String },
        city: { type: String },
      },
    ],
    chatTranscripts: [
      {
        id: { type: String, required: true },
        visitorId: { type: String, required: true },
        role: { type: String, enum: ['user', 'assistant'], required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    recentEvents: [
      {
        id: { type: String },
        type: { type: String, required: true },
        visitorId: { type: String },
        visitCount: { type: Number, default: 1 },
        targetId: { type: String },
        targetTitle: { type: String },
        timestamp: { type: Date, default: Date.now },
        userAgent: { type: String },
        ip: { type: String },
        country: { type: String },
        city: { type: String },
        region: { type: String },
        isp: { type: String },
        browser: { type: String },
        os: { type: String },
        device: { type: String },
        screen: { type: String },
        language: { type: String },
        duration: { type: Number },
        scrollDepth: { type: Number },
        section: { type: String },
        details: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Analytics ||
  mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);
