import { Elysia, t } from 'elysia'
import { config } from '../../../config'
import { responseService } from '../../../shared/services'

/**
 * Health check controller
 * Following Elysia best practice: Simple feature as Elysia controller
 */
export const healthController = new Elysia({ prefix: '/health' })
  .use(responseService)
  .get(
    '/',
    ({ response }) => {
      return response.success(
        {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          environment: config.server.environment
        },
        'Service is healthy'
      )
    },
    {
      detail: {
        summary: 'Health check',
        description: 'Check if the service is running and healthy',
        tags: ['health']
      },
      response: {
        200: t.Object({
          success: t.Literal(true),
          data: t.Object({
            status: t.String(),
            timestamp: t.String(),
            uptime: t.Number(),
            environment: t.String()
          }),
          message: t.String()
        })
      }
    }
  )
  .get('/ping', () => 'pong', {
    detail: {
      summary: 'Simple ping',
      description: 'Simple ping endpoint that returns pong',
      tags: ['health']
    },
    response: {
      200: t.String()
    }
  })
