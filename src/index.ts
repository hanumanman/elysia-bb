import { Elysia } from 'elysia'
import { config } from './config'
import { healthController, noteController } from './features'
import { swaggerPlugin } from './shared/plugins'

const app = new Elysia()
  .use(swaggerPlugin)
  .use(healthController)
  .use(noteController)
  .listen(config.server.port)

// oxlint-disable-next-line no-console
console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
