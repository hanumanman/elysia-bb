import { and, eq, isNull } from 'drizzle-orm'
import { db, users, type Database } from '../../../db'

export class UserRepository {
  constructor(private database: Database = db) {}

  async findById(id: string) {
    const result = await this.database
      .select()
      .from(users)
      .where(and(eq(users.id, id), isNull(users.deletedAt)))
      .limit(1)

    return result[0] || null
  }

  async findByEmail(email: string) {
    const result = await this.database
      .select()
      .from(users)
      .where(and(eq(users.email, email), isNull(users.deletedAt)))
      .limit(1)

    return result[0] || null
  }

  async create(userData: typeof users.$inferInsert) {
    const result = await this.database.insert(users).values(userData).returning()

    return result[0]
  }

  async update(id: string, userData: Partial<typeof users.$inferInsert>) {
    const result = await this.database
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(and(eq(users.id, id), isNull(users.deletedAt)))
      .returning()

    return result[0] || null
  }

  async softDelete(id: string) {
    const result = await this.database
      .update(users)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(and(eq(users.id, id), isNull(users.deletedAt)))
      .returning()

    return result[0] || null
  }

  async exists(email: string): Promise<boolean> {
    const result = await this.database
      .select({ id: users.id })
      .from(users)
      .where(and(eq(users.email, email), isNull(users.deletedAt)))
      .limit(1)

    return result.length > 0
  }
}
