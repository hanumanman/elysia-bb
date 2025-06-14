/**
 * Application configuration
 * Centralized configuration management following best practices
 */

import 'dotenv/config'
import { env } from './env'

export const config = {
  server: {
    port: env.PORT,
    host: env.HOST,
    environment: env.NODE_ENV
  },

  api: {
    version: '1.0.0',
    title: 'Novel Reading API',
    description:
      'A scalable Elysia API for novel reading application with Vietnamese text support'
  },

  cors: {
    origin: env.CORS_ORIGIN,
    credentials: env.CORS_CREDENTIALS
  },

  database: {
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN
  },

  security: {
    jwtSecret: env.JWT_SECRET || 'development-secret-key',
    bcryptRounds: env.BCRYPT_ROUNDS
  }
}

export type Config = typeof config

// Re-export env for direct access to environment variables when needed
export { env } from './env'
export type { Env } from './env'
