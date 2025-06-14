import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import * as relations from './relations'
import * as schema from './schema'

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN
})

export const db = drizzle(client, {
  schema: {
    ...schema,
    ...relations
  }
})

export type Database = typeof db
export * from './relations'
export * from './schema'
