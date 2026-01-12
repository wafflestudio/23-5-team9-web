import fetchClient from './client';

export const regionApi = {
    getRegions: () => fetchClient('/api/regions/'),
    detectRegion: (lat: number, lng: number) => fetchClient('/api/regions/detect', {
        method: 'POST',
        body: JSON.stringify({ latitude: lat, longitude: lng }),
    }),
};
