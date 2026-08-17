import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const portfolioTable = sqliteTable('portfolio_data', {
  id: text('id').primaryKey(),
  profileJson: text('profile_json').notNull(),
  workplacesJson: text('workplaces_json').notNull(),
  projectsJson: text('projects_json').notNull(),
  skillsJson: text('skills_json').notNull(),
  socialsJson: text('socials_json').notNull(),
  cardsJson: text('cards_json').notNull(),
  customizationJson: text('customization_json').notNull(),
  // Top-level colorScheme stored separately for fast reads
  colorScheme: text('color_scheme').notNull().default('cyber_yellow'),
  updatedAt: integer('updated_at').notNull(),
});

export const analyticsTable = sqliteTable('analytics_data', {
  id: text('id').primaryKey(), // 'main'
  totalViews: integer('total_views').notNull().default(0),
  totalResumeDownloads: integer('total_resume_downloads').notNull().default(0),
  totalContactClicks: integer('total_contact_clicks').notNull().default(0),
  totalSocialClicks: integer('total_social_clicks').notNull().default(0),
  totalProjectClicks: integer('total_project_clicks').notNull().default(0),
  projectClicksJson: text('project_clicks_json').notNull().default('{}'),
  sectionEngagementJson: text('section_engagement_json').notNull().default('{}'),
  recentEventsJson: text('recent_events_json').notNull().default('[]'),
  visitorLeadsJson: text('visitor_leads_json').notNull().default('[]'),
  chatTranscriptsJson: text('chat_transcripts_json').notNull().default('[]'),
  updatedAt: integer('updated_at').notNull(),
});
