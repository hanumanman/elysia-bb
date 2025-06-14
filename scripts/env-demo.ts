#!/usr/bin/env bun

/**
 * Demo script to show environment validation in action
 * This script demonstrates what happens when required environment variables are missing
 */

/* eslint-disable no-console */

console.log('🔧 Environment Validation Demo\n')

// Test 1: Missing DATABASE_URL
console.log('Test 1: Missing DATABASE_URL')
console.log('Setting up environment without DATABASE_URL...')

const originalDatabaseUrl = process.env.DATABASE_URL
delete process.env.DATABASE_URL

try {
  // Clear module cache and try to import
  delete require.cache[require.resolve('../src/config/env')]
  require('../src/config/env')
  console.log('❌ Should have failed but did not')
} catch {
  console.log('✅ Correctly caught missing DATABASE_URL')
}

// Restore DATABASE_URL
process.env.DATABASE_URL = originalDatabaseUrl || 'file:./dev.db'

console.log('\n' + '='.repeat(50) + '\n')

// Test 2: Production environment without JWT_SECRET
console.log('Test 2: Production without JWT_SECRET')
console.log('Setting NODE_ENV=production without JWT_SECRET...')

const originalNodeEnv = process.env.NODE_ENV
const originalJwtSecret = process.env.JWT_SECRET

process.env.NODE_ENV = 'production'
delete process.env.JWT_SECRET

try {
  // Clear module cache and try to import
  delete require.cache[require.resolve('../src/config/env')]
  require('../src/config/env')
  console.log('❌ Should have failed but did not')
} catch {
  console.log('✅ Correctly caught missing JWT_SECRET in production')
}

// Restore original values
process.env.NODE_ENV = originalNodeEnv || 'development'
if (originalJwtSecret) {
  process.env.JWT_SECRET = originalJwtSecret
}

console.log('\n' + '='.repeat(50) + '\n')

// Test 3: Valid environment
console.log('Test 3: Valid environment')
console.log('Setting up valid environment...')

process.env.DATABASE_URL = 'file:./dev.db'
process.env.NODE_ENV = 'development'

try {
  // Clear module cache and try to import
  delete require.cache[require.resolve('../src/config/env')]
  const { env } = require('../src/config/env')
  console.log('✅ Environment validation passed!')
  console.log(`   DATABASE_URL: ${env.DATABASE_URL}`)
  console.log(`   NODE_ENV: ${env.NODE_ENV}`)
  console.log(`   PORT: ${env.PORT}`)
} catch (error) {
  console.log(
    '❌ Unexpected error:',
    error instanceof Error ? error.message : String(error)
  )
}

console.log('\n🎉 Demo completed!')
