import { Elysia } from 'elysia'
import { userCrudRoutes, userLookupRoutes } from '../routes'

export const userController = new Elysia({ prefix: '/users' })
  .use(userCrudRoutes)
  .use(userLookupRoutes)
