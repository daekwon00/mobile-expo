import { tokenStorage } from './storage';
import type { ApiResponse } from '@/types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8081';

type RequestOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  /** 인증 헤더 생략 여부 */
  noAuth?: boolean;
};

class ApiClient {
  private baseUrl: string;
  private isRefreshing = false;
  private refreshPromise: Promise<boolean> | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {}, noAuth = false } = options;

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    if (!noAuth) {
      const token = await tokenStorage.getAccessToken();
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      }
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    // 401 → 토큰 갱신 시도
    if (response.status === 401 && !noAuth) {
      const refreshed = await this.tryRefreshToken();
      if (refreshed) {
        return this.request<T>(path, options);
      }
      // 갱신 실패 시 토큰 삭제
      await tokenStorage.clearTokens();
      throw new ApiError(401, '인증이 만료되었습니다. 다시 로그인해주세요.');
    }

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      throw new ApiError(
        response.status,
        errorBody?.message ?? `요청 실패 (${response.status})`,
      );
    }

    // 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  private async tryRefreshToken(): Promise<boolean> {
    // 이미 갱신 중이면 기존 Promise 대기
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        const refreshToken = await tokenStorage.getRefreshToken();
        if (!refreshToken) return false;

        const response = await fetch(`${this.baseUrl}/api/v1/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) return false;

        const result: ApiResponse<{ accessToken: string }> = await response.json();
        if (result.success && result.data.accessToken) {
          await tokenStorage.setTokens(result.data.accessToken, refreshToken);
          return true;
        }
        return false;
      } catch {
        return false;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  /** GET 요청 */
  async get<T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<ApiResponse<T>>(path, { ...options, method: 'GET' });
  }

  /** POST 요청 */
  async post<T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<ApiResponse<T>>(path, { ...options, method: 'POST', body });
  }

  /** PUT 요청 */
  async put<T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<ApiResponse<T>>(path, { ...options, method: 'PUT', body });
  }

  /** DELETE 요청 */
  async delete<T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<ApiResponse<T>>(path, { ...options, method: 'DELETE' });
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const api = new ApiClient(API_BASE_URL);
