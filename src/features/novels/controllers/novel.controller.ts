import { Elysia } from 'elysia'
import {
  novelAuthorRoutes,
  novelCrudRoutes,
  novelDiscoveryRoutes,
  novelSearchRoutes
} from '../routes'

export const novelController = new Elysia({ prefix: '/novels' })
  .use(novelCrudRoutes)
  .use(novelDiscoveryRoutes)
  .use(novelSearchRoutes)
  .use(novelAuthorRoutes)
