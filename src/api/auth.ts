import fetchClient from './client';
import { MAIN_API_URL } from './config';

export const authApi = {
    signup: (data: any) => fetchClient('/api/user/', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    login: (data: any) => fetchClient('/api/auth/tokens', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    getGoogleLoginUrl: () => `${MAIN_API_URL}/api/auth/oauth2/login/google`
};
