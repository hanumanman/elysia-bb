# Tests

This directory contains comprehensive tests for the Elysia API project using
Bun's built-in test runner.

## Test Structure

```text
tests/
├── app.integration.test.ts          # Full application integration tests
├── test-utils.ts                    # Shared test utilities and helpers
├── setup.ts                         # Test configuration and setup
├── features/
│   ├── health/
│   │   └── health.controller.test.ts # Health endpoint tests
│   └── notes/
│       ├── note.controller.test.ts  # Note controller/API tests
│       ├── note.service.test.ts     # Note service business logic tests
│       └── note.repository.test.ts  # Note repository data layer tests
└── shared/
    └── response.service.test.ts     # Shared response service tests
```

## Running Tests

### Run all tests

```bash
bun test
```

### Run tests in watch mode

```bash
bun test:watch
```

### Run specific test file

```bash
bun test tests/features/notes/note.controller.test.ts
```

### Run tests with pattern matching

```bash
bun test --grep "Note Controller"
```

## Test Categories

### 1. Unit Tests

- **Repository Tests**: Test data layer operations (CRUD operations, validation)
- **Service Tests**: Test business logic and integration with repositories
- **Response Service Tests**: Test standardized API response formatting

### 2. Integration Tests

- **Controller Tests**: Test HTTP endpoints, request/response handling, validation
- **App Integration Tests**: Test full application stack including middleware

### 3. Feature Coverage

#### Health Feature

- ✅ Health check endpoint
- ✅ Response format validation
- ✅ Uptime and environment reporting

#### Notes Feature

- ✅ Create, read, update, delete operations
- ✅ Input validation (empty content, etc.)
- ✅ Error handling for non-existent resources
- ✅ Repository data persistence
- ✅ Service business logic

#### Shared Components

- ✅ Response service formatting
- ✅ Middleware integration
- ✅ Swagger documentation endpoint

## Test Utilities

### `testRequest(app, method, path, body?)`

Helper function to make HTTP requests to Elysia app instances in tests.

### `parseJsonResponse(response)`

Helper to parse JSON responses and handle potential parsing errors.

### `testData`

Predefined test data for consistent testing across different test files.

## Important Notes

### Elysia-Specific Behavior

- **Validation Errors**: Elysia returns `422` status codes for validation
  errors, not `500`
- **Error Format**: Validation errors have `type: 'validation'` structure
- **Response Structure**: Success responses don't include top-level `timestamp`
  fields

### Repository Testing

- The `NoteRepository` uses in-memory storage with static methods
- Tests may interact with shared state - consider this when writing new tests
- Repository tests include timing-sensitive operations (like update timestamp
  validation)

### Test Isolation

- Each test file can run independently
- Repository tests share state across test methods in the same file
- Integration tests create fresh app instances for each test suite

## Adding New Tests

1. **Follow the existing structure**: Place tests in appropriate feature directories
2. **Use consistent naming**: `[feature].[layer].test.ts`
3. **Include comprehensive coverage**: Test happy paths, error cases, and edge cases
4. **Use test utilities**: Leverage existing helpers for consistency
5. **Document test purpose**: Use descriptive test names and comments

## Example Test Structure

```typescript
import { describe, it, expect } from 'bun:test'
import { testRequest, parseJsonResponse } from '../../test-utils'

describe('Feature Name', () => {
  describe('happy path scenarios', () => {
    it('should handle valid input correctly', async () => {
      // Test implementation
    })
  })

  describe('error scenarios', () => {
    it('should handle invalid input gracefully', async () => {
      // Test implementation
    })
  })

  describe('edge cases', () => {
    it('should handle boundary conditions', async () => {
      // Test implementation
    })
  })
})
```

## Test Coverage

The test suite covers:

- ✅ All HTTP endpoints (GET, POST, PUT, DELETE)
- ✅ Request/response validation
- ✅ Error handling and edge cases
- ✅ Business logic validation
- ✅ Data persistence operations
- ✅ Response formatting consistency
- ✅ Integration between layers
- ✅ Middleware functionality

## Performance

Current test suite performance:

- **55 tests** across 6 files
- **~170ms** total execution time
- **166 expect() calls**
- All tests passing ✅
