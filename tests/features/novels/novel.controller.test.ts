import { categories, db, novels, tags, users } from '@/db'
import { novelController } from '@/features'
import { beforeEach, describe, expect, it } from 'bun:test'
import { eq } from 'drizzle-orm'
import { Elysia } from 'elysia'

describe('NovelController', () => {
  let app: Elysia
  let testAuthor: any
  let testCategory: any
  let testTag: any

  beforeEach(async () => {
    app = new Elysia().use(novelController)

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

  it('should create a novel via POST /novels', async () => {
    const novelData = {
      title: 'Test Novel',
      authorId: testAuthor.id,
      description: 'A test novel description',
      language: 'en',
      status: 'ongoing',
      categoryIds: [testCategory.id],
      tagIds: [testTag.id]
    }

    const response = await app.handle(
      new Request('http://localhost/novels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novelData)
      })
    )

    expect(response.status).toBe(201)
    const result = await response.json()
    expect(result.title).toBe(novelData.title)
    expect(result.author.id).toBe(testAuthor.id)
    expect(result.categories).toBeDefined()
    expect(result.tags).toBeDefined()
  })

  it('should get novels via GET /novels', async () => {
    // Create test novels first
    const _novel1 = await db
      .insert(novels)
      .values({
        title: 'First Novel',
        authorId: testAuthor.id,
        description: 'First test novel'
      })
      .returning()

    const _novel2 = await db
      .insert(novels)
      .values({
        title: 'Second Novel',
        authorId: testAuthor.id,
        description: 'Second test novel'
      })
      .returning()

    const response = await app.handle(
      new Request('http://localhost/novels?page=1&limit=10')
    )

    expect(response.status).toBe(200)
    const result = await response.json()
    expect(result.novels).toBeDefined()
    expect(result.pagination).toBeDefined()
    expect(result.novels.length).toBeGreaterThanOrEqual(2)
    expect(result.pagination.page).toBe(1)
    expect(result.pagination.limit).toBe(10)
  })

  it('should get a novel by id via GET /novels/:id', async () => {
    const novelResult = await db
      .insert(novels)
      .values({
        title: 'Test Novel',
        authorId: testAuthor.id,
        description: 'A test novel'
      })
      .returning()
    const novel = novelResult[0]

    const response = await app.handle(new Request(`http://localhost/novels/${novel!.id}`))

    expect(response.status).toBe(200)
    const result = await response.json()
    expect(result.id).toBe(novel!.id)
    expect(result.title).toBe('Test Novel')
    expect(result.author.id).toBe(testAuthor.id)
  })

  it('should return 404 for non-existent novel', async () => {
    const response = await app.handle(
      new Request('http://localhost/novels/non-existent-id')
    )

    expect(response.status).toBe(404)
    const result = await response.json()
    expect(result.error).toBe('Novel not found')
  })

  it('should update a novel via PUT /novels/:id', async () => {
    const novelResult = await db
      .insert(novels)
      .values({
        title: 'Original Title',
        authorId: testAuthor.id,
        description: 'Original description'
      })
      .returning()
    const novel = novelResult[0]

    const updateData = {
      title: 'Updated Title',
      description: 'Updated description',
      status: 'completed',
      categoryIds: [testCategory.id]
    }

    const response = await app.handle(
      new Request(`http://localhost/novels/${novel!.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })
    )

    expect(response.status).toBe(200)
    const result = await response.json()
    expect(result.title).toBe(updateData.title)
    expect(result.description).toBe(updateData.description)
    expect(result.status).toBe(updateData.status)
  })

  it('should delete a novel via DELETE /novels/:id', async () => {
    const novelResult = await db
      .insert(novels)
      .values({
        title: 'To Be Deleted',
        authorId: testAuthor.id,
        description: 'This novel will be deleted'
      })
      .returning()
    const novel = novelResult[0]

    const response = await app.handle(
      new Request(`http://localhost/novels/${novel!.id}`, {
        method: 'DELETE'
      })
    )

    expect(response.status).toBe(200)
    const result = await response.json()
    expect(result.message).toBe('Novel deleted successfully')
  })

  it('should get popular novels via GET /novels/popular', async () => {
    // Create novels with different view counts
    const _novel1 = await db
      .insert(novels)
      .values({
        title: 'Popular Novel',
        authorId: testAuthor.id,
        description: 'Very popular',
        totalViews: 1000
      })
      .returning()

    const _novel2 = await db
      .insert(novels)
      .values({
        title: 'Less Popular Novel',
        authorId: testAuthor.id,
        description: 'Less popular',
        totalViews: 100
      })
      .returning()

    const response = await app.handle(
      new Request('http://localhost/novels/popular?page=1&limit=10')
    )

    expect(response.status).toBe(200)
    const result = await response.json()
    expect(result.novels).toBeDefined()
    expect(result.novels.length).toBeGreaterThanOrEqual(2)
    // Should be sorted by views (highest first)
    expect(result.novels[0].totalViews).toBeGreaterThanOrEqual(
      result.novels[1].totalViews
    )
  })

  it('should get novels by author via GET /novels/author/:authorId', async () => {
    // Create another author with a unique email
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

    await db.insert(novels).values({
      title: 'First Author Novel',
      authorId: testAuthor.id,
      description: 'By first author'
    })

    await db.insert(novels).values({
      title: 'Second Author Novel',
      authorId: author2!.id,
      description: 'By second author'
    })

    const response = await app.handle(
      new Request(`http://localhost/novels/author/${testAuthor.id}?page=1&limit=10`)
    )

    expect(response.status).toBe(200)
    const result = await response.json()
    expect(result.novels).toBeDefined()
    expect(result.novels.length).toBeGreaterThanOrEqual(1)
    expect(result.novels[0].author.id).toBe(testAuthor.id)
  })

  it('should search novels via GET /novels/search/:searchTerm', async () => {
    await db.insert(novels).values({
      title: 'Fantasy Adventure',
      authorId: testAuthor.id,
      description: 'A magical story'
    })

    await db.insert(novels).values({
      title: 'Science Fiction',
      authorId: testAuthor.id,
      description: 'Space exploration'
    })

    const response = await app.handle(
      new Request('http://localhost/novels/search/Fantasy?page=1&limit=10')
    )

    expect(response.status).toBe(200)
    const result = await response.json()
    expect(result.novels).toBeDefined()
    expect(result.novels.length).toBeGreaterThanOrEqual(1)
    expect(result.novels[0].title).toContain('Fantasy')
  })

  it('should get recent novels via GET /novels/recent', async () => {
    await db.insert(novels).values({
      title: 'Recent Novel 1',
      authorId: testAuthor.id,
      description: 'Recently created'
    })

    await db.insert(novels).values({
      title: 'Recent Novel 2',
      authorId: testAuthor.id,
      description: 'Also recently created'
    })

    const response = await app.handle(
      new Request('http://localhost/novels/recent?page=1&limit=10')
    )

    expect(response.status).toBe(200)
    const result = await response.json()
    expect(result.novels).toBeDefined()
    expect(result.novels.length).toBeGreaterThanOrEqual(2)
  })

  it('should validate request body for novel creation', async () => {
    const invalidData = {
      title: '', // Empty title should be invalid
      authorId: testAuthor.id
    }

    const response = await app.handle(
      new Request('http://localhost/novels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData)
      })
    )

    expect(response.status).toBe(422) // Elysia returns 422 for validation errors
  })

  it('should handle query parameters for filtering novels', async () => {
    // Create novels with different statuses
    await db.insert(novels).values({
      title: 'Ongoing Novel',
      authorId: testAuthor.id,
      description: 'Still writing',
      status: 'ongoing'
    })

    await db.insert(novels).values({
      title: 'Completed Novel',
      authorId: testAuthor.id,
      description: 'Finished writing',
      status: 'completed'
    })

    const response = await app.handle(
      new Request('http://localhost/novels?status=ongoing&page=1&limit=10')
    )

    expect(response.status).toBe(200)
    const result = await response.json()
    expect(result.novels).toBeDefined()
    expect(result.novels.length).toBeGreaterThanOrEqual(1)
    expect(result.novels[0].status).toBe('ongoing')
  })
})
