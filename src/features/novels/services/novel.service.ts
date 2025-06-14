import { NovelRepository } from '@/features/novels/repositories/novel.repository'

export class NovelService {
  private novelRepository: NovelRepository

  constructor() {
    this.novelRepository = new NovelRepository()
  }

  async getNovelById(id: string) {
    const novelWithAuthor = await this.novelRepository.findById(id)
    if (!novelWithAuthor) return null

    // Get categories and tags for the novel
    const [categories, tags] = await Promise.all([
      this.novelRepository.getNovelCategories(id),
      this.novelRepository.getNovelTags(id)
    ])

    return {
      ...novelWithAuthor.novel,
      author: novelWithAuthor.author,
      categories,
      tags
    }
  }

  async getNovels(
    options: {
      page?: number
      limit?: number
      authorId?: string
      status?: 'ongoing' | 'completed' | 'hiatus' | 'dropped'
      search?: string
      sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'averageRating' | 'totalViews'
      sortOrder?: 'asc' | 'desc'
      categoryIds?: string[]
      tagIds?: string[]
    } = {}
  ) {
    const { page = 1, limit = 20, ...filters } = options
    const offset = (page - 1) * limit

    const [novels, total] = await Promise.all([
      this.novelRepository.findMany({ ...filters, limit, offset }),
      this.novelRepository.count(filters)
    ])

    // Get categories and tags for each novel
    const novelsWithMetadata = await Promise.all(
      novels.map(async (novelWithAuthor) => {
        const [categories, tags] = await Promise.all([
          this.novelRepository.getNovelCategories(novelWithAuthor.novel.id),
          this.novelRepository.getNovelTags(novelWithAuthor.novel.id)
        ])

        return {
          ...novelWithAuthor.novel,
          author: novelWithAuthor.author,
          categories,
          tags
        }
      })
    )

    const totalPages = Math.ceil(total / limit)

    return {
      novels: novelsWithMetadata,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }
  }

  async createNovel(novelData: {
    title: string
    authorId: string
    description?: string
    coverImage?: string
    language?: string
    status?: 'ongoing' | 'completed' | 'hiatus' | 'dropped'
    categoryIds?: string[]
    tagIds?: string[]
  }) {
    const { categoryIds = [], tagIds = [], ...basicNovelData } = novelData

    // Check if author exists and has appropriate role
    // This would typically be done via user service

    // Create the novel
    const novel = await this.novelRepository.create({
      ...basicNovelData,
      language: basicNovelData.language || 'vi',
      status: basicNovelData.status || 'ongoing'
    })

    // Add categories and tags if provided
    if (categoryIds.length > 0) {
      await this.novelRepository.addCategories(novel.id, categoryIds)
    }

    if (tagIds.length > 0) {
      await this.novelRepository.addTags(novel.id, tagIds)
    }

    // Return the complete novel with metadata
    return this.getNovelById(novel.id)
  }

  async updateNovel(
    id: string,
    novelData: Partial<{
      title: string
      description: string
      coverImage: string
      language: string
      status: 'ongoing' | 'completed' | 'hiatus' | 'dropped'
      categoryIds: string[]
      tagIds: string[]
    }>
  ) {
    const { categoryIds, tagIds, ...basicUpdates } = novelData

    // Update basic novel data
    const updatedNovel = await this.novelRepository.update(id, basicUpdates)
    if (!updatedNovel) return null

    // Update categories if provided
    if (categoryIds !== undefined) {
      await this.novelRepository.removeCategories(id)
      if (categoryIds.length > 0) {
        await this.novelRepository.addCategories(id, categoryIds)
      }
    }

    // Update tags if provided
    if (tagIds !== undefined) {
      await this.novelRepository.removeTags(id)
      if (tagIds.length > 0) {
        await this.novelRepository.addTags(id, tagIds)
      }
    }

    // Return the complete updated novel
    return this.getNovelById(id)
  }

  async deleteNovel(id: string) {
    return await this.novelRepository.softDelete(id)
  }

  async incrementNovelViews(id: string) {
    await this.novelRepository.incrementViews(id)
  }

  async updateNovelChapterCount(novelId: string) {
    await this.novelRepository.updateTotalChapters(novelId)
  }

  async updateNovelRating(novelId: string, newRating: number) {
    await this.novelRepository.updateAverageRating(novelId, newRating)
  }

  async getNovelsByAuthor(
    authorId: string,
    options: {
      page?: number
      limit?: number
      status?: 'ongoing' | 'completed' | 'hiatus' | 'dropped'
    } = {}
  ) {
    return this.getNovels({ ...options, authorId })
  }

  async searchNovels(
    searchTerm: string,
    options: {
      page?: number
      limit?: number
      categoryIds?: string[]
      tagIds?: string[]
      sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'averageRating' | 'totalViews'
      sortOrder?: 'asc' | 'desc'
    } = {}
  ) {
    return this.getNovels({ ...options, search: searchTerm })
  }

  async getPopularNovels(
    options: {
      page?: number
      limit?: number
      categoryIds?: string[]
      tagIds?: string[]
    } = {}
  ) {
    return this.getNovels({
      ...options,
      sortBy: 'totalViews',
      sortOrder: 'desc'
    })
  }

  async getTopRatedNovels(
    options: {
      page?: number
      limit?: number
      categoryIds?: string[]
      tagIds?: string[]
    } = {}
  ) {
    return this.getNovels({
      ...options,
      sortBy: 'averageRating',
      sortOrder: 'desc'
    })
  }

  async getRecentNovels(
    options: {
      page?: number
      limit?: number
      categoryIds?: string[]
      tagIds?: string[]
    } = {}
  ) {
    return this.getNovels({
      ...options,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    })
  }

  async getRecentlyUpdatedNovels(
    options: {
      page?: number
      limit?: number
      categoryIds?: string[]
      tagIds?: string[]
    } = {}
  ) {
    return this.getNovels({
      ...options,
      sortBy: 'updatedAt',
      sortOrder: 'desc'
    })
  }
}
