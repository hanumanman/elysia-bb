import { t } from 'elysia'

/**
 * Note validation models
 * Following Elysia best practice: Use model references for type safety and OpenAPI generation
 */
export const NoteModels = {
  // Input models
  'note.create': t.Object({
    content: t.String({ minLength: 1, maxLength: 1000 })
  }),

  'note.update': t.Object({
    content: t.String({ minLength: 1, maxLength: 1000 })
  }),

  // Response models
  'note.response': t.Object({
    id: t.Number(),
    content: t.String(),
    createdAt: t.String({ format: 'date-time' }),
    updatedAt: t.String({ format: 'date-time' })
  }),

  'note.list': t.Array(t.Ref('note.response')),

  // Success responses
  'note.created': t.Object({
    success: t.Literal(true),
    data: t.Ref('note.response'),
    message: t.String()
  }),

  'note.updated': t.Object({
    success: t.Literal(true),
    data: t.Ref('note.response'),
    message: t.String()
  }),

  'note.deleted': t.Object({
    success: t.Literal(true),
    message: t.String()
  }),

  'note.list.response': t.Object({
    success: t.Literal(true),
    data: t.Ref('note.list')
  }),

  'note.single.response': t.Object({
    success: t.Literal(true),
    data: t.Ref('note.response')
  })
}
