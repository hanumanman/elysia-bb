import { swagger } from '@elysiajs/swagger'
import { Elysia } from 'elysia'
import { notePlugin } from './routes/notes/notes.index'

const PORT = 6969

const app = new Elysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: 'Elysia Documentation',
          version: '1.0.0'
        }
      },
      scalarConfig: {
        layout: 'classic'
      }
    })
  )
  .use(notePlugin)
  .listen(PORT)

// oxlint-disable-next-line no-console
console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
