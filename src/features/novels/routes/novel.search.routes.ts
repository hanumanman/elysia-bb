/* eslint-disable no-console */
import { Elysia, t } from 'elysia'
import { NovelService } from '../services/novel.service'

const novelService = new NovelService()

export const novelSearchRoutes = new Elysia().get(
  '/search/:searchTerm',
  async ({ params: { searchTerm }, query, set }) => {
    try {
      const {
        page = 1,
        limit = 20,
        categoryIds,
        tagIds,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = query

      const result = await novelService.searchNovels(searchTerm, {
        page: Number(page),
        limit: Number(limit),
        categoryIds: categoryIds ? categoryIds.split(',') : undefined,
        tagIds: tagIds ? tagIds.split(',') : undefined,
        sortBy,
        sortOrder
      })

      return result
    } catch (error) {
      console.error('Error searching novels:', error)
      set.status = 500
      return { error: 'Internal server error' }
    }
  },
  {
    params: t.Object({
      searchTerm: t.String()
    }),
    query: t.Object({
      page: t.Optional(t.Numeric()),
      limit: t.Optional(t.Numeric()),
      categoryIds: t.Optional(t.String()),
      tagIds: t.Optional(t.String()),
      sortBy: t.Optional(
        t.Union([
          t.Literal('createdAt'),
          t.Literal('updatedAt'),
          t.Literal('title'),
          t.Literal('averageRating'),
          t.Literal('totalViews')
        ])
      ),
      sortOrder: t.Optional(t.Union([t.Literal('asc'), t.Literal('desc')]))
    }),
    detail: {
      tags: ['novels'],
      summary: 'Search novels',
      description: 'Search for novels by title, description, or other criteria'
    }
  }
)
