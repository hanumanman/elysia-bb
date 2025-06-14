import { swagger } from '@elysiajs/swagger'
import { Elysia } from 'elysia'
import { config } from '../../config'

/**
 * Swagger configuration plugin
 * Centralizes API documentation setup
 */
export const swaggerPlugin = new Elysia({ name: 'swagger' }).use(
  swagger({
    documentation: {
      info: {
        title: config.api.title,
        version: config.api.version,
        description: config.api.description
      },
      tags: [
        { name: 'health', description: 'Health check operations' },
        { name: 'novels', description: 'Novel management operations' },
        { name: 'users', description: 'User management operations' }
      ]
    },
    scalarConfig: {
      layout: 'classic',
      theme: 'deepSpace'
    }
  })
)
