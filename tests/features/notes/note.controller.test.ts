import { describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'
import { noteController } from '../../../src/features/notes/controllers/note.controller'
import { parseJsonResponse, testData, testRequest } from '../../test-utils'

describe('Note Controller', () => {
  const app = new Elysia().use(noteController)

  describe('GET /notes', () => {
    it('should return all notes successfully', async () => {
      const response = await testRequest(app, 'GET', '/notes')
      const data = await parseJsonResponse(response)

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('Notes retrieved successfully')
      expect(Array.isArray(data.data)).toBe(true)
    })

    it('should return correct response structure', async () => {
      const response = await testRequest(app, 'GET', '/notes')
      const data = await parseJsonResponse(response)

      expect(data).toHaveProperty('success')
      expect(data).toHaveProperty('message')
      expect(data).toHaveProperty('data')
    })

    it('should return notes with correct structure', async () => {
      const response = await testRequest(app, 'GET', '/notes')
      const data = await parseJsonResponse(response)

      if (data.data.length > 0) {
        const firstNote = data.data[0]
        expect(firstNote).toHaveProperty('id')
        expect(firstNote).toHaveProperty('content')
        expect(firstNote).toHaveProperty('createdAt')
        expect(firstNote).toHaveProperty('updatedAt')
      }
    })
  })

  describe('GET /notes/:id', () => {
    it('should return a specific note when valid id is provided', async () => {
      // First get all notes to find a valid ID
      const allNotesResponse = await testRequest(app, 'GET', '/notes')
      const allNotesData = await parseJsonResponse(allNotesResponse)

      if (allNotesData.data.length > 0) {
        const validId = allNotesData.data[0].id
        const response = await testRequest(app, 'GET', `/notes/${validId}`)
        const data = await parseJsonResponse(response)

        expect(response.status).toBe(200)
        expect(data.success).toBe(true)
        expect(data.message).toBe('Note retrieved successfully')
        expect(data.data.id).toBe(validId)
      }
    })

    it('should return 422 for non-existent note', async () => {
      const nonExistentId = 99999
      const response = await testRequest(app, 'GET', `/notes/${nonExistentId}`)
      const data = await parseJsonResponse(response)

      expect(response.status).toBe(422) // Elysia returns 422 for validation errors
      expect(data.type).toBe('validation')
    })
  })

  describe('POST /notes', () => {
    it('should create a new note successfully', async () => {
      const response = await testRequest(app, 'POST', '/notes', testData.note.create)
      const data = await parseJsonResponse(response)

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('Note created successfully')
      expect(data.data).toHaveProperty('id')
      expect(data.data.content).toBe(testData.note.create.content)
      expect(data.data).toHaveProperty('createdAt')
      expect(data.data).toHaveProperty('updatedAt')
    })

    it('should reject note creation with empty content', async () => {
      const response = await testRequest(
        app,
        'POST',
        '/notes',
        testData.note.invalid.noContent
      )
      const data = await parseJsonResponse(response)

      expect(response.status).toBe(422) // Elysia validation error
      expect(data.type).toBe('validation')
    })

    it('should reject note creation with only whitespace content', async () => {
      const whitespaceNote = { content: '   ' }
      const response = await testRequest(app, 'POST', '/notes', whitespaceNote)
      const data = await parseJsonResponse(response)

      expect(response.status).toBe(422) // Elysia validation error
      expect(data.type).toBe('validation')
    })
  })

  describe('PUT /notes/:id', () => {
    it('should update an existing note successfully', async () => {
      // First create a note
      const createResponse = await testRequest(
        app,
        'POST',
        '/notes',
        testData.note.create
      )
      const createData = await parseJsonResponse(createResponse)
      const noteId = createData.data.id

      // Then update it
      const updateResponse = await testRequest(
        app,
        'PUT',
        `/notes/${noteId}`,
        testData.note.update
      )
      const updateData = await parseJsonResponse(updateResponse)

      expect(updateResponse.status).toBe(200)
      expect(updateData.success).toBe(true)
      expect(updateData.message).toBe('Note updated successfully')
      expect(updateData.data.id).toBe(noteId)
      expect(updateData.data.content).toBe(testData.note.update.content)
      expect(updateData.data.updatedAt).not.toBe(createData.data.updatedAt)
    })

    it('should reject update with empty content', async () => {
      // First create a note
      const createResponse = await testRequest(
        app,
        'POST',
        '/notes',
        testData.note.create
      )
      const createData = await parseJsonResponse(createResponse)
      const noteId = createData.data.id

      // Try to update with empty content
      const updateResponse = await testRequest(
        app,
        'PUT',
        `/notes/${noteId}`,
        testData.note.invalid.noContent
      )
      const updateData = await parseJsonResponse(updateResponse)

      expect(updateResponse.status).toBe(422) // Elysia validation error
      expect(updateData.type).toBe('validation')
    })

    it('should return error for non-existent note update', async () => {
      const nonExistentId = 99999
      const response = await testRequest(
        app,
        'PUT',
        `/notes/${nonExistentId}`,
        testData.note.update
      )
      const data = await parseJsonResponse(response)

      expect(response.status).toBe(422) // Elysia validation error
      expect(data.type).toBe('validation')
    })
  })

  describe('DELETE /notes/:id', () => {
    it('should delete an existing note successfully', async () => {
      // First create a note
      const createResponse = await testRequest(
        app,
        'POST',
        '/notes',
        testData.note.create
      )
      const createData = await parseJsonResponse(createResponse)
      const noteId = createData.data.id

      // Then delete it
      const deleteResponse = await testRequest(app, 'DELETE', `/notes/${noteId}`)
      const deleteData = await parseJsonResponse(deleteResponse)

      expect(deleteResponse.status).toBe(200)
      expect(deleteData.success).toBe(true)
      expect(deleteData.message).toBe('Note deleted successfully')

      // Verify it's actually deleted - try to get it
      const getResponse = await testRequest(app, 'GET', `/notes/${noteId}`)
      expect(getResponse.status).toBe(422) // Should get validation error for non-existent note
    })

    it('should return error for non-existent note deletion', async () => {
      const nonExistentId = 99999
      const response = await testRequest(app, 'DELETE', `/notes/${nonExistentId}`)
      const data = await parseJsonResponse(response)

      expect(response.status).toBe(422) // Elysia validation error
      expect(data.type).toBe('validation')
    })
  })

  describe('response format consistency', () => {
    it('should return consistent success response format', async () => {
      const response = await testRequest(app, 'GET', '/notes')
      const data = await parseJsonResponse(response)

      expect(data).toHaveProperty('success', true)
      expect(data).toHaveProperty('message')
      expect(data).toHaveProperty('data')
    })

    it('should return consistent error response format', async () => {
      const response = await testRequest(app, 'GET', '/notes/99999')
      const data = await parseJsonResponse(response)

      expect(response.status).toBe(422)
      expect(data).toHaveProperty('type', 'validation')
      expect(data).toHaveProperty('message')
    })
  })
})
