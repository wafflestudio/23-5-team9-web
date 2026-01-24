import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useUser } from '@/features/user/hooks/useUser';
import { useRegionStore, DEFAULT_REGION_ID, DEFAULT_REGION_NAME } from '@/shared/store/regionStore';
import { fetchRegionById } from '@/features/location/api/region';

export function useRegionSelection() {
  const { user, isLoggedIn } = useUser();
  const { regionId, regionName, setRegion } = useRegionStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // URL 값을 진실의 원천으로 간주
  const urlRegionId = searchParams.get('region');

  // 1. 초기 진입 및 URL 변경 감지 -> Store 동기화 (단방향 흐름)
  useEffect(() => {
    let ignore = false; // Race Condition 방지용 플래그

    const syncRegion = async () => {
      // Case A: URL에 지역 정보가 없으면 -> 현재 Store 값(혹은 기본값)을 URL에 반영
      if (!urlRegionId) {
        setSearchParams({ region: regionId || DEFAULT_REGION_ID }, { replace: true });
        return;
      }

      // Case B: URL과 Store가 이미 일치하면 할 일 없음 (무한 루프 방지)
      if (urlRegionId === regionId) return;

      // Case C: URL이 변경됨 -> 서버에서 정보 가져와서 Store 업데이트
      try {
        const region = await fetchRegionById(urlRegionId);
        if (!ignore) {
          const name = `${region.sigugun} ${region.dong}`;
          setRegion(region.id, name);
        }
      } catch (error) {
        if (!ignore) {
          // 실패 시 기본값으로 복구
          setSearchParams({ region: DEFAULT_REGION_ID }, { replace: true });
        }
      }
    };

    syncRegion();

    return () => { ignore = true; };
  }, [urlRegionId, regionId, setRegion, setSearchParams]);


  // 2. 사용자 로그인 시 지역 동기화 (이전 로직 유지하되 간결하게)
  useEffect(() => {
    if (isLoggedIn && user?.region?.id) {
      const lastUserId = localStorage.getItem('lastUserId');
      const isNewLogin = lastUserId !== String(user.id);
      
      // "새로운 로그인"이거나 "현재 선택된 지역이 없을 때"만 유저 지역으로 이동
      if (isNewLogin || !regionId) {
        localStorage.setItem('lastUserId', String(user.id));
        // Store를 직접 바꾸지 않고 URL만 바꿈 -> 위 1번 useEffect가 감지해서 Store 업데이트함 (단방향 유지)
        setSearchParams({ region: user.region.id }, { replace: true });
      }
    }
  }, [isLoggedIn, user, regionId, setSearchParams]);

  
  // 핸들러: Store를 직접 set 하지 않고 URL만 변경
  const handleRegionSelect = (id: string, name: string) => {
    setSearchParams({ region: id }, { replace: true });
    // 여기서 setRegion(id, name)을 호출하지 않음으로써 
    // URL 변경 -> useEffect 감지 -> fetch/setRegion 흐름을 탐.
    // (단, UX 반응속도를 위해 Optimistic update가 필요하다면 setRegion을 같이 호출해도 됨)
  };

  return {
    currentRegionId: regionId || DEFAULT_REGION_ID,
    currentRegionName: regionName || DEFAULT_REGION_NAME,
    isModalOpen,
    openModal: () => setIsModalOpen(true),
    closeModal: () => setIsModalOpen(false),
    handleRegionSelect,
  };
}