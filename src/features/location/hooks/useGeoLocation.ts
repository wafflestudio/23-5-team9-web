import { useState } from 'react';
// 이전 단계에서 작성한 api 파일 경로에 맞춰 import 경로를 수정하세요.
import { fetchNearbyRegion, Region } from '@/features/location/api/region';

export function useGeoLocation() {
  const [detecting, setDetecting] = useState(false);

  const detectRegion = async (): Promise<Region> => {
    // 1. 브라우저 지원 여부 확인
    if (!navigator.geolocation) {
      throw new Error("브라우저가 위치 정보를 지원하지 않습니다.");
    }

    setDetecting(true);

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        // 2. 위치 가져오기 성공 시
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            // API 호출 (이전 단계에서 정의한 함수 사용)
            // 명세서 파라미터 이름: lat, long
            const data = await fetchNearbyRegion(latitude, longitude);
            
            resolve(data);
          } catch (error: any) {
            // API 에러 처리
            const msg = error.response?.data?.detail || "서버에서 위치 정보를 찾을 수 없습니다.";
            reject(new Error(msg));
          } finally {
            setDetecting(false);
          }
        },
        // 3. 위치 가져오기 실패 시 (권한 거부 등)
        (error) => {
          setDetecting(false);
          let msg = "위치 정보를 가져올 수 없습니다.";
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              msg = "위치 정보 권한이 거부되었습니다. 브라우저 설정에서 허용해주세요.";
              break;
            case error.POSITION_UNAVAILABLE:
              msg = "현재 위치 정보를 사용할 수 없습니다.";
              break;
            case error.TIMEOUT:
              msg = "위치 정보 요청 시간이 초과되었습니다.";
              break;
          }
          reject(new Error(msg));
        },
        // 4. 옵션 (정확도 향상)
        {
          enableHighAccuracy: true, // 배터리를 더 쓰더라도 정확한 위치 요구
          timeout: 10000,           // 10초 내에 응답 없으면 에러
          maximumAge: 0             // 캐시된 위치 대신 항상 최신 위치 요구
        }
      );
    });
  };

  return { detectRegion, detecting };
}