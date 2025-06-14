import { config } from '@/config'
import { healthController, novelController, userController } from '@/features'
import { swaggerPlugin } from '@/shared/plugins'
import { Elysia } from 'elysia'

const app = new Elysia()
  .use(swaggerPlugin)
  .use(healthController)
  .use(userController)
  .use(novelController)
  .listen(config.server.port)

// oxlint-disable-next-line no-console
console.log(
  `📓 Blackbook backend is running at ${app.server?.hostname}:${app.server?.port}`
)
