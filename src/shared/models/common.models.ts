import { t } from 'elysia'

/**
 * Common validation models shared across features
 */
export const CommonModels = {
  // Standard response models
  'response.success': t.Object({
    success: t.Literal(true),
    data: t.Any(),
    message: t.Optional(t.String())
  }),

  'response.error': t.Object({
    success: t.Literal(false),
    error: t.String(),
    message: t.Optional(t.String())
  }),

  // Common parameter models
  'params.id': t.Object({
    id: t.String({ minLength: 1 })
  }),

  'params.numericId': t.Object({
    id: t.Number({ minimum: 0 })
  }),

  // Pagination models
  'query.pagination': t.Object({
    page: t.Optional(t.Number({ minimum: 1, default: 1 })),
    limit: t.Optional(t.Number({ minimum: 1, maximum: 100, default: 10 }))
  }),

  'response.paginated': t.Object({
    success: t.Literal(true),
    data: t.Array(t.Any()),
    pagination: t.Object({
      page: t.Number(),
      limit: t.Number(),
      total: t.Number(),
      totalPages: t.Number()
    })
  })
}
