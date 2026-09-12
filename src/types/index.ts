/**
 * Global type definitions shared across the entire application.
 *
 * Add app-wide TypeScript utility types, augmentations, and declarations here.
 * For feature-specific types, use src/modules/[feature]/types/ instead.
 */

// ─── API Response Wrappers ───────────────────────────────────────────────────

/** Standard paginated API response shape */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Standard API error response shape */
export interface ApiError {
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
}

// ─── UI Utility Types ────────────────────────────────────────────────────────

/** Extract props from a React component type */
export type PropsOf<T extends React.ElementType> = React.ComponentPropsWithoutRef<T>;

/** Make specific keys required in a type */
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/** Make specific keys optional in a type */
export type PartialFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
