import { Elysia } from 'elysia'
import type { ApiResponse, PaginatedResponse } from '../types'

/**
 * Response service for standardized API responses
 * Following Elysia best practice: Use Elysia instance as a service
 */
export const responseService = new Elysia({ name: 'response-service' }).derive(
  { as: 'global' },
  () => ({
    response: {
      success: <T>(data: T, message?: string): ApiResponse<T> => ({
        success: true,
        data,
        message
      }),

      error: (error: string, message?: string): ApiResponse => ({
        success: false,
        error,
        message
      }),

      paginated: <T>(
        data: T[],
        page: number,
        limit: number,
        total: number
      ): PaginatedResponse<T> => ({
        success: true,
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      })
    }
  })
)
