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
  const [urlRegionName, setUrlRegionName] = useState<string | null>(null);

  const urlRegionId = searchParams.get('region');

  // URL에 region 파라미터가 있으면 해당 지역 이름 가져오기
  useEffect(() => {
    if (urlRegionId) {
      // URL의 regionId가 store와 같으면 store의 이름 사용
      if (urlRegionId === regionId) {
        setUrlRegionName(regionName);
      } else {
        // URL의 region ID로 지역 정보 가져오기
        fetchRegionById(urlRegionId)
          .then((region) => {
            const name = `${region.sigugun} ${region.dong}`;
            setUrlRegionName(name);
            setRegion(region.id, name);
          })
          .catch(() => {
            // 잘못된 region ID면 기본값으로 리다이렉트
            setSearchParams({ region: DEFAULT_REGION_ID }, { replace: true });
          });
      }
    } else {
      // URL에 region이 없으면 현재 regionId를 URL에 추가
      setUrlRegionName(null);
      setSearchParams({ region: regionId }, { replace: true });
    }
  }, [urlRegionId, regionId, regionName]);

  // 로그인 시 사용자 지역으로 자동 동기화
  useEffect(() => {
    if (isLoggedIn && user?.region && user?.id) {
      const lastUserId = localStorage.getItem('lastUserId');
      const savedRegionId = localStorage.getItem('selectedRegionId');

      // 새 사용자이거나, 저장된 지역이 없거나 기본값인 경우 사용자 지역으로 설정
      const isNewUser = lastUserId !== String(user.id);
      const needsRegionSync = !savedRegionId || savedRegionId === DEFAULT_REGION_ID;

      if (isNewUser || needsRegionSync) {
        localStorage.setItem('lastUserId', String(user.id));
        setRegion(user.region.id, `${user.region.sigugun} ${user.region.dong}`);
        setSearchParams({ region: user.region.id }, { replace: true });
      }
    }
  }, [isLoggedIn, user?.region, user?.id]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleRegionSelect = (id: string, name: string) => {
    setRegion(id, name);
    setSearchParams({ region: id }, { replace: true });
  };

  // URL의 region 파라미터를 우선 사용
  const currentRegionId = urlRegionId || regionId;

  return {
    currentRegionId,
    currentRegionName: urlRegionName || regionName || DEFAULT_REGION_NAME,
    isModalOpen,
    openModal,
    closeModal,
    handleRegionSelect,
  };
}
