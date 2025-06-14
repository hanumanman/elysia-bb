import { sql } from 'drizzle-orm'
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

// User Management
export const users = sqliteTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  avatar: text('avatar'),
  role: text('role', { enum: ['reader', 'author', 'admin'] })
    .notNull()
    .default('reader'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  deletedAt: integer('deleted_at', { mode: 'timestamp' })
})

// Authentication tokens
export const authTokens = sqliteTable('auth_tokens', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  type: text('type', { enum: ['access', 'refresh', 'reset'] }).notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`)
})

// Novel Data
export const novels = sqliteTable('novels', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  authorId: text('author_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  description: text('description'),
  coverImage: text('cover_image'),
  language: text('language').notNull().default('vi'),
  status: text('status', { enum: ['ongoing', 'completed', 'hiatus', 'dropped'] })
    .notNull()
    .default('ongoing'),
  averageRating: real('average_rating').default(0),
  totalViews: integer('total_views').notNull().default(0),
  totalChapters: integer('total_chapters').notNull().default(0),
  publishedAt: integer('published_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  deletedAt: integer('deleted_at', { mode: 'timestamp' })
})

// Novel Categories/Genres
export const categories = sqliteTable('categories', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`)
})

// Novel Tags
export const tags = sqliteTable('tags', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`)
})

// Many-to-many relationship for novel categories
export const novelCategories = sqliteTable('novel_categories', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  novelId: text('novel_id')
    .notNull()
    .references(() => novels.id, { onDelete: 'cascade' }),
  categoryId: text('category_id')
    .notNull()
    .references(() => categories.id, { onDelete: 'cascade' })
})

// Many-to-many relationship for novel tags
export const novelTags = sqliteTable('novel_tags', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  novelId: text('novel_id')
    .notNull()
    .references(() => novels.id, { onDelete: 'cascade' }),
  tagId: text('tag_id')
    .notNull()
    .references(() => tags.id, { onDelete: 'cascade' })
})

// Chapter Management
export const chapters = sqliteTable('chapters', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  novelId: text('novel_id')
    .notNull()
    .references(() => novels.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  chapterNumber: integer('chapter_number').notNull(),
  wordCount: integer('word_count').notNull().default(0),
  readingTime: integer('reading_time').notNull().default(0), // in minutes
  views: integer('views').notNull().default(0),
  publishedAt: integer('published_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  deletedAt: integer('deleted_at', { mode: 'timestamp' })
})

// Reading Progress
export const readingProgress = sqliteTable('reading_progress', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  novelId: text('novel_id')
    .notNull()
    .references(() => novels.id, { onDelete: 'cascade' }),
  chapterId: text('chapter_id').references(() => chapters.id, { onDelete: 'cascade' }),
  lastReadChapter: integer('last_read_chapter').notNull().default(0),
  progress: real('progress').notNull().default(0), // percentage 0-100
  lastReadAt: integer('last_read_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`)
})

// User Favorites
export const userFavorites = sqliteTable('user_favorites', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  novelId: text('novel_id')
    .notNull()
    .references(() => novels.id, { onDelete: 'cascade' }),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`)
})

// User Collections/Reading Lists
export const collections = sqliteTable('collections', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  isPublic: integer('is_public', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`)
})

// Collection novels
export const collectionNovels = sqliteTable('collection_novels', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  collectionId: text('collection_id')
    .notNull()
    .references(() => collections.id, { onDelete: 'cascade' }),
  novelId: text('novel_id')
    .notNull()
    .references(() => novels.id, { onDelete: 'cascade' }),
  addedAt: integer('added_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`)
})

