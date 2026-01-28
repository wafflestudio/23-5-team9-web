import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRegionStore } from '@/shared/store/regionStore';
import { fetchRegionById } from '@/features/location/api/region';
import { useTranslation } from '@/shared/i18n';

// 지역 선택 타입: 동 단위(region), 시/구/군 단위(sigugun), 시/도 단위(sido)
export type RegionSelectType = 'region' | 'sigugun' | 'sido';

export interface RegionSelection {
  type: RegionSelectType;
  regionId?: string;  // 동 단위일 때만 사용
  sido?: string;
  sigugun?: string;
  displayName: string;
}

export function useRegionSelection() {
  const t = useTranslation();
  const { regionId, regionName, setRegion, clearRegion } = useRegionStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // URL에서 현재 지역 정보를 가져옵니다
  const urlRegionId = searchParams.get('region') || undefined;
  const urlSido = searchParams.get('sido') || undefined;
  const urlSigugun = searchParams.get('sigugun') || undefined;

  // 현재 선택된 지역 타입 결정
  const getCurrentSelection = (): RegionSelection => {
    if (urlRegionId) {
      return {
        type: 'region',
        regionId: urlRegionId,
        displayName: regionName || t.location.allRegions,
      };
    }
    if (urlSido && urlSigugun) {
      return {
        type: 'sigugun',
        sido: urlSido,
        sigugun: urlSigugun,
        displayName: `${urlSido} ${urlSigugun}`,
      };
    }
    if (urlSido) {
      return {
        type: 'sido',
        sido: urlSido,
        displayName: urlSido,
      };
    }
    return {
      type: 'region',
      displayName: t.location.allRegions,
    };
  };

  const currentSelection = getCurrentSelection();

  // 지역 선택 (동 단위)
  const handleRegionSelect = (id: string, name?: string) => {
    if (name) {
      setRegion(id, name);
    }
    setSearchParams({ region: id });
    closeModal();
  };

  // 시/도 단위 선택
  const handleSidoSelect = (sido: string) => {
    setSearchParams({ sido });
    closeModal();
  };

  // 시/구/군 단위 선택
  const handleSigugunSelect = (sido: string, sigugun: string) => {
    setSearchParams({ sido, sigugun });
    closeModal();
  };

  // 지역 필터 해제 (전체 보기)
  const handleClearRegion = () => {
    clearRegion();
    setSearchParams({});
    closeModal();
  };

  // URL 변경을 감지하여 데이터를 동기화합니다 (동 단위일 때만)
  useEffect(() => {
    if (!urlRegionId) return;
    if (urlRegionId === regionId && regionName) return;

    const syncRegionData = async () => {
      try {
        const region = await fetchRegionById(urlRegionId);
        const name = `${region.sigugun} ${region.dong}`;
        setRegion(region.id, name);
      } catch (error) {
        console.error('Invalid region ID in URL:', error);
        setSearchParams({});
      }
    };

    syncRegionData();
  }, [urlRegionId, regionId, regionName, setRegion, setSearchParams]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return {
    // 하위 호환성을 위해 기존 필드 유지
    currentRegionId: urlRegionId,
    currentRegionName: currentSelection.displayName,
    // 새로운 필드
    currentSelection,
    currentSido: urlSido,
    currentSigugun: urlSigugun,
    isModalOpen,
    openModal,
    closeModal,
    handleRegionSelect,
    handleSidoSelect,
    handleSigugunSelect,
    handleClearRegion,
  };
}