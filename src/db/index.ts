import { config } from '@/config'
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import * as relations from './relations'
import * as schema from './schema'

const client = createClient({
  url: config.database.url,
  authToken: config.database.authToken
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
