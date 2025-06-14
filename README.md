# Elysia with Feature-Based Architecture

A scalable Elysia API server built with feature-based architecture following Elysia best practices.

## Features

- 🚀 **Scalable Architecture** - Feature-based organization for easy maintainability
- 📝 **Notes API** - Full CRUD operations for note management
- ❤️ **Health Checks** - System health monitoring endpoints
- 📖 **Auto Documentation** - Swagger/Scalar UI for API documentation
- 🔒 **Type Safety** - End-to-end TypeScript type safety
- ⚡ **Performance** - Built with Elysia and Bun for maximum performance

## Getting Started

To get started with this template, simply paste this command into your terminal:

```bash
bun create elysia ./elysia-example
```

## Development

To start the development server run:

```bash
bun run dev
```

Open http://localhost:6969/swagger with your browser to see the API documentation.

## API Endpoints

### Health Check

- `GET /health` - Detailed health status
- `GET /health/ping` - Simple ping endpoint

### Notes Management

- `GET /notes` - Get all notes
- `GET /notes/:id` - Get note by ID
- `POST /notes` - Create new note
- `PUT /notes/:id` - Update note
- `DELETE /notes/:id` - Delete note

## Project Structure

```
src/
├── config/                 # Application configuration
├── features/              # Feature-based modules
│   ├── health/           # Health check feature
│   └── notes/            # Notes management feature
├── shared/               # Shared utilities
│   ├── models/          # Common validation models
│   ├── plugins/         # Shared plugins
│   ├── services/        # Shared services
│   └── types/           # Common types
└── index.ts             # Application entry point
```

## Documentation

- [Architecture Guide](./ARCHITECTURE.md) - Detailed architecture explanation
- [Migration Guide](./MIGRATION.md) - Guide for migrating from old structure

## Scripts

- `bun run dev` - Start development server with watch mode
- `bun run format` - Format code with Prettier
- `bun run lint` - Lint code with oxlint
