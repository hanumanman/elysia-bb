import { and, asc, count, desc, eq, inArray, isNull, like, or, sql } from 'drizzle-orm'
import {
  categories,
  chapters,
  db,
  novelCategories,
  novels,
  novelTags,
  tags,
  users,
  type Database
} from '../../../db'

export class NovelRepository {
  constructor(private database: Database = db) {}

  async findById(id: string) {
    const result = await this.database
      .select({
        novel: novels,
        author: {
          id: users.id,
          name: users.name,
          email: users.email,
          avatar: users.avatar,
          role: users.role
        }
      })
      .from(novels)
      .leftJoin(users, eq(novels.authorId, users.id))
      .where(and(eq(novels.id, id), isNull(novels.deletedAt)))
      .limit(1)

    return result[0] || null
  }

  async findMany(
    options: {
      limit?: number
      offset?: number
      authorId?: string
      status?: 'ongoing' | 'completed' | 'hiatus' | 'dropped'
      search?: string
      sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'averageRating' | 'totalViews'
      sortOrder?: 'asc' | 'desc'
      categoryIds?: string[]
      tagIds?: string[]
    } = {}
  ) {
    const {
      limit = 20,
      offset = 0,
      authorId,
      status,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      categoryIds,
      tagIds
    } = options

    // Build conditions array
    const conditions = [isNull(novels.deletedAt)]

    if (authorId) {
      conditions.push(eq(novels.authorId, authorId))
    }

    if (status) {
      conditions.push(eq(novels.status, status))
    }

    if (search) {
      conditions.push(
        or(like(novels.title, `%${search}%`), like(novels.description, `%${search}%`))!
      )
    }

    // Category filter
    if (categoryIds && categoryIds.length > 0) {
      const novelIdsWithCategories = this.database
        .select({ id: novelCategories.novelId })
        .from(novelCategories)
        .where(inArray(novelCategories.categoryId, categoryIds))

      conditions.push(inArray(novels.id, novelIdsWithCategories))
    }

    // Tag filter
    if (tagIds && tagIds.length > 0) {
      const novelIdsWithTags = this.database
        .select({ id: novelTags.novelId })
        .from(novelTags)
        .where(inArray(novelTags.tagId, tagIds))

      conditions.push(inArray(novels.id, novelIdsWithTags))
    }

    // Build the base query
    const baseQuery = this.database
      .select({
        novel: novels,
        author: {
          id: users.id,
          name: users.name,
          email: users.email,
          avatar: users.avatar,
          role: users.role
        }
      })
      .from(novels)
      .leftJoin(users, eq(novels.authorId, users.id))
      .where(and(...conditions))

    // Apply sorting and pagination
    let sortedQuery
    switch (sortBy) {
      case 'title':
        sortedQuery = baseQuery.orderBy(
          sortOrder === 'desc' ? desc(novels.title) : asc(novels.title)
        )
        break
      case 'averageRating':
        sortedQuery = baseQuery.orderBy(
          sortOrder === 'desc' ? desc(novels.averageRating) : asc(novels.averageRating)
        )
        break
      case 'totalViews':
        sortedQuery = baseQuery.orderBy(
          sortOrder === 'desc' ? desc(novels.totalViews) : asc(novels.totalViews)
        )
        break
      case 'updatedAt':
        sortedQuery = baseQuery.orderBy(
          sortOrder === 'desc' ? desc(novels.updatedAt) : asc(novels.updatedAt)
        )
        break
      default:
        sortedQuery = baseQuery.orderBy(
          sortOrder === 'desc' ? desc(novels.createdAt) : asc(novels.createdAt)
        )
    }

    const result = await sortedQuery.limit(limit).offset(offset)
    return result
  }

