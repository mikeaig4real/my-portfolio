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
  updatedAt: integer('updated_at').notNull(),
});
