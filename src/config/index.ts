/**
 * Application configuration
 * Centralized configuration management following best practices
 */

export const config = {
  server: {
    port: Number(process.env.PORT) || 6969,
    host: process.env.HOST || 'localhost',
    environment: process.env.NODE_ENV || 'development'
  },

  api: {
    version: '1.0.0',
    title: 'Elysia API',
    description: 'A scalable Elysia API with feature-based architecture'
  },

  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: process.env.CORS_CREDENTIALS === 'true'
  }
}

export type Config = typeof config
