import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Loading } from '@/shared/ui/StatusMessage';
import { PageContainer } from '@/shared/layouts/PageContainer';

// Fix for default marker icon in leaflet with vite
// We need to import the images directly to ensure they are bundled correctly
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Reset the default icon state
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});

export default function NeighborhoodMap() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        fetchAddress(latitude, longitude);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError('위치 정보를 가져올 수 없습니다. 브라우저의 위치 권한을 확인해주세요.');
        setLoading(false);
      }
    );
  }, []);

  const fetchAddress = async (lat: number, lng: number) => {
    try {
      // Using Nominatim API for reverse geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
            headers: {
                'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7' // Request Korean results
            }
        }
      );
      const data = await response.json();
      
      if (data.address) {
        const addr = data.address;
        // Construct address: City District Neighborhood
        // Example: Seoul Gangnam-gu Yeoksam-dong
        // Nominatim fields can vary, so we try to pick the best ones
        
        const city = addr.city || addr.province || '';
        const district = addr.borough || addr.district || '';
        const neighborhood = addr.quarter || addr.neighbourhood || addr.suburb || '';
        
        // Filter out empty strings and join
        let fullAddress = [city, district, neighborhood].filter(Boolean).join(' ');
        
        // If constructed address is too short, use display_name but try to shorten it
        if (fullAddress.length < 2) {
            // Fallback to a simpler part of display_name if possible, or just use it
             // Often display_name is comma separated, we can take the first few parts
             fullAddress = data.display_name.split(',').slice(0, 3).join(' ');
        }

        setAddress(fullAddress);
      } else {
        setAddress('주소를 찾을 수 없습니다.');
      }
    } catch (e) {
      console.error('Failed to fetch address', e);
      setAddress('주소를 불러오는 중 오류가 발생했습니다.');
    }
  };

  return (
    <PageContainer title="동네 지도">
      {loading && <Loading />}
      {error && <div className="text-red-500 text-center py-5">{error}</div>}
      
      {location && (
        <div className="flex flex-col gap-4">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-lg">
            현재 위치: <strong className="text-primary">{address}</strong>
          </div>
          <div className="h-[500px] w-full rounded-xl overflow-hidden border border-gray-200 z-0 relative">
            <MapContainer center={[location.lat, location.lng]} zoom={16} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[location.lat, location.lng]}>
                <Popup>
                  현재 위치<br />
                  {address}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
