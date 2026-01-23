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

  const urlRegionId = searchParams.get('region');

  // URL에 region 파라미터가 있으면 해당 지역으로 설정
  useEffect(() => {
    if (urlRegionId && urlRegionId !== regionId) {
      // URL의 region ID로 지역 정보 가져오기
      fetchRegionById(urlRegionId)
        .then((region) => {
          setRegion(region.id, `${region.sigugun} ${region.dong}`);
        })
        .catch(() => {
          // 잘못된 region ID면 기본값으로 리다이렉트
          setSearchParams({ region: DEFAULT_REGION_ID }, { replace: true });
        });
    } else if (!urlRegionId) {
      // URL에 region이 없으면 현재 regionId를 URL에 추가
      setSearchParams({ region: regionId }, { replace: true });
    }
  }, [urlRegionId]);

  // 로그인 시 사용자 지역으로 자동 동기화 (localStorage에 저장된 값이 없을 때만)
  useEffect(() => {
    if (isLoggedIn && user?.region) {
      const savedId = localStorage.getItem('selectedRegionId');
      // localStorage에 저장된 값이 없거나 기본값인 경우에만 사용자 지역으로 설정
      if (!savedId || savedId === DEFAULT_REGION_ID) {
        setRegion(user.region.id, user.region.name);
        setSearchParams({ region: user.region.id }, { replace: true });
      }
    }
  }, [isLoggedIn, user?.region]);

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
    currentRegionName: regionName,
    isModalOpen,
    openModal,
    closeModal,
    handleRegionSelect,
  };
}
