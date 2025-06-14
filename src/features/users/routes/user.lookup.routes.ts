/* eslint-disable no-console */
import { UserService } from '@/features/users/services/user.service'
import { Elysia, t } from 'elysia'

const userService = new UserService()

export const userLookupRoutes = new Elysia().get(
  '/email/:email',
  async ({ params: { email }, set }) => {
    try {
      const user = await userService.getUserByEmail(email)
      if (!user) {
        set.status = 404
        return { error: 'User not found' }
      }

      const { passwordHash: _, ...safeUser } = user
      return safeUser
    } catch (error) {
      console.error('Error fetching user by email:', error)
      set.status = 500
      return { error: 'Internal server error' }
    }
  },
  {
    params: t.Object({
      email: t.String({ format: 'email' })
    }),
    detail: {
      tags: ['users'],
      summary: 'Get user by email',
      description:
        'Retrieve a specific user by their email address (excludes sensitive data)'
    }
  }
)
