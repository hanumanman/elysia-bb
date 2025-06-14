/**
 * Novels feature barrel export
 */
export { novelController } from './controllers/novel.controller'
export { NovelRepository } from './repositories/novel.repository'
export { NovelService } from './services/novel.service'

// Export individual route modules for direct use if needed
export {
  novelAuthorRoutes,
  novelCrudRoutes,
  novelDiscoveryRoutes,
  novelSearchRoutes
} from './routes'
