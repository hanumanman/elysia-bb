import { Elysia, t } from 'elysia'

class Note {
  constructor(public data: string[] = ['Moonhalo??']) {}

  add(note: string) {
    this.data.push(note)
    return this.data
  }

  remove(index: number) {
    return this.data.splice(index, 1)
  }

  update(index: number, note: string) {
    return (this.data[index] = note)
  }
}

// Each plugin is a separate instance of Elysia which has its own routes, middlewares, and decorators which can be applied to other instances.
export const notePlugin = new Elysia({ prefix: '/note' })
  .decorate('note', new Note())
  .get('/', ({ note }) => note.data)
  .get(
    '/:index',
    ({ note, params: { index }, status }) => {
      return note.data[index] ?? status('Not Found', 'Not Found intensifies')
    },
    {
      params: t.Object({
        index: t.Number()
      })
    }
  )
  .put(
    '/',
    ({ note, body: { data } }) => {
      return note.add(data)
    },
    {
      body: t.Object({
        data: t.String()
      })
    }
  )
  .patch(
    '/:index',
    (ctx) => {
      if (ctx.params.index in ctx.note.data)
        return ctx.note.update(ctx.params.index, ctx.body.data)

      return ctx.status('Unprocessable Content')
    },
    {
      params: t.Object({
        index: t.Number()
      }),
      body: t.Object({
        data: t.String()
      })
    }
  )
  .delete(
    '/:index',
    (ctx) => {
      if (ctx.params.index in ctx.note.data) {
        return ctx.note.remove(ctx.params.index)
      }
    },
    {
      params: t.Object({
        index: t.Number()
      })
    }
  )
