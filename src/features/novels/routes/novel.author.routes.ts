/* eslint-disable no-console */
import { Elysia, t } from 'elysia'
import { NovelService } from '../services/novel.service'

const novelService = new NovelService()

export const novelAuthorRoutes = new Elysia().get(
  '/author/:authorId',
  async ({ params: { authorId }, query, set }) => {
    try {
      const { page = 1, limit = 20, status } = query

      const result = await novelService.getNovelsByAuthor(authorId, {
        page: Number(page),
        limit: Number(limit),
        status
      })

      return result
    } catch (error) {
      console.error('Error fetching novels by author:', error)
      set.status = 500
      return { error: 'Internal server error' }
    }
  },
  {
    params: t.Object({
      authorId: t.String()
    }),
    query: t.Object({
      page: t.Optional(t.Numeric()),
      limit: t.Optional(t.Numeric()),
      status: t.Optional(
        t.Union([
          t.Literal('ongoing'),
          t.Literal('completed'),
          t.Literal('hiatus'),
          t.Literal('dropped')
        ])
      )
    }),
    detail: {
      tags: ['novels'],
      summary: 'Get novels by author',
      description: 'Retrieve all novels written by a specific author'
    }
  }
)
