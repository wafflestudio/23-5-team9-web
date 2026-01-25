import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useUser } from '@/features/user/hooks/useUser';
import { useRegionStore, DEFAULT_REGION_ID, DEFAULT_REGION_NAME } from '@/shared/store/regionStore';
import { fetchRegionById } from '@/features/location/api/region';

export function useRegionSelection() {
  const { user, isLoggedIn } = useUser();
  // store는 이제 '상태 저장소'가 아니라 URL에 따른 '데이터 캐시/표시용'으로 사용됩니다.
  const { regionId, regionName, setRegion } = useRegionStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. [Source of Truth] URL에서 현재 지역 ID를 가져옵니다.
  const urlRegionId = searchParams.get('region');

  // 2. [Action] 지역 선택 시 Store가 아닌 URL을 변경합니다.
  const handleRegionSelect = (id: string) => {
    // 이름은 URL 변경 후 Effect에서 비동기로 가져오거나, 
    // UX를 위해 미리 알다면 인자로 받아 setRegion을 호출해 낙관적 업데이트를 할 수도 있지만,
    // 원칙적으로 URL 변경이 우선입니다.
    setSearchParams({ region: id });
    closeModal();
  };

  // 3. [Sync] URL 변경을 감지하여 데이터를 동기화합니다.
  useEffect(() => {
    // 3-1. URL에 지역 정보가 아예 없는 경우 (진입 시점)
    if (!urlRegionId) {
      if (isLoggedIn && user?.region?.id) {
        // 로그인 유저라면 유저 지역으로 리다이렉트
        setSearchParams({ region: user.region.id }, { replace: true });
      } else {
        // 비로그인이라면 기본 지역으로 리다이렉트
        setSearchParams({ region: DEFAULT_REGION_ID }, { replace: true });
      }
      return;
    }

    // 3-2. URL과 현재 Store 상태가 일치하면 패스 (불필요한 fetch 방지)
    if (urlRegionId === regionId && regionName) return;

    // 3-3. URL의 ID에 해당하는 지역 정보(이름)를 가져와서 Store에 '반영'만 함
    const syncRegionData = async () => {
      try {
        const region = await fetchRegionById(urlRegionId);
        const name = `${region.sigugun} ${region.dong}`;
        setRegion(region.id, name);
      } catch (error) {
        // 잘못된 ID인 경우 기본값으로 복구
        console.error('Invalid region ID in URL:', error);
        setSearchParams({ region: DEFAULT_REGION_ID }, { replace: true });
      }
    };

    syncRegionData();
  }, [urlRegionId, isLoggedIn, user, regionId, regionName, setRegion, setSearchParams]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return {
    // 컴포넌트는 Store가 아닌 URL(urlRegionId)을 기준으로 렌더링한다고 생각하면 됩니다.
    // 다만 UI에 표시할 이름(Name)이 필요하므로 Store의 값을 보조적으로 사용합니다.
    currentRegionId: urlRegionId || DEFAULT_REGION_ID,
    currentRegionName: regionName || DEFAULT_REGION_NAME, 
    isModalOpen,
    openModal,
    closeModal,
    handleRegionSelect,
  };
}