# Blackbook Backend

A novel reading platform API built with
[Elysia](https://elysiajs.com/) and TypeScript, featuring a clean feature-based
architecture and comprehensive database integration.

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) runtime
- SQLite database

### Installation

```fish
# Clone the repository
git clone <repository-url>
cd elysia-bb

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Set up database
bun run db:generate
bun run db:migrate
bun run db:seed

# Start development server
bun run dev
```

The API will be available at `http://localhost:6969` with interactive Swagger
documentation.

## 📁 Project Structure

This project follows a feature-based architecture pattern for better
scalability and maintainability:

```text
src/
├── config/           # Application configuration & environment
├── db/              # Database layer (schema, migrations, seed)
├── features/        # Feature modules (users, novels, health)
│   ├── health/      # Health check endpoints
│   ├── novels/      # Novel management system
│   └── users/       # User management & authentication
├── shared/          # Shared utilities, plugins, and services
└── index.ts         # Application entry point
```

For detailed architecture information, see
[Architecture Documentation](./changelogs/ARCHITECTURE.md).

## 🎯 Features

### Core Functionality

- **User Management**: Registration, authentication, and user profiles
- **Novel System**: Complete novel reading platform with chapters, genres, and
  metadata
- **Health Monitoring**: API health checks and system status

### Technical Features

- **Type Safety**: Full TypeScript implementation with Zod validation
- **Database**: SQLite with Drizzle ORM and comprehensive schema (23+ tables)
- **API Documentation**: Auto-generated Swagger/OpenAPI documentation
- **Testing**: Comprehensive test suite with integration and unit tests
- **Code Quality**: ESLint, Prettier, and strict type checking

## 🛠️ Development

### Available Scripts

```fish
# Development
bun run dev              # Start development server with hot reload
bun run type-check       # TypeScript type checking

# Database
bun run db:generate      # Generate database migrations
bun run db:migrate       # Run database migrations
bun run db:push          # Push schema changes to database
bun run db:studio        # Open Drizzle Studio
bun run db:seed          # Seed database with initial data

# Testing
bun test                 # Run all tests
bun test:watch           # Run tests in watch mode

# Code Quality
bun run lint             # Run linting (oxlint + markdownlint)
bun run format           # Format code with Prettier
```

### Testing

The project includes comprehensive testing with:

- Integration tests for full API workflows
- Unit tests for services and repositories
- Controller tests for endpoint validation

See [Testing Documentation](./tests/README.md) for detailed testing
information.

## 📚 Documentation

- **[Architecture](./changelogs/ARCHITECTURE.md)** - Detailed project
  architecture and design decisions
- **[Migration Guide](./changelogs/MIGRATION.md)** - Migration from route-based
  to feature-based architecture
- **[Testing Guide](./tests/README.md)** - Comprehensive testing documentation
- **[Environment Setup](./changelogs/ENV_TYPE_SAFETY.md)** - Environment
  configuration and type safety
- **[Database Integration](./changelogs/DATABASE_INTEGRATION.md)** - Database
  setup and integration details
- **[Changelogs](./changelogs/README.md)** - Historical changes and
  architectural decisions

## 🔧 Technology Stack

### Core Technologies

- **[Elysia](https://elysiajs.com/)** - Fast and type-safe web framework
- **[Bun](https://bun.sh/)** - High-performance JavaScript runtime
- **TypeScript** - Type-safe JavaScript
- **SQLite** - Lightweight relational database

### Database & ORM

- **[Drizzle ORM](https://orm.drizzle.team/)** - Type-safe SQL ORM
- **[Drizzle Kit](https://orm.drizzle.team/kit-docs/overview)** - Database
  migrations and introspection

### Validation & Documentation

- **[Zod](https://zod.dev/)** - TypeScript-first schema validation
- **[Swagger/OpenAPI](https://swagger.io/)** - API documentation

### Development Tools

- **[oxlint](https://oxc-project.github.io/)** - Fast JavaScript/TypeScript
  linter
- **[Prettier](https://prettier.io/)** - Code formatter
- **[Markdownlint](https://github.com/DavidAnson/markdownlint)** - Markdown
  linting

## 🚀 Deployment

The application is designed to be deployment-ready with:

- Environment-based configuration
- Type-safe environment validation
- Comprehensive health checks
- Production-ready database setup

## 🤝 Contributing

1. Follow the feature-based architecture pattern
2. Add comprehensive tests for new features
3. Update documentation for architectural changes
4. Run quality checks before committing:

   ```fish
   bun run type-check
   bun run lint
   bun run format
   bun test
   ```

## 📄 License

Just take it man
