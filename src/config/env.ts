/**
 * Type-safe environment variable configuration
 * Uses Zod for validation and provides clear error messages for missing environment variables
 */

import { z } from 'zod'

// Define the environment schema
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

// Custom validation for production environment
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

/**
 * Parse and validate environment variables
 * Throws a clear error if any required environment variable is missing
 */
function parseEnv() {
  try {
    return envSchemaWithCustomValidation.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((err) => {
        const path = err.path.join('.')
        const message = err.message
        return `  - ${path}: ${message}`
      })

      const errorMessage = [
        '❌ Environment validation failed:',
        '',
        ...missingVars,
        '',
        '💡 Please check your .env file or environment variables.',
        '📋 You can use .env.example as a reference.'
      ].join('\n')

      // eslint-disable-next-line no-console
      console.error(errorMessage)
      process.exit(1)
    }
    throw error
  }
}

// Export the validated environment variables
export const env = parseEnv()

// Export the type for use in other parts of the application
export type Env = typeof env
