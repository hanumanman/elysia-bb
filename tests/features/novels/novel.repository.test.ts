import { categories, db, novels, tags, users } from '@/db'
import { NovelRepository } from '@/features/novels'
import { beforeEach, describe, expect, it } from 'bun:test'
import { eq } from 'drizzle-orm'

describe('NovelRepository', () => {
  let novelRepository: NovelRepository
  let testAuthor: any
  let testCategory: any
  let testTag: any

  beforeEach(async () => {
    novelRepository = new NovelRepository()

    // Clean up test data before each test - clean all test novels
    await db.delete(novels)
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

  it('should create a new novel', async () => {
    const novelData = {
      title: 'Test Novel',
      authorId: testAuthor.id,
      description: 'A test novel description',
      language: 'en',
      status: 'ongoing' as const
    }

    const createdNovel = await novelRepository.create(novelData)

    expect(createdNovel).toBeDefined()
    expect(createdNovel.title).toBe(novelData.title)
    expect(createdNovel.authorId).toBe(novelData.authorId)
    expect(createdNovel.description).toBe(novelData.description)
    expect(createdNovel.language).toBe(novelData.language)
    expect(createdNovel.status).toBe(novelData.status)
    expect(createdNovel.id).toBeDefined()
    expect(createdNovel.createdAt).toBeDefined()
  })

  it('should find novel by id with author information', async () => {
    const novelData = {
      title: 'Test Novel',
      authorId: testAuthor.id,
      description: 'A test novel description'
    }

    const createdNovel = await novelRepository.create(novelData)
    const foundNovel = await novelRepository.findById(createdNovel.id)

    expect(foundNovel).toBeDefined()
    expect(foundNovel?.novel.id).toBe(createdNovel.id)
    expect(foundNovel?.novel.title).toBe(novelData.title)
    expect(foundNovel?.author?.id).toBe(testAuthor.id)
    expect(foundNovel?.author?.name).toBe(testAuthor.name)
  })

  it('should find many novels with pagination', async () => {
    // Create multiple test novels
    const novels = []
    for (let i = 1; i <= 5; i++) {
      const novel = await novelRepository.create({
        title: `Test Novel ${i}`,
        authorId: testAuthor.id,
        description: `Test novel ${i} description`
      })
      novels.push(novel)
    }

    const result = await novelRepository.findMany({ limit: 3, offset: 0 })

    expect(result).toBeDefined()
    expect(result.length).toBe(3)
    expect(result[0]?.novel.title).toContain('Test Novel')
    expect(result[0]?.author?.id).toBe(testAuthor.id)
  })

  it('should count novels with filters', async () => {
    // Create test novels with different statuses
    await novelRepository.create({
      title: 'Ongoing Novel',
      authorId: testAuthor.id,
      status: 'ongoing'
    })

    await novelRepository.create({
      title: 'Completed Novel',
      authorId: testAuthor.id,
      status: 'completed'
    })

    const ongoingCount = await novelRepository.count({ status: 'ongoing' })
    const completedCount = await novelRepository.count({ status: 'completed' })

    expect(ongoingCount).toBeGreaterThanOrEqual(1)
    expect(completedCount).toBeGreaterThanOrEqual(1)
  })

  it('should update novel information', async () => {
    const novelData = {
      title: 'Test Novel',
      authorId: testAuthor.id,
      description: 'Original description'
    }

    const createdNovel = await novelRepository.create(novelData)
    const updatedData = {
      title: 'Updated Test Novel',
      description: 'Updated description',
      status: 'completed' as const
    }

    const updatedNovel = await novelRepository.update(createdNovel.id, updatedData)

    expect(updatedNovel).toBeDefined()
    expect(updatedNovel?.title).toBe(updatedData.title)
    expect(updatedNovel?.description).toBe(updatedData.description)
    expect(updatedNovel?.status).toBe(updatedData.status)
  })

  it('should soft delete a novel', async () => {
    const novelData = {
      title: 'Test Novel',
      authorId: testAuthor.id,
      description: 'A test novel'
    }

    const createdNovel = await novelRepository.create(novelData)
    const deletedNovel = await novelRepository.softDelete(createdNovel.id)

    expect(deletedNovel).toBeDefined()
    expect(deletedNovel?.deletedAt).toBeDefined()

    // Should not find deleted novel
    const foundNovel = await novelRepository.findById(createdNovel.id)
    expect(foundNovel).toBeNull()
  })

  it('should add and retrieve categories for a novel', async () => {
    const novelData = {
      title: 'Test Novel',
      authorId: testAuthor.id,
      description: 'A test novel'
    }

    const createdNovel = await novelRepository.create(novelData)
    await novelRepository.addCategories(createdNovel.id, [testCategory.id])

    const categories = await novelRepository.getNovelCategories(createdNovel.id)

    expect(categories).toBeDefined()
    expect(categories.length).toBe(1)
    expect(categories[0]?.id).toBe(testCategory.id)
    expect(categories[0]?.name).toBe(testCategory.name)
  })

  it('should add and retrieve tags for a novel', async () => {
    const novelData = {
      title: 'Test Novel',
      authorId: testAuthor.id,
      description: 'A test novel'
    }

    const createdNovel = await novelRepository.create(novelData)
    await novelRepository.addTags(createdNovel.id, [testTag.id])

    const tags = await novelRepository.getNovelTags(createdNovel.id)

    expect(tags).toBeDefined()
    expect(tags.length).toBe(1)
    expect(tags[0]?.id).toBe(testTag.id)
    expect(tags[0]?.name).toBe(testTag.name)
  })

  it('should increment novel views', async () => {
    const novelData = {
      title: 'Test Novel',
      authorId: testAuthor.id,
      description: 'A test novel'
    }

    const createdNovel = await novelRepository.create(novelData)
    const initialViews = createdNovel.totalViews

    await novelRepository.incrementViews(createdNovel.id)

    const updatedNovel = await novelRepository.findById(createdNovel.id)
    expect(updatedNovel?.novel.totalViews).toBe(initialViews + 1)
  })

  it('should search novels by title and description', async () => {
    await novelRepository.create({
      title: 'Fantasy Adventure',
      authorId: testAuthor.id,
      description: 'A magical journey through enchanted lands'
    })

    await novelRepository.create({
      title: 'Science Fiction Story',
      authorId: testAuthor.id,
      description: 'Space exploration and alien encounters'
    })

    const fantasyResults = await novelRepository.findMany({ search: 'Fantasy' })
    const magicalResults = await novelRepository.findMany({ search: 'magical' })

    expect(fantasyResults.length).toBeGreaterThanOrEqual(1)
    expect(fantasyResults[0]?.novel.title).toContain('Fantasy')

    expect(magicalResults.length).toBeGreaterThanOrEqual(1)
    expect(magicalResults[0]?.novel.description).toContain('magical')
  })
})
