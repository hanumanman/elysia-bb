# Elysia Novel Reading Platform Architecture

A scalable Elysia API server for a Vietnamese novel reading platform built with
feature-based architecture following Elysia best practices and comprehensive
database integration.

## Project Structure

```text
src/
├── config/                 # Application configuration
│   └── index.ts           # Centralized config with database, security, server settings
├── db/                    # Database layer
│   ├── index.ts          # Database connection and exports
│   ├── schema.ts         # Complete database schema (23 tables)
│   ├── relations.ts      # Drizzle ORM table relationships
│   └── seed.ts           # Database seeding with initial data
├── features/              # Feature-based modules
│   ├── index.ts          # Features barrel export
│   ├── health/           # Health check feature
│   │   ├── controllers/
│   │   └── index.ts
│   ├── novels/           # Novel management feature
│   │   ├── controllers/  # HTTP request handlers
│   │   ├── repositories/ # Data access layer
│   │   ├── services/     # Business logic layer
│   │   └── index.ts
│   └── users/            # User management feature
│       ├── controllers/  # HTTP request handlers
│       ├── repositories/ # Data access layer
│       ├── services/     # Business logic layer
│       └── index.ts
├── shared/               # Shared utilities across features
│   ├── models/          # Common validation models
│   ├── plugins/         # Shared plugins (swagger, etc.)
│   ├── services/        # Shared services (response, etc.)
│   ├── types/           # Common type definitions
│   └── index.ts
├── index.ts             # Application entry point
drizzle/                  # Database migrations
├── 0000_purple_scream.sql
└── meta/
tests/                    # Comprehensive test suite
├── features/            # Feature-specific tests
├── shared/              # Shared utilities tests
└── setup.ts             # Test configuration
```

## Architecture Principles

### Feature-Based Organization

- Each feature is self-contained in its own folder
- Features include controllers, services, repositories for clean separation
- Easy to add, remove, or modify features without affecting others
- Repository pattern for data access abstraction

### Database Integration

- **SQLite with Turso**: Production-ready database with edge scaling
- **Drizzle ORM**: Type-safe database operations with full TypeScript support
- **23 Database Tables**: Comprehensive schema covering all application needs
- **Database Migrations**: Version-controlled schema changes with Drizzle Kit

### Novel Reading Platform Features

- **User Management**: Registration, authentication, profiles, preferences
- **Novel Management**: CRUD operations, categorization, tagging
- **Chapter System**: Individual chapter management with reading progress
- **Reading Experience**: Bookmarks, reading history, progress tracking
- **Social Features**: Reviews, ratings, comments, user follows
- **Content Organization**: Collections, favorites, categories, tags
- **Moderation**: Content flagging, audit logs, user management
- **Analytics**: Novel performance tracking and user engagement metrics

### Elysia Best Practices

- **Controllers**: Use Elysia instances as controllers (1 instance = 1 controller)
- **Services**: Business logic separation with dependency injection
- **Repositories**: Data access layer with clean interface abstraction
- **Models**: Use model references for type safety and OpenAPI generation
- **Plugins**: Properly named plugins with deduplication support
- **Encapsulation**: Proper scope management (`global`, `scoped`, `local`)

### Database Schema Design

#### Core Entities

- **Users**: User accounts with roles (reader, author, admin)
- **Novels**: Main content with metadata, status, ratings
- **Chapters**: Individual novel chapters with content and analytics
- **Categories/Tags**: Content organization and discovery

#### Social Interactions

- **Reviews & Ratings**: User feedback system with helpfulness voting
- **Comments**: Chapter-level discussions with threading support
- **User Follows**: Social networking between users
- **Notifications**: Real-time user engagement alerts

#### Reading Experience

- **Reading Progress**: Track user progress through novels/chapters
- **Bookmarks**: Save specific positions within chapters
- **Reading History**: Complete reading activity logs
- **User Preferences**: Personalized reading settings (theme, font, etc.)
- **Collections**: User-created reading lists and favorites

#### Content Administration

- **Content Flags**: Moderation system for inappropriate content
- **Audit Logs**: Administrative action tracking
- **Analytics**: Novel performance and engagement metrics

### Scalability Features

- Centralized configuration management with environment variables
- Standardized response format across all endpoints
- Shared validation models for consistency
- Plugin-based architecture for extensibility
- Full TypeScript type safety throughout the application
- Comprehensive test coverage (76+ tests)
- Database indexing for performance optimization
- Soft deletes for data recovery capabilities

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) runtime
- SQLite database (or Turso for production)

### Installation

1. Install dependencies:

   ```bash
   bun install
   ```

2. Set up environment variables:

   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. Run database migrations:

   ```bash
   bun run db:push
   ```

4. Seed the database (optional):

   ```bash
   bun run db:seed
   ```

### Development

1. Start development server:

   ```bash
   bun run dev
   ```

2. View API documentation:
   Open <http://localhost:6969/swagger>

3. Access database studio:

   ```bash
   bun run db:studio
   ```

## API Endpoints

### Health Check

- `GET /health` - System health status with database connectivity
- `GET /health/ping` - Simple ping endpoint for uptime monitoring

### User Management

- `GET /users` - Get paginated list of users
- `GET /users/:id` - Get user profile by ID
- `POST /users` - Create new user account
- `PUT /users/:id` - Update user profile
- `DELETE /users/:id` - Soft delete user account

### Novel Management

