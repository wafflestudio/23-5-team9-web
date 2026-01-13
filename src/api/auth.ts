import fetchClient from './client';

const BACKEND_URL = 'https://dev.server.team9-toy-project.p-e.kr';

export const authApi = {
    signup: (data: any) => fetchClient('/api/user/', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    login: (data: any) => fetchClient('/api/auth/tokens', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    getGoogleLoginUrl: () => `${BACKEND_URL}/api/auth/oauth2/login/google`
};