import client from '@/shared/api/client';

export const regionApi = {
    getRegions: () => client.get('/api/region/'),
    detectRegion: (lat: number, lng: number) => client.post('/api/region/detect', { latitude: lat, longitude: lng }),
};
