import { beforeEach, describe, expect, it } from 'bun:test'
import { eq } from 'drizzle-orm'
import { db, users } from '../../../src/db'
import { UserService } from '../../../src/features/users/services/user.service'

describe('UserService', () => {
  let userService: UserService

  beforeEach(async () => {
    userService = new UserService()

    // Clean up test data before each test
    await db.delete(users).where(eq(users.email, 'test@example.com'))
    await db.delete(users).where(eq(users.email, 'existing@example.com'))
  })

  it('should create a new user successfully', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      passwordHash: 'hashed_password'
    }

    const createdUser = await userService.createUser(userData)

    expect(createdUser).toBeDefined()
    expect(createdUser.name).toBe(userData.name)
    expect(createdUser.email).toBe(userData.email)
    expect(createdUser.role).toBe('reader')
  })

  it('should create user with specified role', async () => {
    const userData = {
      name: 'Author User',
      email: 'test@example.com',
      passwordHash: 'hashed_password',
      role: 'author' as const
    }

    const createdUser = await userService.createUser(userData)

    expect(createdUser.role).toBe('author')
  })

  it('should throw error when creating user with existing email', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      passwordHash: 'hashed_password'
    }

    await userService.createUser(userData)

    await expect(userService.createUser(userData)).rejects.toThrow(
      'User with this email already exists'
    )
  })

  it('should get user by id', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      passwordHash: 'hashed_password'
    }

    const createdUser = await userService.createUser(userData)
    const foundUser = await userService.getUserById(createdUser.id)

    expect(foundUser).toBeDefined()
    expect(foundUser?.id).toBe(createdUser.id)
    expect(foundUser?.email).toBe(userData.email)
  })

  it('should get user by email', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      passwordHash: 'hashed_password'
    }

    const createdUser = await userService.createUser(userData)
    const foundUser = await userService.getUserByEmail(userData.email)

    expect(foundUser).toBeDefined()
    expect(foundUser?.id).toBe(createdUser.id)
    expect(foundUser?.email).toBe(userData.email)
  })

  it('should update user', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      passwordHash: 'hashed_password'
    }

    const createdUser = await userService.createUser(userData)
    const updatedUser = await userService.updateUser(createdUser.id, {
      name: 'Updated User',
      role: 'author'
    })

    expect(updatedUser).toBeDefined()
    expect(updatedUser?.name).toBe('Updated User')
    expect(updatedUser?.role).toBe('author')
  })

  it('should delete user', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      passwordHash: 'hashed_password'
    }

    const createdUser = await userService.createUser(userData)
    const deletedUser = await userService.deleteUser(createdUser.id)

    expect(deletedUser).toBeDefined()
    expect(deletedUser?.deletedAt).toBeDefined()

    // Verify user cannot be found after deletion
    const foundUser = await userService.getUserById(createdUser.id)
    expect(foundUser).toBeNull()
  })

  it('should return null for non-existent user', async () => {
    const user = await userService.getUserById('non-existent-id')
    expect(user).toBeNull()
  })
})
