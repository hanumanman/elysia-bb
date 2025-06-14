/**
 * Test utilities for Elysia testing
 */

/**
 * Test utilities for Elysia testing
 */

/**
 * Helper to make test requests easier using Elysia's handle method
 */
export async function testRequest(app: any, method: string, path: string, body?: any) {
  const request = new Request(`http://localhost${path}`, {
    method: method.toUpperCase(),
    headers: {
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  })

  return await app.handle(request)
}

/**
 * Helper to parse JSON response
 */
export async function parseJsonResponse(response: Response) {
  const text = await response.text()
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

/**
 * Test data generators
 */
export const testData = {
  note: {
    create: {
      title: 'Test Note',
      content: 'This is a test note content'
    },
    update: {
      title: 'Updated Test Note',
      content: 'This is updated test note content'
    },
    invalid: {
      empty: {
        title: '',
        content: ''
      },
      noContent: {
        title: 'Test Note',
        content: ''
      }
    }
  }
}
