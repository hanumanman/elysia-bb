/**
 * Application configuration
 * Centralized configuration management following best practices
 */

import 'dotenv/config'

export const config = {
  server: {
    port: Number(process.env.PORT) || 6969,
    host: process.env.HOST || 'localhost',
    environment: process.env.NODE_ENV || 'development'
  },

  api: {
    version: '1.0.0',
    title: 'Novel Reading API',
    description:
      'A scalable Elysia API for novel reading application with Vietnamese text support'
  },

  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: process.env.CORS_CREDENTIALS === 'true'
  },

  database: {
    url: process.env.DATABASE_URL || 'file:./dev.db',
    authToken: process.env.DATABASE_AUTH_TOKEN
  },

  security: {
    jwtSecret: process.env.JWT_SECRET || 'development-secret-key',
    bcryptRounds: Number(process.env.BCRYPT_ROUNDS) || 12
  }
}

export type Config = typeof config
