import { categories, db, novels, tags, users } from '@/db'
import { NovelService } from '@/features/novels'
import { beforeEach, describe, expect, it } from 'bun:test'
import { eq } from 'drizzle-orm'

describe('NovelService', () => {
  let novelService: NovelService
  let testAuthor: any
  let testCategory: any
  let testTag: any

  beforeEach(async () => {
    novelService = new NovelService()

    // Clean up test data before each test
    await db.delete(novels).where(eq(novels.title, 'Test Novel'))
    await db.delete(users).where(eq(users.email, 'author@example.com'))
    await db.delete(categories).where(eq(categories.name, 'Test Category'))
    await db.delete(tags).where(eq(tags.name, 'Test Tag'))

    // Create test author
    const authorResult = await db
      .insert(users)
      .values({
        name: 'Test Author',
        email: 'author@example.com',
        passwordHash: 'hashed_password',
        role: 'author'
      })
      .returning()
    testAuthor = authorResult[0]

    // Create test category
    const categoryResult = await db
      .insert(categories)
      .values({
        name: 'Test Category',
        slug: 'test-category',
        description: 'A test category'
      })
      .returning()
    testCategory = categoryResult[0]

    // Create test tag
    const tagResult = await db
      .insert(tags)
      .values({
        name: 'Test Tag',
        slug: 'test-tag'
      })
      .returning()
    testTag = tagResult[0]
  })

  it('should create a novel with categories and tags', async () => {
    const novelData = {
      title: 'Test Novel',
      authorId: testAuthor.id,
      description: 'A comprehensive test novel',
      language: 'en',
      status: 'ongoing' as const,
      categoryIds: [testCategory.id],
      tagIds: [testTag.id]
    }

    const createdNovel = await novelService.createNovel(novelData)

    expect(createdNovel).toBeDefined()
    expect(createdNovel?.title).toBe(novelData.title)
    expect(createdNovel?.author?.id).toBe(testAuthor.id)
    expect(createdNovel?.categories?.length).toBe(1)
    expect(createdNovel?.categories?.[0]?.id).toBe(testCategory.id)
    expect(createdNovel?.tags?.length).toBe(1)
    expect(createdNovel?.tags?.[0]?.id).toBe(testTag.id)
  })

  it('should get novel by id with complete metadata', async () => {
    const novelData = {
      title: 'Test Novel',
      authorId: testAuthor.id,
      description: 'A test novel',
      categoryIds: [testCategory.id],
      tagIds: [testTag.id]
    }

    const createdNovel = await novelService.createNovel(novelData)
    const retrievedNovel = await novelService.getNovelById(createdNovel!.id)

    expect(retrievedNovel).toBeDefined()
    expect(retrievedNovel?.title).toBe(novelData.title)
    expect(retrievedNovel?.author?.name).toBe(testAuthor.name)
    expect(retrievedNovel?.categories?.length).toBe(1)
    expect(retrievedNovel?.tags?.length).toBe(1)
  })

  it('should get novels with pagination', async () => {
    // Create multiple test novels
    for (let i = 1; i <= 5; i++) {
      await novelService.createNovel({
        title: `Test Novel ${i}`,
        authorId: testAuthor.id,
        description: `Description for novel ${i}`
      })
    }

    const result = await novelService.getNovels({ page: 1, limit: 3 })

    expect(result).toBeDefined()
    expect(result.novels.length).toBe(3)
    expect(result.pagination.page).toBe(1)
    expect(result.pagination.limit).toBe(3)
    expect(result.pagination.total).toBeGreaterThanOrEqual(3)
    expect(result.pagination.hasNext).toBe(true)
    expect(result.pagination.hasPrev).toBe(false)
  })

  it('should update novel with new metadata', async () => {
    const novelData = {
      title: 'Original Title',
      authorId: testAuthor.id,
      description: 'Original description'
    }

    const createdNovel = await novelService.createNovel(novelData)
    const updateData = {
      title: 'Updated Title',
      description: 'Updated description',
      status: 'completed' as const,
      categoryIds: [testCategory.id],
      tagIds: [testTag.id]
    }

    const updatedNovel = await novelService.updateNovel(createdNovel!.id, updateData)

    expect(updatedNovel).toBeDefined()
    expect(updatedNovel?.title).toBe(updateData.title)
    expect(updatedNovel?.description).toBe(updateData.description)
    expect(updatedNovel?.status).toBe(updateData.status)
    expect(updatedNovel?.categories?.length).toBe(1)
    expect(updatedNovel?.tags?.length).toBe(1)
  })

  it('should search novels by title', async () => {
    await novelService.createNovel({
      title: 'Fantasy Adventure Quest',
      authorId: testAuthor.id,
      description: 'A magical adventure'
    })

    await novelService.createNovel({
      title: 'Science Fiction Explorer',
      authorId: testAuthor.id,
      description: 'Space exploration story'
    })

    const searchResult = await novelService.searchNovels('Fantasy', { limit: 10 })

    expect(searchResult.novels.length).toBeGreaterThanOrEqual(1)
    expect(searchResult.novels[0]?.title).toContain('Fantasy')
  })

  it('should get popular novels sorted by views', async () => {
    // Create novels with different view counts
    const novel1 = await novelService.createNovel({
      title: 'Low Views Novel',
      authorId: testAuthor.id,
      description: 'Less popular novel'
    })

    const novel2 = await novelService.createNovel({
      title: 'High Views Novel',
      authorId: testAuthor.id,
      description: 'Very popular novel'
    })

    // Simulate views
    if (novel1 && novel2) {
      await novelService.incrementNovelViews(novel1.id)
      for (let i = 0; i < 10; i++) {
        await novelService.incrementNovelViews(novel2.id)
      }
    }

    const popularNovels = await novelService.getPopularNovels({ limit: 10 })

    expect(popularNovels.novels.length).toBeGreaterThanOrEqual(2)
    // The novel with more views should be first
    expect(popularNovels.novels[0]?.totalViews).toBeGreaterThanOrEqual(
      popularNovels.novels[1]?.totalViews || 0
    )
  })

  it('should get novels by author', async () => {
    // Create another author with unique email
    const author2Result = await db
      .insert(users)
      .values({
        name: 'Second Author',
        email: `author2-${Date.now()}@example.com`, // Make email unique
        passwordHash: 'hashed_password',
        role: 'author'
      })
      .returning()
    const author2 = author2Result[0]

    await novelService.createNovel({
      title: 'First Author Novel',
      authorId: testAuthor.id,
      description: 'Novel by first author'
    })

    await novelService.createNovel({
      title: 'Second Author Novel',
      authorId: author2!.id,
      description: 'Novel by second author'
    })

    const authorNovels = await novelService.getNovelsByAuthor(testAuthor.id, {
      limit: 10
    })

    expect(authorNovels.novels.length).toBeGreaterThanOrEqual(1)
    expect(authorNovels.novels[0]?.author?.id).toBe(testAuthor.id)
  })

  it('should get recent novels', async () => {
    // Create novels with a small delay to ensure different timestamps
    await novelService.createNovel({
      title: 'First Novel',
      authorId: testAuthor.id,
      description: 'First created novel'
    })

    // Small delay
    await new Promise((resolve) => setTimeout(resolve, 10))

    await novelService.createNovel({
      title: 'Second Novel',
      authorId: testAuthor.id,
      description: 'Second created novel'
    })

    const recentNovels = await novelService.getRecentNovels({ limit: 10 })

    expect(recentNovels.novels.length).toBeGreaterThanOrEqual(2)
    // Most recent should be first
    const firstNovel = recentNovels.novels[0]
    const secondNovel = recentNovels.novels[1]
    if (firstNovel && secondNovel) {
      expect(new Date(firstNovel.createdAt!).getTime()).toBeGreaterThanOrEqual(
        new Date(secondNovel.createdAt!).getTime()
      )
    }
  })

  it('should increment novel views', async () => {
    const novelData = {
      title: 'Test Novel',
      authorId: testAuthor.id,
      description: 'A test novel'
    }

    const createdNovel = await novelService.createNovel(novelData)
    const initialViews = createdNovel?.totalViews || 0

    if (createdNovel) {
      await novelService.incrementNovelViews(createdNovel.id)
      const updatedNovel = await novelService.getNovelById(createdNovel.id)
      expect(updatedNovel?.totalViews).toBe(initialViews + 1)
    }
  })

  it('should delete novel', async () => {
    const novelData = {
      title: 'Test Novel',
      authorId: testAuthor.id,
      description: 'A test novel'
    }

    const createdNovel = await novelService.createNovel(novelData)

    if (createdNovel) {
      const deletedNovel = await novelService.deleteNovel(createdNovel.id)
      expect(deletedNovel).toBeDefined()

      // Should not find deleted novel
      const foundNovel = await novelService.getNovelById(createdNovel.id)
      expect(foundNovel).toBeNull()
    }
  })
})