- `GET /novels` - Get novels with filtering, search, and pagination
- `GET /novels/:id` - Get novel details with chapters
- `POST /novels` - Create new novel
- `PUT /novels/:id` - Update novel information
- `DELETE /novels/:id` - Soft delete novel
- `POST /novels/:id/categories` - Associate novel with categories
- `POST /novels/:id/tags` - Associate novel with tags

## Adding New Features

1. Create a new folder under `src/features/` following the naming convention
2. Follow the established three-layer architecture:
   - `repositories/` - Data access layer with database operations
   - `services/` - Business logic and validation layer
   - `controllers/` - HTTP request handlers with proper error handling
3. Create the main controller export in the feature's `index.ts`
4. Add the controller to `src/features/index.ts` barrel export
5. Import and use in `src/index.ts` application setup
6. Add comprehensive tests for all layers (repository, service, controller)

### Feature Development Guidelines

- Use Drizzle ORM for all database operations
- Implement proper error handling and validation
- Follow the established response format from `shared/services/response.service.ts`
- Add OpenAPI/Swagger documentation with proper models
- Write unit and integration tests with good coverage
- Update relevant documentation

## Configuration

The application uses environment-based configuration management. Key areas:

### Environment Variables

```bash
# Server Configuration
PORT=6969                    # Server port (default: 6969)
HOST=localhost              # Server host (default: localhost)
NODE_ENV=development        # Environment (development/production)

# Database Configuration
DATABASE_URL=file:./dev.db  # SQLite database URL
DATABASE_AUTH_TOKEN=        # Turso auth token (production only)

# Security Configuration
JWT_SECRET=your-secret-key  # JWT signing secret
BCRYPT_ROUNDS=12           # Password hashing rounds

# CORS Configuration
CORS_ORIGIN=*              # Allowed origins (default: *)
CORS_CREDENTIALS=false     # Enable credentials (default: false)
```

### Database Configuration

- **Development**: Local SQLite database (`file:./dev.db`)
- **Production**: Turso (LibSQL) with edge scaling capabilities
- **ORM**: Drizzle ORM with full TypeScript integration
- **Migrations**: Managed through Drizzle Kit
- **Seeding**: Automated initial data population

## Database Schema Overview

### Core Tables (23 total)

#### User Tables

- `users` - User accounts with roles and authentication
- `auth_tokens` - JWT tokens for authentication
- `user_preferences` - Reading preferences and settings
- `user_follows` - Social networking relationships

#### Content Tables

- `novels` - Main novel content with metadata
- `chapters` - Individual novel chapters
- `categories` - Genre classification system
- `tags` - Flexible content tagging
- `novel_categories` - Many-to-many novel-category relationships
- `novel_tags` - Many-to-many novel-tag relationships

#### Reading Experience Tables

- `reading_progress` - User progress through novels
- `bookmarks` - Saved positions within chapters
- `reading_history` - Complete reading activity logs
- `user_favorites` - User's favorite novels
- `collections` - User-created reading lists
- `collection_novels` - Many-to-many collection-novel relationships

#### Social Interaction Tables

- `reviews` - User reviews with ratings
- `review_votes` - Helpfulness voting on reviews
- `comments` - Chapter-level discussions
- `notifications` - Real-time user alerts

#### Administration Tables

- `content_flags` - Content moderation system
- `audit_logs` - Administrative action tracking
- `novel_analytics` - Performance and engagement metrics

## Scripts

### Development Scripts

- `bun run dev` - Start development server with watch mode
- `bun run test` - Run all tests
- `bun run test:watch` - Run tests in watch mode

### Code Quality Scripts

- `bun run format` - Format code with Prettier
- `bun run lint` - Lint code with oxlint and markdownlint
- `bun run type-check` - Run TypeScript type checking

### Database Scripts

- `bun run db:generate` - Generate database migrations
- `bun run db:migrate` - Run database migrations
- `bun run db:push` - Push schema changes to database
- `bun run db:studio` - Open Drizzle Studio (database GUI)
- `bun run db:seed` - Seed database with initial data

## Testing

The application includes comprehensive test coverage with 76+ passing tests:

### Test Structure

- **Integration Tests**: End-to-end API testing (`tests/app.integration.test.ts`)
- **Repository Tests**: Database operation testing
- **Service Tests**: Business logic validation
- **Controller Tests**: HTTP endpoint testing
- **Shared Utilities Tests**: Common service testing

### Test Commands

```bash
# Run all tests
bun run test

# Run tests in watch mode
bun run test:watch

# Run specific test file
bun test tests/features/novels/novel.service.test.ts
```

## Performance & Security Features

### Performance Optimizations

- **Database Indexing**: Strategic indexes on frequently queried fields
- **Pagination**: Built-in pagination for large dataset handling
- **Type Safety**: Compile-time error prevention with TypeScript
- **Efficient Queries**: Optimized database queries with Drizzle ORM

### Security Features

- **Password Hashing**: Bcrypt with configurable rounds
- **Input Validation**: Comprehensive validation at all layers
- **Soft Deletes**: Data recovery capabilities
- **SQL Injection Prevention**: ORM-level protection
- **Vietnamese Text Support**: Proper text normalization and search

## Deployment

### Local Development

```bash
# Clone and setup
git clone <repository>
cd elysia-bb
bun install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Setup database
bun run db:push
bun run db:seed

# Start development
bun run dev
```

### Production Deployment

The application is designed for deployment with:

- **Turso Database**: Edge-distributed SQLite for global performance
- **Bun Runtime**: High-performance JavaScript runtime
- **Docker Support**: Containerized deployment capability
- **Environment Configuration**: Production-ready configuration management
