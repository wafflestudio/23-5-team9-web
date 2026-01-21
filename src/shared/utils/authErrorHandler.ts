import { AxiosError } from 'axios';

/**
 * Checks if an error is a 401 authentication error
 */
export function isAuthError(error: unknown): boolean {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as AxiosError;
    return axiosError.response?.status === 401;
  }
  return false;
}

/**
 * Clears authentication tokens and React Query cache
 * Call this when authentication fails permanently (refresh token expired, etc.)
 */
export function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('refresh_token');
}

/**
 * Handles 401 errors by clearing auth state
 * Returns true if it was a 401 error, false otherwise
 */
export function handleAuthError(error: unknown): boolean {
  if (isAuthError(error)) {
    clearAuth();
    return true;
  }
  return false;
}
