import { relations } from 'drizzle-orm'
import {
  auditLogs,
  authTokens,
  bookmarks,
  categories,
  chapters,
  collectionNovels,
  collections,
  comments,
  contentFlags,
  notifications,
  novelAnalytics,
  novelCategories,
  novels,
  novelTags,
  readingHistory,
  readingProgress,
  reviews,
  reviewVotes,
  tags,
  userFavorites,
  userFollows,
  userPreferences,
  users
} from './schema'

// User relations
export const usersRelations = relations(users, ({ many, one }) => ({
  authTokens: many(authTokens),
  novels: many(novels),
  readingProgress: many(readingProgress),
  favorites: many(userFavorites),
  collections: many(collections),
  preferences: one(userPreferences),
  bookmarks: many(bookmarks),
  readingHistory: many(readingHistory),
  reviews: many(reviews),
  reviewVotes: many(reviewVotes),
  comments: many(comments),
  following: many(userFollows, { relationName: 'follower' }),
  followers: many(userFollows, { relationName: 'following' }),
  notifications: many(notifications),
  reportedFlags: many(contentFlags, { relationName: 'reporter' }),
  moderatedFlags: many(contentFlags, { relationName: 'moderator' }),
  auditLogs: many(auditLogs)
}))

// Auth tokens relations
export const authTokensRelations = relations(authTokens, ({ one }) => ({
  user: one(users, {
    fields: [authTokens.userId],
    references: [users.id]
  })
}))

// Novel relations
export const novelsRelations = relations(novels, ({ one, many }) => ({
  author: one(users, {
    fields: [novels.authorId],
    references: [users.id]
  }),
  categories: many(novelCategories),
  tags: many(novelTags),
  chapters: many(chapters),
  readingProgress: many(readingProgress),
  favorites: many(userFavorites),
  collectionNovels: many(collectionNovels),
  reviews: many(reviews),
  analytics: many(novelAnalytics)
}))

// Category relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  novels: many(novelCategories)
}))

// Tag relations
export const tagsRelations = relations(tags, ({ many }) => ({
  novels: many(novelTags)
}))

// Novel categories relations
export const novelCategoriesRelations = relations(novelCategories, ({ one }) => ({
  novel: one(novels, {
    fields: [novelCategories.novelId],
    references: [novels.id]
  }),
  category: one(categories, {
    fields: [novelCategories.categoryId],
    references: [categories.id]
  })
}))

// Novel tags relations
export const novelTagsRelations = relations(novelTags, ({ one }) => ({
  novel: one(novels, {
    fields: [novelTags.novelId],
    references: [novels.id]
  }),
  tag: one(tags, {
    fields: [novelTags.tagId],
    references: [tags.id]
  })
}))

// Chapter relations
export const chaptersRelations = relations(chapters, ({ one, many }) => ({
  novel: one(novels, {
    fields: [chapters.novelId],
    references: [novels.id]
  }),
  readingProgress: many(readingProgress),
  bookmarks: many(bookmarks),
  readingHistory: many(readingHistory),
  comments: many(comments)
}))

// Reading progress relations
export const readingProgressRelations = relations(readingProgress, ({ one }) => ({
  user: one(users, {
    fields: [readingProgress.userId],
    references: [users.id]
  }),
  novel: one(novels, {
    fields: [readingProgress.novelId],
    references: [novels.id]
  }),
  chapter: one(chapters, {
    fields: [readingProgress.chapterId],
    references: [chapters.id]
  })
}))

// User favorites relations
export const userFavoritesRelations = relations(userFavorites, ({ one }) => ({
  user: one(users, {
    fields: [userFavorites.userId],
    references: [users.id]
  }),
  novel: one(novels, {
    fields: [userFavorites.novelId],
    references: [novels.id]
  })
}))

// Collections relations
export const collectionsRelations = relations(collections, ({ one, many }) => ({
  user: one(users, {
    fields: [collections.userId],
    references: [users.id]
  }),
  novels: many(collectionNovels)
}))

// Collection novels relations
export const collectionNovelsRelations = relations(collectionNovels, ({ one }) => ({
  collection: one(collections, {
    fields: [collectionNovels.collectionId],
    references: [collections.id]
  }),
  novel: one(novels, {
    fields: [collectionNovels.novelId],
    references: [novels.id]
  })
}))

// User preferences relations
export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(users, {
    fields: [userPreferences.userId],
    references: [users.id]
  })
}))

// Bookmarks relations
export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  user: one(users, {
    fields: [bookmarks.userId],
    references: [users.id]
  }),
  chapter: one(chapters, {
    fields: [bookmarks.chapterId],
    references: [chapters.id]
  })
}))

// Reading history relations
export const readingHistoryRelations = relations(readingHistory, ({ one }) => ({
  user: one(users, {
    fields: [readingHistory.userId],
    references: [users.id]
  }),
  chapter: one(chapters, {
    fields: [readingHistory.chapterId],
    references: [chapters.id]
  })
}))

// Reviews relations
export const reviewsRelations = relations(reviews, ({ one, many }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id]
  }),
  novel: one(novels, {
    fields: [reviews.novelId],
    references: [novels.id]
  }),
  votes: many(reviewVotes)
}))

// Review votes relations
export const reviewVotesRelations = relations(reviewVotes, ({ one }) => ({
  user: one(users, {
    fields: [reviewVotes.userId],
    references: [users.id]
  }),
  review: one(reviews, {
    fields: [reviewVotes.reviewId],
    references: [reviews.id]
  })
}))

// Comments relations
export const commentsRelations = relations(comments, ({ one, many }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id]
  }),
  chapter: one(chapters, {
    fields: [comments.chapterId],
    references: [chapters.id]
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
    relationName: 'parent'
  }),
  replies: many(comments, { relationName: 'parent' })
}))

// User follows relations
export const userFollowsRelations = relations(userFollows, ({ one }) => ({
  follower: one(users, {
    fields: [userFollows.followerId],
    references: [users.id],
    relationName: 'follower'
  }),
  following: one(users, {
    fields: [userFollows.followingId],
    references: [users.id],
    relationName: 'following'
  })
}))

// Notifications relations
export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id]
  })
}))

// Content flags relations
export const contentFlagsRelations = relations(contentFlags, ({ one }) => ({
  reporter: one(users, {
    fields: [contentFlags.reporterId],
    references: [users.id],
    relationName: 'reporter'
  }),
  moderator: one(users, {
    fields: [contentFlags.moderatorId],
    references: [users.id],
    relationName: 'moderator'
  })
}))

// Audit logs relations
export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  admin: one(users, {
    fields: [auditLogs.adminId],
    references: [users.id]
  })
}))

// Novel analytics relations
export const novelAnalyticsRelations = relations(novelAnalytics, ({ one }) => ({
  novel: one(novels, {
    fields: [novelAnalytics.novelId],
    references: [novels.id]
  })
}))
