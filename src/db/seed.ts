/* eslint-disable no-console */
import { eq } from 'drizzle-orm'
import { db } from './index'
import { categories, tags, users } from './schema'

async function seed() {
  console.log('🌱 Starting database seeding...')

  try {
    // Seed default categories
    console.log('📚 Seeding categories...')
    const defaultCategories = [
      {
        name: 'Romance',
        slug: 'romance',
        description: 'Romantic stories and love tales'
      },
      { name: 'Fantasy', slug: 'fantasy', description: 'Fantasy and magical stories' },
      {
        name: 'Sci-Fi',
        slug: 'sci-fi',
        description: 'Science fiction and futuristic stories'
      },
      { name: 'Mystery', slug: 'mystery', description: 'Mystery and detective stories' },
      { name: 'Horror', slug: 'horror', description: 'Horror and thriller stories' },
      { name: 'Drama', slug: 'drama', description: 'Dramatic and emotional stories' },
      { name: 'Comedy', slug: 'comedy', description: 'Funny and humorous stories' },
      { name: 'Action', slug: 'action', description: 'Action and adventure stories' },
      {
        name: 'Slice of Life',
        slug: 'slice-of-life',
        description: 'Everyday life stories'
      },
      {
        name: 'Historical',
        slug: 'historical',
        description: 'Historical fiction and period stories'
      }
    ]

    for (const category of defaultCategories) {
      const existing = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, category.slug))
        .limit(1)
      if (existing.length === 0) {
        await db.insert(categories).values(category)
        console.log(`  ✅ Added category: ${category.name}`)
      }
    }

    // Seed default tags
    console.log('🏷️  Seeding tags...')
    const defaultTags = [
      { name: 'Completed', slug: 'completed' },
      { name: 'Ongoing', slug: 'ongoing' },
      { name: 'Popular', slug: 'popular' },
      { name: 'Trending', slug: 'trending' },
      { name: 'New Release', slug: 'new-release' },
      { name: "Editor's Choice", slug: 'editors-choice' },
      { name: 'Short Story', slug: 'short-story' },
      { name: 'Series', slug: 'series' },
      { name: 'Vietnamese', slug: 'vietnamese' },
      { name: 'English', slug: 'english' },
      { name: 'Mature Content', slug: 'mature-content' },
      { name: 'Young Adult', slug: 'young-adult' },
      { name: 'Award Winner', slug: 'award-winner' },
      { name: 'Fan Favorite', slug: 'fan-favorite' },
      { name: 'Quick Read', slug: 'quick-read' }
    ]

    for (const tag of defaultTags) {
      const existing = await db
        .select()
        .from(tags)
        .where(eq(tags.slug, tag.slug))
        .limit(1)
      if (existing.length === 0) {
        await db.insert(tags).values(tag)
        console.log(`  ✅ Added tag: ${tag.name}`)
      }
    }

    // Create admin user if it doesn't exist
    console.log('👤 Creating admin user...')
    const adminEmail = 'admin@example.com'
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.email, adminEmail))
      .limit(1)

    if (existingAdmin.length === 0) {
      // Note: In a real application, you should hash the password
      // For now, we'll use a placeholder that should be changed
      await db.insert(users).values({
        name: 'Admin User',
        email: adminEmail,
        passwordHash: 'CHANGE_THIS_PASSWORD_HASH', // This should be properly hashed
        role: 'admin'
      })
      console.log(`  ✅ Created admin user: ${adminEmail}`)
      console.log(`  ⚠️  Remember to change the admin password!`)
    }

    console.log('✅ Database seeding completed successfully!')
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    process.exit(1)
  }
}

// Run the seed function
seed().then(() => {
  console.log('🎉 Seeding finished!')
  process.exit(0)
})
