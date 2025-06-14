import { describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'
import { healthController } from '../src/features'
import { swaggerPlugin } from '../src/shared/plugins'
import { parseJsonResponse, testRequest } from './test-utils'

describe('App Integration Tests', () => {
  // Create a full app instance similar to the main app
  const app = new Elysia().use(swaggerPlugin).use(healthController)

  describe('health endpoint integration', () => {
    it('should work with the full app stack', async () => {
      const response = await testRequest(app, 'GET', '/health')
      const data = await parseJsonResponse(response)

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('Service is healthy')
    })
  })

  describe('swagger integration', () => {
    it('should provide swagger documentation', async () => {
      const response = await testRequest(app, 'GET', '/swagger')
      expect(response.status).toBe(200)
    })
  })

  describe('middleware integration', () => {
    it('should apply response service to all endpoints', async () => {
      // Health endpoint
      const healthResponse = await testRequest(app, 'GET', '/health')
      const healthData = await parseJsonResponse(healthResponse)
      expect(healthData).toHaveProperty('success')
      expect(healthData).toHaveProperty('message')
    })
  })

  describe('content type headers', () => {
    it('should return correct content types for all endpoints', async () => {
      const healthResponse = await testRequest(app, 'GET', '/health')
      expect(healthResponse.headers.get('content-type')).toContain('application/json')
    })
  })
})
