import { describe, expect, it } from 'bun:test'
import { NoteRepository } from '../../../src/features/notes/repositories/note.repository'
import type {
  CreateNoteRequest,
  UpdateNoteRequest
} from '../../../src/features/notes/types/note.types'

describe('Note Repository', () => {
  // Note: Since NoteRepository uses static methods and in-memory storage,
  // we need to be careful about test isolation. In a real app, you might want
  // to add a reset method or use a proper database with transactions.

  describe('findAll', () => {
    it('should return all notes', () => {
      const notes = NoteRepository.findAll()
      expect(Array.isArray(notes)).toBe(true)
      expect(notes.length).toBeGreaterThanOrEqual(1) // Has the default note
    })

    it('should return notes with correct structure', () => {
      const notes = NoteRepository.findAll()
      const firstNote = notes[0]

      expect(firstNote).toHaveProperty('id')
      expect(firstNote).toHaveProperty('content')
      expect(firstNote).toHaveProperty('createdAt')
      expect(firstNote).toHaveProperty('updatedAt')
      expect(typeof firstNote.id).toBe('number')
      expect(typeof firstNote.content).toBe('string')
    })
  })

  describe('findById', () => {
    it('should return a note when valid id is provided', () => {
      const notes = NoteRepository.findAll()
      const firstNote = notes[0]

      const foundNote = NoteRepository.findById(firstNote.id)
      expect(foundNote).toBeDefined()
      expect(foundNote?.id).toBe(firstNote.id)
      expect(foundNote?.content).toBe(firstNote.content)
    })

    it('should return undefined when note does not exist', () => {
      const nonExistentId = 99999
      const note = NoteRepository.findById(nonExistentId)
      expect(note).toBeUndefined()
    })
  })

  describe('create', () => {
    it('should create a new note with valid data', () => {
      const initialCount = NoteRepository.count()
      const noteData: CreateNoteRequest = {
        content: 'Test note content'
      }

      const createdNote = NoteRepository.create(noteData)

      expect(createdNote).toBeDefined()
      expect(createdNote.content).toBe(noteData.content)
      expect(typeof createdNote.id).toBe('number')
      expect(createdNote.id).toBeGreaterThan(0)
      expect(createdNote.createdAt).toBeDefined()
      expect(createdNote.updatedAt).toBeDefined()
      expect(NoteRepository.count()).toBe(initialCount + 1)
    })

    it('should generate unique ids for different notes', () => {
      const note1 = NoteRepository.create({ content: 'Note 1' })
      const note2 = NoteRepository.create({ content: 'Note 2' })

      expect(note1.id).not.toBe(note2.id)
    })
  })

  describe('update', () => {
    it('should update an existing note', async () => {
      // First create a note
      const noteData: CreateNoteRequest = { content: 'Original content' }
      const createdNote = NoteRepository.create(noteData)

      // Add a small delay to ensure different timestamps
      await new Promise((resolve) => setTimeout(resolve, 1))

      // Then update it
      const updateData: UpdateNoteRequest = { content: 'Updated content' }
      const updatedNote = NoteRepository.update(createdNote.id, updateData)

      expect(updatedNote).toBeDefined()
      expect(updatedNote?.content).toBe(updateData.content)
      expect(updatedNote?.id).toBe(createdNote.id)
      expect(updatedNote?.updatedAt).not.toBe(createdNote.updatedAt)
    })

    it('should return null when trying to update non-existent note', () => {
      const nonExistentId = 99999
      const updateData: UpdateNoteRequest = { content: 'Updated content' }

      const result = NoteRepository.update(nonExistentId, updateData)
      expect(result).toBeNull()
    })
  })

  describe('delete', () => {
    it('should delete an existing note', () => {
      // First create a note
      const noteData: CreateNoteRequest = { content: 'Note to delete' }
      const createdNote = NoteRepository.create(noteData)
      const initialCount = NoteRepository.count()

      // Then delete it
      const deleteResult = NoteRepository.delete(createdNote.id)

      expect(deleteResult).toBe(true)
      expect(NoteRepository.count()).toBe(initialCount - 1)
      expect(NoteRepository.findById(createdNote.id)).toBeUndefined()
    })

    it('should return false when trying to delete non-existent note', () => {
      const nonExistentId = 99999
      const deleteResult = NoteRepository.delete(nonExistentId)

      expect(deleteResult).toBe(false)
    })
  })

  describe('count', () => {
    it('should return the correct number of notes', () => {
      const initialCount = NoteRepository.count()

      // Create a note
      NoteRepository.create({ content: 'Test note' })
      expect(NoteRepository.count()).toBe(initialCount + 1)

      // Create another note
      const note2 = NoteRepository.create({ content: 'Test note 2' })
      expect(NoteRepository.count()).toBe(initialCount + 2)

      // Delete a note
      NoteRepository.delete(note2.id)
      expect(NoteRepository.count()).toBe(initialCount + 1)
    })
  })
})
