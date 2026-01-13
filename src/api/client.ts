import { MAIN_API_URL } from './config';

interface FetchClientOptions extends RequestInit {
  headers?: Record<string, string>;
}

async function fetchClient(endpoint: string, options: FetchClientOptions = {}) {

  // 서버는 기억력이 없습니다 (Stateless)
  // 요청을 보낼 때마다 token을 항상 지참해야 합니다. 
  const token = localStorage.getItem('token');
  
  const headers: Record<string, string> = {
    // "서버야! 내가 보내는 편지는 JSON으로 쓰여 있어!"
    'Content-Type': 'application/json',
    // "이것은 철수의 요청이야"
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // fetch to {https://dev.server...} + {/api/user/me}
  const response = await fetch(`${MAIN_API_URL}${endpoint}`, {
    ...options,
    headers,
  });
  // 비동기 통신

  return response;
}

export default fetchClient;