// Reading Preferences
export const userPreferences = sqliteTable('user_preferences', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(),
  fontSize: integer('font_size').notNull().default(16),
  theme: text('theme', { enum: ['light', 'dark', 'auto'] })
    .notNull()
    .default('auto'),
  readingSpeed: integer('reading_speed').notNull().default(200), // words per minute
  lineHeight: real('line_height').notNull().default(1.6),
  fontFamily: text('font_family').notNull().default('system'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`)
})

// Bookmarks
export const bookmarks = sqliteTable('bookmarks', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  chapterId: text('chapter_id')
    .notNull()
    .references(() => chapters.id, { onDelete: 'cascade' }),
  position: integer('position').notNull().default(0), // character position in chapter
  note: text('note'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`)
})

// Reading History
export const readingHistory = sqliteTable('reading_history', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  chapterId: text('chapter_id')
    .notNull()
    .references(() => chapters.id, { onDelete: 'cascade' }),
  readAt: integer('read_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  readingTime: integer('reading_time').notNull().default(0) // in seconds
})

// Reviews & Ratings
export const reviews = sqliteTable('reviews', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  novelId: text('novel_id')
    .notNull()
    .references(() => novels.id, { onDelete: 'cascade' }),
  rating: integer('rating').notNull(), // 1-5 stars
  title: text('title'),
  content: text('content'),
  helpfulVotes: integer('helpful_votes').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  deletedAt: integer('deleted_at', { mode: 'timestamp' })
})

// Review helpfulness votes
export const reviewVotes = sqliteTable('review_votes', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  reviewId: text('review_id')
    .notNull()
    .references(() => reviews.id, { onDelete: 'cascade' }),
  isHelpful: integer('is_helpful', { mode: 'boolean' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`)
})

// Comments
export const comments = sqliteTable('comments', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  chapterId: text('chapter_id')
    .notNull()
    .references(() => chapters.id, { onDelete: 'cascade' }),
  parentId: text('parent_id'), // for threading - will be set up as foreign key in relations
  content: text('content').notNull(),
  isModerated: integer('is_moderated', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  deletedAt: integer('deleted_at', { mode: 'timestamp' })
})

// User follows
export const userFollows = sqliteTable('user_follows', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  followerId: text('follower_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  followingId: text('following_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`)
})

// Notifications
export const notifications = sqliteTable('notifications', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  type: text('type', {
    enum: ['new_chapter', 'new_review', 'new_follower', 'novel_completed', 'system']
  }).notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  data: text('data'), // JSON string for additional data
  isRead: integer('is_read', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`)
})

// Content moderation flags
export const contentFlags = sqliteTable('content_flags', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  reporterId: text('reporter_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  contentType: text('content_type', {
    enum: ['novel', 'chapter', 'comment', 'review']
  }).notNull(),
  contentId: text('content_id').notNull(),
  reason: text('reason', {
    enum: ['spam', 'inappropriate', 'copyright', 'harassment', 'other']
  }).notNull(),
  description: text('description'),
  status: text('status', { enum: ['pending', 'resolved', 'dismissed'] })
    .notNull()
    .default('pending'),
  moderatorId: text('moderator_id').references(() => users.id),
  moderatorNote: text('moderator_note'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  resolvedAt: integer('resolved_at', { mode: 'timestamp' })
})

// Audit logs for admin actions
export const auditLogs = sqliteTable('audit_logs', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  adminId: text('admin_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  action: text('action').notNull(),
  targetType: text('target_type').notNull(),
  targetId: text('target_id').notNull(),
  oldValues: text('old_values'), // JSON string
  newValues: text('new_values'), // JSON string
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`)
})

// Analytics data
export const novelAnalytics = sqliteTable('novel_analytics', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  novelId: text('novel_id')
    .notNull()
    .references(() => novels.id, { onDelete: 'cascade' }),
  date: text('date').notNull(), // YYYY-MM-DD format
  views: integer('views').notNull().default(0),
  uniqueReaders: integer('unique_readers').notNull().default(0),
  averageReadingTime: integer('average_reading_time').notNull().default(0), // in seconds
  newFavorites: integer('new_favorites').notNull().default(0),
  newReviews: integer('new_reviews').notNull().default(0)
})
