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
import { Button, Select } from '@/shared/ui';
import { Modal } from '@/shared/ui/feedback';

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
  const [sidoList, setSidoList] = useState<string[]>([]);
  const [sigugunList, setSigugunList] = useState<string[]>([]);
  const [dongList, setDongList] = useState<DongEntry[]>([]);

  const [selectedSido, setSelectedSido] = useState('');
  const [selectedSigugun, setSelectedSigugun] = useState('');
  const [selectedDongId, setSelectedDongId] = useState('');
  const [selectedDongName, setSelectedDongName] = useState('');

  const { detectRegion, detecting } = useGeoLocation();

  // 모달 열릴 때 시/도 목록 불러오기
  useEffect(() => {
    if (isOpen) {
      const loadSido = async () => {
        try {
          const list = await fetchSidoList();
          setSidoList(list);
        } catch (e) {
          console.error("시/도 목록 로드 실패", e);
        }
      };
      loadSido();
    }
  }, [isOpen]);

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
      console.error("지역 정보 동기화 실패", e);
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
      const detectedRegion = await detectRegion();
      await syncRegionState(detectedRegion.id);
    } catch (error: any) {
      console.error("Error detecting location:", error);
      alert(error.message || "위치 감지 실패");
    }
  };

  // 확인 버튼
  const handleConfirm = () => {
    if (!selectedDongId) {
      alert("지역(동)까지 모두 선택해주세요.");
      return;
    }
    onSelect(selectedDongId, selectedDongName);
    onClose();
  };

  // 옵션 배열
  const sidoOptions = [
    { value: '', label: '시/도 선택' },
    ...sidoList.map(s => ({ value: s, label: s }))
  ];

  const sigugunOptions = [
    { value: '', label: '시/구/군 선택' },
    ...sigugunList.map(s => ({ value: s, label: s }))
  ];

  const dongOptions = [
    { value: '', label: '읍/면/동 선택' },
    ...dongList.map(d => ({ value: d.id, label: d.dong }))
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="지역 설정">
      <div className="flex flex-col gap-4">
        {/* 내 위치로 찾기 버튼 */}
        <Button
          type="button"
          variant="secondary"
          fullWidth
          onClick={handleDetectLocation}
          disabled={detecting}
        >
          {detecting ? "위치 찾는 중..." : "내 위치로 찾기"}
        </Button>

        <div className="relative flex items-center my-2">
          <div className="flex-grow border-t border-border-light"></div>
          <span className="flex-shrink mx-4 text-text-secondary text-sm">또는 직접 선택</span>
          <div className="flex-grow border-t border-border-light"></div>
        </div>

        {/* 3단 드롭다운 */}
        <Select
          options={sidoOptions}
          value={selectedSido}
          onChange={handleSidoChange}
          className="w-full"
        />

        <Select
          options={sigugunOptions}
          value={selectedSigugun}
          onChange={handleSigugunChange}
          disabled={!selectedSido}
          className="w-full"
        />

        <Select
          options={dongOptions}
          value={selectedDongId}
          onChange={handleDongChange}
          disabled={!selectedSigugun}
          className="w-full"
        />

        {/* 버튼 영역 */}
        <div className="flex gap-3 mt-4">
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={onClose}
          >
            취소
          </Button>
          <Button
            type="button"
            variant="primary"
            fullWidth
            onClick={handleConfirm}
          >
            확인
          </Button>
        </div>
      </div>
    </Modal>
  );
}
