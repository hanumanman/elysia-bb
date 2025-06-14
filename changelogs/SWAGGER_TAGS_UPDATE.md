# Swagger Tags Update

## Date: June 14, 2025

## Overview

Updated the Swagger documentation to properly organize API endpoints by removing
the obsolete "notes" tag and grouping all novel and user operations under their
respective "novels" and "users" tags.

## Changes Made

### 1. Swagger Configuration Update

**File**: `src/shared/plugins/swagger.plugin.ts`

- ❌ Removed: `notes` tag (was: "Note management operations")
- ✅ Added: `novels` tag - "Novel management operations"
- ✅ Added: `users` tag - "User management operations"

### 2. Novel Controller Updates

**File**: `src/features/novels/controllers/novel.controller.ts`
Added `detail` property with tags and documentation to all novel endpoints:

- **GET /novels** - `novels` tag

  - Summary: "Get all novels"
  - Description: "Retrieve a paginated list of novels with optional filtering
    and sorting"

- **GET /novels/:id** - `novels` tag

  - Summary: "Get novel by ID"
  - Description: "Retrieve a specific novel by its ID and increment view count"

- **POST /novels** - `novels` tag

  - Summary: "Create a new novel"
  - Description: "Create a new novel with the provided information"

- **PUT /novels/:id** - `novels` tag

  - Summary: "Update a novel"
  - Description: "Update an existing novel with the provided information"

- **DELETE /novels/:id** - `novels` tag

  - Summary: "Delete a novel"
  - Description: "Soft delete a novel by its ID"

- **GET /novels/popular** - `novels` tag

  - Summary: "Get popular novels"
  - Description: "Retrieve novels sorted by total views (most popular first)"

- **GET /novels/top-rated** - `novels` tag

  - Summary: "Get top-rated novels"
  - Description: "Retrieve novels sorted by average rating (highest rated
    first)"

- **GET /novels/recent** - `novels` tag

  - Summary: "Get recent novels"
  - Description: "Retrieve novels sorted by creation date (newest first)"

- **GET /novels/recently-updated** - `novels` tag

  - Summary: "Get recently updated novels"
  - Description: "Retrieve novels sorted by last update date (most recently
    updated first)"

- **GET /novels/author/:authorId** - `novels` tag

  - Summary: "Get novels by author"
  - Description: "Retrieve all novels written by a specific author"

- **GET /novels/search/:searchTerm** - `novels` tag
  - Summary: "Search novels"
  - Description: "Search for novels by title, description, or other criteria"

### 3. User Controller Updates

**File**: `src/features/users/controllers/user.controller.ts`
Added `detail` property with tags and documentation to all user endpoints:

- **GET /users/:id** - `users` tag

  - Summary: "Get user by ID"
  - Description: "Retrieve a specific user by their ID (excludes sensitive
    data)"

- **POST /users** - `users` tag

  - Summary: "Create a new user"
  - Description: "Create a new user account with the provided information"

- **GET /users/email/:email** - `users` tag
  - Summary: "Get user by email"
  - Description: "Retrieve a specific user by their email address (excludes
    sensitive data)"

### 4. Health Controller (No Changes Needed)

**File**: `src/features/health/controllers/health.controller.ts`
The health controller already had proper tagging with the `health` tag, so no
changes were required.

## Validation

### Tests

- ✅ All existing tests continue to pass (69 tests passed)
- ✅ No breaking changes to functionality

### Code Quality

- ✅ Linting: No warnings or errors
- ✅ Formatting: Code properly formatted
- ✅ Type checking: No TypeScript errors

## Impact

### Swagger Documentation

- The Swagger UI now properly groups all endpoints under logical categories:
  - **Health**: Health check operations
  - **Novels**: All novel-related operations (11 endpoints)
  - **Users**: All user-related operations (3 endpoints)
- Removed obsolete "notes" tag that was no longer relevant
- Each endpoint now has clear summaries and descriptions for better API
  discoverability

### Developer Experience

- Better organized API documentation
- Clearer endpoint grouping in Swagger UI
- Improved API documentation readability
- More descriptive endpoint summaries and descriptions

## Notes

- The changes are backward compatible
- All existing functionality remains intact
- The update only affects the Swagger documentation presentation
- The `health` tag was already properly configured and required no changes
