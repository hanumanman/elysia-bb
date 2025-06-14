/* eslint-disable no-console */
import { Elysia, t } from 'elysia'
import { NovelService } from '../services/novel.service'

const novelService = new NovelService()

export const novelController = new Elysia({ prefix: '/novels' })
  .get(
    '/',
    async ({ query, set }) => {
      try {
        const {
          page = 1,
          limit = 20,
          authorId,
          status,
          search,
          sortBy = 'createdAt',
          sortOrder = 'desc',
          categoryIds,
          tagIds
        } = query

        const result = await novelService.getNovels({
          page: Number(page),
          limit: Number(limit),
          authorId,
          status,
          search,
          sortBy,
          sortOrder,
          categoryIds: categoryIds ? categoryIds.split(',') : undefined,
          tagIds: tagIds ? tagIds.split(',') : undefined
        })

        return result
      } catch (error) {
        console.error('Error fetching novels:', error)
        set.status = 500
        return { error: 'Internal server error' }
      }
    },
    {
      query: t.Object({
        page: t.Optional(t.Numeric()),
        limit: t.Optional(t.Numeric()),
        authorId: t.Optional(t.String()),
        status: t.Optional(
          t.Union([
            t.Literal('ongoing'),
            t.Literal('completed'),
            t.Literal('hiatus'),
            t.Literal('dropped')
          ])
        ),
        search: t.Optional(t.String()),
        sortBy: t.Optional(
          t.Union([
            t.Literal('createdAt'),
            t.Literal('updatedAt'),
            t.Literal('title'),
            t.Literal('averageRating'),
            t.Literal('totalViews')
          ])
        ),
        sortOrder: t.Optional(t.Union([t.Literal('asc'), t.Literal('desc')])),
        categoryIds: t.Optional(t.String()), // comma-separated IDs
        tagIds: t.Optional(t.String()) // comma-separated IDs
      }),
      detail: {
        tags: ['novels'],
        summary: 'Get all novels',
        description:
          'Retrieve a paginated list of novels with optional filtering and sorting'
      }
    }
  )

  .get(
    '/:id',
    async ({ params: { id }, set }) => {
      try {
        const novel = await novelService.getNovelById(id)
        if (!novel) {
          set.status = 404
          return { error: 'Novel not found' }
        }

        // Increment view count
        await novelService.incrementNovelViews(id)

        return novel
      } catch (error) {
        console.error('Error fetching novel by ID:', error)
        set.status = 500
        return { error: 'Internal server error' }
      }
    },
    {
      params: t.Object({
        id: t.String()
      }),
      detail: {
        tags: ['novels'],
        summary: 'Get novel by ID',
        description: 'Retrieve a specific novel by its ID and increment view count'
      }
    }
  )

  .post(
    '/',
    async ({ body, set }) => {
      try {
        const novel = await novelService.createNovel(body)
        set.status = 201
        return novel
      } catch (error) {
        console.error('Error creating novel:', error)
        set.status = 400
        return {
          error: error instanceof Error ? error.message : 'Failed to create novel'
        }
      }
    },
    {
      body: t.Object({
        title: t.String({ minLength: 1 }),
        authorId: t.String(),
        description: t.Optional(t.String()),
        coverImage: t.Optional(t.String()),
        language: t.Optional(t.String()),
        status: t.Optional(
          t.Union([
            t.Literal('ongoing'),
            t.Literal('completed'),
            t.Literal('hiatus'),
            t.Literal('dropped')
          ])
        ),
        categoryIds: t.Optional(t.Array(t.String())),
        tagIds: t.Optional(t.Array(t.String()))
      }),
      detail: {
        tags: ['novels'],
        summary: 'Create a new novel',
        description: 'Create a new novel with the provided information'
      }
    }
  )

  .put(
    '/:id',
    async ({ params: { id }, body, set }) => {
      try {
        const novel = await novelService.updateNovel(id, body)
        if (!novel) {
          set.status = 404
          return { error: 'Novel not found' }
        }
        return novel
      } catch (error) {
        console.error('Error updating novel:', error)
        set.status = 400
        return {
          error: error instanceof Error ? error.message : 'Failed to update novel'
        }
      }
    },
    {
      params: t.Object({
        id: t.String()
      }),
      body: t.Object({
        title: t.Optional(t.String({ minLength: 1 })),
        description: t.Optional(t.String()),
        coverImage: t.Optional(t.String()),
        language: t.Optional(t.String()),
        status: t.Optional(
          t.Union([
            t.Literal('ongoing'),
            t.Literal('completed'),
            t.Literal('hiatus'),
            t.Literal('dropped')
          ])
        ),
        categoryIds: t.Optional(t.Array(t.String())),
        tagIds: t.Optional(t.Array(t.String()))
      }),
      detail: {
        tags: ['novels'],
        summary: 'Update a novel',
        description: 'Update an existing novel with the provided information'
      }
    }
  )

  .delete(
    '/:id',
    async ({ params: { id }, set }) => {
      try {
        const novel = await novelService.deleteNovel(id)
        if (!novel) {
          set.status = 404
          return { error: 'Novel not found' }
        }
        return { message: 'Novel deleted successfully' }
      } catch (error) {
        console.error('Error deleting novel:', error)
        set.status = 500
        return { error: 'Internal server error' }
      }
    },
    {
      params: t.Object({
        id: t.String()
      }),
      detail: {
        tags: ['novels'],
        summary: 'Delete a novel',
        description: 'Soft delete a novel by its ID'
      }
    }
  )

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

  .get(
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

  .get(
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
