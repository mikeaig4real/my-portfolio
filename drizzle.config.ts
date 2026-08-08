import { defineConfig } from 'drizzle-kit';
import { DATABASE_CONSTANTS } from './lib/constants';

export default defineConfig({
  schema: './lib/db/schema/drizzleSchema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: `file:${DATABASE_CONSTANTS.SQLITE_DB_FILE_PATH}`,
  },
});
