import { db, users } from '@/db'
import { UserRepository } from '@/features/users'
import { beforeEach, describe, expect, it } from 'bun:test'
import { eq } from 'drizzle-orm'

describe('UserRepository', () => {
  let userRepository: UserRepository

  beforeEach(async () => {
    userRepository = new UserRepository()

    // Clean up test data before each test
    await db.delete(users).where(eq(users.email, 'test@example.com'))
  })

  it('should create a new user', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      passwordHash: 'hashed_password',
      role: 'reader' as const
    }

    const createdUser = await userRepository.create(userData)

    expect(createdUser).toBeDefined()
    expect(createdUser.name).toBe(userData.name)
    expect(createdUser.email).toBe(userData.email)
    expect(createdUser.role).toBe(userData.role)
    expect(createdUser.id).toBeDefined()
    expect(createdUser.createdAt).toBeDefined()
  })

  it('should find user by id', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      passwordHash: 'hashed_password',
      role: 'reader' as const
    }

    const createdUser = await userRepository.create(userData)
    const foundUser = await userRepository.findById(createdUser.id)

    expect(foundUser).toBeDefined()
    expect(foundUser?.id).toBe(createdUser.id)
    expect(foundUser?.email).toBe(userData.email)
  })

  it('should find user by email', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      passwordHash: 'hashed_password',
      role: 'reader' as const
    }

    const createdUser = await userRepository.create(userData)
    const foundUser = await userRepository.findByEmail(userData.email)

    expect(foundUser).toBeDefined()
    expect(foundUser?.id).toBe(createdUser.id)
    expect(foundUser?.email).toBe(userData.email)
  })

  it('should update user', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      passwordHash: 'hashed_password',
      role: 'reader' as const
    }

    const createdUser = await userRepository.create(userData)
    const updatedUser = await userRepository.update(createdUser.id, {
      name: 'Updated Test User'
    })

    expect(updatedUser).toBeDefined()
    expect(updatedUser?.name).toBe('Updated Test User')
    expect(updatedUser?.email).toBe(userData.email)
  })

  it('should soft delete user', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      passwordHash: 'hashed_password',
      role: 'reader' as const
    }

    const createdUser = await userRepository.create(userData)
    const deletedUser = await userRepository.softDelete(createdUser.id)

    expect(deletedUser).toBeDefined()
    expect(deletedUser?.deletedAt).toBeDefined()

    // Verify user cannot be found after soft delete
    const foundUser = await userRepository.findById(createdUser.id)
    expect(foundUser).toBeNull()
  })

  it('should check if user exists', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      passwordHash: 'hashed_password',
      role: 'reader' as const
    }

    const exists1 = await userRepository.exists(userData.email)
    expect(exists1).toBe(false)

    await userRepository.create(userData)

    const exists2 = await userRepository.exists(userData.email)
    expect(exists2).toBe(true)
  })

  it('should return null for non-existent user', async () => {
    const user = await userRepository.findById('non-existent-id')
    expect(user).toBeNull()
  })
})
