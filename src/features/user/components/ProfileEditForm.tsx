import React, { useState, useEffect } from 'react';
// 이전 단계에서 정의한 API 함수들과 인터페이스 import
import { searchRegions, fetchRegionById, Region } from '@/features/location/api/region';
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
  
  // 지역 관련 state
  const [regionId, setRegionId] = useState(initialRegionId);
  const [regions, setRegions] = useState<Region[]>([]); // 검색 결과 또는 선택된 지역 목록
  const [searchQuery, setSearchQuery] = useState('');   // 지역 검색어
  const [isSearching, setIsSearching] = useState(false);
  
  const [loading, setLoading] = useState(false);

  // 커스텀 훅
  const { detectRegion, detecting } = useGeoLocation();

  // 1. 초기 닉네임 설정
  useEffect(() => {
    if (initialNickname) setNickname(initialNickname);
  }, [initialNickname]);

  // 2. 초기 프로필 이미지 설정
  useEffect(() => {
    if (initialProfileImage) {
      setProfileImage(initialProfileImage);
    } else {
      generateRandomImage();
    }
  }, [initialProfileImage]);

  // 3. 초기 지역 설정 (ID만 있을 경우 상세 정보를 가져와서 Select 옵션에 추가)
  useEffect(() => {
    const fetchInitialRegion = async () => {
      if (initialRegionId) {
        try {
          // 기존 목록에 해당 ID가 없다면 서버에서 정보 가져오기
          if (!regions.find(r => r.id === initialRegionId)) {
            const regionData = await fetchRegionById(initialRegionId);
            setRegions([regionData]); // 초기 선택값으로 설정
            setRegionId(initialRegionId);
          }
        } catch (error) {
          console.error('초기 지역 정보 로딩 실패:', error);
        }
      }
    };
    fetchInitialRegion();
  }, [initialRegionId]);

  // 지역 검색 핸들러
  const handleSearchRegion = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const results = await searchRegions(searchQuery);
      setRegions(results);
      if (results.length > 0) {
        setRegionId(results[0].id); // 첫 번째 결과 자동 선택 (UX 선택사항)
      } else {
        alert('검색 결과가 없습니다.');
      }
    } catch (error) {
      console.error('Region search error:', error);
      alert('지역 검색 중 오류가 발생했습니다.');
    } finally {
      setIsSearching(false);
    }
  };

  // 내 위치 찾기 핸들러
  const handleDetectLocation = async () => {
    try {
      const detectedRegion = await detectRegion();

      // 기존 목록에 없으면 추가
      setRegions(prev => {
        const exists = prev.find(r => r.id === detectedRegion.id);
        return exists ? prev : [detectedRegion, ...prev];
      });
      
      setRegionId(detectedRegion.id);
      alert(`현재 위치('${detectedRegion.full_name}')가 선택되었습니다.`);
    } catch (error: any) {
      console.error("Error detecting location:", error);
      alert(error.message || "위치 감지 실패");
    }
  };

  const generateRandomImage = () => {
    const randomSeed = Math.random().toString(36).substring(7);
    setProfileImage(`https://robohash.org/${randomSeed}?set=set4`);
  };

  const handleLinkInput = () => {
    const url = prompt('이미지 URL을 입력하세요:', profileImage);
    if (url) {
      setProfileImage(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regionId) {
        alert("지역을 선택해주세요.");
        return;
    }
    
    setLoading(true);
    try {
      await onSubmit({ nickname, region_id: regionId, profile_image: profileImage });
    } finally {
      setLoading(false);
    }
  };

  // Select 컴포넌트용 옵션 매핑 (API 응답의 full_name 사용)
  const regionOptions = regions.map(r => ({ 
    value: r.id, 
    label: r.full_name // 이전에 정의한 Interface에 맞춤
  }));

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* 프로필 이미지 섹션 */}
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

      {/* 이메일 (읽기 전용) */}
      {initialEmail && (
        <div>
          <label className="block mb-2 font-bold text-sm text-text-secondary">이메일</label>
          <Input value={initialEmail} readOnly className="cursor-not-allowed opacity-70" />
        </div>
      )}

      {/* 닉네임 */}
      <div>
        <label className="block mb-2 font-bold text-sm text-text-secondary">닉네임</label>
        <Input
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            required
            placeholder="닉네임을 입력하세요"
        />
      </div>

      {/* 지역 선택 섹션 */}
      <div>
        <label className="block mb-2 font-bold text-sm text-text-secondary">지역 설정</label>
        
        {/* 검색창 */}
        <div className="flex gap-2 mb-2">
            <Input 
                placeholder="동 이름 검색 (예: 신사동)" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearchRegion())}
            />
            <Button 
                type="button" 
                onClick={handleSearchRegion} 
                variant="secondary"
                disabled={isSearching}
            >
                검색
            </Button>
        </div>

        {/* 선택 및 위치 찾기 */}
        <div className="flex gap-2">
          <Select
            options={regionOptions}
            value={regionId}
            onChange={e => setRegionId(e.target.value)}
            disabled={regions.length === 0}
            className="flex-1"
          />
          <Button
              type="button"
              onClick={handleDetectLocation}
              disabled={detecting}
              variant="secondary"
              className="whitespace-nowrap"
          >
              {detecting ? "감지 중..." : "내 위치 찾기"}
          </Button>
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