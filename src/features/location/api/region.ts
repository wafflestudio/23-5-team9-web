import client from '@/shared/api/client';

export interface Region {
  id: string;
  name: string;
}

export const regionApi = {
    getRegions   : () => client.get<Region[]>('/api/region/'),
    detectRegion : (lat: number, lng: number) => client.post<Region>('/api/region/detect', { latitude: lat, longitude: lng }),
};
