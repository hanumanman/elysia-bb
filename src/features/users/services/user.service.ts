import { UserRepository } from '@/features/users/repositories/user.repository'

export class UserService {
  private userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()
  }

  async getUserById(id: string) {
    return await this.userRepository.findById(id)
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.findByEmail(email)
  }

  async createUser(userData: {
    name: string
    email: string
    passwordHash: string
    role?: 'reader' | 'author' | 'admin'
  }) {
    // Check if user already exists
    const existingUser = await this.userRepository.exists(userData.email)
    if (existingUser) {
      throw new Error('User with this email already exists')
    }

    return await this.userRepository.create({
      ...userData,
      role: userData.role || 'reader'
    })
  }

  async updateUser(
    id: string,
    userData: Partial<{
      name: string
      email: string
      avatar: string
      role: 'reader' | 'author' | 'admin'
    }>
  ) {
    return await this.userRepository.update(id, userData)
  }

  async deleteUser(id: string) {
    return await this.userRepository.softDelete(id)
  }
}
