import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalyticsEvent {
  type: 'page_view' | 'project_click' | 'resume_download' | 'contact_click' | string;
  targetId?: string;
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
}

export interface IAnalytics extends Document {
  totalViews: number;
  totalResumeDownloads: number;
  totalContactClicks: number;
  projectClicks: Map<string, number>;
  recentEvents: IAnalyticsEvent[];
  updatedAt: Date;
}

const AnalyticsSchema: Schema = new Schema(
  {
    totalViews: { type: Number, default: 0 },
    totalResumeDownloads: { type: Number, default: 0 },
    totalContactClicks: { type: Number, default: 0 },
    projectClicks: { type: Map, of: Number, default: {} },
    recentEvents: [
      {
        type: { type: String, required: true },
        targetId: { type: String },
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
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Analytics ||
  mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);
