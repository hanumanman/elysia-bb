/**
 * Users feature barrel export
 */
export { userController } from './controllers/user.controller'
export { UserRepository } from './repositories/user.repository'
export { UserService } from './services/user.service'

// Export individual route modules for direct use if needed
export { userCrudRoutes, userLookupRoutes } from './routes'
