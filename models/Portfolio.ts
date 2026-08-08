import mongoose, { Schema, Document, Model } from 'mongoose';
import { PortfolioData } from '@/types/portfolio';

export interface IPortfolioDocument extends Omit<PortfolioData, 'profile'>, Document {
  profile: PortfolioData['profile'];
}

const ProfileSchema = new Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  bio: { type: String, required: true },
  avatar: { type: String, required: true },
  location: { type: String, default: '' },
  availability: { type: String, default: '' },
  email: { type: String, default: '' },
  resumeUrl: { type: String, default: '#' },
  statusEmoji: { type: String, default: '⚡' },
}, { _id: false });

const WorkplaceSchema = new Schema({
  id: { type: String, required: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  period: { type: String, required: true },
  location: { type: String, default: '' },
  description: { type: String, default: '' },
  skills: [{ type: String }],
  isCurrent: { type: Boolean, default: false },
  logoBg: { type: String, default: '#facc15' },
}, { _id: false });

const ProjectSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  tagline: { type: String, default: '' },
  description: { type: String, default: '' },
  category: { type: String, default: 'Web App' },
  tags: [{ type: String }],
  viewType: { 
    type: String, 
    enum: ['featured', 'gallery', 'metric', 'compact', 'code'], 
    default: 'featured' 
  },
  coverImage: { type: String, default: '' },
  galleryImages: [{ type: String }],
  demoUrl: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  metric: {
    label: { type: String },
    value: { type: String },
  },
  codeSnippet: {
    language: { type: String },
    code: { type: String },
  },
  featured: { type: Boolean, default: false },
  accentColor: { type: String, default: '#facc15' },
}, { _id: false });

const SkillGroupSchema = new Schema({
  id: { type: String, required: true },
  category: { type: String, required: true },
  skills: [{ type: String }],
  badgeColor: { type: String, default: '#facc15' },
}, { _id: false });

const SocialLinkSchema = new Schema({
  id: { type: String, required: true },
  platform: { type: String, required: true },
  url: { type: String, required: true },
  username: { type: String, required: true },
}, { _id: false });

const BentoCardConfigSchema = new Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  title: { type: String, default: '' },
  colSpan: { type: Number, default: 1 },
  rowSpan: { type: Number, default: 1 },
  order: { type: Number, default: 0 },
  visible: { type: Boolean, default: true },
  accentColor: { type: String, default: '#facc15' },
  targetId: { type: String },
  customContent: {
    title: { type: String },
    body: { type: String },
    metricValue: { type: String },
    metricLabel: { type: String },
  },
}, { _id: false });

const PortfolioSchema = new Schema<IPortfolioDocument>(
  {
    profile: { type: ProfileSchema, required: true },
    workplaces: [WorkplaceSchema],
    projects: [ProjectSchema],
    skills: [SkillGroupSchema],
    socials: [SocialLinkSchema],
    cards: [BentoCardConfigSchema],
  },
  { timestamps: true }
);

const Portfolio: Model<IPortfolioDocument> =
  mongoose.models.Portfolio || mongoose.model<IPortfolioDocument>('Portfolio', PortfolioSchema);

export default Portfolio;
