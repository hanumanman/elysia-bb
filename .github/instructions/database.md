# Database Integration Instructions

I want to integrate a database into my project.
I want to use SQLite and Drizzle ORM with Turso to manage my database.
The database is for a novel reading application.

The database should support the following features:

## Core Data Storage

- **User Management**: Store user data including name, email, password hash,
  profile avatar, user roles (reader, author, admin), account creation date,
  and authentication tokens
- **Novel Data**: Store novel information including title, author, description,
  cover image, categories/genres, tags, publication date, status
  (ongoing/completed), language, average rating, and total views
- **Chapter Management**: Store chapter data including title, content, chapter
  number, publication date, word count, and reading time estimates
- **Reading Progress**: Track user reading progress per novel/chapter,
  bookmarks, reading history with timestamps, and reading speed analytics

## User Experience Features

- **Favorites & Collections**: Allow users to favorite novels and create
  custom reading lists/collections
- **Reading Preferences**: Store user preferences for font size, theme
  (light/dark mode), reading speed, and display settings
- **Bookmarks**: Support chapter bookmarks with notes and timestamps
- **Reading History**: Track what users have read and when

## Social & Community Features

- **Reviews & Ratings**: Store user reviews, ratings (1-5 stars), and review
  helpfulness votes for novels
- **Comments**: Support chapter comments with threading and moderation
- **User Interactions**: Follow system for authors/users, notifications for
  updates

## Content Management

- **Novel Organization**: Support for novel series, chapter ordering, content
  versioning for updates/edits
- **Content Moderation**: Flags for inappropriate content, admin moderation
  tools
- **Upload System**: Support novel and chapter uploads with validation

## Search & Discovery

- **Advanced Search**: Search novels by title, author, genre, tags, status,
  and rating. Support Vietnamese text normalization so "Truyện hay nhất"
  is searchable when user queries "truyen hay nhat"
- **Recommendations**: Algorithm support for personalized recommendations
  based on reading history and preferences
- **Trending & Popular**: Track popular novels, trending content, and
  recently updated novels

## Performance & Scalability

- **Indexing Strategy**: Proper database indexes for search performance,
  especially for Vietnamese text search
- **Pagination**: Support for paginated results on large datasets
- **Caching Support**: Database structure optimized for caching frequently
  accessed data (popular novels, user preferences)
- **Analytics**: Track reading statistics, popular content, and user
  engagement metrics

## Technical Requirements

- Use SQLite as the database engine with Drizzle ORM for type-safe queries
- Deploy with Turso for production scalability and edge distribution
- Implement proper foreign key relationships and constraints
- Use transactions for data consistency (e.g., when uploading novels with
  multiple chapters)
- Implement soft deletes for user data and content (for recovery purposes)
- Support database migrations for schema changes
- Include proper error handling and validation at the database layer

## Security Considerations

- Hash passwords using secure algorithms (bcrypt/argon2)
- Sanitize user input to prevent SQL injection (Drizzle provides protection)
- Implement rate limiting for search and API endpoints
- Add audit logs for admin actions and content moderation
- Secure file upload validation for cover images and content

## Performance Optimization

- Index frequently searched fields (title, author, genre, tags)
- Implement full-text search for Vietnamese content
- Use database views for complex queries (trending novels, user stats)
- Consider read replicas for high-traffic scenarios
- Implement proper connection pooling
