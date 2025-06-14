import { describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'
import { healthController, noteController } from '../src/features'
import { swaggerPlugin } from '../src/shared/plugins'
import { parseJsonResponse, testData, testRequest } from './test-utils'

describe('App Integration Tests', () => {
  // Create a full app instance similar to the main app
  const app = new Elysia().use(swaggerPlugin).use(healthController).use(noteController)

  describe('health endpoint integration', () => {
    it('should work with the full app stack', async () => {
      const response = await testRequest(app, 'GET', '/health')
      const data = await parseJsonResponse(response)

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('Service is healthy')
    })
  })

  describe('notes endpoints integration', () => {
    it('should handle full CRUD flow', async () => {
      // 1. Get initial notes
      const initialResponse = await testRequest(app, 'GET', '/notes')
      const initialData = await parseJsonResponse(initialResponse)
      expect(initialResponse.status).toBe(200)
      const initialCount = initialData.data.length

      // 2. Create a new note
      const createResponse = await testRequest(
        app,
        'POST',
        '/notes',
        testData.note.create
      )
      const createData = await parseJsonResponse(createResponse)
      expect(createResponse.status).toBe(200)
      expect(createData.success).toBe(true)
      const newNoteId = createData.data.id

      // 3. Verify note was created by getting all notes
      const afterCreateResponse = await testRequest(app, 'GET', '/notes')
      const afterCreateData = await parseJsonResponse(afterCreateResponse)
      expect(afterCreateData.data.length).toBe(initialCount + 1)

      // 4. Get the specific note
      const getResponse = await testRequest(app, 'GET', `/notes/${newNoteId}`)
      const getData = await parseJsonResponse(getResponse)
      expect(getResponse.status).toBe(200)
      expect(getData.data.content).toBe(testData.note.create.content)

      // 5. Update the note
      const updateResponse = await testRequest(
        app,
        'PUT',
        `/notes/${newNoteId}`,
        testData.note.update
      )
      const updateData = await parseJsonResponse(updateResponse)
      expect(updateResponse.status).toBe(200)
      expect(updateData.data.content).toBe(testData.note.update.content)

      // 6. Delete the note
      const deleteResponse = await testRequest(app, 'DELETE', `/notes/${newNoteId}`)
      expect(deleteResponse.status).toBe(200)

      // 7. Verify note was deleted
      const finalResponse = await testRequest(app, 'GET', '/notes')
      const finalData = await parseJsonResponse(finalResponse)
      expect(finalData.data.length).toBe(initialCount)
    })

    it('should handle error scenarios in the full app context', async () => {
      // Test non-existent note
      const response = await testRequest(app, 'GET', '/notes/99999')
      const data = await parseJsonResponse(response)
      expect(response.status).toBe(422) // Elysia validation error
      expect(data.type).toBe('validation')

      // Test invalid note creation
      const invalidCreateResponse = await testRequest(app, 'POST', '/notes', {
        content: ''
      })
      const invalidCreateData = await parseJsonResponse(invalidCreateResponse)
      expect(invalidCreateResponse.status).toBe(422) // Elysia validation error
      expect(invalidCreateData.type).toBe('validation')
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

      // Notes endpoint
      const notesResponse = await testRequest(app, 'GET', '/notes')
      const notesData = await parseJsonResponse(notesResponse)
      expect(notesData).toHaveProperty('success')
      expect(notesData).toHaveProperty('message')
    })
  })

  describe('content type headers', () => {
    it('should return correct content types for all endpoints', async () => {
      const healthResponse = await testRequest(app, 'GET', '/health')
      expect(healthResponse.headers.get('content-type')).toContain('application/json')

      const notesResponse = await testRequest(app, 'GET', '/notes')
      expect(notesResponse.headers.get('content-type')).toContain('application/json')
    })
  })
})
