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
import { Button, Input, Select, Avatar } from '@/shared/ui';

interface ProfileEditFormProps {
  initialEmail?: string;
  initialNickname?: string;
  initialRegionId?: string;
  initialProfileImage?: string;
  submitButtonText?: string;
  onSubmit: (data: { nickname: string; region_id: string; profile_image: string }) => Promise<void>;
}

export default function ProfileEditForm({
  initialEmail = '',
  initialNickname = '',
  initialRegionId = '',
  initialProfileImage = '',
  submitButtonText = '저장하기',
  onSubmit
}: ProfileEditFormProps) {

  const [nickname, setNickname] = useState(initialNickname);
  const [profileImage, setProfileImage] = useState(initialProfileImage);
  const [loading, setLoading] = useState(false);

  // --- 지역 선택 관련 State ---
  const [sidoList, setSidoList] = useState<string[]>([]);
  const [sigugunList, setSigugunList] = useState<string[]>([]);
  const [dongList, setDongList] = useState<DongEntry[]>([]);

  const [selectedSido, setSelectedSido] = useState('');
  const [selectedSigugun, setSelectedSigugun] = useState('');
  const [selectedDongId, setSelectedDongId] = useState(initialRegionId); // 최종적으로 전송할 ID

  const { detectRegion, detecting } = useGeoLocation();

  // 1. 초기 데이터 세팅 (프로필 이미지, 닉네임)
  useEffect(() => {
    if (initialNickname) setNickname(initialNickname);
    if (initialProfileImage) {
      setProfileImage(initialProfileImage);
    } else {
      generateRandomImage();
    }
  }, [initialNickname, initialProfileImage]);

  // 2. 컴포넌트 마운트 시: 시/도 목록 불러오기
  useEffect(() => {
    const loadSido = async () => {
      try {
        const list = await fetchSidoList();
        setSidoList(list);
      } catch (e) {
        console.error("시/도 목록 로드 실패", e);
      }
    };
    loadSido();
  }, []);

  // 3. 초기 지역 ID가 있거나 위치 찾기 성공 시: 전체 드롭다운 상태 복원
  // (Sido, Sigugun, Dong 목록을 순차적으로 로드해서 세팅)
  const syncRegionState = async (regionId: string) => {
    try {
      // 3-1. 상세 정보 가져오기
      const regionData: Region = await fetchRegionById(regionId);
      
      // 3-2. State 업데이트 (API 호출 순서 보장)
      setSelectedSido(regionData.sido);
      
      const siguguns = await fetchSigugunList(regionData.sido);
      setSigugunList(siguguns);
      setSelectedSigugun(regionData.sigugun);

      const dongs = await fetchDongList(regionData.sido, regionData.sigugun);
      setDongList(dongs);
      setSelectedDongId(regionData.id);

    } catch (e) {
      console.error("지역 정보 동기화 실패", e);
    }
  };

  // 초기 렌더링 시 기존 지역 정보가 있다면 복원
  useEffect(() => {
    if (initialRegionId) {
      syncRegionState(initialRegionId);
    }
  }, [initialRegionId]);


  // --- 핸들러: 단계별 선택 로직 ---

  // 시/도 변경
  const handleSidoChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSido = e.target.value;
    setSelectedSido(newSido);
    
    // 하위 초기화
    setSelectedSigugun('');
    setSelectedDongId('');
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

    // 하위 초기화
    setSelectedDongId('');

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

  // 읍/면/동 변경 (최종 ID 선택)
  const handleDongChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDongId(e.target.value);
  };

  // 내 위치 찾기 핸들러
  const handleDetectLocation = async () => {
    try {
      const detectedRegion = await detectRegion(); // API 호출
      await syncRegionState(detectedRegion.id);    // 드롭다운 상태 동기화
      alert(`현재 위치('${detectedRegion.full_name}')로 설정되었습니다.`);
    } catch (error: any) {
      console.error("Error detecting location:", error);
      alert(error.message || "위치 감지 실패");
    }
  };

  // 이미지 생성/링크 핸들러 (기존 동일)
  const generateRandomImage = () => {
    const randomSeed = Math.random().toString(36).substring(7);
    setProfileImage(`https://robohash.org/${randomSeed}?set=set4`);
  };

  const handleLinkInput = () => {
    const url = prompt('이미지 URL을 입력하세요:', profileImage);
    if (url) setProfileImage(url);
  };

  // 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDongId) {
        alert("지역(동)까지 모두 선택해주세요.");
        return;
    }
    
    setLoading(true);
    try {
      await onSubmit({ 
        nickname, 
        region_id: selectedDongId, 
        profile_image: profileImage 
      });
    } finally {
      setLoading(false);
    }
  };

  // --- 옵션 배열 생성 (Select 컴포넌트용) ---
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
    ...dongList.map(d => ({ value: d.id, label: d.dong })) // Value는 ID, Label은 동 이름
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      
      {/* 1. 프로필 이미지 */}
      <div className="text-center mb-2">
        <div className="relative inline-block">
          <Avatar src={profileImage} alt="Profile" size="xl" />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1 w-max">
            <Button type="button" size="sm" variant="secondary" onClick={generateRandomImage} className="text-xs py-1 px-3">
                랜덤
            </Button>
            <Button type="button" size="sm" variant="secondary" onClick={handleLinkInput} className="text-xs py-1 px-3">
                링크
            </Button>
          </div>
        </div>
      </div>

      {/* 2. 이메일 */}
      {initialEmail && (
        <div>
          <label className="block mb-2 font-bold text-sm text-text-secondary">이메일</label>
          <Input value={initialEmail} readOnly className="cursor-not-allowed opacity-70" />
        </div>
      )}

      {/* 3. 닉네임 */}
      <div>
        <label className="block mb-2 font-bold text-sm text-text-secondary">닉네임</label>
        <Input
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            required
            placeholder="닉네임을 입력하세요"
        />
      </div>

      {/* 4. 지역 선택 (3단 드롭다운) */}
      <div>
        <div className="flex justify-between items-center mb-2">
            <label className="font-bold text-sm text-text-secondary">지역 설정</label>
            <Button
              type="button"
              size="sm"
              onClick={handleDetectLocation}
              disabled={detecting}
              variant="secondary"
              className="text-xs py-1 px-2"
          >
              {detecting ? "위치 찾는 중..." : "📍 내 위치로 찾기"}
          </Button>
        </div>
        
        <div className="flex flex-col gap-3">
          {/* 시/도 */}
          <Select
            options={sidoOptions}
            value={selectedSido}
            onChange={handleSidoChange}
            className="w-full"
          />

          {/* 시/구/군 */}
          <Select
            options={sigugunOptions}
            value={selectedSigugun}
            onChange={handleSigugunChange}
            disabled={!selectedSido}
            className="w-full"
          />

          {/* 읍/면/동 */}
          <Select
            options={dongOptions}
            value={selectedDongId}
            onChange={handleDongChange}
            disabled={!selectedSigugun}
            className="w-full"
          />
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        fullWidth
        disabled={loading}
        className="mt-4"
      >
        {loading ? '처리 중...' : submitButtonText}
      </Button>
    </form>
  );
}