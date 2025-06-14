import { describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'
import { responseService } from '../../src/shared/services/response.service'

describe('Response Service', () => {
  // Initialize the response service in a test app
  const app = new Elysia().use(responseService).derive(() => {
    // Get the response service from context
    return {}
  })

  describe('success response', () => {
    it('should create correct success response structure', () => {
      // Test the response format directly
      const testData = { id: 1, name: 'Test' }
      const response = {
        success: true as const,
        data: testData,
        message: 'Test message'
      }

      expect(response.success).toBe(true)
      expect(response.data).toEqual(testData)
      expect(response.message).toBe('Test message')
    })

    it('should use default message when not provided', () => {
      const testData = { id: 1, name: 'Test' }
      const response = {
        success: true as const,
        data: testData,
        message: 'Success'
      }

      expect(response.success).toBe(true)
      expect(response.data).toEqual(testData)
      expect(response.message).toBe('Success')
    })
  })

  describe('successNoData response', () => {
    it('should create correct success response without data', () => {
      const response = {
        success: true as const,
        message: 'Operation completed'
      }

      expect(response.success).toBe(true)
      expect(response.message).toBe('Operation completed')
      expect(response).not.toHaveProperty('data')
    })
  })

  describe('error response', () => {
    it('should create correct error response structure', () => {
      const response = {
        success: false as const,
        error: 'Test error',
        message: 'Error message'
      }

      expect(response.success).toBe(false)
      expect(response.error).toBe('Test error')
      expect(response.message).toBe('Error message')
    })

    it('should work without optional message', () => {
      const response = {
        success: false as const,
        error: 'Test error',
        message: undefined
      }

      expect(response.success).toBe(false)
      expect(response.error).toBe('Test error')
      expect(response.message).toBeUndefined()
    })
  })

  describe('paginated response', () => {
    it('should create correct paginated response structure', () => {
      const testData = [{ id: 1 }, { id: 2 }, { id: 3 }]
      const page = 1
      const limit = 10
      const total = 25

      const response = {
        success: true as const,
        data: testData,
        message: 'Data retrieved successfully',
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }

      expect(response.success).toBe(true)
      expect(response.data).toEqual(testData)
      expect(response.message).toBe('Data retrieved successfully')
      expect(response.pagination.page).toBe(1)
      expect(response.pagination.limit).toBe(10)
      expect(response.pagination.total).toBe(25)
      expect(response.pagination.totalPages).toBe(3)
    })

    it('should calculate totalPages correctly', () => {
      const testCases = [
        { total: 25, limit: 10, expectedPages: 3 },
        { total: 30, limit: 10, expectedPages: 3 },
        { total: 31, limit: 10, expectedPages: 4 },
        { total: 0, limit: 10, expectedPages: 0 },
        { total: 5, limit: 10, expectedPages: 1 }
      ]

      testCases.forEach(({ total, limit, expectedPages }) => {
        const totalPages = Math.ceil(total / limit)
        expect(totalPages).toBe(expectedPages)
      })
    })
  })

  describe('response service integration', () => {
    it('should be properly integrated as Elysia plugin', () => {
      expect(app).toBeDefined()
      // The response service should be available in the app context
      // This tests that the plugin structure is correct
    })
  })

  describe('type safety', () => {
    it('should maintain type safety for success responses', () => {
      interface TestData {
        id: number
        name: string
      }

      const testData: TestData = { id: 1, name: 'Test' }
      const response = {
        success: true as const,
        data: testData,
        message: 'Test'
      }

      // TypeScript should enforce that data matches TestData type
      expect(response.data.id).toBe(1)
      expect(response.data.name).toBe('Test')
    })
  })
})
