import { MAIN_API_URL } from './config';

interface FetchClientOptions extends RequestInit {
  headers?: Record<string, string>;
}

async function fetchClient(endpoint: string, options: FetchClientOptions = {}) {
  const token = localStorage.getItem('token');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${MAIN_API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return response;
}

export default fetchClient;
