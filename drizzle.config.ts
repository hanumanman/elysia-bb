import 'dotenv/config'
import type { Config } from 'drizzle-kit'
import { env } from './src/config/env'

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: env.DATABASE_URL
  }
} satisfies Config
