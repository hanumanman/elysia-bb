import { db, users } from '@/db'
import { userController } from '@/features'
import { beforeEach, describe, expect, it } from 'bun:test'
import { eq } from 'drizzle-orm'
import { Elysia } from 'elysia'

describe('UserController', () => {
  let app: Elysia

  beforeEach(async () => {
    app = new Elysia().use(userController)

    // Clean up test data before each test
    await db.delete(users).where(eq(users.email, 'test@example.com'))
  })

  it('should create a new user via POST /users', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      passwordHash: 'hashed_password',
      role: 'reader'
    }

    const response = await app.handle(
      new Request('http://localhost/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })
    )

    expect(response.status).toBe(201)

    const result = await response.json()
    expect(result.name).toBe(userData.name)
    expect(result.email).toBe(userData.email)
    expect(result.role).toBe(userData.role)
    expect(result.passwordHash).toBeUndefined() // Should not return password hash
  })

  it('should get user by id via GET /users/:id', async () => {
    // First create a user
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      passwordHash: 'hashed_password'
    }

    const createResponse = await app.handle(
      new Request('http://localhost/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })
    )

    const createdUser = await createResponse.json()

    // Then get the user by id
    const getResponse = await app.handle(
      new Request(`http://localhost/users/${createdUser.id}`)
    )

    expect(getResponse.status).toBe(200)

    const result = await getResponse.json()
    expect(result.id).toBe(createdUser.id)
    expect(result.name).toBe(userData.name)
    expect(result.email).toBe(userData.email)
    expect(result.passwordHash).toBeUndefined() // Should not return password hash
  })

  it('should get user by email via GET /users/email/:email', async () => {
    // First create a user
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      passwordHash: 'hashed_password'
    }

    await app.handle(
      new Request('http://localhost/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })
    )

    // Then get the user by email
    const getResponse = await app.handle(
      new Request(`http://localhost/users/email/${userData.email}`)
    )

    expect(getResponse.status).toBe(200)

    const result = await getResponse.json()
    expect(result.name).toBe(userData.name)
    expect(result.email).toBe(userData.email)
    expect(result.passwordHash).toBeUndefined() // Should not return password hash
  })

  it('should return 404 for non-existent user id', async () => {
    const response = await app.handle(
      new Request('http://localhost/users/non-existent-id')
    )

    expect(response.status).toBe(404)

    const result = await response.json()
    expect(result.error).toBe('User not found')
  })

  it('should return 404 for non-existent user email', async () => {
    const response = await app.handle(
      new Request('http://localhost/users/email/nonexistent@example.com')
    )

    expect(response.status).toBe(404)

    const result = await response.json()
    expect(result.error).toBe('User not found')
  })

  it('should return 400 when creating user with existing email', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      passwordHash: 'hashed_password'
    }

    // Create first user
    await app.handle(
      new Request('http://localhost/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })
    )

    // Try to create second user with same email
    const response = await app.handle(
      new Request('http://localhost/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })
    )

    expect(response.status).toBe(400)

    const result = await response.json()
    expect(result.error).toBe('User with this email already exists')
  })
})
