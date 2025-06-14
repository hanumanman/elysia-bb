/* eslint-disable no-console */
import { Elysia, t } from 'elysia'
import { NovelService } from '../services/novel.service'

const novelService = new NovelService()

export const novelDiscoveryRoutes = new Elysia()
  .get(
    '/popular',
    async ({ query, set }) => {
      try {
        const { page = 1, limit = 20, categoryIds, tagIds } = query

        const result = await novelService.getPopularNovels({
          page: Number(page),
          limit: Number(limit),
          categoryIds: categoryIds ? categoryIds.split(',') : undefined,
          tagIds: tagIds ? tagIds.split(',') : undefined
        })

        return result
      } catch (error) {
        console.error('Error fetching popular novels:', error)
        set.status = 500
        return { error: 'Internal server error' }
      }
    },
    {
      query: t.Object({
        page: t.Optional(t.Numeric()),
        limit: t.Optional(t.Numeric()),
        categoryIds: t.Optional(t.String()),
        tagIds: t.Optional(t.String())
      }),
      detail: {
        tags: ['novels'],
        summary: 'Get popular novels',
        description: 'Retrieve novels sorted by total views (most popular first)'
      }
    }
  )

  .get(
    '/top-rated',
    async ({ query, set }) => {
      try {
        const { page = 1, limit = 20, categoryIds, tagIds } = query

        const result = await novelService.getTopRatedNovels({
          page: Number(page),
          limit: Number(limit),
          categoryIds: categoryIds ? categoryIds.split(',') : undefined,
          tagIds: tagIds ? tagIds.split(',') : undefined
        })

        return result
      } catch (error) {
        console.error('Error fetching top-rated novels:', error)
        set.status = 500
        return { error: 'Internal server error' }
      }
    },
    {
      query: t.Object({
        page: t.Optional(t.Numeric()),
        limit: t.Optional(t.Numeric()),
        categoryIds: t.Optional(t.String()),
        tagIds: t.Optional(t.String())
      }),
      detail: {
        tags: ['novels'],
        summary: 'Get top-rated novels',
        description: 'Retrieve novels sorted by average rating (highest rated first)'
      }
    }
  )

  .get(
    '/recent',
    async ({ query, set }) => {
      try {
        const { page = 1, limit = 20, categoryIds, tagIds } = query

        const result = await novelService.getRecentNovels({
          page: Number(page),
          limit: Number(limit),
          categoryIds: categoryIds ? categoryIds.split(',') : undefined,
          tagIds: tagIds ? tagIds.split(',') : undefined
        })

        return result
      } catch (error) {
        console.error('Error fetching recent novels:', error)
        set.status = 500
        return { error: 'Internal server error' }
      }
    },
    {
      query: t.Object({
        page: t.Optional(t.Numeric()),
        limit: t.Optional(t.Numeric()),
        categoryIds: t.Optional(t.String()),
        tagIds: t.Optional(t.String())
      }),
      detail: {
        tags: ['novels'],
        summary: 'Get recent novels',
        description: 'Retrieve novels sorted by creation date (newest first)'
      }
    }
  )

  .get(
    '/recently-updated',
    async ({ query, set }) => {
      try {
        const { page = 1, limit = 20, categoryIds, tagIds } = query

        const result = await novelService.getRecentlyUpdatedNovels({
          page: Number(page),
          limit: Number(limit),
          categoryIds: categoryIds ? categoryIds.split(',') : undefined,
          tagIds: tagIds ? tagIds.split(',') : undefined
        })

        return result
      } catch (error) {
        console.error('Error fetching recently updated novels:', error)
        set.status = 500
        return { error: 'Internal server error' }
      }
    },
    {
      query: t.Object({
        page: t.Optional(t.Numeric()),
        limit: t.Optional(t.Numeric()),
        categoryIds: t.Optional(t.String()),
        tagIds: t.Optional(t.String())
      }),
      detail: {
        tags: ['novels'],
        summary: 'Get recently updated novels',
        description:
          'Retrieve novels sorted by last update date (most recently updated first)'
      }
    }
  )
