import { Elysia } from 'elysia'
import { NoteRepository } from '../repositories/note.repository'
import type { CreateNoteRequest, UpdateNoteRequest } from '../types/note.types'

/**
 * Note service - business logic layer
 * Following Elysia best practice: Use Elysia instance as a service for request-dependent services
 */
export const noteService = new Elysia({ name: 'note-service' }).derive(
  { as: 'scoped' },
  () => ({
    noteService: {
      async getAllNotes() {
        return NoteRepository.findAll()
      },

      async getNoteById(id: number) {
        const note = NoteRepository.findById(id)
        if (!note) {
          throw new Error('Note not found')
        }
        return note
      },

      async createNote(data: CreateNoteRequest) {
        if (!data.content.trim()) {
          throw new Error('Note content cannot be empty')
        }
        return NoteRepository.create(data)
      },

      async updateNote(id: number, data: UpdateNoteRequest) {
        if (!data.content.trim()) {
          throw new Error('Note content cannot be empty')
        }

        const updatedNote = NoteRepository.update(id, data)
        if (!updatedNote) {
          throw new Error('Note not found')
        }
        return updatedNote
      },

      async deleteNote(id: number) {
        const deleted = NoteRepository.delete(id)
        if (!deleted) {
          throw new Error('Note not found')
        }
        return true
      },

      async getNoteCount() {
        return NoteRepository.count()
      }
    }
  })
)
