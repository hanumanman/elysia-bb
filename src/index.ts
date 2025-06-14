import { Elysia } from 'elysia'
import { config } from './config'
import { healthController, novelController, userController } from './features'
import { swaggerPlugin } from './shared/plugins'

const app = new Elysia()
  .use(swaggerPlugin)
  .use(healthController)
  .use(userController)
  .use(novelController)
  .listen(config.server.port)

// oxlint-disable-next-line no-console
console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
