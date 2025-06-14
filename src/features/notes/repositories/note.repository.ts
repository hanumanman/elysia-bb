import type { CreateNoteRequest, Note, UpdateNoteRequest } from '../types/note.types'

/**
 * Note repository - handles data persistence
 * Following Elysia best practice: Non-request dependent service as static class
 */
export abstract class NoteRepository {
  private static notes: Note[] = [
    {
      id: 1,
      content: 'Welcome to Elysia Notes!',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]
  private static nextId = 2

  static findAll(): Note[] {
    return this.notes
  }

  static findById(id: number): Note | undefined {
    return this.notes.find((note) => note.id === id)
  }

  static create(data: CreateNoteRequest): Note {
    const note: Note = {
      id: this.nextId++,
      content: data.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.notes.push(note)
    return note
  }

  static update(id: number, data: UpdateNoteRequest): Note | null {
    const noteIndex = this.notes.findIndex((note) => note.id === id)
    if (noteIndex === -1) return null

    const updatedNote: Note = {
      ...this.notes[noteIndex],
      content: data.content,
      updatedAt: new Date().toISOString()
    }
    this.notes[noteIndex] = updatedNote
    return updatedNote
  }

  static delete(id: number): boolean {
    const noteIndex = this.notes.findIndex((note) => note.id === id)
    if (noteIndex === -1) return false

    this.notes.splice(noteIndex, 1)
    return true
  }

  static count(): number {
    return this.notes.length
  }
}
