import { useState } from 'react';
import { fetchNearbyRegion, Region } from '@/features/location/api/region';
import { useTranslation } from '@/shared/i18n';

export function useGeoLocation() {
  const [detecting, setDetecting] = useState(false);
  const t = useTranslation();

  const detectRegion = async (): Promise<Region> => {
    // 1. 브라우저 지원 여부 확인
    if (!navigator.geolocation) {
      throw new Error(t.location.browserNotSupported);
    }

    setDetecting(true);

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        // 2. 위치 가져오기 성공 시
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;

            // API 호출
            const data = await fetchNearbyRegion(latitude, longitude);

            resolve(data);
          } catch (error: any) {
            // API 에러 처리
            let msg = t.location.serverLocationError;
            if (error.response) {
              try {
                const errData = await error.response.json();
                msg = errData?.detail || t.location.serverLocationError;
              } catch { /* ignore */ }
            }
            reject(new Error(msg));
          } finally {
            setDetecting(false);
          }
        },
        // 3. 위치 가져오기 실패 시 (권한 거부 등)
        (error) => {
          setDetecting(false);
          let msg = t.location.locationUnavailable;

          switch (error.code) {
            case error.PERMISSION_DENIED:
              msg = t.location.permissionDenied;
              break;
            case error.POSITION_UNAVAILABLE:
              msg = t.location.positionUnavailable;
              break;
            case error.TIMEOUT:
              msg = t.location.timeout;
              break;
          }
          reject(new Error(msg));
        },
        // 4. 옵션 (정확도 향상)
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  };

  return { detectRegion, detecting };
}
