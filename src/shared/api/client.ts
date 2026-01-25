import ky, { KyInstance } from 'ky';
import { MAIN_API_URL } from './config';
import { useAuthStore } from '@/features/auth/hooks/store';

// 토큰 갱신 상태 관리
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const { refreshToken, updateTokens, logout } = useAuthStore.getState();

  if (!refreshToken) {
    logout();
    throw new Error('No refresh token');
  }

  try {
    const response = await ky
      .get(`${MAIN_API_URL}/api/auth/tokens/refresh`, {
        headers: { Authorization: `Bearer ${refreshToken}` },
      })
      .json<{ access_token: string; refresh_token: string }>();

    updateTokens(response.access_token, response.refresh_token);
    return response.access_token;
  } catch {
    logout();
    throw new Error('Token refresh failed');
  }
}

// 여러 요청이 동시에 401을 받았을 때 토큰 갱신을 한 번만 수행
async function handleTokenRefresh(): Promise<string> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = refreshAccessToken().finally(() => {
    isRefreshing = false;
    refreshPromise = null;
  });

  return refreshPromise;
}

const client: KyInstance = ky.create({
  prefixUrl: MAIN_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  retry: 0,
  hooks: {
    beforeRequest: [
      (request, options) => {
        const token = useAuthStore.getState().token;
        const skipAuth = (options as { skipAuth?: boolean }).skipAuth;

        if (token && !skipAuth) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status !== 401) {
          return response;
        }

        // 로그인/refresh/product 요청은 401이어도 토큰 갱신 시도 안 함
        const url = request.url;
        if (
          url.includes('/api/auth/tokens') ||
          url.includes('/api/product')
        ) {
          return response;
        }

        try {
          const newToken = await handleTokenRefresh();

          // 새 토큰으로 요청 재시도
          const newRequest = new Request(request, {
            headers: new Headers(request.headers),
          });
          newRequest.headers.set('Authorization', `Bearer ${newToken}`);

          return ky(newRequest, {
            ...options,
            hooks: undefined, // 무한 루프 방지
          });
        } catch {
          return response;
        }
      },
    ],
  },
});

export default client;
