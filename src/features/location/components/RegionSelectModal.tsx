import React, { useState, useEffect } from 'react';
import {
  fetchSidoList,
  fetchSigugunList,
  fetchDongList,
  fetchRegionById,
  Region,
  DongEntry
} from '@/features/location/api/region';
import { useGeoLocation } from '@/features/location/hooks/useGeoLocation';
import { useUser } from '@/features/user/hooks/useUser';
import { Button, NativeSelect, Modal } from '@mantine/core';
import { useTranslation } from '@/shared/i18n';

interface RegionSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (regionId: string, regionName: string) => void;
  initialRegionId?: string;
}

export default function RegionSelectModal({
  isOpen,
  onClose,
  onSelect,
  initialRegionId
}: RegionSelectModalProps) {
  const t = useTranslation();
  const [sidoList, setSidoList] = useState<string[]>([]);
  const [sigugunList, setSigugunList] = useState<string[]>([]);
  const [dongList, setDongList] = useState<DongEntry[]>([]);

  const [selectedSido, setSelectedSido] = useState('');
  const [selectedSigugun, setSelectedSigugun] = useState('');
  const [selectedDongId, setSelectedDongId] = useState('');
  const [selectedDongName, setSelectedDongName] = useState('');

  const { detectRegion, detecting } = useGeoLocation();
  const { user, isLoggedIn } = useUser();

  // 모달 열릴 때 시/도 목록 불러오기
  useEffect(() => {
    if (isOpen) {
      const loadSido = async () => {
        try {
          const list = await fetchSidoList();
          setSidoList(list);
        } catch (e) {
          console.error(t.location.sidoLoadFailed, e);
        }
      };
      loadSido();
    }
  }, [isOpen, t.location.sidoLoadFailed]);

  // 초기 지역 ID가 있으면 드롭다운 상태 복원
  const syncRegionState = async (regionId: string) => {
    try {
      const regionData: Region = await fetchRegionById(regionId);

      setSelectedSido(regionData.sido);

      const siguguns = await fetchSigugunList(regionData.sido);
      setSigugunList(siguguns);
      setSelectedSigugun(regionData.sigugun);

      const dongs = await fetchDongList(regionData.sido, regionData.sigugun);
      setDongList(dongs);
      setSelectedDongId(regionData.id);
      setSelectedDongName(`${regionData.sigugun} ${regionData.dong}`);
    } catch (e) {
      console.error(t.location.syncFailed, e);
    }
  };

  useEffect(() => {
    if (isOpen && initialRegionId) {
      syncRegionState(initialRegionId);
    }
  }, [isOpen, initialRegionId]);

  // 시/도 변경
  const handleSidoChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSido = e.target.value;
    setSelectedSido(newSido);
    setSelectedSigugun('');
    setSelectedDongId('');
    setSelectedDongName('');
    setDongList([]);

    if (newSido) {
      try {
        const list = await fetchSigugunList(newSido);
        setSigugunList(list);
      } catch (e) {
        console.error(e);
      }
    } else {
      setSigugunList([]);
    }
  };

  // 시/구/군 변경
  const handleSigugunChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSigugun = e.target.value;
    setSelectedSigugun(newSigugun);
    setSelectedDongId('');
    setSelectedDongName('');

    if (newSigugun && selectedSido) {
      try {
        const list = await fetchDongList(selectedSido, newSigugun);
        setDongList(list);
      } catch (e) {
        console.error(e);
      }
    } else {
      setDongList([]);
    }
  };

  // 동 변경
  const handleDongChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const dongId = e.target.value;
    setSelectedDongId(dongId);
    const dong = dongList.find(d => d.id === dongId);
    if (dong) {
      setSelectedDongName(`${selectedSigugun} ${dong.dong}`);
    }
  };

  // 내 위치 찾기
  const handleDetectLocation = async () => {
    try {
      // 로그인한 유저이고 저장된 지역이 있으면 그것을 사용
      if (isLoggedIn && user?.region) {
        await syncRegionState(user.region.id);
        return;
      }

      // 그렇지 않으면 GPS로 위치 찾기
      const detectedRegion = await detectRegion();
      await syncRegionState(detectedRegion.id);
    } catch (error) {
      console.error("Error detecting location:", error);
      alert(error instanceof Error ? error.message : t.user.locationFailed);
    }
  };

  // 확인 버튼
  const handleConfirm = () => {
    if (!selectedDongId) {
      alert(t.user.selectAllRegion);
      return;
    }
    onSelect(selectedDongId, selectedDongName);
    onClose();
  };

  // 옵션 배열
  const sidoOptions = [
    { value: '', label: t.location.selectSido },
    ...sidoList.map(s => ({ value: s, label: s }))
  ];

  const sigugunOptions = [
    { value: '', label: t.location.selectSigugun },
    ...sigugunList.map(s => ({ value: s, label: s }))
  ];

  const dongOptions = [
    { value: '', label: t.location.selectDong },
    ...dongList.map(d => ({ value: d.id, label: d.dong }))
  ];

  return (
    <Modal opened={isOpen} onClose={onClose} title={t.location.regionSettings} centered>
      <div className="flex flex-col gap-4">
        {/* 내 위치로 찾기 버튼 */}
        <Button
          type="button"
          variant="light"
          fullWidth
          onClick={handleDetectLocation}
          disabled={detecting}
        >
          {detecting ? t.location.findingLocation : t.user.findMyLocation}
        </Button>

        <div className="relative flex items-center my-2">
          <div className="grow border-t border-border-light"></div>
          <span className="shrink mx-4 text-text-secondary text-sm">{t.location.orSelectDirectly}</span>
          <div className="grow border-t border-border-light"></div>
        </div>

        {/* 3단 드롭다운 */}
        <NativeSelect
          data={sidoOptions}
          value={selectedSido}
          onChange={handleSidoChange}
        />

        <NativeSelect
          data={sigugunOptions}
          value={selectedSigugun}
          onChange={handleSigugunChange}
          disabled={!selectedSido}
        />

        <NativeSelect
          data={dongOptions}
          value={selectedDongId}
          onChange={handleDongChange}
          disabled={!selectedSigugun}
        />

        {/* 버튼 영역 */}
        <div className="flex gap-3 mt-4">
          <Button
            type="button"
            variant="light"
            fullWidth
            onClick={onClose}
          >
            {t.common.cancel}
          </Button>
          <Button
            type="button"
            color="orange"
            fullWidth
            onClick={handleConfirm}
          >
            {t.common.confirm}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
