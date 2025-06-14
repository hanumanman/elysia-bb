/**
 * Note feature type definitions
 */

export interface Note {
  id: number
  content: string
  createdAt: string
  updatedAt: string
}

export interface CreateNoteRequest {
  content: string
}

export interface UpdateNoteRequest {
  content: string
}
