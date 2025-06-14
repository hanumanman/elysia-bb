import { Elysia } from 'elysia'
import type { ApiErrorResponse, ApiSuccessResponse, PaginatedResponse } from '../types'

/**
 * Response service for standardized API responses
 * Following Elysia best practice: Use Elysia instance as a service
 */
export const responseService = new Elysia({ name: 'response-service' }).derive(
  { as: 'global' },
  () => ({
    response: {
      success: <T>(data: T, message: string = 'Success'): ApiSuccessResponse<T> => ({
        success: true as const,
        data,
        message
      }),

      successNoData: (message: string): { success: true; message: string } => ({
        success: true as const,
        message
      }),

      error: (error: string, message?: string): ApiErrorResponse => ({
        success: false as const,
        error,
        message
      }),

      paginated: <T>(
        data: T[],
        page: number,
        limit: number,
        total: number
      ): PaginatedResponse<T> => ({
        success: true as const,
        data,
        message: 'Data retrieved successfully',
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
