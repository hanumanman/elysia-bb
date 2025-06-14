import { Elysia } from 'elysia'
import { CommonModels } from '../../../shared/models/common.models'
import { responseService } from '../../../shared/services'
import { NoteModels } from '../models/note.models'
import { noteService } from '../services/note.service'

/**
 * Note controller - handles HTTP requests
 * Following Elysia best practice: Use Elysia instance as controller
 */
export const noteController = new Elysia({ prefix: '/notes' })
  .use(responseService)
  .use(noteService)
  .model(CommonModels)
  .model(NoteModels)
  .get(
    '/',
    async ({ noteService, response }) => {
      try {
        const notes = await noteService.getAllNotes()
        return response.success(notes, 'Notes retrieved successfully')
      } catch (error) {
        return response.error(
          'Failed to retrieve notes',
          error instanceof Error ? error.message : 'Unknown error'
        )
      }
    },
    {
      detail: {
        summary: 'Get all notes',
        description: 'Retrieve a list of all notes',
        tags: ['notes']
      },
      response: {
        200: 'note.list.response',
        500: 'response.error'
      }
    }
  )
  .get(
    '/:id',
    async ({ noteService, response, params: { id } }) => {
      try {
        const note = await noteService.getNoteById(id)
        return response.success(note, 'Note retrieved successfully')
      } catch (error) {
        if (error instanceof Error && error.message === 'Note not found') {
          return response.error('Note not found', 'The requested note does not exist')
        }
        return response.error(
          'Failed to retrieve note',
          error instanceof Error ? error.message : 'Unknown error'
        )
      }
    },
    {
      params: 'params.numericId',
      detail: {
        summary: 'Get note by ID',
        description: 'Retrieve a specific note by its ID',
        tags: ['notes']
      },
      response: {
        200: 'note.single.response',
        404: 'response.error',
        500: 'response.error'
      }
    }
  )
  .post(
    '/',
    async ({ noteService, response, body }) => {
      try {
        const note = await noteService.createNote(body)
        return response.success(note, 'Note created successfully')
      } catch (error) {
        return response.error(
          'Failed to create note',
          error instanceof Error ? error.message : 'Unknown error'
        )
      }
    },
    {
      body: 'note.create',
      detail: {
        summary: 'Create a new note',
        description: 'Create a new note with the provided content',
        tags: ['notes']
      },
      response: {
        200: 'note.created',
        400: 'response.error',
        500: 'response.error'
      }
    }
  )
  .put(
    '/:id',
    async ({ noteService, response, params: { id }, body }) => {
      try {
        const note = await noteService.updateNote(id, body)
        return response.success(note, 'Note updated successfully')
      } catch (error) {
        if (error instanceof Error && error.message === 'Note not found') {
          return response.error('Note not found', 'The requested note does not exist')
        }
        return response.error(
          'Failed to update note',
          error instanceof Error ? error.message : 'Unknown error'
        )
      }
    },
    {
      params: 'params.numericId',
      body: 'note.update',
      detail: {
        summary: 'Update a note',
        description: 'Update an existing note with new content',
        tags: ['notes']
      },
      response: {
        200: 'note.updated',
        400: 'response.error',
        404: 'response.error',
        500: 'response.error'
      }
    }
  )
  .delete(
    '/:id',
    async ({ noteService, response, params: { id } }) => {
      try {
        await noteService.deleteNote(id)
        return response.success(null, 'Note deleted successfully')
      } catch (error) {
        if (error instanceof Error && error.message === 'Note not found') {
          return response.error('Note not found', 'The requested note does not exist')
        }
        return response.error(
          'Failed to delete note',
          error instanceof Error ? error.message : 'Unknown error'
        )
      }
    },
    {
      params: 'params.numericId',
      detail: {
        summary: 'Delete a note',
        description: 'Delete an existing note by its ID',
        tags: ['notes']
      },
      response: {
        200: 'note.deleted',
        404: 'response.error',
        500: 'response.error'
      }
    }
  )
