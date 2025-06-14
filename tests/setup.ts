/**
 * Test configuration for Bun test runner
 *
 * This file can be used to configure global test settings,
 * setup, and teardown for the test suite.
 */

// Global test setup
// Setting up test environment...

// You can add global setup here if needed
// For example: database connections, mock services, etc.

// Export test configuration if needed
export const testConfig = {
  timeout: 10000, // 10 seconds timeout for tests
  retries: 2 // Retry failed tests up to 2 times
}

// Add any global test utilities or mocks here
export const globalMocks = {
  // Add global mocks if needed
}
