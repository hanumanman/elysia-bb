# Absolute Imports Implementation

## Overview

Updated the project to use absolute imports with `@` as an alias for the `src`
folder, improving code maintainability and reducing the complexity of relative
import paths.

## Changes Made

### TypeScript Configuration

- **File**: `tsconfig.json`
- **Changes**:
  - Added `baseUrl: "./"` configuration
  - Added path mapping: `"@/*": ["src/*"]`

### Source Files Updated

The following files were updated to use absolute imports where it makes sense:

#### Core Application

- `src/index.ts` - Updated imports for config, features, and shared plugins

#### Database Layer

- `src/db/index.ts` - Updated config import

#### Shared Components

- `src/shared/plugins/swagger.plugin.ts` - Updated config import
- `src/shared/services/response.service.ts` - Updated types import

#### Features - Health

- `src/features/health/controllers/health.controller.ts` - Updated config and
  response service imports

#### Features - Users

- `src/features/users/controllers/user.controller.ts` - Updated service import
- `src/features/users/services/user.service.ts` - Updated repository import
- `src/features/users/repositories/user.repository.ts` - Updated database
  imports

#### Features - Novels

- `src/features/novels/controllers/novel.controller.ts` - Updated service import
- `src/features/novels/services/novel.service.ts` - Updated repository import
- `src/features/novels/repositories/novel.repository.ts` - Updated database
  imports

## Import Strategy

### When to Use Absolute Imports

- Imports across different feature directories (e.g., from `features/users` to
  `shared/services`)
- Imports to root-level directories (`config`, `db`, `shared`)
- Deep nested imports that would require multiple `../` levels

### When to Keep Relative Imports

- Local imports within the same directory or close siblings (e.g., `./index`,
  `../model`)
- Test files (since they are outside the `src` directory)
- Barrel exports within the same feature/module

## Benefits

1. **Cleaner Imports**: No more deep relative paths like `../../../config`
2. **Better Refactoring**: Moving files doesn't break absolute import paths
3. **Improved Readability**: Clear indication of project structure
4. **IDE Support**: Better autocomplete and navigation

## Testing

- ✅ TypeScript compilation passes (`bun run type-check`)
- ✅ All tests pass (74/75 - one unrelated test failure)
- ✅ Application starts successfully
- ✅ Linting passes without warnings

## Notes

- Test files continue to use relative imports since they are outside the `src`
  directory
- Barrel exports (index.ts files) maintain relative imports for local exports
- The `@` alias specifically points to the `src` folder as per common convention

## Future Considerations

- Consider adding additional path aliases if the project grows (e.g.,
  `@/tests/*` for test utilities)
- Monitor for any build tool configuration needs (Bun handles TypeScript path
  mapping automatically)
