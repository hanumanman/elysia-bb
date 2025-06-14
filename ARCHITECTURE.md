# Elysia Feature-Based Architecture

A scalable Elysia API server built with feature-based architecture following Elysia best practices.

## Project Structure

```
src/
├── config/                 # Application configuration
│   └── index.ts
├── features/              # Feature-based modules
│   ├── index.ts          # Features barrel export
│   ├── health/           # Health check feature
│   │   ├── controllers/
│   │   └── index.ts
│   └── notes/            # Notes management feature
│       ├── controllers/
│       ├── models/
│       ├── repositories/
│       ├── services/
│       ├── types/
│       └── index.ts
├── shared/               # Shared utilities across features
│   ├── models/          # Common validation models
│   ├── plugins/         # Shared plugins (swagger, etc.)
│   ├── services/        # Shared services (response, etc.)
│   ├── types/           # Common type definitions
│   └── index.ts
└── index.ts             # Application entry point
```

## Architecture Principles

### Feature-Based Organization

- Each feature is self-contained in its own folder
- Features include controllers, services, models, types, and repositories
- Easy to add, remove, or modify features without affecting others

### Elysia Best Practices

- **Controllers**: Use Elysia instances as controllers (1 instance = 1 controller)
- **Services**: Use Elysia instances for request-dependent services with proper naming
- **Models**: Use model references for type safety and OpenAPI generation
- **Plugins**: Properly named plugins with deduplication support
- **Encapsulation**: Proper scope management (`global`, `scoped`, `local`)

### Scalability Features

- Centralized configuration management
- Standardized response format
- Shared validation models
- Plugin-based architecture
- Type safety throughout

## Getting Started

1. Install dependencies:

```bash
bun install
```

2. Start development server:

```bash
bun run dev
```

3. View API documentation:
   Open http://localhost:6969/swagger

## API Endpoints

### Health Check

- `GET /health` - Health status
- `GET /health/ping` - Simple ping endpoint

### Notes

- `GET /notes` - Get all notes
- `GET /notes/:id` - Get note by ID
- `POST /notes` - Create new note
- `PUT /notes/:id` - Update note
- `DELETE /notes/:id` - Delete note

## Adding New Features

1. Create a new folder under `src/features/`
2. Follow the same structure as existing features:
   - `controllers/` - HTTP request handlers
   - `services/` - Business logic
   - `models/` - Validation schemas
   - `types/` - TypeScript interfaces
   - `repositories/` - Data access layer (if needed)
3. Export the main controller in the feature's `index.ts`
4. Add the controller to `src/features/index.ts`
5. Import and use in `src/index.ts`

## Configuration

Environment variables can be set to configure the application:

- `PORT` - Server port (default: 6969)
- `HOST` - Server host (default: localhost)
- `NODE_ENV` - Environment (default: development)
- `CORS_ORIGIN` - CORS origin (default: \*)
- `CORS_CREDENTIALS` - Enable CORS credentials (default: false)

## Scripts

- `bun run dev` - Start development server with watch mode
- `bun run format` - Format code with Prettier
- `bun run lint` - Lint code with oxlint
