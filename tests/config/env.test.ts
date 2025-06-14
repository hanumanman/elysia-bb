/**
 * Environment validation tests
 * Tests for type-safe environment variable configuration
 */

import { describe, expect, it } from 'bun:test'
import { z } from 'zod'

// Import the schema for testing (we'll recreate the validation logic for testing)
const envSchema = z.object({
  // Database Configuration
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  DATABASE_AUTH_TOKEN: z.string().optional(),

  // Server Configuration
  PORT: z.coerce.number().positive().default(6969),
  HOST: z.string().default('localhost'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // CORS Configuration
  CORS_ORIGIN: z.string().default('*'),
  CORS_CREDENTIALS: z
    .string()
    .optional()
    .transform((val) => val === 'true'),

  // Security Configuration
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required for production').optional(),
  BCRYPT_ROUNDS: z.coerce.number().positive().default(12)
})

const envSchemaWithCustomValidation = envSchema.refine(
  (data) => {
    if (data.NODE_ENV === 'production' && !data.JWT_SECRET) {
      return false
    }
    return true
  },
  {
    message: 'JWT_SECRET is required when NODE_ENV is production',
    path: ['JWT_SECRET']
  }
)

describe('Environment Configuration', () => {
  it('should parse valid environment variables', () => {
    const testEnv = {
      DATABASE_URL: 'file:./test.db',
      NODE_ENV: 'development'
    }

    const result = envSchemaWithCustomValidation.parse(testEnv)

    expect(result.DATABASE_URL).toBe('file:./test.db')
    expect(result.NODE_ENV).toBe('development')
    expect(result.PORT).toBe(6969) // default value
  })

  it('should fail when DATABASE_URL is missing', () => {
    const testEnv = {
      NODE_ENV: 'development'
    }

    expect(() => {
      envSchemaWithCustomValidation.parse(testEnv)
    }).toThrow()
  })

  it('should fail when JWT_SECRET is missing in production', () => {
    const testEnv = {
      DATABASE_URL: 'file:./test.db',
      NODE_ENV: 'production'
    }

    expect(() => {
      envSchemaWithCustomValidation.parse(testEnv)
    }).toThrow()
  })

  it('should apply default values correctly', () => {
    const testEnv = {
      DATABASE_URL: 'file:./test.db'
    }

    const result = envSchemaWithCustomValidation.parse(testEnv)

    expect(result.PORT).toBe(6969)
    expect(result.HOST).toBe('localhost')
    expect(result.NODE_ENV).toBe('development')
    expect(result.CORS_ORIGIN).toBe('*')
    expect(result.BCRYPT_ROUNDS).toBe(12)
  })

  it('should transform CORS_CREDENTIALS correctly', () => {
    const testEnv = {
      DATABASE_URL: 'file:./test.db',
      CORS_CREDENTIALS: 'true'
    }

    const result = envSchemaWithCustomValidation.parse(testEnv)

    expect(result.CORS_CREDENTIALS).toBe(true)
  })

  it('should handle production environment with JWT_SECRET', () => {
    const testEnv = {
      DATABASE_URL: 'file:./test.db',
      NODE_ENV: 'production',
      JWT_SECRET: 'production-secret'
    }

    const result = envSchemaWithCustomValidation.parse(testEnv)

    expect(result.NODE_ENV).toBe('production')
    expect(result.JWT_SECRET).toBe('production-secret')
  })
})
