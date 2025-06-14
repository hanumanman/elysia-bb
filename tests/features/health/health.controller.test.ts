import { describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'
import { healthController } from '../../../src/features/health/controllers/health.controller'
import { parseJsonResponse, testRequest } from '../../test-utils'

describe('Health Controller', () => {
  const app = new Elysia().use(healthController)

  describe('GET /health', () => {
    it('should return healthy status', async () => {
      const response = await testRequest(app, 'GET', '/health')
      const data = await parseJsonResponse(response)

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('Service is healthy')
      expect(data.data).toMatchObject({
        status: 'healthy',
        environment: expect.any(String)
      })
      expect(data.data.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
      expect(typeof data.data.uptime).toBe('number')
      expect(data.data.uptime).toBeGreaterThanOrEqual(0)
    })

    it('should have correct response structure', async () => {
      const response = await testRequest(app, 'GET', '/health')
      const data = await parseJsonResponse(response)

      expect(data).toHaveProperty('success')
      expect(data).toHaveProperty('message')
      expect(data).toHaveProperty('data')

      expect(data.data).toHaveProperty('status')
      expect(data.data).toHaveProperty('timestamp')
      expect(data.data).toHaveProperty('uptime')
      expect(data.data).toHaveProperty('environment')
    })

    it('should return content-type application/json', async () => {
      const response = await testRequest(app, 'GET', '/health')

      expect(response.headers.get('content-type')).toContain('application/json')
    })
  })
})