  async count(
    options: {
      authorId?: string
      status?: 'ongoing' | 'completed' | 'hiatus' | 'dropped'
      search?: string
      categoryIds?: string[]
      tagIds?: string[]
    } = {}
  ) {
    const { authorId, status, search, categoryIds, tagIds } = options

    const conditions = [isNull(novels.deletedAt)]

    if (authorId) {
      conditions.push(eq(novels.authorId, authorId))
    }

    if (status) {
      conditions.push(eq(novels.status, status))
    }

    if (search) {
      conditions.push(
        or(like(novels.title, `%${search}%`), like(novels.description, `%${search}%`))!
      )
    }

    if (categoryIds && categoryIds.length > 0) {
      const novelIdsWithCategories = this.database
        .select({ id: novelCategories.novelId })
        .from(novelCategories)
        .where(inArray(novelCategories.categoryId, categoryIds))

      conditions.push(inArray(novels.id, novelIdsWithCategories))
    }

    if (tagIds && tagIds.length > 0) {
      const novelIdsWithTags = this.database
        .select({ id: novelTags.novelId })
        .from(novelTags)
        .where(inArray(novelTags.tagId, tagIds))

      conditions.push(inArray(novels.id, novelIdsWithTags))
    }

    const result = await this.database
      .select({ count: count() })
      .from(novels)
      .where(and(...conditions))

    return result[0]?.count || 0
  }

  async create(novelData: typeof novels.$inferInsert) {
    const result = await this.database.insert(novels).values(novelData).returning()
    return result[0]
  }

  async update(id: string, novelData: Partial<typeof novels.$inferInsert>) {
    const result = await this.database
      .update(novels)
      .set({ ...novelData, updatedAt: new Date() })
      .where(and(eq(novels.id, id), isNull(novels.deletedAt)))
      .returning()

    return result[0] || null
  }

  async softDelete(id: string) {
    const result = await this.database
      .update(novels)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(and(eq(novels.id, id), isNull(novels.deletedAt)))
      .returning()

    return result[0] || null
  }

  async updateTotalChapters(novelId: string) {
    const chapterCount = await this.database
      .select({ count: count() })
      .from(chapters)
      .where(and(eq(chapters.novelId, novelId), isNull(chapters.deletedAt)))

    const totalChapters = chapterCount[0]?.count || 0

    await this.database
      .update(novels)
      .set({ totalChapters, updatedAt: new Date() })
      .where(eq(novels.id, novelId))
  }

  async updateAverageRating(novelId: string, newRating: number) {
    await this.database
      .update(novels)
      .set({ averageRating: newRating, updatedAt: new Date() })
      .where(eq(novels.id, novelId))
  }

  async incrementViews(novelId: string) {
    await this.database
      .update(novels)
      .set({
        totalViews: sql`${novels.totalViews} + 1`,
        updatedAt: new Date()
      })
      .where(eq(novels.id, novelId))
  }

  async getNovelCategories(novelId: string) {
    const result = await this.database
      .select({
        category: categories
      })
      .from(novelCategories)
      .leftJoin(categories, eq(novelCategories.categoryId, categories.id))
      .where(eq(novelCategories.novelId, novelId))

    return result.map((r) => r.category).filter(Boolean)
  }

  async getNovelTags(novelId: string) {
    const result = await this.database
      .select({
        tag: tags
      })
      .from(novelTags)
      .leftJoin(tags, eq(novelTags.tagId, tags.id))
      .where(eq(novelTags.novelId, novelId))

    return result.map((r) => r.tag).filter(Boolean)
  }

  async addCategories(novelId: string, categoryIds: string[]) {
    if (categoryIds.length === 0) return

    const values = categoryIds.map((categoryId) => ({
      novelId,
      categoryId
    }))

    await this.database.insert(novelCategories).values(values)
  }

  async addTags(novelId: string, tagIds: string[]) {
    if (tagIds.length === 0) return

    const values = tagIds.map((tagId) => ({
      novelId,
      tagId
    }))

    await this.database.insert(novelTags).values(values)
  }

  async removeCategories(novelId: string, categoryIds?: string[]) {
    if (categoryIds && categoryIds.length > 0) {
      await this.database
        .delete(novelCategories)
        .where(
          and(
            eq(novelCategories.novelId, novelId),
            inArray(novelCategories.categoryId, categoryIds)
          )
        )
    } else {
      await this.database
        .delete(novelCategories)
        .where(eq(novelCategories.novelId, novelId))
    }
  }

  async removeTags(novelId: string, tagIds?: string[]) {
    if (tagIds && tagIds.length > 0) {
      await this.database
        .delete(novelTags)
        .where(and(eq(novelTags.novelId, novelId), inArray(novelTags.tagId, tagIds)))
    } else {
      await this.database.delete(novelTags).where(eq(novelTags.novelId, novelId))
    }
  }
}
