/* eslint-disable no-console */
import { UserService } from '@/features/users/services/user.service'
import { Elysia, t } from 'elysia'

const userService = new UserService()

export const userCrudRoutes = new Elysia()
  .get(
    '/:id',
    async ({ params: { id }, set }) => {
      try {
        const user = await userService.getUserById(id)
        if (!user) {
          set.status = 404
          return { error: 'User not found' }
        }

        // Don't return sensitive data
        const { passwordHash: _, ...safeUser } = user
        return safeUser
      } catch (error) {
        console.error('Error fetching user by ID:', error)
        set.status = 500
        return { error: 'Internal server error' }
      }
    },
    {
      params: t.Object({
        id: t.String()
      }),
      detail: {
        tags: ['users'],
        summary: 'Get user by ID',
        description: 'Retrieve a specific user by their ID (excludes sensitive data)'
      }
    }
  )

  .post(
    '/',
    async ({ body, set }) => {
      try {
        const user = await userService.createUser(body)
        const { passwordHash: _, ...safeUser } = user
        set.status = 201
        return safeUser
      } catch (error) {
        set.status = 400
        return { error: error instanceof Error ? error.message : 'Failed to create user' }
      }
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String({ format: 'email' }),
        passwordHash: t.String(),
        role: t.Optional(
          t.Union([t.Literal('reader'), t.Literal('author'), t.Literal('admin')])
        )
      }),
      detail: {
        tags: ['users'],
        summary: 'Create a new user',
        description: 'Create a new user account with the provided information'
      }
    }
  )
